import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { X, Minus, Plus, Trash2 } from 'lucide-react'
import { useCart, setQty, removeFromCart, zar, CART_OPEN_EVENT, CART_CLOSE_EVENT, closeCart } from '@/lib/cart'
import { getPetProduct, priceForSlug } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
import { trackPets } from '@/lib/analytics'

export default function CartDrawer() {
  const [open, setOpen] = useState(false)
  const items = useCart()
  const navigate = useNavigate()
  const { locale, t } = useI18n()
  const dialogRef = useRef<HTMLDialogElement>(null)
  const af = locale === 'af'
  useEffect(() => {
    const show = () => setOpen(true)
    const hide = () => setOpen(false)
    window.addEventListener(CART_OPEN_EVENT, show)
    window.addEventListener(CART_CLOSE_EVENT, hide)
    return () => { window.removeEventListener(CART_OPEN_EVENT, show); window.removeEventListener(CART_CLOSE_EVENT, hide) }
  }, [])
  useEffect(() => {
    const dialog = dialogRef.current
    if (open) dialog?.showModal()
    else dialog?.close()
    if (!open) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = previous }
  }, [open])
  const subtotal = items.reduce((sum, item) => sum + priceForSlug(item.slug) * item.qty, 0)
  const shipping = subtotal >= 1500 || !items.length ? 0 : 89
  function checkout() {
    trackPets('pets_checkout_started', { source: 'cart_drawer' })
    closeCart()
    navigate('/checkout')
  }
  return (
    <dialog ref={dialogRef} onCancel={() => setOpen(false)} onClose={() => setOpen(false)}
      aria-labelledby="cart-title" className="fixed inset-y-0 left-auto right-0 m-0 h-dvh max-h-none w-full max-w-md bg-cream p-6 text-espresso shadow-xl backdrop:bg-black/40">
      <div className="flex items-center justify-between">
        <h2 id="cart-title" className="font-serif text-3xl">{af ? 'Jou mandjie' : 'Your basket'}</h2>
        <button onClick={closeCart} aria-label={af ? 'Sluit mandjie' : 'Close basket'} className="rounded-full p-3"><X /></button>
      </div>
      {!items.length ? <div className="py-10">
        <p>{af ? 'Jou mandjie is leeg.' : 'Your basket is empty.'}</p>
        <Link onClick={closeCart} to="/product/mobility-collagen" className="mt-6 inline-block underline">{t('nav.shopNow')}</Link>
      </div> : <>
        <ul className="mt-8 space-y-6">{items.map(item => <li key={item.slug} className="border-b border-sand pb-5">
          <Link onClick={closeCart} to={`/product/${item.slug}`} className="font-serif text-xl underline">{getPetProduct(item.slug)?.name}</Link>
          <p className="mt-2">{zar(priceForSlug(item.slug))} × {item.qty}</p>
          <div className="mt-3 flex items-center gap-4">
            <button onClick={() => setQty(item.slug, item.qty - 1)} aria-label={t('cart.qtyDec')} className="rounded border p-2"><Minus size={18}/></button>
            <span aria-live="polite">{item.qty}</span>
            <button disabled={item.qty >= 99} onClick={() => setQty(item.slug, item.qty + 1)} aria-label={t('cart.qtyInc')} className="rounded border p-2"><Plus size={18}/></button>
            <button onClick={() => removeFromCart(item.slug)} aria-label={t('cart.removeAria', { name: getPetProduct(item.slug)?.name ?? item.slug })} className="ml-auto rounded p-2"><Trash2 size={18}/></button>
          </div>
        </li>)}</ul>
        <dl className="mt-8 space-y-3">
          <div className="flex justify-between"><dt>{af ? 'Subtotaal' : 'Subtotal'}</dt><dd>{zar(subtotal)}</dd></div>
          <div className="flex justify-between"><dt>{af ? 'Aflewering in Suid-Afrika' : 'South African delivery'}</dt><dd>{zar(shipping)}</dd></div>
          <div className="flex justify-between font-bold"><dt>{af ? 'Totaal' : 'Total'}</dt><dd>{zar(subtotal + shipping)}</dd></div>
        </dl>
        <p className="mt-4 text-sm">{af ? 'Gratis aflewering op bestellings vanaf R1 500. Die finale bedrag word by betaling bevestig.' : 'Free delivery on orders of R1 500 or more. The final amount is confirmed at checkout.'}</p>
        <button onClick={checkout} className="mt-6 w-full rounded-full bg-clinical px-6 py-4 text-white">{t('cart.checkoutCta')}</button>
        <p className="mt-4 text-sm">{af ? 'Meld veilig aan om jou EFT-bestelling te plaas. Geen waglys of outomatiese intekening nie.' : 'Sign in securely to place your EFT order. No waiting list or automatic subscription.'}</p>
      </>}
    </dialog>
  )
}
