import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const SESSION_KEY = 'psa_exit_toast'

/**
 * Exit-intent-lite: when the user scrolls back up fast more than twice,
 * slide in a quiet founding-member reminder. Once per session, dismissible.
 */
export default function ExitToast() {
  const { t } = useI18n()
  const [show, setShow] = useState(false)
  const fastUps = useRef(0)
  const lastY = useRef(0)
  const lastT = useRef(0)

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === 'shown') return
    lastY.current = window.scrollY

    const onScroll = () => {
      const y = window.scrollY
      const now = performance.now()
      const dy = y - lastY.current
      const dt = now - lastT.current
      // fast upward flick: big negative delta inside a short window
      if (dy < -140 && dt < 400) {
        fastUps.current += 1
      } else if (dy > 40) {
        fastUps.current = 0
      }
      lastY.current = y
      lastT.current = now
      if (fastUps.current > 2) {
        sessionStorage.setItem(SESSION_KEY, 'shown')
        setShow(true)
        window.removeEventListener('scroll', onScroll)
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function dismiss() {
    setShow(false)
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, x: 80 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 80 }}
          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
          role="status"
          className="fixed bottom-20 right-4 z-40 w-[320px] rounded-2xl border border-sand bg-warmwhite p-5 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.35)] md:bottom-24 md:right-6"
        >
          <button
            onClick={dismiss}
            aria-label={t('et.dismiss')}
            className="absolute right-3 top-3 cursor-pointer text-espresso-70 transition-colors hover:text-espresso"
          >
            <X className="h-4 w-4" />
          </button>
          <p className="mono-label !text-[10px] text-amber-deep">{t('et.label')}</p>
          <p className="mt-2 font-serif text-lg font-semibold leading-snug text-espresso">
            {t('et.title')}
          </p>
          <p className="mt-1 text-sm leading-relaxed text-espresso-70">{t('et.body')}</p>
          <a
            href="#waitlist"
            onClick={dismiss}
            className="mt-4 block rounded-full bg-amber py-3 text-center font-serif text-base font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
          >
            {t('et.cta')}
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
