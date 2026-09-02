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

const failures = []
const assert = (condition, message) => {
  if (!condition) failures.push(message)
}

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
