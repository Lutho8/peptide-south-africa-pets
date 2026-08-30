import { track } from '@vercel/analytics'

export type PetsEvent =
  | 'pets_pathway_started'
  | 'pets_pathway_completed'
  | 'pets_evidence_opened'
  | 'pets_collagen_added'
  | 'pets_checkout_started'
  | 'pets_auth_started'
  | 'pets_eft_order_created'

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
    // Measurement must never interrupt clinical content or checkout.
  }
}
