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
  | 'pets_bridge_viewed'
  | 'pets_whatsapp_click'

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

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

/** Meta standard-event mapping. Unlisted events fire as trackCustom so they
 * still show up in Events Manager without polluting Meta's standard-event set. */
const META_STANDARD_EVENT: Partial<Record<PetsEvent, string>> = {
  pets_research_navigator_completed: 'Lead',
  pets_checkout_started: 'InitiateCheckout',
  pets_collagen_added: 'AddToCart',
  pets_eft_order_created: 'Purchase',
  pets_bridge_viewed: 'ViewContent',
  pets_whatsapp_click: 'Contact',
}

let pixelInitAttempted = false

/**
 * Injects the Meta Pixel base code, gated on VITE_META_PIXEL_ID being set.
 * No-ops (and never throws) when the env var is absent, so this is safe to
 * ship ahead of Business Manager access — flipping the env var is all that's
 * needed to activate it later.
 */
export function initMetaPixel(): void {
  if (pixelInitAttempted) return
  pixelInitAttempted = true
  const pixelId = import.meta.env.VITE_META_PIXEL_ID
  if (!pixelId || typeof window === 'undefined') return
  try {
    if (window.fbq) return
    const fbq = function (...args: unknown[]) {
      const q = (fbq as unknown as { queue: unknown[][] }).queue
      q.push(args)
    } as unknown as Window['fbq'] & { queue: unknown[][]; loaded: boolean; version: string; push: Window['fbq'] }
    fbq!.queue = []
    fbq!.loaded = true
    fbq!.version = '2.0'
    fbq!.push = fbq!
    window.fbq = fbq
    window._fbq = fbq
    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)
    window.fbq('init', pixelId)
    window.fbq('track', 'PageView')
  } catch {
    // Pixel bootstrap must never break the app.
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
    if (window.fbq) {
      const standardEvent = META_STANDARD_EVENT[name]
      if (standardEvent) window.fbq('track', standardEvent, properties)
      else window.fbq('trackCustom', name, properties)
    }
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
