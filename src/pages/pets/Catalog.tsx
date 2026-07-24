import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import type { Product } from '@/lib/data'
import { PRODUCTS, TOTAL_WAITING } from '@/lib/data'
import ComingSoonBadge from '@/components/ComingSoonBadge'
import CitationAccordion from '@/components/CitationAccordion'
import AddToBoxButton from '@/components/AddToBoxButton'
import { useLiveWaitlistCount } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n'
import { SectionHeader, CountUp } from './shared'
import { cn } from '@/lib/utils'

/** Section 7 — product catalog with sticky shortlist rail (technique #1). */
export default function Catalog() {
  const { t } = useI18n()
  const [active, setActive] = useState<Product>(PRODUCTS[0])
  const [docked, setDocked] = useState(false)
  // Real Supabase waitlist rows on top of the marketing base (TOTAL_WAITING).
  const liveCount = useLiveWaitlistCount()
  const cardRefs = useRef<(HTMLElement | null)[]>([])
  const railRef = useRef<HTMLDivElement>(null)

  // IntersectionObserver swaps rail content with the in-view product
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx)
            setActive(PRODUCTS[idx])
          }
        })
      },
      { rootMargin: '-40% 0px -40% 0px' },
    )
    cardRefs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  // dock scale-in when the rail becomes stuck
  useEffect(() => {
    const el = railRef.current
    if (!el) return
    const onScroll = () => {
      const stuck = el.getBoundingClientRect().top <= 97
      setDocked((prev) => (prev === stuck ? prev : stuck))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="catalog" className="section-pad bg-cream">
      <div className="psa-container">
        <SectionHeader
          overline={t('cat.overline')}
          title={
            <>
              {t('cat.titleA')} <em className="text-amber">{t('cat.titleEm')}</em>
            </>
          }
          sub={t('cat.sub')}
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-12">
          {/* sticky rail (cols 1–3) */}
          <div className="hidden lg:col-span-3 lg:block">
            <div ref={railRef} className="sticky top-24 self-start">
              <motion.div
                animate={{ scale: docked ? 1 : 0.97 }}
                transition={{ duration: 0.3 }}
                className={cn(
                  'rounded-[20px] border border-sand bg-warmwhite p-5 transition-shadow duration-300',
                  docked && 'shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)]',
                )}
              >
                <p className="mono-label !text-[11px] text-espresso-70">{t('cat.shortlist')}</p>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.slug}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4"
                  >
                    <img
                      loading="lazy"
                      src={active.image}
                      alt={active.name}
                      className="aspect-[4/5] w-full rounded-xl border border-sand object-cover"
                    />
                    <p className="mt-3 font-serif text-lg font-semibold text-espresso">
                      {active.name}
                    </p>
                    <p className="mono-data mt-1 text-amber-deep">
                      {active.waiting} {t('cat.waiting')}
                    </p>
                  </motion.div>
                </AnimatePresence>
                <p className="mono-data mt-4 border-t border-sand pt-4 text-espresso">
                  {t('cat.ownersOnLists')
                    .split('{count}')
                    .map((part, idx) => (
                      <span key={idx}>
                        {idx > 0 && <CountUp key={liveCount} target={TOTAL_WAITING + liveCount} />}
                        {part}
                      </span>
                    ))}
                </p>
                <a
                  href="#waitlist"
                  className="mt-4 block rounded-full bg-amber py-3 text-center font-serif text-base font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
                >
                  {t('cat.joinCta')}
                </a>
                <a
                  href="#subscriptions"
                  className="mono-label link-underline mt-3 block text-center !text-[10px] text-espresso-70"
                >
                  {t('cat.howSubs')}
                </a>
              </motion.div>
            </div>
          </div>

          {/* product cards (cols 4–12) */}
          <div className="space-y-12 lg:col-span-9">
            {PRODUCTS.map((p, i) => (
              <ProductCard
                key={p.slug}
                product={p}
                index={i}
                refCb={(el) => {
                  cardRefs.current[i] = el
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* mobile: the page-level ConversionBar (Pets.tsx) owns the sticky bottom slot —
          the active-product cue lives inline here instead to avoid stacked bars */}
      <div className="mt-8 flex items-center justify-between rounded-2xl border border-sand bg-warmwhite px-4 py-3 lg:hidden">
        <div className="flex items-center gap-3">
          <img loading="lazy" src={active.image} alt="" className="h-10 w-10 rounded-md border border-sand object-cover" />
          <div>
            <p className="text-sm font-semibold text-espresso">{active.name}</p>
            <p className="mono-data !text-[10px] text-amber-deep">
              {active.waiting} {t('cat.waiting')}
            </p>
          </div>
        </div>
        <AddToBoxButton slug={active.slug} openDrawer={false} />
      </div>
    </section>
  )
}

function ProductCard({
  product: p,
  index,
  refCb,
}: {
  product: Product
  index: number
  refCb: (el: HTMLElement | null) => void
}) {
  const { t } = useI18n()
  const fromLeft = index % 2 === 0
  return (
    <motion.article
      ref={refCb}
      data-idx={index}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -6 }}
      className={cn(
        'group overflow-hidden rounded-[20px] border bg-warmwhite transition-shadow duration-300 hover:shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)]',
        p.firstToLaunch ? 'border-clinical/50 bg-clinical-tint/70' : 'border-sand',
      )}
    >
      {p.firstToLaunch && (
        <p className="mono-label bg-clinical px-5 py-2 !text-[10px] text-cream">
          {t('cat.firstLaunch')}
        </p>
      )}
      <div className="grid md:grid-cols-2">
        <div className="relative overflow-hidden">
          <motion.img
            src={p.image}
            alt={p.name}
            initial={{ clipPath: fromLeft ? 'inset(0 100% 0 0)' : 'inset(0 0 0 100%)' }}
            whileInView={{ clipPath: 'inset(0 0% 0 0%)' }}
            viewport={{ once: true, amount: 0.8 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="aspect-[4/5] h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
          <ComingSoonBadge className="absolute bottom-4 left-4" />
        </div>
        <div className="flex flex-col p-6 md:p-8">
          <p className="mono-label !text-[10px] text-espresso-70">{p.spec}</p>
          <h3 className="mt-2 font-serif text-2xl font-semibold text-espresso">{p.name}</h3>
          <p className="mt-2 text-[1.0625rem] leading-relaxed text-espresso-70">
            {t(`product.benefit.${p.slug}`)}
          </p>
          <div className="mono-data mt-4 flex items-center justify-between">
            <span className="text-espresso">{p.price}</span>
            <span className="text-amber-deep">
              <CountUp target={p.waiting} format={false} /> {t('cat.waiting')}
            </span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <a
              href="#waitlist"
              className="rounded-full bg-amber px-6 py-3 font-serif text-base font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
            >
              {t('cat.joinWaitlist')}
            </a>
            <AddToBoxButton slug={p.slug} />
            <Link
              to={`/product/${p.slug}`}
              className="mono-label link-underline !text-[10px] text-espresso-70"
            >
              {t('cat.productPage')}
            </Link>
          </div>
          <CitationAccordion citations={p.citations} className="mt-5" />
        </div>
      </div>
    </motion.article>
  )
}
