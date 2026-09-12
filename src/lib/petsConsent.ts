export const PETS_CHECKOUT_POLICY_VERSION = 'pets-checkout-2026-09-12'
export const PETS_REPORT_SCOPE_VERSION = 'pets-report-scope-2026-09-01'
export const PETS_RESEARCH_INTEREST_POLICY_VERSION = 'pets-research-interest-2026-09-01'

export interface PetsCheckoutConsent {
  policyVersion: typeof PETS_CHECKOUT_POLICY_VERSION
  reportScopeVersion: typeof PETS_REPORT_SCOPE_VERSION
  ageConfirmed: true
  nutritionalScopeAcknowledged: true
  labelUseAcknowledged: true
  reportScopeAcknowledged: true
  marketingConsent: boolean
  clientAcceptedAt: string
}

export function buildPetsCheckoutConsent(marketingConsent: boolean): PetsCheckoutConsent {
  return {
    policyVersion: PETS_CHECKOUT_POLICY_VERSION,
    reportScopeVersion: PETS_REPORT_SCOPE_VERSION,
    ageConfirmed: true,
    nutritionalScopeAcknowledged: true,
    labelUseAcknowledged: true,
    reportScopeAcknowledged: true,
    marketingConsent,
    clientAcceptedAt: new Date().toISOString(),
  }
}
