import { activePartner, backend, cookie, json, limited, readCookie, sameOrigin } from './_shared/partners.js'
export const config = { runtime: 'edge' }
export default async function handler(req: Request) {
  if (!['POST', 'DELETE'].includes(req.method)) return json({ error: 'Method not allowed' }, 405)
  if (!sameOrigin(req)) return json({ error: 'Invalid origin' }, 403)
  if (limited(req, 'referral')) return json({ error: 'Please try again shortly' }, 429)
  try {
    const { admin } = backend()
    if (req.method === 'DELETE') {
      const id = readCookie(req)
      if (id) {
        const { data: programme, error: pe } = await admin.from('partner_programmes').select('id').eq('programme_key', 'pets_b2b').single()
        if (pe) throw pe
        const { error } = await admin.from('partner_referral_clicks').delete().eq('id', id).eq('programme_id', programme.id)
        if (error) return json({ error: 'Please retry withdrawing tracking' }, 503, cookie('', 0))
      }
      return json({ ok: true }, 200, cookie('', 0))
    }
    const text = await req.text()
    if (text.length > 2048) return json({ error: 'Request too large' }, 413)
    const body = JSON.parse(text)
    if (body.consent !== true) return json({ error: 'Tracking consent required' }, 400)
    const code = typeof body.code === 'string' ? body.code.trim().toUpperCase() : ''
    const campaign = typeof body.campaign === 'string' ? body.campaign : null
    const partner = await activePartner(admin, code, campaign)
    if (!partner) return json({ error: 'This Pets referral is not active. You can browse without referral tracking.' }, 400)
    const id = crypto.randomUUID(), now = Date.now()
    const { error } = await admin.from('partner_referral_clicks').insert({ id, programme_id: partner.programme_id, enrolment_id: partner.enrolment_id, referral_code: code, campaign_key: campaign, method: body.method === 'qr' ? 'qr' : 'referral_click', created_at: new Date(now).toISOString(), expires_at: new Date(now + partner.seconds * 1000).toISOString() })
    if (error) throw error
    return json({ ok: true }, 200, cookie(id, partner.seconds))
  } catch { return json({ error: 'Referral service unavailable. Please retry.' }, 503) }
}
