import { memo, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { AnimatePresence, motion, useInView } from 'framer-motion'
import type { Variants } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FlaskConical, FileCheck2, ShieldCheck } from 'lucide-react'
import type { Product, ProductDetail } from '@/lib/data'
import { getProductBySlug, getProductDetail, PRODUCTS, BATCH_BY_SLUG, LAUNCH_BATCH } from '@/lib/data'
import ComingSoonBadge from '@/components/ComingSoonBadge'
import CitationAccordion from '@/components/CitationAccordion'
import WaitlistForm from '@/components/WaitlistForm'
import AddToBoxButton from '@/components/AddToBoxButton'
import VetPack from '@/components/VetPack'
import { handoutForProduct } from '@/lib/vetpack'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const EASE_OUT = [0.16, 1, 0.3, 1] as [number, number, number, number]
const SPRING = { type: 'spring', stiffness: 260, damping: 30 } as const

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ProductPage() {
  const { slug } = useParams()
  const product = getProductBySlug(slug)
  const detail = getProductDetail(slug)
  const { t } = useI18n()

  if (!product || !detail) {
    return (
      <section className="section-pad bg-cream">
        <div className="psa-container max-w-2xl text-center">
          <p className="mono-label text-amber-deep">{t('pdp.notFound.overline')}</p>
          <h1 className="mt-4 font-serif text-4xl font-medium text-espresso">
            {t('pdp.notFound.title')}
          </h1>
          <p className="mt-4 text-espresso-70">{t('pdp.notFound.body')}</p>
          <Link
            to="/pets"
            className="mt-8 inline-block rounded-full bg-amber px-6 py-3 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
          >
            {t('pdp.notFound.cta')}
          </Link>
        </div>
      </section>
    )
  }

  return (
    <div key={product.slug}>
      <HeroSplit product={product} detail={detail} />
      <BenefitBar detail={detail} />
      <HowItWorks detail={detail} />
      <EvidenceSection product={product} detail={detail} />
      <ComparisonSection product={product} />
      <WaitlistCapture product={product} detail={detail} />
      <RelatedProducts current={product} />
      <PageOutro />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section 2 — sticky split hero                                       */
/* ------------------------------------------------------------------ */

const boxParent: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
}
const boxItem: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT } },
}

function HeroSplit({ product, detail }: { product: Product; detail: ProductDetail }) {
  const { t, locale } = useI18n()
  const batch = BATCH_BY_SLUG[product.slug] ?? LAUNCH_BATCH
  // "Bring your vet" pack — handout rebuilt when the locale flips.
  const handout = useMemo(
    () => handoutForProduct(product.slug, locale),
    [product.slug, locale],
  )
  return (
    <section className="bg-cream pb-20 pt-8 md:pt-12">
      <div className="psa-container">
        {/* crumb (Navbar is global; the page carries the PDP crumb) */}
        <p className="mono-label !text-[10px] text-espresso-70">
          <Link to="/pets" className="link-underline hover:text-amber-deep">
            {t('pdp.crumb')}
          </Link>
          <span className="mx-2 text-sand">/</span>
          <span className="text-espresso">{product.spec}</span>
        </p>

        <div className="mt-8 grid gap-12 lg:grid-cols-12">
          {/* left — sticky gallery (cols 1–6) */}
          <div className="lg:col-span-6">
            <div className="self-start lg:sticky lg:top-24">
              <CounterParallax>
                <Gallery product={product} />
              </CounterParallax>
            </div>
          </div>

          {/* right — buy box (cols 7–12) */}
          <motion.div
            variants={boxParent}
            initial="hidden"
            animate="show"
            className="lg:col-span-6"
          >
            <motion.p variants={boxItem} className="mono-label !text-[11px] text-espresso-70">
              {product.spec}
            </motion.p>

            <motion.h1
              variants={boxItem}
              className="mt-3 font-serif text-[clamp(2.5rem,4.5vw,4rem)] font-medium leading-[1.02] text-espresso"
            >
              {product.name}
            </motion.h1>

            {product.firstToLaunch && (
              <motion.p
                variants={boxItem}
                className="mono-label mt-3 inline-block rounded-full bg-clinical px-3 py-1 !text-[10px] text-cream"
              >
                {t('pdp.firstLaunch')}
              </motion.p>
            )}

            <motion.p
              variants={boxItem}
              className="mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-espresso-70"
            >
              {detail.headline}
            </motion.p>

            {/* price block */}
            <motion.div variants={boxItem} className="mono-data mt-6 flex flex-wrap items-center gap-3">
              <span className="text-lg font-bold text-espresso">{product.price}</span>
              <span className="rounded-full border border-clinical/40 bg-clinical-tint px-2.5 py-0.5 !text-[10px] font-bold text-clinical">
                {t('pdp.vat')}
              </span>
              <span className="text-espresso-70 line-through">
                {t('pdp.estRetail', { price: detail.estRetail })}
              </span>
            </motion.div>

            {/* subscription selector */}
            <motion.div variants={boxItem} className="mt-6">
              <PlanSelector detail={detail} />
            </motion.div>

            {/* disabled buy box — the active path is the Launch Box reservation */}
            <motion.div variants={boxItem} className="mt-6">
              <DisabledBuyButton />
            </motion.div>

            <motion.div variants={boxItem} className="mt-4 flex flex-wrap items-center gap-4">
              <AddToBoxButton
                slug={product.slug}
                variant="primary"
                className="px-7 py-3.5 text-lg"
              />
              <a
                href="#pdp-waitlist"
                className="mono-label link-underline !text-[11px] text-espresso-70"
              >
                {t('pdp.orJoin', {
                  product: product.name.split('(')[0].trim().toUpperCase(),
                })}
              </a>
              <span className="mono-data text-amber-deep">
                {t('pdp.ownersWaiting', { count: product.waiting })}
              </span>
            </motion.div>

            {/* batch → COA deep link */}
            <motion.p
              variants={boxItem}
              className="mono-data mt-4 !text-[11px] uppercase tracking-[0.06em] text-espresso-70"
            >
              {t('pdp.batchLine', { batch })} —{' '}
              <Link
                to={`/verify?batch=${batch}`}
                className="link-underline font-bold text-clinical"
              >
                {t('pdp.viewCoa')}
              </Link>
            </motion.p>

            {/* bring-your-vet one-tap pack */}
            {handout && (
              <motion.div variants={boxItem} className="mt-6">
                <VetPack
                  handouts={[handout]}
                  link={`${window.location.origin}/product/${product.slug}`}
                />
              </motion.div>
            )}

            {/* trust row */}
            <motion.ul
              variants={boxItem}
              className="mono-label mt-8 grid grid-cols-3 gap-3 border-t border-sand pt-5 !text-[10px] text-espresso-70"
            >
              <li className="flex items-center gap-2">
                <FlaskConical className="h-4 w-4 shrink-0 text-clinical" /> ≥99% HPLC
              </li>
              <li className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 shrink-0 text-clinical" /> {t('pdp.trust2')}
              </li>
              <li className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 shrink-0 text-clinical" /> {t('pdp.trust3')}
              </li>
            </motion.ul>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ---------------- gallery ---------------- */

function Gallery({ product }: { product: Product }) {
  const { t } = useI18n()
  const shots = [
    { id: 'front', src: product.image, caption: t('pdp.shot.front'), macro: false },
    { id: 'label', src: product.image, caption: `BATCH: ${BATCH_BY_SLUG[product.slug] ?? LAUNCH_BATCH}`, macro: true },
    { id: 'scale', src: getProductDetail(product.slug)?.scaleImage ?? '/dog-portrait-1.png', caption: t('pdp.shot.scale'), macro: false },
  ]
  const [active, setActive] = useState(0)
  const shot = shots[active]

  return (
    <div>
      <motion.div
        initial={{ scale: 1.06, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: EASE_OUT }}
        className="relative overflow-hidden rounded-[20px] border border-sand bg-warmwhite"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={shot.id}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="aspect-[4/5] w-full overflow-hidden">
              <img
                src={shot.src}
                alt={`${product.name} — ${shot.caption.toLowerCase()}`}
                className={cn(
                  'h-full w-full object-cover',
                  shot.macro && 'origin-center scale-[1.7]',
                )}
              />
            </div>
          </motion.div>
        </AnimatePresence>

        {/* COA stamp watermark */}
        <img
loading="lazy"           src="/coa-stamp.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute right-4 top-4 h-20 w-20 -rotate-[8deg] opacity-40"
        />
        <ComingSoonBadge className="absolute bottom-4 left-4" />
        <span className="mono-data pointer-events-none absolute bottom-4 right-4 rounded-full bg-espresso/70 px-2.5 py-1 !text-[10px] text-cream backdrop-blur-sm">
          {shot.caption}
        </span>
      </motion.div>

      {/* thumbnails */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {shots.map((s, i) => (
          <motion.button
            key={s.id}
            type="button"
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.08, duration: 0.5, ease: EASE_OUT }}
            aria-pressed={active === i}
            className={cn(
              'group relative cursor-pointer overflow-hidden rounded-xl border bg-warmwhite transition-colors',
              active === i ? 'border-amber' : 'border-sand hover:border-amber/60',
            )}
          >
            <div className="aspect-square w-full overflow-hidden">
              <img
loading="lazy"                 src={s.src}
                alt=""
                className={cn(
                  'h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]',
                  s.macro && 'origin-center scale-[1.7] group-hover:scale-[1.8]',
                )}
              />
            </div>
            <span className="mono-data absolute inset-x-0 bottom-0 bg-espresso/70 px-1.5 py-1 text-center !text-[9px] text-cream">
              {s.caption}
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}

/** GSAP counter-parallax for the sticky gallery — isolated per react-dev rules. */
function CounterParallax({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !ref.current) return
    const ctx = gsap.context(() => {
      gsap.to(ref.current, {
        yPercent: -4,
        ease: 'none',
        scrollTrigger: {
          trigger: ref.current,
          start: 'top top+=96',
          end: '+=120%',
          scrub: true,
        },
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return <div ref={ref}>{children}</div>
}

/* ---------------- plan selector ---------------- */

function PlanSelector({ detail }: { detail: ProductDetail }) {
  const [plan, setPlan] = useState<'sub' | 'once'>('sub')
  const { t } = useI18n()

  const cards = [
    {
      id: 'sub' as const,
      title: t('pdp.plan.sub'),
      price: detail.subPrice,
      body: t('pdp.plan.subBody'),
      shine: true,
    },
    {
      id: 'once' as const,
      title: t('pdp.plan.once', { price: detail.oneTimePrice }),
      price: detail.oneTimePrice,
      body: t('pdp.plan.onceBody'),
      shine: false,
    },
  ]

  return (
    <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={t('pdp.plan.aria')}>
      {cards.map((c) => {
        const selected = plan === c.id
        return (
          <motion.button
            key={c.id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setPlan(c.id)}
            animate={{ scale: selected ? 1.02 : 1 }}
            transition={SPRING}
            className={cn(
              'relative cursor-pointer overflow-hidden rounded-2xl border p-4 text-left transition-colors',
              selected
                ? 'border-clinical bg-clinical-tint/70'
                : 'border-sand bg-warmwhite hover:border-clinical/40',
            )}
          >
            {c.shine && <ShineSweep />}
            <span className="mono-label absolute right-3 top-3 rounded-full border border-sand bg-cream px-2 py-0.5 !text-[8px] text-espresso-70">
              {t('pdp.plan.badge')}
            </span>
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  'flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2',
                  selected ? 'border-clinical' : 'border-sand',
                )}
              >
                {selected && <span className="h-2 w-2 rounded-full bg-clinical" />}
              </span>
              <span className="mono-label !text-[10px] text-espresso">{c.title}</span>
            </span>
            <span className="mono-data mt-2 block font-bold text-espresso">{c.price}</span>
            <span className="mt-1 block text-xs leading-relaxed text-espresso-70">{c.body}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

/** Amber shine sweep, looping every ~5s — memoized perpetual micro-component. */
const ShineSweep = memo(function ShineSweep() {
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-amber/25 to-transparent"
      initial={{ x: '-150%' }}
      animate={{ x: '450%' }}
      transition={{ duration: 1.1, ease: 'easeInOut', repeat: Infinity, repeatDelay: 3.9 }}
    />
  )
})

/* ---------------- disabled buy button + shake tooltip ---------------- */

function DisabledBuyButton() {
  const [hot, setHot] = useState(false)
  const { t } = useI18n()

  return (
    <div
      className="relative"
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
    >
      <motion.button
        type="button"
        aria-disabled="true"
        onClick={() => {
          setHot(true)
          window.setTimeout(() => setHot(false), 1600)
        }}
        animate={hot ? { x: [0, -3, 3, -3, 3, 0] } : { x: 0 }}
        transition={{ duration: 0.3 }}
        className="mono-label w-full cursor-not-allowed rounded-full bg-sand py-4 !text-[11px] text-espresso-70"
      >
        {t('pdp.disabled')}
      </motion.button>
      <AnimatePresence>
        {hot && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-none absolute -top-11 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-espresso px-3.5 py-2 text-xs text-cream shadow-[0_20px_50px_-20px_rgba(43,33,24,0.5)]"
          >
            {t('pdp.disabledTip')}
            <span className="absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-espresso" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section 3 — benefit bar                                             */
/* ------------------------------------------------------------------ */

function BenefitBar({ detail }: { detail: ProductDetail }) {
  return (
    <motion.section
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
      viewport={{ once: true, amount: 0.8 }}
      transition={{ duration: 0.8, ease: EASE_OUT }}
      className="bg-espresso py-14"
    >
      <div className="psa-container grid grid-cols-2 gap-8 lg:grid-cols-4">
        {detail.benefits.map(([label, line], i) => (
          <div key={label}>
            <TypeOn
              text={label}
              delay={i * 0.1}
              className="mono-label block !text-[11px] text-amber"
            />
            <p className="mt-2 font-serif text-lg italic leading-snug text-cream/85">{line}</p>
          </div>
        ))}
      </div>
    </motion.section>
  )
}

/** Mono label type-on: character-by-character opacity flicker (lab printout feel). */
function TypeOn({ text, delay = 0, className }: { text: string; delay?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -15% 0px' })
  return (
    <span ref={ref} className={className} aria-label={text}>
      {text.split('').map((ch, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: [0, 1, 0.4, 1] } : {}}
          transition={{ delay: delay + i * 0.03, duration: 0.12 }}
        >
          {ch}
        </motion.span>
      ))}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/* Section 4 — how it works                                            */
/* ------------------------------------------------------------------ */

function HowItWorks({ detail }: { detail: ProductDetail }) {
  const { t } = useI18n()
  return (
    <section className="section-pad bg-cream-2">
      <div className="psa-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <p className="mono-label text-amber-deep">{t('pdp.hiw.overline')}</p>
          <h2 className="mt-4 font-serif text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[1.02] text-espresso">
            {t('pdp.hiw.title')}
          </h2>
        </motion.div>

        <div className="relative mt-14">
          {/* connecting hairline — scrub-linked draw (desktop only) */}
          <HairlineDraw className="absolute left-0 right-0 top-3 hidden h-px lg:block" />

          <div className="grid gap-10 lg:grid-cols-3">
            {detail.steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.12, duration: 0.6, ease: EASE_OUT }}
                className="relative"
              >
                <span className="relative z-10 inline-block h-6 w-6 rounded-full border-2 border-amber bg-cream-2" />
                <p className="mono-label mt-5 !text-[11px] text-amber-deep">
                  {t('pdp.hiw.step', { n: String(i + 1).padStart(2, '0') })}
                </p>
                <h3 className="mt-2 font-serif text-2xl font-semibold text-espresso">{step.title}</h3>
                <p className="mt-2 max-w-sm leading-relaxed text-espresso-70">{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

/** GSAP scrub-linked hairline draw — isolated per react-dev rules. */
function HairlineDraw({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce || !ref.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ref.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: ref.current,
            start: 'top 90%',
            end: 'top 40%',
            scrub: true,
          },
        },
      )
    }, ref)
    return () => ctx.revert()
  }, [])

  return <div ref={ref} className={cn('origin-left bg-amber/60', className)} />
}

/* ------------------------------------------------------------------ */
/* Section 5 — evidence & citations                                    */
/* ------------------------------------------------------------------ */

function EvidenceSection({ detail }: { product: Product; detail: ProductDetail }) {
  const { t } = useI18n()
  return (
    <section className="section-pad bg-warmwhite">
      <div className="psa-container max-w-[860px]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <p className="mono-label text-amber-deep">{t('pdp.ev.overline')}</p>
          <h2 className="mt-4 font-serif text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[1.02] text-espresso">
            {t('pdp.ev.titleA')} <em className="text-clinical">{t('pdp.ev.titleEm')}</em>{' '}
            {t('pdp.ev.titleB')}
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-espresso-70">
            {t('pdp.ev.sub')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.1, duration: 0.6, ease: EASE_OUT }}
          className="mt-10"
        >
          <CitationAccordion citations={detail.fullCitations} />
        </motion.div>

        <p className="mono-data mt-6 border-l-2 border-alert pl-4 !text-[11px] leading-relaxed text-espresso-70">
          {t('pdp.ev.honesty')}
        </p>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 6 — import vs PSA comparison                                */
/* ------------------------------------------------------------------ */

const COMPARISON_ROWS: { labelKey: string; impKey: string }[] = [
  { labelKey: 'pdp.cmp.price', impKey: 'pdp.cmp.imp1' },
  { labelKey: 'pdp.cmp.shipping', impKey: 'pdp.cmp.imp2' },
  { labelKey: 'pdp.cmp.docs', impKey: 'pdp.cmp.imp3' },
  { labelKey: 'pdp.cmp.support', impKey: 'pdp.cmp.imp4' },
]

function ComparisonSection({ product }: { product: Product }) {
  const { t } = useI18n()
  const psaAnswers = [
    t('pdp.cmp.psa1', { price: product.price.replace(/^FROM /, 'From ') }),
    t('pdp.cmp.psa2'),
    t('pdp.cmp.psa3'),
    t('pdp.cmp.psa4'),
  ]

  return (
    <section className="section-pad bg-cream">
      <div className="psa-container max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <p className="mono-label text-amber-deep">{t('pdp.cmp.overline')}</p>
          <h2 className="mt-4 font-serif text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[1.02] text-espresso">
            {t('pdp.cmp.title')}
          </h2>
        </motion.div>

        <div className="mt-12">
          {/* header row */}
          <div className="mono-label mb-3 grid grid-cols-[0.8fr_1fr_1fr] gap-3 !text-[10px] text-espresso-70 max-md:grid-cols-[1fr_1fr]">
            <span className="max-md:hidden" />
            <span>{t('pdp.cmp.import')}</span>
            <span className="text-clinical">{t('pdp.cmp.psa')}</span>
          </div>

          {COMPARISON_ROWS.map((row, i) => (
            <motion.div
              key={row.labelKey}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ delay: i * 0.08, duration: 0.55, ease: EASE_OUT }}
              className="mb-3 grid grid-cols-[0.8fr_1fr_1fr] items-stretch gap-3 max-md:grid-cols-2"
            >
              <p className="mono-label self-center !text-[10px] text-espresso-70 max-md:col-span-2">
                {t(row.labelKey)}
              </p>
              <div className="rounded-xl border border-sand bg-warmwhite px-4 py-3 text-sm text-espresso-70">
                {t(row.impKey)}
              </div>
              <motion.div
                initial={{ y: 4 }}
                whileInView={{ y: 0 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: 0.15 + i * 0.08, duration: 0.5, ease: EASE_OUT }}
                className="rounded-xl border-2 border-clinical bg-clinical-tint/60 px-4 py-3 text-sm font-medium text-espresso"
              >
                {psaAnswers[i]}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 7 — per-product waitlist capture                            */
/* ------------------------------------------------------------------ */

function WaitlistCapture({ product, detail }: { product: Product; detail: ProductDetail }) {
  const { t } = useI18n()
  return (
    <section id="pdp-waitlist" className="paper-texture section-pad bg-cream-2">
      <div className="psa-container relative grid gap-12 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
          className="self-center"
        >
          <p className="mono-label text-amber-deep">
            {t('pdp.wl.overline', { product: product.name.toUpperCase() })}
          </p>
          <h2 className="mt-4 font-serif text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[1.02] text-espresso">
            {t('pdp.wl.title', { product: product.name.split('(')[0].trim() })}
          </h2>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-espresso-70">
            {t('pdp.wl.body')}
          </p>
          <LiveCounter base={product.waiting} avg={detail.avgPerDay} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ delay: 0.1, duration: 0.7, ease: EASE_OUT }}
          className="rounded-[20px] border border-sand bg-warmwhite p-6 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)] md:p-8"
        >
          <WaitlistForm defaultProducts={[product.slug]} compact />
        </motion.div>
      </div>
    </section>
  )
}

/** Live counter: ticks +1 every 30–70s with an amber flash. */
function LiveCounter({ base, avg }: { base: number; avg: number }) {
  const [count, setCount] = useState(base)
  const [flash, setFlash] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    let tick = 0
    let unflash = 0
    const schedule = () => {
      tick = window.setTimeout(() => {
        setCount((c) => c + 1)
        setFlash(true)
        unflash = window.setTimeout(() => setFlash(false), 1200)
        schedule()
      }, 30000 + Math.random() * 40000)
    }
    schedule()
    return () => {
      window.clearTimeout(tick)
      window.clearTimeout(unflash)
    }
  }, [])

  return (
    <p className="mono-data mt-8 border-t border-sand pt-5 text-espresso">
      <motion.span
        animate={{ color: flash ? '#D97E3F' : '#2B2118' }}
        transition={{ duration: 0.4 }}
        className="font-bold tabular-nums"
      >
        {t('pdp.counter', { count })}
      </motion.span>
      <span className="text-espresso-70">{t('pdp.counterAvg', { avg })}</span>
    </p>
  )
}

/* ------------------------------------------------------------------ */
/* Section 8 — related products                                        */
/* ------------------------------------------------------------------ */

function RelatedProducts({ current }: { current: Product }) {
  const related = PRODUCTS.filter((p) => p.slug !== current.slug).slice(0, 3)
  const { t } = useI18n()

  return (
    <section className="section-pad bg-cream">
      <div className="psa-container">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: EASE_OUT }}
        >
          <p className="mono-label text-amber-deep">{t('pdp.rel.overline')}</p>
          <h3 className="mt-3 font-serif text-3xl font-semibold text-espresso md:text-4xl">
            {t('pdp.rel.title')}
          </h3>
        </motion.div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {related.map((p, i) => {
            const note = getProductDetail(p.slug)?.pairNote ?? p.benefit
            return (
              <motion.div
                key={p.slug}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.1, duration: 0.6, ease: EASE_OUT }}
                whileHover={{ y: -6 }}
                className={cn(
                  'group overflow-hidden rounded-[20px] border bg-warmwhite transition-shadow duration-300 hover:shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)]',
                  p.firstToLaunch ? 'border-clinical/50' : 'border-sand',
                )}
              >
                {p.firstToLaunch && (
                  <p className="mono-label bg-clinical px-4 py-1.5 !text-[9px] text-cream">
                    {t('pdp.rel.first')}
                  </p>
                )}
                <Link to={`/product/${p.slug}`} className="block">
                  <div className="relative overflow-hidden">
                    <img
loading="lazy"                       src={p.image}
                      alt={p.name}
                      className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <ComingSoonBadge className="absolute bottom-3 left-3" />
                  </div>
                  <div className="p-5">
                    <p className="mono-label !text-[9px] text-espresso-70">{p.spec}</p>
                    <p className="mt-1.5 font-serif text-xl font-semibold text-espresso">{p.name}</p>
                    <p className="mt-1 text-sm italic text-espresso-70">{note}</p>
                    <div className="mono-data mt-3 flex items-center justify-between">
                      <span className="text-espresso">{p.price}</span>
                      <span className="text-amber-deep">{t('pdp.waiting', { count: p.waiting })}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 9 — breadcrumb out (compliance strip + footer are global)   */
/* ------------------------------------------------------------------ */

function PageOutro() {
  const { t } = useI18n()
  return (
    <div className="border-t border-sand bg-cream py-8">
      <div className="psa-container flex flex-wrap items-center justify-between gap-4">
        <Link to="/pets" className="mono-label link-underline !text-[10px] text-espresso-70">
          {t('pdp.outro.back')}
        </Link>
        <a
          href="https://peptide-south-africa.com"
          className="mono-label link-underline !text-[10px] text-espresso-70"
        >
          ← PEPTIDE-SOUTH-AFRICA.COM
        </a>
      </div>
    </div>
  )
}
