import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { getCart, addToCart, setQty, clearCart } from '../src/lib/cart.ts'

const values = new Map()
globalThis.window = Object.assign(new EventTarget(), {
  localStorage: { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) },
})
values.set('psa_pets_cart', JSON.stringify([{ slug: 'bpc-157', qty: 1 }, { slug: 'mobility-collagen', qty: 1.5 }]))
assert.deepEqual(getCart(), [], 'Legacy reservations and invalid quantities must not become orders')
assert.deepEqual(addToCart('kpv'), [])
assert.deepEqual(setQty('recovery-blend', 2), [])
assert.deepEqual(addToCart('mobility-collagen', Infinity), [])
addToCart('mobility-collagen', 2)
assert.equal(getCart()[0].qty, 2)
setQty('mobility-collagen', 120)
assert.equal(getCart()[0].qty, 99)
setQty('mobility-collagen', 0)
assert.deepEqual(getCart(), [])
clearCart()
const edge = readFileSync('supabase/functions/pets-eft-create-order/index.ts', 'utf8')
assert.match(edge, /Access-Control-Allow-Headers[^\n]*x-pets-session-id/, 'Browser checkout session header must pass preflight')
console.log('Cart eligibility, quantity, legacy-data and checkout CORS checks passed.')
