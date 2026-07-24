/**
 * PSA PETS — "Launch Box" reservation cart.
 *
 * Everything is COMING SOON, so this is a reservation cart: shoppers build a
 * stack at founding-member pricing, then convert through the waitlist (no
 * payment is ever taken).
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

/** Fired on window after every cart write. */
export const CART_CHANGE_EVENT = 'psa-cart-change'
/** UI events — open/close the CartDrawer from anywhere. */
export const CART_OPEN_EVENT = 'psa-cart-open'
export const CART_CLOSE_EVENT = 'psa-cart-close'

/** Founding-member discount applied at launch (reservation pricing). */
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
        typeof (i as CartItem).qty === 'number',
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
  const items = getCart()
  const found = items.find((i) => i.slug === slug)
  if (found) {
    found.qty = Math.min(99, found.qty + qty)
    return writeCart([...items])
  }
  return writeCart([...items, { slug, qty: Math.max(1, qty) }])
}

export function removeFromCart(slug: string): CartItem[] {
  return writeCart(getCart().filter((i) => i.slug !== slug))
}

/** Set an exact quantity; qty <= 0 removes the line. */
export function setQty(slug: string, qty: number): CartItem[] {
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
