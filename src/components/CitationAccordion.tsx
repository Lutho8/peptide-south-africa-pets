import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Citation } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

interface Props {
  citations: Citation[]
  className?: string
}

/**
 * Shared molecule (design.md §7.5) — expandable evidence & citations panel.
 * Framer Motion height animation, lab-record citation rows, alert-bordered honesty lines.
 */
export default function CitationAccordion({ citations, className }: Props) {
  const [open, setOpen] = useState(false)
  const { t } = useI18n()

  return (
    <div className={cn('overflow-hidden rounded-2xl border border-sand bg-clinical-tint/60', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="mono-label flex w-full cursor-pointer items-center justify-between px-4 py-3 text-espresso transition-colors hover:text-amber-deep"
      >
        <span>
          {open ? '−' : '+'} {t('cite.header', { count: citations.length })}
        </span>
        <span className="mono-data text-espresso-70">{open ? t('cite.close') : t('cite.open')}</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
          >
            <div className="space-y-3 px-4 pb-4">
              {citations.map((c, i) => (
                <motion.div
                  key={`${c.badge}-${i}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i, duration: 0.3 }}
                  className={cn(
                    'rounded-xl bg-warmwhite p-3',
                    c.honesty ? 'border-l-4 border-alert' : 'border border-sand',
                  )}
                >
                  {!c.honesty && (
                    <span className="mono-label inline-block rounded-full bg-clinical-tint px-2 py-0.5 !text-[10px] text-clinical">
                      {c.badge}
                    </span>
                  )}
                  <p className="mt-1.5 text-sm leading-relaxed text-espresso-70">{c.summary}</p>
                  {c.source && <p className="mono-data mt-2 text-espresso-70">{c.source}</p>}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
