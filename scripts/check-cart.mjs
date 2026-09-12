import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { getCart, addToCart, setQty, clearCart } from '../src/lib/cart.ts'

const values = new Map()
globalThis.window = Object.assign(new EventTarget(), {
  localStorage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) },
})
values.set('psa_pets_cart', JSON.stringify([{ slug: 'not-a-product', qty: 1 }, { slug: 'mobility-collagen', qty: 1.5 }]))
assert.deepEqual(getCart(), [], 'Legacy reservations and invalid quantities must not become orders')
assert.deepEqual(addToCart('kpv'), [{ slug: 'kpv', qty: 1 }])
assert.deepEqual(setQty('recovery-blend', 2), [{ slug: 'kpv', qty: 1 }, { slug: 'recovery-blend', qty: 2 }])
assert.deepEqual(addToCart('mobility-collagen', Infinity), [{ slug: 'kpv', qty: 1 }, { slug: 'recovery-blend', qty: 2 }])
addToCart('mobility-collagen', 2)
assert.equal(getCart().find((item) => item.slug === 'mobility-collagen').qty, 2)
setQty('mobility-collagen', 120)
assert.equal(getCart().find((item) => item.slug === 'mobility-collagen').qty, 99)
setQty('mobility-collagen', 0)
assert.equal(getCart().some((item) => item.slug === 'mobility-collagen'), false)
clearCart()
const edge = readFileSync('supabase/functions/pets-eft-create-order/index.ts', 'utf8')
assert.match(edge, /Access-Control-Allow-Headers[^\n]*x-pets-session-id/, 'Browser checkout session header must pass preflight')
for (const slug of ['pets-bpc-157', 'pets-kpv', 'pets-recovery-blend', 'pets-immune-thymogen', 'pets-mobility-collagen']) {
  assert.match(edge, new RegExp(`\\["${slug}"`), `${slug} must be server-priced`)
}
assert.doesNotMatch(edge, /UNIT_PRICE/, 'Single-product price authority must be removed')
console.log('Full-catalog cart eligibility, quantity, server pricing and checkout CORS checks passed.')
