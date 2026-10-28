import { backend, json, limited, sameOrigin } from './_shared/partners.js'
export const config = { runtime: 'edge' }
export default async function handler(req: Request) {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  if (!sameOrigin(req)) return json({ error: 'Invalid origin' }, 403)
  if (limited(req, 'application', 5, 3600000)) return json({ error: 'Too many attempts. Please try again later.' }, 429)
  try {
    const text = await req.text()
    if (text.length > 12000) return json({ error: 'Application too long' }, 413)
    const body = JSON.parse(text)
    if (body.website || body.application_terms !== true) return json({ error: 'Please accept the application terms.' }, 400)
    const fields = ['business_name', 'contact_name', 'email', 'whatsapp', 'city', 'business_type']
    if (fields.some(k => typeof body[k] !== 'string' || !body[k].trim() || body[k].length > 320) || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email)) return json({ error: 'Complete the required business details.' }, 400)
    const payload: Record<string, unknown> = Object.fromEntries(fields.map(k => [k, body[k].trim()]))
    for (const key of ['profile_url', 'branch_range', 'client_volume']) {
      if (body[key] != null && (typeof body[key] !== 'string' || body[key].length > 500)) return json({ error: 'Invalid optional field.' }, 400)
      payload[key] = body[key] || null
    }
    if (payload.profile_url) { const url = new URL(String(payload.profile_url)); if (url.protocol !== 'https:' && url.protocol !== 'http:') return json({ error: 'Use a public HTTP or HTTPS profile link.' }, 400) }
    if (!['pet_groomer', 'dog_spa', 'mobile_groomer', 'other_pet_business'].includes(body.business_type)) return json({ error: 'Choose a supported pet-business type.' }, 400)
    Object.assign(payload, { location: payload.city, website_url: payload.profile_url, terms_accepted: true, regulated_professional: body.regulated_professional === true, marketing_consent: body.marketing_consent === true })
    const { admin } = backend()
    const { error } = await admin.rpc('submit_pets_partner_application', { payload })
    if (error) return json({ error: error.message.includes('already exists') ? 'An application already exists for this email. Sign in to check its status.' : 'Applications are not open yet or your details could not be accepted. Please try again later.' }, 400)
    return json({ ok: true })
  } catch { return json({ error: 'Application service unavailable. Please try again.' }, 503) }
}
