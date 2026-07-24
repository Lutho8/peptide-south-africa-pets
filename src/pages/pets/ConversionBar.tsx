import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { liveWaitlistTotal } from '@/lib/waitlist'
import { useLiveWaitlistCount } from '@/lib/supabase'
import { TOTAL_WAITING } from '@/lib/data'
import { useCartCount, openCart } from '@/lib/cart'
import { useI18n } from '@/lib/i18n'

/**
 * Sticky bottom conversion bar (mobile + desktop). Appears once the hero is
 * scrolled past: quiz CTA on the left, live Launch Box count on the right.
 */
export default function ConversionBar() {
  const { t } = useI18n()
  const [visible, setVisible] = useState(false)
  const boxCount = useCartCount()
  // Marketing base + real Supabase rows + local unsynced entries.
  const waiting = liveWaitlistTotal(TOTAL_WAITING) + useLiveWaitlistCount()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 96 }}
          animate={{ y: 0 }}
          exit={{ y: 96 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-40 border-t border-sand bg-cream/95 backdrop-blur-sm"
        >
          <div className="psa-container flex items-center justify-between gap-3 py-3">
            <div className="flex min-w-0 items-center gap-4">
              <p className="mono-label hidden !text-[10px] text-espresso-70 sm:block">
                <span className="tabular-nums text-amber-deep">{waiting.toLocaleString('en-ZA')}</span>
                {t('cb.waiting').split('{count}')[1]}
              </p>
              <Link
                to="/quiz"
                className="whitespace-nowrap rounded-full bg-amber px-5 py-2.5 font-serif text-sm font-semibold text-warmwhite transition-colors hover:bg-amber-deep sm:text-base"
              >
                {t('cb.quiz')}
              </Link>
            </div>
            <button
              onClick={openCart}
              className="mono-label flex shrink-0 cursor-pointer items-center gap-2 rounded-full border border-espresso/25 bg-warmwhite px-4 py-2.5 !text-[10px] text-espresso transition-colors hover:border-amber hover:text-amber-deep"
            >
              <ShoppingBag className="h-4 w-4" />
              {t('cb.box')}
              <span className="tabular-nums rounded-full bg-amber px-1.5 py-0.5 !text-[10px] font-bold text-warmwhite">
                {boxCount}
              </span>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
