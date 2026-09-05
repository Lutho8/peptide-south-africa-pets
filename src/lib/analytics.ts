import { track } from '@vercel/analytics'

export type PetsEvent =
  | 'pets_pathway_started'
  | 'pets_pathway_completed'
  | 'pets_evidence_opened'
  | 'pets_collagen_added'
  | 'pets_checkout_started'
  | 'pets_auth_started'
  | 'pets_eft_order_created'

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void
    _fbq?: unknown
  }
}

/** Meta standard-event mapping. Unlisted events fire as trackCustom so they
 * still show up in Events Manager without polluting Meta's standard-event set. */
const META_STANDARD_EVENT: Partial<Record<PetsEvent, string>> = {
  pets_pathway_completed: 'Lead',
  pets_checkout_started: 'InitiateCheckout',
  pets_collagen_added: 'AddToCart',
  pets_eft_order_created: 'Purchase',
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
    // Measurement must never interrupt clinical content or checkout.
  }
}
