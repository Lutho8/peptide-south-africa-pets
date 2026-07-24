import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

const FAQ_COUNT = 6

/** Section 12 — FAQ, honest answers. */
export default function Faq() {
  const [open, setOpen] = useState<number | null>(0)
  const { t } = useI18n()

  return (
    <section id="faq" className="section-pad bg-cream">
      <div className="mx-auto max-w-[860px] px-4 md:px-6">
        <h2 className="text-center font-serif text-[clamp(2.2rem,4.5vw,4rem)] font-medium text-espresso">
          {t('faq.titleA')} <em className="text-amber">{t('faq.titleEm')}</em>
        </h2>

        <div className="mt-12 divide-y divide-sand border-y border-sand">
          {Array.from({ length: FAQ_COUNT }, (_, i) => {
            const q = t(`faq.${i + 1}.q`)
            const isOpen = open === i
            return (
              <div key={q}>
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="flex w-full cursor-pointer items-baseline gap-4 py-6 text-left"
                >
                  <span
                    className={cn(
                      'mono-label !text-[11px] transition-colors',
                      isOpen ? 'text-amber' : 'text-espresso-70',
                    )}
                  >
                    Q{i + 1}
                  </span>
                  <span className="flex-1 font-serif text-xl font-semibold text-espresso md:text-2xl">
                    {q}
                  </span>
                  <span className="mono-label text-espresso-70">{isOpen ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="overflow-hidden"
                    >
                      <motion.p
                        initial={{ y: 8 }}
                        animate={{ y: 0 }}
                        className="pb-6 pl-12 pr-8 leading-relaxed text-espresso-70"
                      >
                        {t(`faq.${i + 1}.a`)}
                      </motion.p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
