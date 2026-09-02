import { track } from '@vercel/analytics'
import { supabase } from '@/lib/supabase'

export type PetsEvent =
  | 'pets_catalog_viewed'
  | 'pets_research_navigator_started'
  | 'pets_research_navigator_completed'
  | 'pets_evidence_opened'
  | 'pets_waitlist_started'
  | 'pets_waitlist_joined'
  | 'pets_collagen_added'
  | 'pets_checkout_started'
  | 'pets_auth_started'
  | 'pets_checkout_consent_accepted'
  | 'pets_eft_order_created'
  | 'pets_eft_instructions_shown'
  | 'pets_portal_viewed'
  | 'pets_portal_orders_viewed'
  | 'pets_portal_reports_viewed'
  | 'pets_reorder_started'

const SESSION_KEY = 'psa_pets_analytics_sid'

export function petsSessionId(): string {
  try {
    let id = window.sessionStorage.getItem(SESSION_KEY)
    if (!id) {
      id = typeof crypto.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`
      window.sessionStorage.setItem(SESSION_KEY, id)
    }
    return id
  } catch {
    return 'unknown'
  }
}

/** PII-free Peptides4Pets funnel telemetry, isolated to the Pets Vercel project. */
export function trackPets(
  name: PetsEvent,
  properties: Record<string, string | number | boolean> = {},
) {
  try {
    track(name, properties)
    window.dispatchEvent(
      new CustomEvent('peptides4pets:analytics', { detail: { name, properties } }),
    )
  } catch {
    // Measurement must never interrupt the research journey or checkout.
  }

  if (name === 'pets_auth_started' || name === 'pets_eft_order_created') return
  void (async () => {
    try {
      const { data } = await supabase.auth.getSession()
      const orderId = typeof properties.order_id === 'string' ? properties.order_id : null
      await supabase.from('psa_pets_lifecycle_events').insert({
        event: name,
        event_version: '1.0',
        source: 'pets_storefront',
        session_id: petsSessionId(),
        user_id: data.session?.user.id ?? null,
        order_id: orderId,
        props: properties,
      })
    } catch {
      // First-party analytics is best-effort and never blocks the customer.
    }
  })()
}
