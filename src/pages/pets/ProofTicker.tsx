import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'

const ENTRY_COUNT = 10

/** Social-proof ticker — slow mono marquee of recent waitlist joins. */
export default function ProofTicker() {
  const { t } = useI18n()
  // Seeded fictional entries — clearly styled as a mono lab-feed ticker.
  const line = Array.from({ length: ENTRY_COUNT }, (_, i) => `● ${t(`ticker.${i + 1}`)}`).join('   ')

  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 0.6 }}
      aria-label="Recent waitlist joins"
      className="border-y border-sand bg-espresso py-3.5"
    >
      <div className="relative overflow-hidden">
        <div className="marquee-track">
          {[0, 1].map((n) => (
            <span
              key={n}
              className="mono-data whitespace-nowrap !text-[11px] text-cream/80"
            >
              {line}&nbsp;&nbsp;&nbsp;
            </span>
          ))}
        </div>
        {/* honesty tag — seeded preview, not live data */}
        <span className="mono-label absolute right-0 top-1/2 hidden -translate-y-1/2 bg-espresso py-1 pl-4 !text-[9px] text-cream/50 md:block">
          {t('ticker.tag')}
        </span>
      </div>
    </motion.section>
  )
}
