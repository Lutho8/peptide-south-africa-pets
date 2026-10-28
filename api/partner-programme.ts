import { backend, json } from './_shared/partners.js'
export const config = { runtime: 'edge' }

// Public commercial copy is read from the same approved policy used at checkout.
// Proposal documents and unapproved policies are never served as entitlements.
export default async function handler(req: Request) {
  if (req.method !== 'GET') return json({ error: 'Method not allowed' }, 405)
  try {
    const { admin } = backend()
    const { data: programme, error } = await admin.from('partner_programmes')
      .select('id,programme_key,accepting_applications,financial_activation')
      .eq('programme_key', 'pets_b2b').eq('storefront', 'pets').single()
    if (error) throw error
    const { data: policy, error: policyError } = await admin.from('partner_policies')
      .select('policy_version,commission_rate_bps,attribution_window_days,validation_days,minimum_payout_cents,payout_frequency,repeat_order_rule,code_precedence,customer_discount_bps,terms_sha256,approved_at')
      .eq('programme_id', programme.id).eq('active', true).not('approved_at', 'is', null).maybeSingle()
    if (policyError) throw policyError
    return json({ programme_key: programme.programme_key, accepting_applications: programme.accepting_applications, financial_activation: programme.financial_activation && !!policy, policy })
  } catch {
    return json({ error: 'Programme information is temporarily unavailable.', programme_key: 'pets_b2b', accepting_applications: false, financial_activation: false, policy: null }, 503)
  }
}
