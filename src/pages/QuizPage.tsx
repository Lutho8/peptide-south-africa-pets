import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Variants } from 'framer-motion'
import {
  CONCERN_OPTIONS,
  MAX_CONCERNS,
  PET_TYPE_OPTIONS,
  addStackToCart,
  buildStack,
  concernLabelLocalized,
  isSenior,
  saveQuizLead,
  sizeBandsFor,
} from '@/lib/quiz'
import type { ConcernId, PetType, QuizAnswers, SizeBand, StackResult } from '@/lib/quiz'
import { getRefFromUrl } from '@/lib/waitlist'
import { openCart } from '@/lib/cart'
import VetPack from '@/components/VetPack'
import { handoutForProduct } from '@/lib/vetpack'
import type { VetHandout } from '@/lib/vetpack'
import { useI18n } from '@/lib/i18n'
import {
  generateTicketCode,
  getUtmFromUrl,
  submitPetsWaitlist,
  upsertPetsLead,
} from '@/lib/supabase'
import { cn } from '@/lib/utils'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
const SPRING = { type: 'spring', stiffness: 260, damping: 30 } as const
const TOTAL_QUESTIONS = 7
const LAST_STEP = 7

const inputCls =
  'w-full rounded-xl border border-sand bg-warmwhite px-4 py-3 text-espresso placeholder:text-espresso-70/50 focus:border-amber focus:outline-none'

export default function QuizPage() {
  const navigate = useNavigate()
  const reduced = useReducedMotion()
  const { t, locale } = useI18n()

  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState(1)
  const stepRef = useRef(0)

  /* ----- answers ----- */
  const [petType, setPetType] = useState<PetType | null>(null)
  const [petName, setPetName] = useState('')
  const [breed, setBreed] = useState('')
  const [ageYears, setAgeYears] = useState(6)
  const [size, setSize] = useState<SizeBand | null>(null)
  const [concerns, setConcerns] = useState<ConcernId[]>([])
  const [supplements, setSupplements] = useState('')
  const [hasVet, setHasVet] = useState<boolean | null>(null)

  /* ----- lead capture ----- */
  const [ownerName, setOwnerName] = useState('')
  const [email, setEmail] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [popia, setPopia] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [encouragement, setEncouragement] = useState<string | null>(null)
  const [stack, setStack] = useState<StackResult | null>(null)
  /** True once the lead is captured (gated form OR post-reveal inline form). */
  const [leadCaptured, setLeadCaptured] = useState(false)
  /** True when the user bypassed the lead gate ("Show my plan first"). */
  const [skippedGate, setSkippedGate] = useState(false)
  /** Confirmation toast after "add my stack" (auto-dismisses). */
  const [toast, setToast] = useState<string | null>(null)

  const senior = isSenior(petType, ageYears)
  const speciesWord = (pt: PetType | null) => t(`quiz.species.${pt ?? 'pet'}`)
  const displayName = petName.trim() || (locale === 'af' ? 'jou troeteldier' : 'your pet')
  const progress = step === 0 ? 0 : Math.round((step / TOTAL_QUESTIONS) * 100)

  /* ----- step navigation (browser-back aware; direct entry restarts at 0) ----- */
  function goTo(n: number, push = true) {
    const next = Math.min(Math.max(n, 0), LAST_STEP)
    setDirection(next >= stepRef.current ? 1 : -1)
    stepRef.current = next
    setStep(next)
    if (push) {
      try {
        window.history.pushState({ quizStep: next }, '')
      } catch {
        /* history unavailable — in-memory step still works */
      }
    }
    window.scrollTo({ top: 0 })
  }

  useEffect(() => {
    try {
      window.history.replaceState({ quizStep: 0 }, '')
    } catch {
      /* ignore */
    }
    const onPop = (e: PopStateEvent) => {
      const s = (e.state as { quizStep?: number } | null)?.quizStep
      const next = typeof s === 'number' ? Math.min(Math.max(s, 0), LAST_STEP) : 0
      setDirection(next >= stepRef.current ? 1 : -1)
      stepRef.current = next
      setStep(next)
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  /* ----- guards ----- */
  useEffect(() => {
    if (step === LAST_STEP && !stack) goTo(0, false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, stack])

  /* ----- encouragement auto-dismiss ----- */
  useEffect(() => {
    if (!encouragement) return
    const t = window.setTimeout(() => setEncouragement(null), 2400)
    return () => window.clearTimeout(t)
  }, [encouragement])

  /* ----- toast auto-dismiss ----- */
  useEffect(() => {
    if (!toast) return
    const id = window.setTimeout(() => setToast(null), 4200)
    return () => window.clearTimeout(id)
  }, [toast])

  /* ----- answer handlers ----- */
  function selectPetType(pt: PetType) {
    setPetType(pt)
    setEncouragement(t('quiz.enc.petType', { pet: speciesWord(pt) }))
    goTo(2)
  }

  function submitProfile(e: FormEvent) {
    e.preventDefault()
    const errs: Record<string, string> = {}
    if (petName.trim().length < 2) errs.petName = t('quiz.err.petName')
    if (ageYears < 1 || ageYears > 30) errs.age = t('quiz.err.age')
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setEncouragement(t('quiz.enc.profile', { name: displayName }))
    goTo(3)
  }

  function selectSize(b: SizeBand) {
    setSize(b)
    setEncouragement(t('quiz.enc.size', { name: displayName }))
    goTo(4)
  }

  function toggleConcern(id: ConcernId) {
    setErrors({})
    setConcerns((prev) => {
      if (prev.includes(id)) return prev.filter((c) => c !== id)
      if (prev.length >= MAX_CONCERNS) return prev
      return [...prev, id]
    })
  }

  function continueConcerns() {
    if (concerns.length === 0) {
      setErrors({ concerns: t('quiz.err.concerns') })
      return
    }
    setErrors({})
    setEncouragement(t('quiz.enc.concerns', { name: displayName }))
    goTo(5)
  }

  function continueRoutine() {
    if (hasVet === null) {
      setErrors({ hasVet: t('quiz.err.vet') })
      return
    }
    setErrors({})
    setEncouragement(
      hasVet
        ? t('quiz.enc.vetYes', { name: displayName })
        : t('quiz.enc.vetNo'),
    )
    goTo(6)
  }

  function answersSnapshot(): QuizAnswers {
    return {
      petType: petType ?? 'dog',
      petName: petName.trim(),
      breed: breed.trim(),
      ageYears,
      senior,
      size: size ?? 'M',
      concerns,
      supplements: supplements.trim(),
      hasVet: hasVet ?? false,
    }
  }

  /**
   * Validate + persist the lead (localStorage quiz lead + Supabase dual-write).
   * Shared by the gated lead step and the post-reveal inline capture — the
   * value exchange is identical either way. Returns true on success.
   */
  function captureLead(): boolean {
    const errs: Record<string, string> = {}
    if (ownerName.trim().length < 2) errs.ownerName = t('quiz.err.owner')
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errs.email = t('quiz.err.email')
    if (!/^\+?(?:27|0)\d{9}$/.test(whatsapp.replace(/[\s-]/g, '')))
      errs.whatsapp = t('quiz.err.whatsapp')
    if (!popia) errs.popia = t('quiz.err.popia')
    setErrors(errs)
    if (Object.keys(errs).length > 0) return false

    const answers = answersSnapshot()
    const result = stack ?? buildStack(answers)
    if (!stack) setStack(result)
    saveQuizLead({
      ownerName: ownerName.trim(),
      email: email.trim(),
      whatsapp: whatsapp.trim(),
      popiaConsent: popia,
      petName: answers.petName,
      petType: answers.petType,
      stack: result.slugs,
      capturedAt: new Date().toISOString(),
    })
    // Dual-write the quiz lead to Supabase (waitlist row + CRM). Fire-and-forget:
    // failures are queued locally and never block the plan reveal.
    void syncQuizLead(answers, result.slugs)
    setLeadCaptured(true)
    return true
  }

  function submitLead(e: FormEvent) {
    e.preventDefault()
    if (captureLead()) goTo(7)
  }

  /** "Show my plan first" — reveal results without the lead gate. */
  function skipLead() {
    if (!stack) setStack(buildStack(answersSnapshot()))
    setSkippedGate(true)
    goTo(7)
  }

  /** Post-reveal inline capture (same dual-write as the gated step). */
  function submitInlineLead(e: FormEvent) {
    e.preventDefault()
    captureLead()
  }

  async function syncQuizLead(answers: QuizAnswers, slugs: string[]): Promise<void> {
    try {
      const code = generateTicketCode()
      await submitPetsWaitlist({
        ticket_code: code,
        owner_name: ownerName.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim() || null,
        pet_type: answers.petType,
        pet_breed: answers.breed || null,
        pet_age: answers.ageYears,
        products: slugs,
        primary_concern: answers.concerns[0] ?? null,
        referral_code: code,
        referred_by: getRefFromUrl(),
        source: 'quiz',
        locale,
        consent_popia: popia,
        utm: getUtmFromUrl(),
        quiz_answers: answers as unknown as Record<string, unknown>,
      })
      await upsertPetsLead({
        email: email.trim(),
        first_name: ownerName.trim().split(' ')[0] || null,
        phone: whatsapp.trim() || null,
        city: null,
        stage: 'lead',
        source_site: 'pets.peptide-south-africa.com',
        consent_email: true,
        consent_whatsapp: Boolean(whatsapp.trim()),
        notes: `PSA PETS waitlist: ${slugs.join(', ')}`,
      })
    } catch {
      /* funnel must never break on a sync failure */
    }
  }

  function addMyStack() {
    if (!stack) return
    addStackToCart(stack.slugs)
    // Open the global Launch Box drawer (mounted in Layout) so the user sees
    // their stack land — no dead-end navigation to a missing anchor.
    openCart()
    setToast(t('quiz.stackToast'))
  }

  function joinWaitlist() {
    if (!stack) return
    navigate(`/waitlist?product=${stack.slugs.join(',')}`)
  }

  /**
   * Generic, conservative dosing guidance per product, driven by the pet's
   * size band. Drops: once daily, 5-on/2-off. Collagen: daily scoop. Horses:
   * vet-guided chart. The full vet-reviewed chart ships with every order.
   */
  function doseFor(slug: string): { amount: string; schedule: string } {
    const band = size ?? 'M'
    if (petType === 'horse') {
      return { amount: t('quiz.dose.equine'), schedule: t('quiz.dose.vetGuided') }
    }
    if (slug === 'mobility-collagen') {
      return { amount: t(`quiz.dose.scoop.${band}`), schedule: t('quiz.dose.dailyFood') }
    }
    return { amount: t(`quiz.dose.drops.${band}`), schedule: t('quiz.dose.cycle') }
  }

  function retake() {
    setPetType(null)
    setPetName('')
    setBreed('')
    setAgeYears(6)
    setSize(null)
    setConcerns([])
    setSupplements('')
    setHasVet(null)
    setOwnerName('')
    setEmail('')
    setWhatsapp('')
    setPopia(false)
    setErrors({})
    setStack(null)
    setLeadCaptured(false)
    setSkippedGate(false)
    setToast(null)
    setEncouragement(null)
    goTo(0)
  }

  /* ----- motion ----- */
  const variants: Variants = {
    enter: (d: number) => ({ x: reduced ? 0 : d * 56, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: reduced ? 0 : d * -56, opacity: 0 }),
  }
  const stepTransition = reduced
    ? { duration: 0 }
    : { duration: 0.4, ease: EASE }

  /* ------------------------------ steps ------------------------------- */

  function renderHook() {
    return (
      <div className="text-center">
        <p className="mono-label text-clinical">{t('quiz.overline')}</p>
        <h1 className="mx-auto mt-4 max-w-xl font-serif text-4xl font-medium leading-[1.05] tracking-[-0.02em] text-espresso md:text-5xl">
          {t('quiz.hookTitle')}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[1.0625rem] leading-relaxed text-espresso-70">
          {t('quiz.hookSub')}
        </p>
        <motion.button
          type="button"
          whileTap={reduced ? undefined : { scale: 0.97 }}
          transition={SPRING}
          onClick={() => goTo(1)}
          className="mt-8 inline-flex cursor-pointer items-center gap-2 rounded-full bg-amber px-8 py-4 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
        >
          {t('quiz.hookCta')}
          <span aria-hidden>→</span>
        </motion.button>
        <p className="mono-data mt-4 text-[11px] uppercase tracking-[0.08em] text-espresso-70">
          {t('quiz.hookMeta')}
        </p>

        <div className="relative mx-auto mt-10 max-w-xs">
          <img
            src="/dog-portrait-3.png"
            alt="Hands gently holding a senior dog's paw"
            className="w-full rounded-2xl object-cover"
          />
          <img
            src="/coa-stamp.svg"
            alt=""
            aria-hidden
            className="absolute -bottom-6 -right-6 h-24 w-24 rotate-12"
          />
        </div>
      </div>
    )
  }

  function renderPetType() {
    return (
      <div>
        <StepHeading
          kicker={t('quiz.step1.kicker')}
          title={t('quiz.step1.title')}
          sub={t('quiz.step1.sub')}
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {PET_TYPE_OPTIONS.map((o) => (
            <motion.button
              key={o.id}
              type="button"
              whileTap={reduced ? undefined : { scale: 0.97 }}
              transition={SPRING}
              onClick={() => selectPetType(o.id)}
              className={cn(
                'group flex cursor-pointer flex-col items-center rounded-[20px] border bg-warmwhite p-6 text-center transition-colors',
                petType === o.id
                  ? 'border-amber'
                  : 'border-sand hover:border-amber/60 hover:shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)]',
              )}
            >
              <img src={o.icon} alt="" className="h-16 w-16" />
              <span className="mono-label mt-4 text-espresso">
                {locale === 'af' ? (o.labelAf ?? o.label) : o.label}
              </span>
              <span className="mt-2 text-xs italic leading-snug text-espresso-70">
                {locale === 'af' ? (o.taglineAf ?? o.tagline) : o.tagline}
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  function renderProfile() {
    return (
      <form onSubmit={submitProfile} noValidate>
        <StepHeading
          kicker={t('quiz.step2.kicker')}
          title={t('quiz.step2.title', { pet: speciesWord(petType) })}
          sub={t('quiz.step2.sub')}
        />
        <div className="mt-8 space-y-5">
          <div>
            <label htmlFor="quiz-pet-name" className="mono-label mb-2 block text-espresso-70">
              {petType === 'horse' ? t('quiz.petName.horse') : t('quiz.petName.pet')}
            </label>
            <input
              id="quiz-pet-name"
              autoFocus
              value={petName}
              onChange={(e) => setPetName(e.target.value)}
              placeholder={petType === 'cat' ? 'Minki' : petType === 'horse' ? 'Blitz' : 'Bella'}
              className={inputCls}
            />
            <FieldError msg={errors.petName} />
          </div>
          <div>
            <label htmlFor="quiz-breed" className="mono-label mb-2 block text-espresso-70">
              {t('quiz.breed')} <span className="text-espresso-70/60">{t('quiz.optional')}</span>
            </label>
            <input
              id="quiz-breed"
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
              placeholder={t('quiz.breedPh')}
              className={inputCls}
            />
          </div>
          <div>
            <label htmlFor="quiz-age" className="mono-label mb-2 block text-espresso-70">
              {t('quiz.ageLabel').split('{age}')[0]}
              <span className="text-espresso">
                {ageYears}
                {t('quiz.ageLabel').split('{age}')[1]}
              </span>
            </label>
            <input
              id="quiz-age"
              type="range"
              min={1}
              max={30}
              value={ageYears}
              onChange={(e) => setAgeYears(Number(e.target.value))}
              className="w-full accent-amber"
            />
            <div className="mono-data flex justify-between text-[10px] text-espresso-70">
              <span>1</span>
              <span>30</span>
            </div>
            <AnimatePresence>
              {senior && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mono-label mt-2 inline-block rounded-full border border-clinical/40 bg-clinical-tint px-3 py-1 !text-[10px] text-clinical"
                >
                  {t('quiz.seniorOn', {
                    threshold: petType === 'cat' ? '10+' : petType === 'horse' ? '15+' : '7+',
                  })}
                </motion.p>
              )}
            </AnimatePresence>
            <FieldError msg={errors.age} />
          </div>
        </div>
        <ContinueButton label={t('quiz.continue')} />
      </form>
    )
  }

  function renderSize() {
    const bands = sizeBandsFor(petType)
    return (
      <div>
        <StepHeading
          kicker={t('quiz.step3.kicker')}
          title={t('quiz.step3.title', { name: displayName })}
          sub={t('quiz.step3.sub')}
        />
        <div className="mt-8 space-y-3">
          {bands.map((b) => (
            <motion.button
              key={b.id}
              type="button"
              whileTap={reduced ? undefined : { scale: 0.98 }}
              transition={SPRING}
              onClick={() => selectSize(b.id)}
              className={cn(
                'flex w-full cursor-pointer items-center gap-4 rounded-[20px] border bg-warmwhite p-4 text-left transition-colors',
                size === b.id
                  ? 'border-amber'
                  : 'border-sand hover:border-amber/60 hover:shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)]',
              )}
            >
              <span className="mono-label flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-espresso/20 !text-base text-espresso">
                {b.id}
              </span>
              <span className="min-w-0">
                <span className="mono-label block text-espresso">
                  {locale === 'af' ? (b.rangeAf ?? b.range) : b.range}
                </span>
                <span className="mt-1 block truncate text-xs italic text-espresso-70">
                  {locale === 'af' ? (b.noteAf ?? b.note) : b.note}
                </span>
              </span>
              <span aria-hidden className="ml-auto text-espresso-70">
                →
              </span>
            </motion.button>
          ))}
        </div>
      </div>
    )
  }

  function renderConcerns() {
    return (
      <div>
        <StepHeading
          kicker={t('quiz.step4.kicker')}
          title={t('quiz.step4.title', { name: displayName })}
          sub={t('quiz.step4.sub', { max: MAX_CONCERNS })}
        />
        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {CONCERN_OPTIONS.map((c) => {
            const selected = concerns.includes(c.id)
            const maxed = !selected && concerns.length >= MAX_CONCERNS
            return (
              <motion.button
                key={c.id}
                type="button"
                whileTap={reduced ? undefined : { scale: 0.98 }}
                transition={SPRING}
                onClick={() => toggleConcern(c.id)}
                aria-pressed={selected}
                disabled={maxed}
                className={cn(
                  'relative cursor-pointer rounded-[20px] border p-4 text-left transition-colors',
                  selected
                    ? 'border-clinical bg-clinical-tint'
                    : maxed
                      ? 'cursor-not-allowed border-sand bg-warmwhite opacity-50'
                      : 'border-sand bg-warmwhite hover:border-clinical/50',
                )}
              >
                <span className="flex items-start justify-between gap-3">
                  <span className="mono-label text-espresso">
                    {locale === 'af' ? (c.labelAf ?? c.label) : c.label}
                  </span>
                  <span
                    aria-hidden
                    className={cn(
                      'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border',
                      selected ? 'border-clinical bg-clinical text-cream' : 'border-sand',
                    )}
                  >
                    {selected && (
                      <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                        <path
                          d="M2 6.5L4.5 9L10 3"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                </span>
                <span className="mt-2 block text-xs leading-snug text-espresso-70">
                  {locale === 'af' ? (c.descAf ?? c.desc) : c.desc}
                </span>
              </motion.button>
            )
          })}
        </div>
        <div className="mt-5 flex items-center justify-between">
          <span className="mono-data text-[11px] uppercase tracking-[0.08em] text-espresso-70">
            {t('quiz.selected', { count: concerns.length, max: MAX_CONCERNS })}
          </span>
          {concerns.includes('anxiety') && (
            <span className="mono-data text-[11px] uppercase tracking-[0.08em] text-amber-deep">
              {t('quiz.calmingDev')}
            </span>
          )}
        </div>
        <FieldError msg={errors.concerns} />
        <ContinueButton label={t('quiz.continue')} onClick={continueConcerns} />
      </div>
    )
  }

  function renderRoutine() {
    return (
      <div>
        <StepHeading
          kicker="SAFETY CHECK"
          title={`What is ${displayName} already on?`}
          sub="Supplements, chronic meds — and whether a vet is in the picture."
        />
        <div className="mt-8 space-y-6">
          <div>
            <label htmlFor="quiz-supps" className="mono-label mb-2 block text-espresso-70">
              CURRENT SUPPLEMENTS / MEDS <span className="text-espresso-70/60">(OPTIONAL)</span>
            </label>
            <textarea
              id="quiz-supps"
              rows={3}
              value={supplements}
              onChange={(e) => setSupplements(e.target.value)}
              placeholder="e.g. joint chews, chronic anti-inflammatories, nothing yet…"
              className={cn(inputCls, 'resize-none')}
            />
            <p className="mono-data mt-2 text-[11px] text-espresso-70">
              WE FLAG INTERACTIONS IN YOUR PLAN NOTES — YOUR VET GETS THE FULL LIST.
            </p>
          </div>
          <div>
            <span className="mono-label mb-2 block text-espresso-70">
              DO YOU HAVE A VET FOR {displayName.toUpperCase()}?
            </span>
            <div className="flex gap-2">
              {(
                [
                  { value: true, label: 'YES — HAVE A VET' },
                  { value: false, label: 'NO VET YET' },
                ] as const
              ).map((opt) => (
                <motion.button
                  key={String(opt.value)}
                  type="button"
                  whileTap={reduced ? undefined : { scale: 1.04 }}
                  transition={SPRING}
                  onClick={() => {
                    setHasVet(opt.value)
                    setErrors({})
                  }}
                  aria-pressed={hasVet === opt.value}
                  className={cn(
                    'mono-label flex-1 cursor-pointer rounded-full border px-4 py-3 !text-[11px] transition-colors',
                    hasVet === opt.value
                      ? 'border-amber bg-amber text-espresso'
                      : 'border-sand bg-warmwhite text-espresso-70 hover:border-amber/60',
                  )}
                >
                  {opt.label}
                </motion.button>
              ))}
            </div>
            <FieldError msg={errors.hasVet} />
            <AnimatePresence>
              {hasVet === false && (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-3 border-l-2 border-alert pl-3 text-sm text-espresso-70"
                >
                  {t('quiz.noVetNote', { name: displayName })}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
        <ContinueButton label={t('quiz.continue')} onClick={continueRoutine} />
      </div>
    )
  }

  function renderLead() {
    return (
      <form onSubmit={submitLead} noValidate>
        <StepHeading
          kicker={t('quiz.step6.kicker')}
          title={t('quiz.step6.title', { name: displayName })}
          sub={t('quiz.step6.sub')}
        />
        <div className="mt-8 space-y-5">
          <div>
            <label htmlFor="quiz-owner" className="mono-label mb-2 block text-espresso-70">
              {t('quiz.yourName')}
            </label>
            <input
              id="quiz-owner"
              autoFocus
              value={ownerName}
              onChange={(e) => setOwnerName(e.target.value)}
              placeholder={t('form.namePh')}
              className={inputCls}
            />
            <FieldError msg={errors.ownerName} />
          </div>
          <div>
            <label htmlFor="quiz-email" className="mono-label mb-2 block text-espresso-70">
              {t('quiz.email')}
            </label>
            <input
              id="quiz-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('form.emailPh')}
              className={inputCls}
            />
            <FieldError msg={errors.email} />
          </div>
          <div>
            <label htmlFor="quiz-wa" className="mono-label mb-2 block text-espresso-70">
              {t('quiz.whatsapp')}
            </label>
            <input
              id="quiz-wa"
              inputMode="tel"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="+27 82 000 0000"
              className={inputCls}
            />
            <FieldError msg={errors.whatsapp} />
          </div>
          <div>
            <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-sand bg-warmwhite p-4">
              <input
                type="checkbox"
                checked={popia}
                onChange={(e) => setPopia(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-clinical"
              />
              <span className="text-sm leading-snug text-espresso-70">
                I&rsquo;m happy for PSA PETS to contact me about {displayName}&rsquo;s plan
                and pet product launches. POPIA compliant — unsubscribe anytime.
              </span>
            </label>
            <FieldError msg={errors.popia} />
          </div>
        </div>
        <motion.button
          type="submit"
          whileTap={reduced ? undefined : { scale: 0.98 }}
          transition={SPRING}
          className="mt-8 w-full cursor-pointer rounded-full bg-amber py-4 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
        >
          {t('quiz.seePlan', { name: displayName })}
        </motion.button>
        <p className="mono-data mt-3 text-center text-[11px] text-espresso-70">
          {t('quiz.leadFoot')}
        </p>
        {/* escape hatch — the plan renders on-screen either way */}
        <button
          type="button"
          onClick={skipLead}
          className="mono-label link-underline mx-auto mt-4 block cursor-pointer !text-[11px] text-espresso-70"
        >
          {t('quiz.skipLead')}
        </button>
      </form>
    )
  }

  function renderResults() {
    if (!stack) return null
    const today = new Date()
      .toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })
      .toUpperCase()
    // "Bring your vet" pack — one handout per stacked product.
    const vetHandouts = stack.items
      .map((item) => handoutForProduct(item.product.slug, locale))
      .filter((h): h is VetHandout => h !== null)
    return (
      <div>
        <p className="mono-data text-center text-[11px] uppercase tracking-[0.08em] text-clinical">
          {t('quiz.readyLine', { date: today, ref: stack.ref })}
        </p>
        <h2 className="mt-3 text-center font-serif text-3xl font-medium leading-tight tracking-[-0.02em] text-espresso md:text-5xl">
          {t('quiz.resultsTitle', { name: displayName })}
        </h2>
        <p className="mx-auto mt-3 max-w-md text-center text-[1.0625rem] text-espresso-70">
          {stack.items.length === 1
            ? t('quiz.results.countOne')
            : t('quiz.results.count', { count: stack.items.length })}
          ,{' '}
          {t('quiz.results.matched', {
            concerns:
              concerns
                .map((c) => concernLabelLocalized(c, locale))
                .join(' · ')
                .toLowerCase() || t('quiz.results.wellness'),
          })}
          {senior ? t('quiz.results.senior') : ''}.
        </p>

        {/* lab-stub prescription card */}
        <div className="relative mt-10 overflow-hidden rounded-[20px] border border-sand bg-warmwhite p-6 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)] md:p-8">
          <img
            src="/coa-stamp.svg"
            alt=""
            aria-hidden
            className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rotate-12 opacity-15"
          />
          <div className="relative">
            <div className="flex items-center justify-between border-b border-dashed border-sand pb-3">
              <span className="mono-label text-espresso">{t('quiz.protocol')}</span>
              <span className="mono-data text-espresso-70">{stack.ref}</span>
            </div>
            <dl className="mono-data mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-[12px] text-espresso sm:grid-cols-3">
              <div>
                <dt className="text-espresso-70">{t('quiz.patient')}</dt>
                <dd className="uppercase">{displayName}</dd>
              </div>
              <div>
                <dt className="text-espresso-70">{t('quiz.speciesLabel')}</dt>
                <dd className="uppercase">{petType ? speciesWord(petType) : '—'}</dd>
              </div>
              <div>
                <dt className="text-espresso-70">{t('quiz.breedRow')}</dt>
                <dd className="uppercase">{breed.trim() || '—'}</dd>
              </div>
              <div>
                <dt className="text-espresso-70">{t('quiz.ageRow')}</dt>
                <dd>
                  {ageYears} {t('quiz.yrs')}
                  {senior ? ` · ${t('quiz.seniorTag')}` : ''}
                </dd>
              </div>
              <div>
                <dt className="text-espresso-70">{t('quiz.sizeBand')}</dt>
                <dd>{size ?? '—'}</dd>
              </div>
              <div>
                <dt className="text-espresso-70">{t('quiz.vetOnFile')}</dt>
                <dd>{hasVet ? t('quiz.yes') : t('quiz.notYet')}</dd>
              </div>
            </dl>

            {/* stack items */}
            <div className="mt-6 space-y-4">
              {stack.items.map((item, i) => (
                <div
                  key={item.product.slug}
                  className="flex gap-4 rounded-2xl border border-sand bg-cream p-4"
                >
                  <div className="w-20 shrink-0 overflow-hidden rounded-xl bg-cream-2 sm:w-24">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={cn(
                          'mono-label inline-flex items-center rounded-full border px-2.5 py-0.5 !text-[10px]',
                          item.evidenceTone === 'clinical' &&
                            'border-clinical/40 bg-clinical-tint text-clinical',
                          item.evidenceTone === 'amber' &&
                            'border-amber/60 bg-amber/10 text-amber-deep',
                          item.evidenceTone === 'neutral' &&
                            'border-sand bg-warmwhite text-espresso-70',
                        )}
                      >
                        {item.evidenceBadge}
                      </span>
                      <span className="mono-data text-[10px] uppercase tracking-[0.08em] text-espresso-70">
                        {t('quiz.itemX', {
                          a: String(i + 1).padStart(2, '0'),
                          b: String(stack.items.length).padStart(2, '0'),
                        })}
                      </span>
                    </div>
                    <h3 className="mt-2 font-serif text-lg font-semibold text-espresso">
                      {item.product.name}
                    </h3>
                    <p className="mono-data text-[10px] uppercase tracking-[0.06em] text-espresso-70">
                      {item.product.spec}
                    </p>
                    <p className="mt-2 text-sm leading-snug text-espresso-70">
                      {item.whyKey
                        ? t(item.whyKey, {
                            name: displayName,
                            breed: breed.trim() || speciesWord(petType),
                            age: ageYears,
                          })
                        : item.why}
                    </p>
                    <p className="mono-label mt-2 !text-[11px] text-espresso">
                      {item.product.price}
                    </p>
                    {item.preclinical && item.honesty && (
                      <p className="mt-2 border-l-2 border-alert pl-2 text-xs leading-snug text-espresso-70">
                        {item.honesty}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {stack.calming && (
                <div className="rounded-2xl border border-dashed border-amber/60 bg-amber/5 p-4">
                  <span className="mono-label inline-flex items-center rounded-full border border-amber/60 px-2.5 py-0.5 !text-[10px] text-amber-deep">
                    {t('quiz.calmingBadge')}
                  </span>
                  <h3 className="mt-2 font-serif text-lg font-semibold text-espresso">
                    {t('quiz.calmingTitle', { name: displayName })}
                  </h3>
                  <p className="mt-1 text-sm leading-snug text-espresso-70">
                    {t('quiz.calmingBody')}
                  </p>
                </div>
              )}
            </div>

            {/* dosing guidance — weight-band rows, conservative + generic */}
            <div className="mt-6 rounded-2xl border border-sand bg-warmwhite p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="mono-label !text-[10px] text-clinical">{t('quiz.dose.title')}</p>
                <span className="mono-data text-[10px] uppercase tracking-[0.08em] text-espresso-70">
                  {t('quiz.dose.band', { band: size ?? 'M' })}
                </span>
              </div>
              <div className="mono-data mt-3 divide-y divide-sand text-[11px] uppercase tracking-[0.04em] text-espresso">
                {stack.items.map((item) => {
                  const dose = doseFor(item.product.slug)
                  return (
                    <div key={item.product.slug} className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 py-2.5 sm:grid-cols-[1.2fr_1fr_1.2fr]">
                      <span className="font-bold">{item.product.name}</span>
                      <span className="text-right text-amber-deep sm:text-left">{dose.amount}</span>
                      <span className="col-span-2 text-espresso-70 sm:col-span-1">{dose.schedule}</span>
                    </div>
                  )
                })}
              </div>
              <p className="mono-data mt-3 border-t border-dashed border-sand pt-3 text-[10px] uppercase leading-relaxed tracking-[0.06em] text-espresso-70">
                {t('quiz.dose.intro')}
              </p>
              <p className="mono-data mt-1 text-[10px] uppercase leading-relaxed tracking-[0.06em] text-clinical">
                {t('quiz.dose.chart')}
              </p>
            </div>

            {stack.honestyLine && (
              <p className="mt-5 border-l-2 border-alert pl-3 text-sm leading-snug text-espresso-70">
                {stack.honestyLineKey
                  ? t(stack.honestyLineKey, { name: displayName })
                  : stack.honestyLine}
              </p>
            )}
            <p className="mono-data mt-4 text-[10px] uppercase tracking-[0.08em] text-espresso-70">
              {t('quiz.disclaimer')}
            </p>
            <button
              type="button"
              onClick={() => window.print()}
              className="mono-label mt-4 inline-flex cursor-pointer items-center gap-2 rounded-full border border-espresso/30 bg-warmwhite px-5 py-2.5 !text-[11px] text-espresso transition-colors hover:border-amber hover:text-amber-deep"
            >
              {t('quiz.dose.print')} ↓
            </button>
          </div>
        </div>

        {/* bring-your-vet one-tap pack (WhatsApp share + printable handout) */}
        <VetPack
          className="mt-6"
          handouts={vetHandouts}
          link={`${window.location.origin}/product/${stack.slugs[0] ?? ''}`}
        />

        {/* CTA row */}
        <div className="mt-8 space-y-3">
          <motion.button
            type="button"
            whileTap={reduced ? undefined : { scale: 0.98 }}
            transition={SPRING}
            onClick={addMyStack}
            className="w-full cursor-pointer rounded-full bg-amber py-4 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
          >
            {t('quiz.addStack')}
          </motion.button>
          <motion.button
            type="button"
            whileTap={reduced ? undefined : { scale: 0.98 }}
            transition={SPRING}
            onClick={joinWaitlist}
            className="mono-label w-full cursor-pointer rounded-full border border-espresso bg-transparent py-4 !text-[12px] text-espresso transition-colors hover:bg-espresso hover:text-cream"
          >
            {t('quiz.joinStack')}
          </motion.button>
        </div>

        {/* post-reveal lead capture — shown when the user skipped the gate */}
        {skippedGate && !leadCaptured ? (
          <form
            onSubmit={submitInlineLead}
            noValidate
            className="mt-8 rounded-[20px] border border-clinical/30 bg-clinical-tint/40 p-6"
          >
            <p className="mono-label !text-[10px] text-clinical">{t('quiz.save.kicker')}</p>
            <h3 className="mt-2 font-serif text-xl font-semibold text-espresso">
              {t('quiz.save.title', { name: displayName })}
            </h3>
            <p className="mt-1 text-sm leading-snug text-espresso-70">{t('quiz.save.sub')}</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div>
                <input
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder={t('form.namePh')}
                  aria-label={t('quiz.yourName')}
                  className={inputCls}
                />
                <FieldError msg={errors.ownerName} />
              </div>
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('form.emailPh')}
                  aria-label={t('quiz.email')}
                  className={inputCls}
                />
                <FieldError msg={errors.email} />
              </div>
              <div className="sm:col-span-2">
                <input
                  inputMode="tel"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="+27 82 000 0000"
                  aria-label={t('quiz.whatsapp')}
                  className={inputCls}
                />
                <FieldError msg={errors.whatsapp} />
              </div>
            </div>
            <label className="mt-3 flex cursor-pointer items-start gap-3 rounded-xl border border-sand bg-warmwhite p-3">
              <input
                type="checkbox"
                checked={popia}
                onChange={(e) => setPopia(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-clinical"
              />
              <span className="text-xs leading-snug text-espresso-70">
                {t('quiz.popia', { name: displayName })}
              </span>
            </label>
            <FieldError msg={errors.popia} />
            <motion.button
              type="submit"
              whileTap={reduced ? undefined : { scale: 0.98 }}
              transition={SPRING}
              className="mt-4 w-full cursor-pointer rounded-full bg-clinical py-3.5 font-serif text-base font-semibold text-warmwhite transition-colors hover:bg-espresso"
            >
              {t('quiz.save.cta')}
            </motion.button>
          </form>
        ) : skippedGate ? (
          <p className="mono-data mt-8 rounded-full border border-clinical/30 bg-clinical-tint/40 px-5 py-3 text-center text-[11px] uppercase tracking-[0.08em] text-clinical">
            {t('quiz.save.done')}
          </p>
        ) : null}

        <div className="mt-6 flex flex-col items-center gap-3 text-center">
          <button
            type="button"
            onClick={retake}
            className="mono-label link-underline cursor-pointer !text-[11px] text-espresso-70"
          >
            {t('quiz.retake')}
          </button>
          <Link
            to="/science"
            className="mono-label link-underline !text-[11px] text-clinical"
          >
            {t('quiz.evidenceLink')}
          </Link>
        </div>
      </div>
    )
  }

  function renderStep() {
    switch (step) {
      case 0:
        return renderHook()
      case 1:
        return renderPetType()
      case 2:
        return renderProfile()
      case 3:
        return renderSize()
      case 4:
        return renderConcerns()
      case 5:
        return renderRoutine()
      case 6:
        return renderLead()
      case 7:
        return renderResults()
      default:
        return null
    }
  }

  /* ------------------------------ frame ------------------------------- */

  return (
    <div className="paper-texture bg-cream">
      <div className="mx-auto w-full max-w-2xl px-4 pb-24 pt-8 md:pt-12">
        {step > 0 && step < LAST_STEP && (
          <div className="mb-8">
            <div className="flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => window.history.back()}
                className="mono-label link-underline cursor-pointer !text-[11px] text-espresso-70"
              >
                {t('quiz.back')}
              </button>
              <span className="mono-label !text-[11px] text-espresso-70">
                Q{step} / {TOTAL_QUESTIONS}
              </span>
              <span className="mono-data w-10 text-right text-[11px] text-espresso-70">
                {progress}%
              </span>
            </div>
            <div
              className="mt-3 h-1 overflow-hidden rounded-full bg-sand"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <motion.div
                className="h-full rounded-full bg-amber"
                initial={false}
                animate={{ width: `${progress}%` }}
                transition={reduced ? { duration: 0 } : { duration: 0.4, ease: EASE }}
              />
            </div>
          </div>
        )}

        <AnimatePresence>
          {encouragement && step > 0 && step < LAST_STEP && (
            <motion.p
              key={`${step}-${encouragement}`}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduced ? 0 : 0.3 }}
              className="mb-6 font-serif text-base italic text-clinical"
            >
              {encouragement}
            </motion.p>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait" custom={direction} initial={false}>
          <motion.div
            key={step}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={stepTransition}
          >
            {renderStep()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* stack-added toast — points at the open Launch Box drawer */}
      <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4">
        <AnimatePresence>
          {toast && (
            <motion.p
              role="status"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 24 }}
              transition={{ duration: 0.35, ease: EASE }}
              className="mono-label rounded-full border border-clinical/40 bg-espresso px-5 py-3 !text-[11px] text-cream shadow-[0_20px_50px_-20px_rgba(43,33,24,0.5)]"
            >
              {toast}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

/* --------------------------- small components ------------------------- */

function StepHeading({
  kicker,
  title,
  sub,
}: {
  kicker: string
  title: string
  sub?: string
}) {
  return (
    <div>
      <p className="mono-label text-clinical">{kicker}</p>
      <h2 className="mt-3 font-serif text-3xl font-medium leading-tight tracking-[-0.02em] text-espresso md:text-4xl">
        {title}
      </h2>
      {sub && <p className="mt-3 text-[1.0625rem] leading-relaxed text-espresso-70">{sub}</p>}
    </div>
  )
}

function ContinueButton({ label, onClick }: { label: string; onClick?: () => void }) {
  return (
    <motion.button
      type={onClick ? 'button' : 'submit'}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="mt-8 w-full cursor-pointer rounded-full bg-espresso py-4 font-serif text-lg font-semibold text-cream transition-colors hover:bg-amber-deep"
    >
      {label} →
    </motion.button>
  )
}

function FieldError({ msg }: { msg?: string }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.span
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="mono-label mt-1 block !text-[10px] text-alert"
        >
          {msg}
        </motion.span>
      )}
    </AnimatePresence>
  )
}
