import { backend, json, limited, resolveReferral, sameOrigin } from './_shared/partners.js'
export const config = { runtime: 'edge' }
export default async function handler(req: Request) {
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405)
  if (!sameOrigin(req)) return json({ error: 'Invalid origin' }, 403)
  if (limited(req, 'checkout', 20)) return json({ error: 'Please try again shortly' }, 429)
  const authorization = req.headers.get('authorization')
  if (!authorization?.startsWith('Bearer ')) return json({ error: 'Sign in before checkout' }, 401)
  try {
    const { admin, url, key } = backend()
    const { data, error } = await admin.auth.getUser(authorization.slice(7))
    if (error || !data.user) return json({ error: 'Your session has expired. Please sign in again.' }, 401)
    const text = await req.text()
    if (text.length > 16000) return json({ error: 'Request too large' }, 413)
    const body = JSON.parse(text)
    // Whitelist checkout fields; caller programme, rates and attribution are discarded.
    const safe = Object.fromEntries(['requestId', 'selections', 'firstName', 'lastName', 'email', 'consent', 'fulfilment'].map(k => [k, body[k]]))
    const partnerAttribution = await resolveReferral(admin, req, body.partnerCode)
    const response = await fetch(`${url}/functions/v1/pets-eft-create-order`, { method: 'POST', headers: { authorization, apikey: key, 'Content-Type': 'application/json', 'x-pets-session-id': req.headers.get('x-pets-session-id')?.slice(0, 200) ?? '' }, body: JSON.stringify({ ...safe, partnerAttribution }) })
    const result = await response.json().catch(() => null)
    if (!result) return json({ error: 'Checkout is temporarily unavailable.' }, 502)
    return json(result, response.status)
  } catch (error) {
    const invalid = error instanceof Error && error.message === 'PARTNER_CODE_INVALID'
    return json({ error: invalid ? 'That Pets partner code is not active. Correct or remove it to continue.' : 'Checkout is temporarily unavailable. Please retry.', code: invalid ? 'PARTNER_CODE_INVALID' : 'CHECKOUT_UNAVAILABLE' }, invalid ? 400 : 503)
  }
}
