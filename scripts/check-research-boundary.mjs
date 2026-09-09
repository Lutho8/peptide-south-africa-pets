import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path) => readFileSync(resolve(root, path), 'utf8')

const homepage = read('src/pages/Pets.tsx')
const heroCopy = read('src/pages/pets/conversionCopy.ts')
const quiz = read('src/pages/QuizPage.tsx')
const checkout = read('src/pages/CheckoutPage.tsx')
const edge = read('supabase/functions/pets-eft-create-order/index.ts')
const migration = read('supabase/migrations/20260901170000_add_pets_research_commerce_backbone.sql')
const app = read('src/App.tsx')
const routine = read('src/pages/RoutinePage.tsx')

const failures = []
const assert = (condition, message) => {
  if (!condition) failures.push(message)
}

/** META-PETS-001 guardrails, binding on the Facebook→WhatsApp bridge page. */
const BRIDGE_FORBIDDEN_TERMS = [
  /peptide/i,
  /bpc-157/i,
  /tb-500/i,
  /\bkpv\b/i,
  /ghk-cu/i,
  /thymosin/i,
  /\bcure[sd]?\b/i,
  /\btreat(s|ment|ed|ing)?\b/i,
  /\bheal(s|ed|ing)?\b/i,
  /guarantee/i,
  /real recovery/i,
  /tracked the difference/i,
  /made .* easier/i,
  /point you to the right next step/i,
  /what might help yours/i,
]
for (const term of BRIDGE_FORBIDDEN_TERMS) {
  assert(!term.test(routine), `Bridge page must not contain forbidden term: ${term}`)
}
assert(routine.includes('not veterinary advice'), 'Bridge page must carry the not-veterinary-advice disclaimer')
assert(!routine.includes('Navbar'), 'Bridge page must stay outside the sitewide Navbar (pathway separation)')
assert(!routine.includes('Footer'), 'Bridge page must stay outside the sitewide Footer (pathway separation)')

assert(!homepage.includes('GuaranteeBand'), 'Homepage must not render the outcome guarantee')
assert(!homepage.includes('Testimonials'), 'Homepage must not render treatment-outcome testimonials')
assert(!heroCopy.includes('Vet-minded peptide protocols'), 'Hero must not market pet peptide protocols')
assert(!heroCopy.includes('60-day guarantee'), 'Hero must not promise a 60-day outcome guarantee')
assert(!quiz.includes('doseFor('), 'Research navigator must not generate peptide doses')
assert(!quiz.includes('addStackToCart'), 'Research navigator must not add experimental stacks to cart')
assert(checkout.includes('buildPetsCheckoutConsent'), 'Checkout must create a versioned Pets consent receipt')
assert(checkout.includes('consent.marketing'), 'Marketing consent must remain separate and optional')
assert(edge.includes('UNIT_PRICE = 395'), 'Pets price authority must live on the server')
assert(edge.includes('pets-eft-create-order'), 'Pets order endpoint must remain isolated from the storefront client')
assert(migration.includes('enable row level security'), 'New Pets tables must enable RLS')
assert(migration.includes('psa_pets_lifecycle_events'), 'Pets lifecycle event backbone must be migrated')
assert(app.includes('path="account"'), 'Branded Pets account route must remain available')
assert(app.includes('path="admin/lifecycle"'), 'Private Pets lifecycle dashboard route must remain available')

if (failures.length) {
  console.error(failures.map((failure) => `- ${failure}`).join('\n'))
  process.exit(1)
}

console.log('Pets research-commerce boundary checks passed.')
