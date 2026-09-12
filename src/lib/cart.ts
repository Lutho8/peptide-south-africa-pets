/**
 * Peptides4Pets — "Launch Box" cart.
 *
 * The five published catalogue products are live and checkout-eligible through
 * the secure EFT flow (see lib/eftCheckout.ts). Client totals are display-only;
 * the server recomputes every line in pets-eft-create-order.
 *
 * CONTRACT (the quiz agent builds against this — do not break):
 * - localStorage key: `psa_pets_cart`
 * - value: JSON array of `{ slug: string, qty: number }`
 * - pub/sub: window CustomEvent `psa-cart-change` fired after every write
 */
import { useEffect, useState } from 'react'

export interface CartItem {
  slug: string
  qty: number
}

const KEY = 'psa_pets_cart'

/** Published catalogue slugs allowed into a live EFT order. */
export const CHECKOUT_ELIGIBLE = new Set([
  'bpc-157',
  'kpv',
  'recovery-blend',
  'immune-thymogen',
  'mobility-collagen',
])

/** True when a cart line may go through the live EFT checkout. */
export function isCheckoutEligible(slug: string): boolean {
  return CHECKOUT_ELIGIBLE.has(slug)
}

/** Fired on window after every cart write. */
export const CART_CHANGE_EVENT = 'psa-cart-change'
/** UI events — open/close the CartDrawer from anywhere. */
export const CART_OPEN_EVENT = 'psa-cart-open'
export const CART_CLOSE_EVENT = 'psa-cart-close'

/** Legacy founding-price constant retained for old waitlist records. */
export const FOUNDING_DISCOUNT = 0.2
/** Free-shipping threshold in ZAR. */
export const FREE_SHIPPING_THRESHOLD = 1500

export function getCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (i): i is CartItem =>
        typeof i === 'object' &&
        i !== null &&
        typeof (i as CartItem).slug === 'string' &&
        Number.isInteger((i as CartItem).qty) && (i as CartItem).qty > 0 && (i as CartItem).qty <= 99 && isCheckoutEligible((i as CartItem).slug),
    )
  } catch {
    return []
  }
}

function writeCart(items: CartItem[]): CartItem[] {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items))
  } catch {
    /* storage full / private mode — in-memory state still updates */
  }
  window.dispatchEvent(new CustomEvent(CART_CHANGE_EVENT))
  return items
}

/** Add (or increment) a product. Returns the new cart. */
export function addToCart(slug: string, qty = 1): CartItem[] {
  if (!isCheckoutEligible(slug) || !Number.isInteger(qty) || qty < 1) return getCart()
  const items = getCart()
  const found = items.find((i) => i.slug === slug)
  if (found) {
    found.qty = Math.min(99, found.qty + qty)
    return writeCart([...items])
  }
  return writeCart([...items, { slug, qty: Math.min(99, qty) }])
}

export function removeFromCart(slug: string): CartItem[] {
  return writeCart(getCart().filter((i) => i.slug !== slug))
}

/** Set an exact quantity; qty <= 0 removes the line. */
export function setQty(slug: string, qty: number): CartItem[] {
  if (!isCheckoutEligible(slug) || !Number.isInteger(qty)) return getCart()
  if (qty <= 0) return removeFromCart(slug)
  const items = getCart()
  const found = items.find((i) => i.slug === slug)
  if (!found) return writeCart([...items, { slug, qty: Math.min(99, qty) }])
  found.qty = Math.min(99, qty)
  return writeCart([...items])
}

export function clearCart(): CartItem[] {
  return writeCart([])
}

/** Total unit count across all lines (Navbar badge). */
export function cartCount(): number {
  return getCart().reduce((sum, i) => sum + i.qty, 0)
}

/** Unique product slugs in the cart (waitlist prefill). */
export function cartSlugs(): string[] {
  return getCart().map((i) => i.slug)
}

/* ------------------------------ pub/sub ------------------------------ */

/** Subscribe to cart changes (same-tab events + cross-tab storage). */
export function subscribeToCart(listener: () => void): () => void {
  window.addEventListener(CART_CHANGE_EVENT, listener)
  window.addEventListener('storage', listener)
  return () => {
    window.removeEventListener(CART_CHANGE_EVENT, listener)
    window.removeEventListener('storage', listener)
  }
}

/** React hook — live cart snapshot. */
export function useCart(): CartItem[] {
  const [items, setItems] = useState<CartItem[]>(() => getCart())
  useEffect(() => subscribeToCart(() => setItems(getCart())), [])
  return items
}

/** React hook — live unit count for the Navbar badge. */
export function useCartCount(): number {
  const items = useCart()
  return items.reduce((sum, i) => sum + i.qty, 0)
}

export function openCart(): void {
  window.dispatchEvent(new CustomEvent(CART_OPEN_EVENT))
}

export function closeCart(): void {
  window.dispatchEvent(new CustomEvent(CART_CLOSE_EVENT))
}

/* ------------------------------ pricing ------------------------------ */

export function zar(n: number): string {
  return `R${Math.round(n).toLocaleString('en-ZA')}`
}
