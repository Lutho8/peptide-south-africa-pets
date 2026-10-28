import { createClient, type SupabaseClient } from '@supabase/supabase-js'

export const COOKIE = '__Host-psa_pets_ref'
export const MAX_SECONDS = 30 * 86400
export const json = (body: unknown, status = 200, cookie?: string) => Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store', ...(cookie ? { 'Set-Cookie': cookie } : {}) } })
export const cookie = (id: string, seconds = MAX_SECONDS) => `${COOKIE}=${id}; Path=/; Max-Age=${seconds}; Secure; HttpOnly; SameSite=Lax`
export function readCookie(req: Request) {
  const id = req.headers.get('cookie')?.split(';').map(s => s.trim()).find(s => s.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1)
  return id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id) ? id : null
}
export function backend() {
  const url = process.env.SUPABASE_URL, key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Service unavailable')
  return { url, key, admin: createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } }) }
}
export function sameOrigin(req: Request) { return req.headers.get('origin') === new URL(req.url).origin }
const hits = new Map<string, { count: number; until: number }>()
// Best-effort isolate limit; database uniqueness also prevents duplicate applications.
export function limited(req: Request, scope: string, limit = 30, ms = 60000) {
  const key = `${scope}:${req.headers.get('x-forwarded-for')?.split(',')[0] ?? 'unknown'}`
  const now = Date.now(), prior = hits.get(key)
  if (!prior || prior.until <= now) { if (hits.size >= 5000) hits.clear(); hits.set(key, { count: 1, until: now + ms }); return false }
  return ++prior.count > limit
}
export async function activePartner(admin: SupabaseClient, code: string, campaign: string | null) {
  if (!/^PETS-[A-Z0-9_-]{3,70}$/.test(code) || (campaign && !/^[a-z0-9][a-z0-9_-]{0,63}$/.test(campaign))) return null
  const { data: programme, error: pe } = await admin.from('partner_programmes').select('id,financial_activation').eq('programme_key', 'pets_b2b').eq('storefront', 'pets').maybeSingle()
  if (pe) throw pe
  if (!programme?.financial_activation) return null
  const { data: policy, error: po } = await admin.from('partner_policies').select('policy_version,attribution_window_days,terms_sha256').eq('programme_id', programme.id).eq('active', true).not('approved_at', 'is', null).maybeSingle()
  if (po) throw po
  if (!policy || policy.attribution_window_days < 1 || policy.attribution_window_days > 30) return null
  const { data: enrolment, error: ee } = await admin.from('partner_enrolments').select('id').eq('programme_id', programme.id).eq('referral_code', code).eq('status', 'approved').maybeSingle()
  if (ee) throw ee
  if (!enrolment) return null
  const { data: agreement, error: ae } = await admin.from('partner_agreement_acceptances').select('id').eq('enrolment_id', enrolment.id).eq('terms_version', policy.policy_version).eq('terms_sha256', policy.terms_sha256).maybeSingle()
  if (ae) throw ae
  if (!agreement) return null
  if (campaign) {
    const { data, error } = await admin.from('partner_campaigns').select('id').eq('enrolment_id', enrolment.id).eq('campaign_key', campaign).eq('active', true).maybeSingle()
    if (error) throw error
    if (!data) return null
  }
  return { programme_id: programme.id, enrolment_id: enrolment.id, seconds: policy.attribution_window_days * 86400 }
}
export function currentClick(created: string, expires: string, seconds: number, now = Date.now()) {
  const start = Date.parse(created), end = Date.parse(expires)
  return Number.isFinite(start) && Number.isFinite(end) && start <= now && end > now && end - start <= seconds * 1000 && now - start < seconds * 1000
}
export async function resolveReferral(admin: SupabaseClient, req: Request, entered: unknown) {
  if (entered != null && typeof entered !== 'string') throw new Error('PARTNER_CODE_INVALID')
  if (typeof entered === 'string' && entered.trim()) {
    const code = entered.trim().toUpperCase()
    if (!await activePartner(admin, code, null)) throw new Error('PARTNER_CODE_INVALID')
    return { code, campaign: null, method: 'entered_code' }
  }
  const id = readCookie(req)
  if (!id) return null
  const { data, error } = await admin.from('partner_referral_clicks').select('programme_id,enrolment_id,referral_code,campaign_key,method,created_at,expires_at').eq('id', id).maybeSingle()
  if (error) throw error
  if (!data) return null
  const partner = await activePartner(admin, data.referral_code, data.campaign_key)
  if (!partner || partner.programme_id !== data.programme_id || partner.enrolment_id !== data.enrolment_id || !currentClick(data.created_at, data.expires_at, partner.seconds)) return null
  return { code: data.referral_code, campaign: data.campaign_key, method: data.method, click_id: id }
}
