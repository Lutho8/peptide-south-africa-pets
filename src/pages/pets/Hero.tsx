import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion, useReducedMotion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { useConversionCopy } from './conversionCopy'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/**
 * Product-first landing hero — full-bleed looping video with a warm
 * cream-to-dark scrim. Reduced motion (or video failure) falls back to the
 * static poster. Copy is intentionally short: one promise, two actions,
 * three trust chips.
 */
export default function Hero() {
  const { t } = useI18n()
  const copy = useConversionCopy()
  const trustChips = [copy.heroTrust1, copy.heroTrust2, copy.heroTrust3]
  const reduceMotion = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [videoOk, setVideoOk] = useState(true)
  const showVideo = !reduceMotion && videoOk

  // Some browsers pause autoplay when the tab is backgrounded on load — nudge
  // playback once mounted; failures quietly leave the poster in place.
  useEffect(() => {
    if (!showVideo) return
    videoRef.current?.play().catch(() => setVideoOk(false))
  }, [showVideo])

  return (
    <section
      className="relative min-h-[100dvh] overflow-hidden bg-espresso"
      style={{ minHeight: 'max(620px, 100dvh)' }}
    >
      {/* poster — always rendered as the LCP/reduced-motion/fallback layer */}
      <img
        src="/hero-dog-main.png"
        alt={t('hero.imgAlt')}
        fetchPriority="high"
        className="absolute inset-0 z-0 h-full w-full object-cover object-[50%_30%]"
      />
      {showVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 z-[1] h-full w-full object-cover object-[50%_30%]"
          src="/hero-dog-loop.mp4"
          poster="/hero-dog-main.png"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
          onError={() => setVideoOk(false)}
        />
      )}

      {/* warm scrim: deep at the bottom for copy, cream glow from the top */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background:
            'linear-gradient(to top, rgba(24,17,11,0.88) 0%, rgba(24,17,11,0.55) 34%, rgba(24,17,11,0.18) 58%, rgba(247,241,229,0.18) 100%)',
        }}
      />
      <div
        className="absolute inset-0 z-[2] hidden md:block"
        style={{
          background:
            'linear-gradient(to right, rgba(24,17,11,0.62) 0%, rgba(24,17,11,0.22) 42%, transparent 64%)',
        }}
      />

      <div className="psa-container relative z-[3] grid min-h-[100dvh] grid-cols-1 content-end gap-8 pb-20 pt-40 md:grid-cols-12">
        <div className="md:col-span-8 lg:col-span-7">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.1 }}
            className="mono-label text-amber"
          >
            {copy.heroOverline}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
            className="mt-4 max-w-[14ch] font-serif text-[clamp(3rem,7.5vw,6.25rem)] font-medium leading-[0.98] tracking-[-0.02em] text-cream"
          >
            {copy.heroH1}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.45 }}
            className="mt-5 max-w-[520px] text-lg leading-relaxed text-cream/85 md:text-xl"
          >
            {copy.heroSub}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              to="/quiz"
              className="rounded-full bg-amber px-8 py-4 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
            >
              {copy.heroCtaQuiz}
            </Link>
            <a
              href="#launch"
              className="rounded-full border border-cream/40 bg-cream/10 px-8 py-4 font-serif text-lg font-semibold text-cream backdrop-blur-sm transition-colors hover:border-amber hover:text-amber"
            >
              {copy.heroCtaShop}
            </a>
          </motion.div>

          {/* trust chips — exactly three */}
          <motion.ul
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.75 }}
            className="mt-7 flex flex-wrap gap-2"
          >
            {trustChips.map((chip) => (
              <li
                key={chip}
                className="mono-label rounded-full border border-cream/25 bg-cream/10 px-3.5 py-1.5 !text-[10px] text-cream backdrop-blur-sm"
              >
                {chip}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </section>
  )
}
