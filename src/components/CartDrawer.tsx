import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { X, Minus, Plus, Trash2, PackageOpen } from 'lucide-react'
import {
  useCart,
  getCart,
  setQty,
  removeFromCart,
  zar,
  FOUNDING_DISCOUNT,
  FREE_SHIPPING_THRESHOLD,
  CART_OPEN_EVENT,
  CART_CLOSE_EVENT,
  closeCart,
} from '@/lib/cart'
import { getPetProduct, priceForSlug, BATCH_BY_SLUG, LAUNCH_BATCH } from '@/lib/data'
import { submitLaunchBox } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n'
import WaitlistForm from '@/components/WaitlistForm'
import type { WaitlistEntry } from '@/lib/waitlist'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/**
 * "Your Launch Box" — the reservation cart drawer.
 * Slides in from the right; checkout converts cart → waitlist (no payment yet).
 * Global: mounted once in Layout, opened via `openCart()` from anywhere.
 */
export default function CartDrawer() {
  const [open, setOpen] = useState(false)
  const [reserving, setReserving] = useState(false)
  const items = useCart()
  const { t } = useI18n()

  useEffect(() => {
    const onOpen = () => setOpen(true)
    const onClose = () => setOpen(false)
    window.addEventListener(CART_OPEN_EVENT, onOpen)
    window.addEventListener(CART_CLOSE_EVENT, onClose)
    return () => {
      window.removeEventListener(CART_OPEN_EVENT, onOpen)
      window.removeEventListener(CART_CLOSE_EVENT, onClose)
    }
  }, [])

  // Reset to the cart view whenever the drawer (re)opens or contents change.
  useEffect(() => {
    if (!open) setReserving(false)
  }, [open])

  // Lock body scroll while open.
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  const lines = items
    .map((i) => ({ ...i, product: getPetProduct(i.slug) }))
    .filter((l) => l.product)

  const subtotal = lines.reduce((sum, l) => sum + priceForSlug(l.slug) * l.qty, 0)
  const discount = subtotal * FOUNDING_DISCOUNT
  const total = subtotal - discount
  const shipProgress = Math.min(1, total / FREE_SHIPPING_THRESHOLD)
  const shipRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total)

  /**
   * Embedded waitlist reservation succeeded → record the Launch Box in
   * Supabase. waitlist_id is left null: the anon role is INSERT-only and
   * cannot SELECT the waitlist row id, so the reservation is stored
   * independently (email is the join key).
   */
  function handleReserved(entry: WaitlistEntry) {
    const cart = getCart()
    if (cart.length === 0) return
    const boxSubtotal = cart.reduce((sum, i) => sum + priceForSlug(i.slug) * i.qty, 0)
    void submitLaunchBox({
      email: entry.email,
      waitlist_id: null,
      items: cart,
      subtotal_zar: boxSubtotal,
      founding_discount_pct: Math.round(FOUNDING_DISCOUNT * 100),
      status: 'reserved',
    })
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-espresso/45 backdrop-blur-[2px]"
          />
          <motion.aside
            key="drawer"
            role="dialog"
            aria-label={t('cart.title')}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.45, ease: EASE }}
            className="fixed inset-y-0 right-0 z-[71] flex w-full max-w-[440px] flex-col border-l border-sand bg-cream shadow-[0_20px_50px_-20px_rgba(43,33,24,0.4)]"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-sand px-6 py-5">
              <div>
                <p className="mono-label !text-[10px] text-amber-deep">{t('cart.overline')}</p>
                <h2 className="mt-1 font-serif text-2xl font-semibold text-espresso">
                  {t('cart.title')}
                </h2>
              </div>
              <button
                onClick={closeCart}
                aria-label={t('cart.close')}
                className="cursor-pointer rounded-full border border-sand p-2 text-espresso transition-colors hover:border-amber hover:text-amber-deep"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {reserving ? (
              /* ---- cart → waitlist conversion step ---- */
              <div className="flex-1 overflow-y-auto px-6 py-6">
                <button
                  onClick={() => setReserving(false)}
                  className="mono-label link-underline cursor-pointer !text-[10px] text-espresso-70"
                >
                  {t('cart.back')}
                </button>
                <h3 className="mt-4 font-serif text-2xl font-semibold text-espresso">
                  {lines.length === 1
                    ? t('cart.reserveTitle.one')
                    : t('cart.reserveTitle.many', { count: lines.length })}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-espresso-70">
                  {t('cart.reserveBody', { pct: Math.round(FOUNDING_DISCOUNT * 100) })}
                </p>
                <div className="mt-5">
                  <WaitlistForm
                    compact
                    defaultProducts={lines.map((l) => l.slug)}
                    onSuccess={handleReserved}
                  />
                </div>
              </div>
            ) : lines.length === 0 ? (
              /* ---- empty state ---- */
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
                <span className="flex h-16 w-16 items-center justify-center rounded-full border border-sand bg-warmwhite">
                  <PackageOpen className="h-7 w-7 text-espresso-70" />
                </span>
                <p className="font-serif text-xl font-semibold text-espresso">
                  {t('cart.emptyTitle')}
                </p>
                <p className="text-sm leading-relaxed text-espresso-70">{t('cart.emptyBody')}</p>
                <Link
                  to="/pets#launch"
                  onClick={closeCart}
                  className="mt-2 rounded-full bg-amber px-6 py-3 font-serif text-base font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
                >
                  {t('cart.browse')}
                </Link>
              </div>
            ) : (
              <>
                {/* ---- line items ---- */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <ul className="divide-y divide-sand">
                    <AnimatePresence initial={false}>
                      {lines.map((l) => (
                        <motion.li
                          key={l.slug}
                          layout="position"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, x: 40 }}
                          transition={{ duration: 0.3, ease: EASE }}
                          className="flex gap-4 py-4"
                        >
                          <img
                            src={l.product!.image}
                            alt={l.product!.name}
                            className="h-20 w-16 shrink-0 rounded-xl border border-sand object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-2">
                              <p className="font-serif text-base font-semibold leading-tight text-espresso">
                                {l.product!.name}
                              </p>
                              <button
                                onClick={() => removeFromCart(l.slug)}
                                aria-label={t('cart.removeAria', { name: l.product!.name })}
                                className="cursor-pointer p-1 text-espresso-70 transition-colors hover:text-alert"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                            <p className="mono-data mt-0.5 !text-[10px] text-espresso-70">
                              BATCH {BATCH_BY_SLUG[l.slug] ?? LAUNCH_BATCH} ·{' '}
                              {zar(priceForSlug(l.slug))}
                              {l.product!.priceUnit}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                              <div className="flex items-center gap-1 rounded-full border border-sand bg-warmwhite px-1 py-0.5">
                                <button
                                  onClick={() => setQty(l.slug, l.qty - 1)}
                                  aria-label={t('cart.qtyDec')}
                                  className="cursor-pointer rounded-full p-1.5 text-espresso transition-colors hover:text-amber-deep"
                                >
                                  <Minus className="h-3.5 w-3.5" />
                                </button>
                                <span className="mono-data w-6 text-center !text-[11px] tabular-nums text-espresso">
                                  {l.qty}
                                </span>
                                <button
                                  onClick={() => setQty(l.slug, l.qty + 1)}
                                  aria-label={t('cart.qtyInc')}
                                  className="cursor-pointer rounded-full p-1.5 text-espresso transition-colors hover:text-amber-deep"
                                >
                                  <Plus className="h-3.5 w-3.5" />
                                </button>
                              </div>
                              <span className="mono-data font-bold text-espresso">
                                {zar(priceForSlug(l.slug) * l.qty)}
                              </span>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </AnimatePresence>
                  </ul>
                </div>

                {/* ---- totals + free shipping + reserve CTA ---- */}
                <div className="border-t border-sand bg-warmwhite px-6 py-5">
                  {/* free-shipping progress */}
                  <div className="mb-4">
                    <p className="mono-label flex justify-between !text-[10px] text-espresso-70">
                      <span>
                        {shipRemaining > 0
                          ? t('cart.shipRemaining', { amount: zar(shipRemaining) })
                          : t('cart.shipUnlocked')}
                      </span>
                      <span>{zar(FREE_SHIPPING_THRESHOLD)}</span>
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-sand">
                      <motion.div
                        className={cn(
                          'h-full rounded-full',
                          shipRemaining > 0 ? 'bg-amber' : 'bg-clinical',
                        )}
                        initial={false}
                        animate={{ width: `${shipProgress * 100}%` }}
                        transition={{ duration: 0.5, ease: EASE }}
                      />
                    </div>
                  </div>

                  <dl className="mono-data space-y-1.5 text-espresso-70">
                    <div className="flex justify-between">
                      <dt>{t('cart.subtotal')}</dt>
                      <dd className="tabular-nums">{zar(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between text-clinical">
                      <dt>{t('cart.founding', { pct: Math.round(FOUNDING_DISCOUNT * 100) })}</dt>
                      <dd className="tabular-nums">−{zar(discount)}</dd>
                    </div>
                    <div className="flex justify-between border-t border-sand pt-2 font-bold text-espresso">
                      <dt>{t('cart.reservedTotal')}</dt>
                      <dd className="tabular-nums">{zar(total)}</dd>
                    </div>
                  </dl>

                  <button
                    onClick={() => setReserving(true)}
                    className="mono-label mt-4 w-full cursor-pointer rounded-full bg-amber py-4 !text-[11px] text-warmwhite transition-colors hover:bg-amber-deep"
                  >
                    {t('cart.reserveCta')}
                  </button>
                  <p className="mono-data mt-3 text-center !text-[10px] text-espresso-70">
                    {t('cart.footer')}
                  </p>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
