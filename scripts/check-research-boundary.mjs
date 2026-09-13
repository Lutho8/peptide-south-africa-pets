import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const read = (path) => readFileSync(resolve(root, path), 'utf8')

const homepage = read('src/pages/Pets.tsx')
const heroCopy = read('src/pages/pets/conversionCopy.ts')
const quiz = read('src/pages/QuizPage.tsx')
const checkout = read('src/pages/CheckoutPage.tsx')
const cart = read('src/lib/cart.ts')
const consent = read('src/lib/petsConsent.ts')
const edge = read('supabase/functions/pets-eft-create-order/index.ts')
const migration = read('supabase/migrations/20260901170000_add_pets_research_commerce_backbone.sql')
const app = read('src/App.tsx')
const catalog = read('src/lib/data.ts')
const coa = read('src/lib/coa.ts')
const productPage = read('src/pages/ProductPage.tsx')
const checkoutCopy = read('src/pages/checkoutCopy.ts')
const publicCopy = [heroCopy, catalog, coa, productPage, checkoutCopy].join('\n')

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
assert(edge.includes('const PRODUCTS = new Map'), 'Pets multi-product price authority must live on the server')
assert(edge.includes('["pets-bpc-157"'), 'BPC-157 must be server-priced before checkout')
for (const slug of ['bpc-157', 'kpv', 'recovery-blend', 'immune-thymogen', 'mobility-collagen']) {
  assert(cart.includes(`'${slug}'`), `${slug} must be checkout eligible`)
}
assert(consent.includes('pets-checkout-2026-09-13'), 'Checkout consent version must match the current policy')
assert(edge.includes('pets-checkout-2026-09-13'), 'Server consent version must match the storefront')
assert(edge.includes('selections: body.selections'), 'Pets EFT handoff must forward server-priceable cart selections')
assert(edge.includes('requestId,'), 'Pets EFT handoff must forward the idempotency request ID')
assert(edge.includes('orderId: order.id'), 'Pets EFT handoff must settle the existing Pets order rather than create a duplicate')
assert(edge.includes('apikey: serviceRoleKey'), 'Pets EFT handoff must use the trusted server-to-server settlement credential')
assert(!/oral drops|gut & skin drops|not for animal administration|not for sale/i.test(publicCopy), 'Published storefront copy must use vial form and current availability language')
for (const label of ['BPC-157 Research Vial', 'KPV Gut & Skin Research Vial']) {
  assert(catalog.includes(label), `${label} must remain the canonical catalogue name`)
  assert(coa.includes(label), `${label} must remain aligned in sample COA data`)
}
assert(checkout.includes('clearCart()'), 'Successful multi-product checkout must clear the purchased cart')
assert(!checkout.includes("currency: 'ZAR'"), 'Order creation must not emit client-side Purchase revenue')
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
