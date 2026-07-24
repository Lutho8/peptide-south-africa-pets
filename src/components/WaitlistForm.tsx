import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { PRODUCTS, waLink } from '@/lib/data'
import {
  addWaitlistEntry,
  buildReferralLink,
  buildReferralWhatsAppLink,
  effectiveQueue,
  getProductFromUrl,
  getRefFromUrl,
  REFERRAL_BOOST_SPOTS,
} from '@/lib/waitlist'
import type { WaitlistEntry } from '@/lib/waitlist'
import { cartSlugs } from '@/lib/cart'
import { getUtmFromUrl, submitPetsWaitlist, upsertPetsLead } from '@/lib/supabase'
import type { PetsWaitlistRow } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const PET_TYPES = [
  { id: 'dog', icon: '/icon-dog.svg' },
  { id: 'cat', icon: '/icon-cat.svg' },
  { id: 'horse', icon: '/icon-horse.svg' },
  { id: 'other', icon: null },
]

const CITIES = ['Cape Town', 'Johannesburg', 'Durban', 'Pretoria', 'Other']
const CONCERNS = ['mobility', 'injury', 'gut', 'skin', 'anxiety', 'longevity']

interface Props {
  /** Products pre-checked in the chips row (slugs). Defaults to all. */
  defaultProducts?: string[]
  compact?: boolean
  /** Fired once the local entry is saved (CartDrawer uses it to reserve the Launch Box). */
  onSuccess?: (entry: WaitlistEntry) => void
}

interface Errors {
  [k: string]: string
}

const spring = { type: 'spring', stiffness: 260, damping: 30 } as const

export default function WaitlistForm({ defaultProducts, compact = false, onSuccess }: Props) {
  const { t, locale } = useI18n()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [petType, setPetType] = useState('dog')
  const [breed, setBreed] = useState('')
  const [petAge, setPetAge] = useState(8)
  const [city, setCity] = useState('Cape Town')
  // Prefill priority: explicit prop → URL ?product= → Launch Box contents → all products.
  const [products, setProducts] = useState<string[]>(() => {
    if (defaultProducts && defaultProducts.length > 0) return defaultProducts
    const fromUrl = getProductFromUrl()
    if (fromUrl && PRODUCTS.some((p) => p.slug === fromUrl)) return [fromUrl]
    const fromCart = cartSlugs().filter((s) => PRODUCTS.some((p) => p.slug === s))
    if (fromCart.length > 0) return fromCart
    return PRODUCTS.map((p) => p.slug)
  })
  const [concern, setConcern] = useState('mobility')
  const [errors, setErrors] = useState<Errors>({})
  const [submitting, setSubmitting] = useState(false)
  const [entry, setEntry] = useState<WaitlistEntry | null>(null)
  const [copied, setCopied] = useState(false)
  // null = sync in flight, true = Supabase + CRM synced, false = queued locally.
  const [synced, setSynced] = useState<boolean | null>(null)
  // Referral code captured at mount — a "you were referred" credit shows on success.
  const [incomingRef] = useState<string | null>(() => getRefFromUrl())

  const productNames = useMemo(
    () =>
      products
        .map((slug) => PRODUCTS.find((p) => p.slug === slug)?.name ?? slug)
        .join(', '),
    [products],
  )

  function toggleProduct(slug: string) {
    setProducts((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    )
  }

  function validate(): boolean {
    const next: Errors = {}
    if (name.trim().length < 2) next.name = t('form.err.name')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = t('form.err.email')
    if (!/^\+?27\d{9}$/.test(whatsapp.replace(/[\s-]/g, '')))
      next.whatsapp = t('form.err.whatsapp')
    if (breed.trim().length < 2) next.breed = t('form.err.breed')
    if (products.length === 0) next.products = t('form.err.products')
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (!validate() || submitting) return
    setSubmitting(true)
    // brief spinner morph before success
    window.setTimeout(() => {
      const saved = addWaitlistEntry({
        name: name.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim(),
        petType,
        breed: breed.trim(),
        petAge,
        city,
        products,
        concern,
        ref: incomingRef,
      })
      setEntry(saved)
      setSubmitting(false)
      onSuccess?.(saved)
      // Dual-write to Supabase (waitlist) + PSA CRM (psa_leads). Fire-and-forget:
      // failures queue locally and retry on next load — the confirmation always shows.
      void syncToBackend(saved)
    }, 800)
  }

  async function syncToBackend(saved: WaitlistEntry): Promise<void> {
    const row: PetsWaitlistRow = {
      ticket_code: saved.code,
      owner_name: saved.name,
      email: saved.email,
      whatsapp: saved.whatsapp || null,
      pet_type: saved.petType,
      pet_breed: saved.breed || null,
      pet_age: saved.petAge,
      city: saved.city || null,
      products: saved.products,
      primary_concern: saved.concern,
      referral_code: saved.code,
      referred_by: saved.ref ?? null,
      source: 'waitlist-form',
      locale,
      consent_popia: true,
      utm: getUtmFromUrl(),
    }
    const waitlistOk = await submitPetsWaitlist(row)
    const leadOk = await upsertPetsLead({
      email: saved.email,
      first_name: saved.name.split(' ')[0] || null,
      phone: saved.whatsapp || null,
      city: saved.city || null,
      stage: 'lead',
      source_site: 'pets.peptide-south-africa.com',
      consent_email: true,
      consent_whatsapp: Boolean(saved.whatsapp),
      notes: `PSA PETS waitlist: ${saved.products.join(', ')}`,
    })
    setSynced(waitlistOk && leadOk)
  }

  async function copyReferralLink(code: string) {
    try {
      await navigator.clipboard.writeText(buildReferralLink(code))
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — the link is visible for manual copy */
    }
  }

  const waMessage = entry
    ? t('form.waMessage', {
        name: entry.name,
        products: productNames,
        petType: entry.petType,
        breed: entry.breed,
        age: entry.petAge,
        code: entry.code,
      })
    : ''

  const referralWaHref = entry
    ? locale === 'af'
      ? `https://wa.me/?text=${encodeURIComponent(
          t('form.refWaText', {
            name: entry.name.split(' ')[0],
            link: buildReferralLink(entry.code),
          }),
        )}`
      : buildReferralWhatsAppLink(entry.code, entry.name.split(' ')[0])
    : '#'

  return (
    <div className="relative">
      <AnimatePresence mode="wait">
        {entry ? (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={spring}
            className="rounded-[20px] border border-clinical/30 bg-warmwhite p-8 text-center shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)]"
          >
            <p className="mono-label text-clinical">{t('form.confirmed')}</p>
            <h3 className="mt-3 font-serif text-3xl font-semibold text-espresso md:text-4xl">
              {t('form.youreIn', { name: entry.name.split(' ')[0] })}
            </h3>
            <p className="mono-data mt-4 text-espresso">
              {t('form.queueLine', {
                queue: String(effectiveQueue(entry)).padStart(4, '0'),
                code: entry.code,
              })}
            </p>
            {entry.ref && (
              <p className="mono-data mt-2 inline-block rounded-full border border-amber/60 bg-amber/10 px-3 py-1 !text-[10px] text-amber-deep">
                {t('form.referred', { ref: entry.ref, spots: REFERRAL_BOOST_SPOTS })}
              </p>
            )}
            {synced !== null && (
              <p
                className={cn(
                  'mono-data mt-2 inline-block rounded-full border px-3 py-1 !text-[10px]',
                  synced
                    ? 'border-clinical/40 bg-clinical-tint text-clinical'
                    : 'border-amber/60 bg-amber/10 text-amber-deep',
                )}
              >
                {synced ? t('form.synced') : t('form.syncQueued')}
              </p>
            )}
            <p className="mt-3 text-sm text-espresso-70">{t('form.foundingNote')}</p>

            {/* Referral boost — move up the queue by sharing */}
            <div className="mt-6 rounded-2xl border border-clinical/30 bg-clinical-tint/50 p-4 text-left">
              <p className="mono-label !text-[10px] text-clinical">{t('form.refTitle')}</p>
              <p className="mt-1 text-xs leading-relaxed text-espresso-70">
                {t('form.refBody', { spots: REFERRAL_BOOST_SPOTS })}
              </p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                <input
                  readOnly
                  value={buildReferralLink(entry.code)}
                  onFocus={(e) => e.target.select()}
                  aria-label={t('form.refAria')}
                  className="mono-data min-w-0 flex-1 rounded-xl border border-sand bg-warmwhite px-3 py-2.5 !text-[11px] text-espresso"
                />
                <button
                  type="button"
                  onClick={() => copyReferralLink(entry.code)}
                  className="mono-label cursor-pointer rounded-xl border border-espresso/25 bg-warmwhite px-4 py-2.5 !text-[10px] text-espresso transition-colors hover:border-amber hover:text-amber-deep"
                >
                  {copied ? t('form.copied') : t('form.copy')}
                </button>
              </div>
              <a
                href={referralWaHref}
                target="_blank"
                rel="noreferrer"
                className="mono-label mt-3 inline-flex items-center gap-2 rounded-full bg-clinical px-4 py-2.5 !text-[10px] text-cream transition-colors hover:bg-espresso"
              >
                <img src="/icon-whatsapp.svg" alt="" className="h-4 w-4 invert" />
                {t('form.shareWa')}
              </a>
            </div>

            <a
              href={waLink(waMessage)}
              target="_blank"
              rel="noreferrer"
              className="group mt-6 inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
            >
              {t('form.confirmWa')}
              <span className="transition-transform group-hover:translate-x-1">→</span>
            </a>
            <p className="mono-data mt-5 text-[11px] text-espresso-70">{t('form.popiaFoot')}</p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={onSubmit}
            noValidate
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -16 }}
            className={cn('space-y-5', compact && 'space-y-4')}
          >
            {/* owner name + email */}
            <div className="grid gap-5 md:grid-cols-2">
              <Field label={t('form.name')} error={errors.name}>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('form.namePh')}
                  className={inputCls}
                />
              </Field>
              <Field label={t('form.email')} error={errors.email}>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('form.emailPh')}
                  className={inputCls}
                />
              </Field>
            </div>

            {/* whatsapp + breed */}
            <div className="grid gap-5 md:grid-cols-2">
              <Field label={t('form.whatsapp')} error={errors.whatsapp}>
                <input
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder={t('form.waPh')}
                  className={inputCls}
                />
              </Field>
              <Field label={t('form.breed')} error={errors.breed}>
                <input
                  value={breed}
                  onChange={(e) => setBreed(e.target.value)}
                  placeholder={t('form.breedPh')}
                  className={inputCls}
                />
              </Field>
            </div>

            {/* pet type pills */}
            <Field label={t('form.petType')}>
              <div className="flex flex-wrap gap-2">
                {PET_TYPES.map((pt) => (
                  <motion.button
                    key={pt.id}
                    type="button"
                    whileTap={{ scale: 1.08 }}
                    transition={spring}
                    onClick={() => setPetType(pt.id)}
                    className={cn(
                      'flex cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium transition-colors',
                      petType === pt.id
                        ? 'border-amber bg-amber text-espresso'
                        : 'border-sand bg-warmwhite text-espresso-70 hover:border-amber/60',
                    )}
                  >
                    {pt.icon && <img src={pt.icon} alt="" className="h-5 w-5" />}
                    {t(`form.pet.${pt.id}`)}
                  </motion.button>
                ))}
              </div>
            </Field>

            {/* age slider + city */}
            <div className="grid gap-5 md:grid-cols-2">
              <Field label={t('form.age', { age: petAge })}>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={petAge}
                  onChange={(e) => setPetAge(Number(e.target.value))}
                  className="w-full accent-amber"
                />
                <AnimatePresence>
                  {petAge >= 10 && (
                    <motion.p
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="mt-1 font-serif text-sm italic text-espresso-70"
                    >
                      {t('form.seniorNote')}
                    </motion.p>
                  )}
                </AnimatePresence>
              </Field>
              <Field label={t('form.city')}>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className={cn(inputCls, 'cursor-pointer')}
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c}>
                      {t(`form.city.${c}`)}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            {/* products of interest */}
            <Field label={t('form.products')} error={errors.products}>
              <div className="flex flex-wrap gap-2">
                {PRODUCTS.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => toggleProduct(p.slug)}
                    className={cn(
                      'mono-label cursor-pointer rounded-full border px-3 py-1.5 !text-[10px] transition-colors',
                      products.includes(p.slug)
                        ? 'border-clinical bg-clinical-tint text-clinical'
                        : 'border-sand bg-warmwhite text-espresso-70 hover:border-clinical/50',
                    )}
                  >
                    {p.name}
                  </button>
                ))}
              </div>
            </Field>

            {/* concern */}
            <Field label={t('form.concern')}>
              <div className="flex flex-wrap gap-2">
                {CONCERNS.map((c) => (
                  <motion.button
                    key={c}
                    type="button"
                    whileTap={{ scale: 1.08 }}
                    transition={spring}
                    onClick={() => setConcern(c)}
                    className={cn(
                      'cursor-pointer rounded-full border px-4 py-2 text-sm capitalize transition-colors',
                      concern === c
                        ? 'border-amber bg-amber text-espresso'
                        : 'border-sand bg-warmwhite text-espresso-70 hover:border-amber/60',
                    )}
                  >
                    {t(`form.concern.${c}`)}
                  </motion.button>
                ))}
              </div>
            </Field>

            <button
              type="submit"
              disabled={submitting}
              className="w-full cursor-pointer rounded-full bg-amber py-4 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-amber-deep disabled:opacity-70"
            >
              {submitting ? t('form.submitting') : t('form.submit')}
            </button>
            <p className="mono-data text-center text-[11px] text-espresso-70">{t('form.popia')}</p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  )
}

const inputCls =
  'w-full rounded-xl border border-sand bg-warmwhite px-4 py-3 text-espresso placeholder:text-espresso-70/50 focus:border-amber focus:outline-none'

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <span className="mono-label mb-2 block text-espresso-70">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mono-label mt-1 block !text-[10px] text-alert"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  )
}
