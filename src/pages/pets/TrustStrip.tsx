import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'

const ITEM_COUNT = 5

/** Section 4 — PSA DNA trust strip. */
export default function TrustStrip() {
  const { t } = useI18n()
  return (
    <section className="relative overflow-hidden border-y border-sand bg-cream py-10">
      <img
loading="lazy"         src="/coa-stamp.svg"
        alt=""
        aria-hidden
        className="pointer-events-none absolute -right-8 top-1/2 h-48 w-48 -translate-y-1/2 opacity-[0.06]"
      />
      <div className="psa-container grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: ITEM_COUNT }, (_, idx) => idx + 1).map((n, i) => (
          <motion.div
            key={n}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.85 }}
            transition={{ delay: i * 0.08, duration: 0.5 }}
          >
            <p className="mono-label !text-[11px] text-clinical">{t(`trust.${n}.label`)}</p>
            <p className="mt-2 text-sm leading-snug text-espresso-70">{t(`trust.${n}.text`)}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
