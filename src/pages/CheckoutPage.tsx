import { useEffect, useMemo, useState } from 'react'
import type { FormEvent, ReactNode } from 'react'
import { Navigate, useNavigate } from 'react-router'
import type { User } from '@supabase/supabase-js'
import { ArrowRight, CheckCircle2, Landmark, LoaderCircle, LockKeyhole, Mail, ShieldCheck } from 'lucide-react'
import { FREE_SHIPPING_THRESHOLD, isCheckoutEligible, removeFromCart, useCart, zar } from '@/lib/cart'
import { priceForSlug } from '@/lib/data'
import { supabase } from '@/lib/supabase'
import { EFT_SESSION_KEY, startPetsEftCheckout } from '@/lib/eftCheckout'
import type { PetsCheckoutForm } from '@/lib/eftCheckout'
import { trackPets } from '@/lib/analytics'
import { buildPetsCheckoutConsent } from '@/lib/petsConsent'
import { useCheckoutCopy } from '@/pages/checkoutCopy'
import Seo from '@/components/Seo'

const provinces = ['Eastern Cape', 'Free State', 'Gauteng', 'KwaZulu-Natal', 'Limpopo', 'Mpumalanga', 'Northern Cape', 'North West', 'Western Cape']
const empty: PetsCheckoutForm = { firstName: '', lastName: '', email: '', phone: '', addressLine1: '', city: '', province: 'Western Cape', postalCode: '', petName: '', petSpecies: 'dog' }

/**
 * /checkout — secure EFT order for the live, checkout-eligible product
 * (Mobility Collagen). Totals here are display-only; eft-create-order
 * recomputes the amount server-side. In-development peptides never reach
 * this page — they stay on the waitlist reservation path.
 */
export default function CheckoutPage() {
  const items = useCart()
  const navigate = useNavigate()
  const copy = useCheckoutCopy()
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [magicEmail, setMagicEmail] = useState('')
  const [magicSent, setMagicSent] = useState(false)
  const [authBusy, setAuthBusy] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [consent, setConsent] = useState({
    age: false,
    nutritional: false,
    labelUse: false,
    reportScope: false,
    marketing: false,
  })
  const [form, setForm] = useState<PetsCheckoutForm>(empty)
  const quantity = items.find((item) => isCheckoutEligible(item.slug))?.qty ?? 0
  // Display-only totals derived from the shared catalog exports; the server
  // recomputes the amount in eft-create-order (flat shipping R89 there).
  const unitPrice = priceForSlug('mobility-collagen')
  const subtotal = quantity * unitPrice
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : 89
  const total = subtotal + shipping

  useEffect(() => {
    const applyUser = (next: User | null) => {
      setUser(next)
      if (next?.email) setForm((current) => ({ ...current, email: current.email || next.email! }))
    }
    void supabase.auth.getUser().then(({ data }) => applyUser(data.user))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => applyUser(session?.user ?? null))
    return () => data.subscription.unsubscribe()
  }, [])

  // A new checkout invalidates any previous order's bank details.
  useEffect(() => {
    sessionStorage.removeItem(EFT_SESSION_KEY)
    trackPets('pets_checkout_started', { item_count: quantity, displayed_total_zar: total })
    // The cart fingerprint is stable for this page load; totals remain display-only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fieldsComplete = useMemo(() => Object.entries(form).every(([, value]) => String(value).trim().length > 0), [form])
  if (quantity === 0) return <Navigate to="/pets" replace />

  async function google() {
    setAuthBusy(true)
    setError('')
    trackPets('pets_auth_started', { method: 'google' })
    const { error: authError } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/checkout` } })
    if (authError) { setError(authError.message); setAuthBusy(false) }
  }

  async function magicLink(event: FormEvent) {
    event.preventDefault()
    setAuthBusy(true)
    setError('')
    trackPets('pets_auth_started', { method: 'magic_link' })
    const { error: authError } = await supabase.auth.signInWithOtp({ email: magicEmail.trim(), options: { emailRedirectTo: `${location.origin}/checkout` } })
    setAuthBusy(false)
    if (authError) setError(authError.message)
    else setMagicSent(true)
  }

  async function placeOrder(event: FormEvent) {
    event.preventDefault()
    setError('')
    if (
      !fieldsComplete ||
      !/^\d{4}$/.test(form.postalCode) ||
      !consent.age ||
      !consent.nutritional ||
      !consent.labelUse ||
      !consent.reportScope
    ) {
      setError(copy.validationError)
      return
    }
    setBusy(true)
    try {
      const state = await startPetsEftCheckout(
        items,
        form,
        buildPetsCheckoutConsent(consent.marketing),
      )
      sessionStorage.setItem(EFT_SESSION_KEY, JSON.stringify(state))
      // Only the purchased (eligible) line leaves the box — peptide
      // reservations stay put for the waitlist path.
      removeFromCart('mobility-collagen')
      trackPets('pets_eft_order_created', { value: state.amount, currency: 'ZAR' })
      navigate('/checkout/eft-instructions', { state })
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'EFT checkout could not be started')
      setBusy(false)
    }
  }

  const inputClass =
    'w-full rounded-xl border border-sand bg-cream px-4 py-3 text-[0.95rem] text-espresso placeholder-espresso-70/50 outline-none transition-colors focus:border-amber'

  return (
    <>
      <Seo title={copy.seoTitle} description={copy.seoDesc} path="/checkout" noindex />
      <div className="min-h-[100dvh] bg-cream py-12">
        <div className="psa-container grid gap-8 lg:grid-cols-[1fr_0.52fr]">
          <section className="rounded-[20px] border border-sand bg-warmwhite p-6 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)] sm:p-10">
            <p className="mono-label text-clinical">{copy.kicker}</p>
            <h1 className="mt-4 font-serif text-[clamp(2rem,4vw,3rem)] font-medium leading-[1.05] text-espresso">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-espresso-70">{copy.sub}</p>

            {user === undefined ? (
              <div className="mt-10 flex items-center gap-3 text-sm text-espresso-70">
                <LoaderCircle className="h-4 w-4 animate-spin" /> {copy.checking}
              </div>
            ) : !user ? (
              <div className="mt-10 rounded-[20px] border border-clinical/30 bg-clinical-tint/40 p-6">
                <p className="mono-label !text-[10px] text-clinical">{copy.authKicker}</p>
                <h2 className="mt-3 font-serif text-2xl font-semibold text-espresso md:text-3xl">
                  {copy.authTitle}
                </h2>
                <button
                  type="button"
                  onClick={google}
                  disabled={authBusy}
                  className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-espresso px-5 py-3.5 font-semibold text-cream transition-colors hover:bg-clinical disabled:opacity-50"
                >
                  {copy.googleCta} <ArrowRight className="h-4 w-4" />
                </button>
                <div className="mono-label my-5 flex items-center gap-3 !text-[10px] text-espresso-70">
                  <span className="h-px flex-1 bg-sand" />
                  {copy.orEmail}
                  <span className="h-px flex-1 bg-sand" />
                </div>
                {magicSent ? (
                  <p className="flex items-start gap-2 rounded-2xl bg-warmwhite p-4 text-sm text-clinical">
                    <Mail className="h-4 w-4 shrink-0" /> {copy.magicSent}
                  </p>
                ) : (
                  <form onSubmit={magicLink} className="flex flex-col gap-3 sm:flex-row">
                    <input
                      type="email"
                      required
                      value={magicEmail}
                      onChange={(event) => setMagicEmail(event.target.value)}
                      placeholder={copy.emailPlaceholder}
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      disabled={authBusy}
                      className="mono-label cursor-pointer rounded-full border border-espresso/25 px-5 py-3 !text-[11px] text-espresso transition-colors hover:border-amber hover:text-amber-deep disabled:opacity-50"
                    >
                      {copy.magicCta}
                    </button>
                  </form>
                )}
              </div>
            ) : (
              <form onSubmit={placeOrder} className="mt-9">
                <div className="mb-6 flex items-center gap-3 rounded-2xl border border-clinical/30 bg-clinical-tint/40 p-4 text-sm text-clinical">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>
                    {copy.sessionActive}
                    {user.email ? ` · ${user.email}` : ''}
                  </span>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label={copy.firstName}><input className={inputClass} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} /></Field>
                  <Field label={copy.lastName}><input className={inputClass} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} /></Field>
                  <Field label={copy.email}><input type="email" className={inputClass} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
                  <Field label={copy.mobile}><input inputMode="tel" className={inputClass} placeholder={copy.mobilePlaceholder} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></Field>
                  <Field label={copy.street} wide><input className={inputClass} value={form.addressLine1} onChange={(e) => setForm({ ...form, addressLine1: e.target.value })} /></Field>
                  <Field label={copy.city}><input className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></Field>
                  <Field label={copy.province}><select className={inputClass} value={form.province} onChange={(e) => setForm({ ...form, province: e.target.value })}>{provinces.map((province) => <option key={province}>{province}</option>)}</select></Field>
                  <Field label={copy.postalCode}><input inputMode="numeric" maxLength={4} className={inputClass} value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value.replace(/\D/g, '') })} /></Field>
                  <Field label={copy.petName}><input className={inputClass} value={form.petName} onChange={(e) => setForm({ ...form, petName: e.target.value })} /></Field>
                  <Field label={copy.petSpecies}><select className={inputClass} value={form.petSpecies} onChange={(e) => setForm({ ...form, petSpecies: e.target.value as PetsCheckoutForm['petSpecies'] })}><option value="dog">{copy.speciesDog}</option><option value="cat">{copy.speciesCat}</option><option value="horse">{copy.speciesHorse}</option></select></Field>
                </div>
                <div className="mt-6 space-y-3 rounded-2xl border border-sand bg-cream p-4">
                  <ConsentCheck
                    checked={consent.age}
                    onChange={(checked) => setConsent((current) => ({ ...current, age: checked }))}
                    label={copy.ageConsent}
                  />
                  <ConsentCheck
                    checked={consent.nutritional}
                    onChange={(checked) => setConsent((current) => ({ ...current, nutritional: checked }))}
                    label={copy.nutritionalConsent}
                  />
                  <ConsentCheck
                    checked={consent.labelUse}
                    onChange={(checked) => setConsent((current) => ({ ...current, labelUse: checked }))}
                    label={copy.labelUseConsent}
                  />
                  <ConsentCheck
                    checked={consent.reportScope}
                    onChange={(checked) => setConsent((current) => ({ ...current, reportScope: checked }))}
                    label={copy.reportScopeConsent}
                  />
                  <ConsentCheck
                    checked={consent.marketing}
                    onChange={(checked) => setConsent((current) => ({ ...current, marketing: checked }))}
                    label={copy.marketingConsent}
                    optional
                  />
                </div>
                <button
                  type="submit"
                  disabled={busy}
                  className="mt-6 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-amber px-6 py-4 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-amber-deep disabled:opacity-50"
                >
                  {busy ? (
                    <>
                      <LoaderCircle className="h-4 w-4 animate-spin" /> {copy.busyLabel}
                    </>
                  ) : (
                    <>
                      {copy.submitPrefix} {zar(total)} <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>
            )}
            {error && (
              <p role="alert" className="mt-5 rounded-2xl border border-alert/30 bg-cream p-4 text-sm text-alert">
                {error}
              </p>
            )}
          </section>

          <aside className="h-fit rounded-[20px] bg-espresso p-6 text-cream sm:p-8 lg:sticky lg:top-24">
            <p className="mono-label !text-[10px] text-amber">{copy.summaryKicker}</p>
            <div className="mt-7 flex gap-4">
              <img src="/product-collagen.png" alt="" className="h-24 w-24 rounded-2xl border border-cream/15 object-cover" />
              <div>
                <h2 className="font-serif text-2xl font-semibold">{copy.productName}</h2>
                <p className="mono-data mt-2 !text-[11px] uppercase tracking-[0.06em] text-cream/60">
                  {copy.quantity.replace('{qty}', String(quantity))}
                </p>
                <p className="mono-data mt-2 font-bold">{zar(subtotal)}</p>
              </div>
            </div>
            <dl className="mt-7 space-y-3 border-t border-cream/10 pt-6 text-sm">
              <div className="flex justify-between text-cream/60">
                <dt>{copy.courier}</dt>
                <dd>{shipping === 0 ? copy.courierFree : zar(shipping)}</dd>
              </div>
              <div className="mono-data flex justify-between text-xl font-bold">
                <dt>{copy.totalLabel}</dt>
                <dd>{zar(total)}</dd>
              </div>
            </dl>
            <div className="mt-7 grid gap-3 text-xs leading-relaxed text-cream/60">
              <p className="flex gap-2"><Landmark className="h-4 w-4 shrink-0 text-amber" /> {copy.trust1}</p>
              <p className="flex gap-2"><LockKeyhole className="h-4 w-4 shrink-0 text-amber" /> {copy.trust2}</p>
              <p className="flex gap-2"><ShieldCheck className="h-4 w-4 shrink-0 text-amber" /> {copy.trust3}</p>
            </div>
          </aside>
        </div>
      </div>
    </>
  )
}

function Field({ label, wide, children }: { label: string; wide?: boolean; children: ReactNode }) {
  return (
    <label className={wide ? 'sm:col-span-2' : ''}>
      <span className="mono-label mb-2 block !text-[9px] text-espresso-70">{label}</span>
      {children}
    </label>
  )
}

function ConsentCheck({
  checked,
  onChange,
  label,
  optional = false,
}: {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  optional?: boolean
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed text-espresso-70">
      <input
        type="checkbox"
        className="mt-1 accent-clinical"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span>
        {label}
        {!optional && <span className="ml-1 text-alert" aria-label="required">*</span>}
      </span>
    </label>
  )
}
