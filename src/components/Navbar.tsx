import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag } from 'lucide-react'
import { getWaitlistEntries, liveWaitlistTotal } from '@/lib/waitlist'
import { useLiveWaitlistCount } from '@/lib/supabase'
import { TOTAL_WAITING, waLink } from '@/lib/data'
import { useCartCount, openCart } from '@/lib/cart'
import { useI18n, LanguageToggle } from '@/lib/i18n'
import { cn } from '@/lib/utils'

/** `key` entries are translated; plain `label` entries (product names) stay as-is. */
const LINKS: { to: string; key?: string; label?: string }[] = [
  { to: '/pets', key: 'nav.catalog' },
  { to: '/product/bpc-157', label: 'BPC-157' },
  { to: '/science', key: 'nav.science' },
  { to: '/verify', key: 'nav.verify' },
  { to: '/blog', key: 'nav.blog' },
  { to: '/waitlist', key: 'nav.waitlist' },
]

function useCountUp(target: number, duration = 1200, start = true) {
  const [value, setValue] = useState(0)
  const started = useRef(false)
  useEffect(() => {
    // After the intro animation, track target changes (e.g. real RPC count arriving).
    if (started.current) {
      setValue(target)
      return
    }
    if (!start) return
    started.current = true
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(target)
      return
    }
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min(1, (t - t0) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, start])
  return value
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem('psa_pets_annbar') === 'off',
  )
  const [drawer, setDrawer] = useState(false)
  const navigate = useNavigate()
  // Marketing base (TOTAL_WAITING) + real Supabase rows + local unsynced entries.
  const liveCount = useLiveWaitlistCount()
  const total = liveWaitlistTotal(TOTAL_WAITING) + liveCount
  const counter = useCountUp(total)
  const boxCount = useCartCount()
  const { t } = useI18n()
  // Waitlist pill: members go to their queue dashboard, everyone else joins.
  const isMember = getWaitlistEntries().length > 0
  const ctaTarget = isMember ? '/queue' : '/waitlist'

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function dismissBar() {
    sessionStorage.setItem('psa_pets_annbar', 'off')
    setDismissed(true)
  }

  return (
    <header className="sticky top-0 z-50">
      {/* Section 1 — Announcement bar */}
      {!dismissed && (
        <div className="relative flex h-9 items-center overflow-hidden bg-espresso text-cream">
          <div className="marquee-track">
            {[0, 1].map((n) => (
              <span key={n} className="mono-label whitespace-nowrap !text-[11px] text-cream">
                {t('nav.marquee').repeat(4)}
              </span>
            ))}
          </div>
          <button
            onClick={dismissBar}
            aria-label={t('nav.dismissAnnouncement')}
            className="mono-label absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer bg-espresso px-2 !text-[11px] text-cream/70 hover:text-cream"
          >
            ✕
          </button>
        </div>
      )}

      {/* Section 2 — Nav */}
      <nav
        className={cn(
          'flex h-[72px] items-center transition-all duration-300',
          scrolled
            ? 'border-b border-sand bg-cream/95 backdrop-blur-sm'
            : 'border-b border-transparent bg-cream/60 backdrop-blur-sm md:bg-transparent',
        )}
      >
        <div className="psa-container flex items-center justify-between gap-4">
          <Link to="/pets" className="font-serif text-2xl font-semibold text-espresso">
            PSA<span className="text-amber">·PETS</span>
          </Link>

          <div className="hidden items-center gap-7 md:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) =>
                  cn(
                    'mono-label link-underline !text-[11px] text-espresso-70 hover:text-espresso',
                    isActive && 'text-amber-deep',
                  )
                }
              >
                {l.key ? t(l.key) : l.label}
              </NavLink>
            ))}
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <span className="mono-label rounded-full border border-amber px-3 py-1.5 !text-[10px] tabular-nums text-amber-deep">
              {t('nav.waitingChip', { count: counter.toLocaleString('en-ZA') })}
            </span>
            <button
              onClick={openCart}
              aria-label={t('nav.cartAria', { count: boxCount })}
              className="relative cursor-pointer rounded-full border border-espresso/25 p-2.5 text-espresso transition-colors hover:border-amber hover:text-amber-deep"
            >
              <ShoppingBag className="h-5 w-5" />
              <AnimatePresence>
                {boxCount > 0 && (
                  <motion.span
                    key={boxCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="mono-data absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-amber px-1 !text-[10px] font-bold text-warmwhite"
                  >
                    {boxCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              onClick={() => navigate(ctaTarget)}
              className="cursor-pointer rounded-full bg-amber px-5 py-2.5 font-serif text-base font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
            >
              {isMember ? t('nav.myQueue') : t('nav.cta')}
            </button>
            <LanguageToggle />
            <a
              href={waLink(t('nav.waMsg'))}
              target="_blank"
              rel="noreferrer"
              aria-label={t('nav.waAria')}
              className="rounded-full border border-clinical/30 p-2 transition-colors hover:bg-clinical-tint"
            >
              <img src="/icon-whatsapp.svg" alt="" className="h-5 w-5" />
            </a>
          </div>

          {/* mobile: cart + hamburger */}
          <div className="flex items-center gap-1 md:hidden">
            <button
              onClick={openCart}
              aria-label={t('nav.cartAria', { count: boxCount })}
              className="relative cursor-pointer p-2 text-espresso"
            >
              <ShoppingBag className="h-5 w-5" />
              {boxCount > 0 && (
                <span className="mono-data absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-amber px-1 !text-[9px] font-bold text-warmwhite">
                  {boxCount}
                </span>
              )}
            </button>
            <LanguageToggle className="mr-1" />
            <button
              className="flex cursor-pointer flex-col gap-1.5 p-2"
              onClick={() => setDrawer(true)}
              aria-label={t('nav.openMenu')}
            >
              <span className="h-0.5 w-6 bg-espresso" />
              <span className="h-0.5 w-6 bg-espresso" />
              <span className="h-0.5 w-6 bg-espresso" />
            </button>
          </div>
        </div>
      </nav>

      {/* mobile drawer */}
      <AnimatePresence>
        {drawer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex flex-col bg-cream p-6 md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-serif text-2xl font-semibold text-espresso">
                PSA<span className="text-amber">·PETS</span>
              </span>
              <div className="flex items-center gap-3">
                <LanguageToggle />
                <button
                  onClick={() => setDrawer(false)}
                  aria-label={t('nav.closeMenu')}
                  className="mono-label cursor-pointer p-2 text-espresso"
                >
                  {t('nav.close')}
                </button>
              </div>
            </div>
            <div className="mt-12 flex flex-col gap-6">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * i }}
                >
                  <Link
                    to={l.to}
                    onClick={() => setDrawer(false)}
                    className="font-serif text-4xl font-medium text-espresso"
                  >
                    {l.key ? t(l.key) : l.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto space-y-4">
              <p className="mono-label !text-[11px] text-amber-deep">
                {t('nav.waitingChip', { count: total.toLocaleString('en-ZA') })}
              </p>
              <button
                onClick={() => {
                  setDrawer(false)
                  navigate(ctaTarget)
                }}
                className="w-full cursor-pointer rounded-full bg-amber py-4 font-serif text-lg font-semibold text-warmwhite"
              >
                {isMember ? t('nav.myQueue') : t('nav.cta')}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
