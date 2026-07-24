import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, ShieldCheck } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const CHIPS = ['guar.chip1', 'guar.chip2', 'guar.chip3'] as const
const TERMS = ['guar.term1', 'guar.term2', 'guar.term3', 'guar.term4'] as const

/** Slim clinical-green band — the 60-day mobility guarantee. */
export default function GuaranteeBand() {
  const { t } = useI18n()
  const [termsOpen, setTermsOpen] = useState(false)
  return (
    <section className="bg-clinical py-14 text-cream md:py-16">
      <div className="psa-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-start gap-8 md:flex-row md:items-center md:gap-12"
        >
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-cream/20 bg-warmwhite/10">
            <ShieldCheck className="h-7 w-7 text-cream" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="mono-label !text-[10px] text-amber">{t('guar.overline')}</p>
            <h2 className="mt-3 max-w-2xl font-serif text-[clamp(1.6rem,3vw,2.4rem)] font-medium leading-[1.1] text-warmwhite">
              {t('guar.title')}
            </h2>
            <p className="mt-3 max-w-2xl leading-relaxed text-cream/70">{t('guar.body')}</p>

            {/* terms CTA + expandable mono terms list */}
            <button
              type="button"
              onClick={() => setTermsOpen((o) => !o)}
              aria-expanded={termsOpen}
              className="mono-label mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-cream/30 bg-warmwhite/10 px-5 py-2.5 !text-[11px] text-cream transition-colors hover:bg-cream hover:text-clinical"
            >
              {t('guar.cta')}
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ${termsOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence initial={false}>
              {termsOpen && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="mono-data mt-4 max-w-2xl space-y-2 overflow-hidden !text-[11px] uppercase leading-relaxed tracking-[0.06em] text-cream/80"
                >
                  {TERMS.map((key) => (
                    <li key={key} className="flex gap-3 border-l-2 border-amber/60 pl-3">
                      {t(key)}
                    </li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2 md:flex-col md:items-end">
            {CHIPS.map((key, i) => (
              <motion.span
                key={key}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="mono-label rounded-full border border-cream/25 bg-warmwhite/10 px-4 py-2 !text-[10px] text-cream"
              >
                {t(key)}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
