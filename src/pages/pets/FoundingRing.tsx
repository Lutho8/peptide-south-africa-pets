import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { PET_PRODUCTS, TOTAL_WAITING } from '@/lib/data'
import { liveWaitlistTotal } from '@/lib/waitlist'
import { useLiveWaitlistCount } from '@/lib/supabase'
import { CountUp } from './shared'

// Founding 20% pricing is capped at the first 500; the claimed count is the
// BPC-157 list — pulled from the same catalog data as the global counter.
const CLAIMED = PET_PRODUCTS.find((p) => p.slug === 'bpc-157')?.waiting ?? 438
const CAP = 500
const R = 52
const CIRC = 2 * Math.PI * R

/**
 * Urgency, honestly: founding-member capacity counter with a progress ring.
 * The number is the real public counter (438 BPC-157 list), not a fake timer.
 */
export default function FoundingRing() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' })
  const { t } = useI18n()
  const pct = CLAIMED / CAP

  // Same totals as the navbar/conversion-bar chip: marketing base + real
  // Supabase rows + local entries. Standard list = everyone not in the
  // founding-cap BPC-157 cohort, so the two counters finally agree.
  const liveCount = useLiveWaitlistCount()
  const totalWaiting = liveWaitlistTotal(TOTAL_WAITING) + liveCount
  const standardWaiting = Math.max(0, totalWaiting - CLAIMED)

  return (
    <section className="bg-cream pb-4 pt-2">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="psa-container"
      >
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-[20px] border border-sand bg-warmwhite p-6 sm:flex-row sm:gap-8 sm:p-8">
          {/* progress ring */}
          <div className="relative h-[120px] w-[120px] shrink-0">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle cx="60" cy="60" r={R} fill="none" stroke="#E3D5BC" strokeWidth="8" />
              <motion.circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke="#D97E3F"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                initial={{ strokeDashoffset: CIRC }}
                animate={inView ? { strokeDashoffset: CIRC * (1 - pct) } : {}}
                transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              />
            </svg>
            <div className="mono-data absolute inset-0 flex flex-col items-center justify-center text-espresso">
              <span className="text-lg font-bold tabular-nums">
                <CountUp target={CLAIMED} format={false} />
              </span>
              <span className="!text-[10px] text-espresso-70">/ {CAP}</span>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <p className="mono-label !text-[11px] text-amber-deep">
              {CLAIMED} / {CAP} {t('ring.label')}
            </p>
            <p className="mt-2 font-serif text-2xl font-semibold leading-snug text-espresso">
              {t('ring.title', { claimed: CLAIMED, cap: CAP })}
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-espresso-70">
              {t('ring.body', { cap: CAP })}
            </p>
            <p className="mono-data mt-3 !text-[10px] uppercase tracking-[0.08em] text-espresso-70">
              {t('ring.standard', { count: standardWaiting.toLocaleString('en-ZA') })}
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
