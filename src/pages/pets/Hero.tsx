import { useRef } from 'react'
import { Link } from 'react-router'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useI18n } from '@/lib/i18n'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/**
 * Keeps.com-style floating annotation labels anchored to Diesel.
 * Desktop: dot + hairline + mono chip, positioned so nothing covers the eyes
 * (eyes sit ~x 48–58% / y ~28% of the frame — all anchors avoid that zone).
 * Mobile: the same chips collapse to a stacked grid under the CTAs.
 * Labels resolve via i18n keys `hero.anno.<id>`.
 */
const ANNOTATIONS: {
  id: string
  top: string
  left: string
  dir: 'left' | 'right'
}[] = [
  { id: 'recovery', top: '22%', left: '43.5%', dir: 'left' },
  { id: 'senior', top: '17%', left: '64.5%', dir: 'right' },
  { id: 'joints', top: '72%', left: '45%', dir: 'left' },
  { id: 'gut', top: '84%', left: '63%', dir: 'right' },
]

/** Section 3 — full-bleed senior Boerboel hero. GSAP-only island. */
export default function Hero() {
  const root = useRef<HTMLElement>(null)
  const { t } = useI18n()
  const line1 = t('hero.line1')
  const line2 = t('hero.line2')

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      // ---- Load choreography ----
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.fromTo(
        '.hero-img',
        { scale: 1.12, filter: 'brightness(1.06)' },
        { scale: 1.0, filter: 'brightness(1)', duration: 2 },
      )
        .fromTo('.hero-scrim', { opacity: 0 }, { opacity: 1, duration: 1 }, 0)
        .fromTo(
          '.hero-overline span',
          { opacity: 0 },
          { opacity: 1, duration: 0.03, stagger: 0.03 },
          0.4,
        )
        .fromTo(
          '.hero-char',
          { yPercent: 110, rotate: 3 },
          { yPercent: 0, rotate: 0, duration: 0.9, stagger: 0.02 },
          0.6,
        )
        .fromTo(
          ['.hero-sub', '.hero-ctas', '.hero-trust', '.hero-caption'],
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
          1.1,
        )
        // annotation chips slide in from their anchor side, staggered
        .fromTo(
          '.hero-anno',
          { opacity: 0, x: (i) => (ANNOTATIONS[i]?.dir === 'left' ? -26 : 26) },
          { opacity: 1, x: 0, duration: 0.7, stagger: 0.16 },
          1.6,
        )
        .fromTo(
          '.hero-anno-dot',
          { scale: 0 },
          { scale: 1, duration: 0.4, ease: 'back.out(2.5)', stagger: 0.16 },
          1.55,
        )
        // mobile stacked chips
        .fromTo(
          '.hero-anno-chip-sm',
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
          1.5,
        )

      // gentle perpetual float — subtle y drift per chip
      gsap.to('.hero-anno-inner', {
        y: (i) => (i % 2 === 0 ? -7 : 7),
        duration: (i) => 2.6 + i * 0.4,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
      })

      // ---- Scroll parallax scrub over first 100vh ----
      gsap.to('.hero-img', {
        scale: 1.08,
        yPercent: 8,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-headline', {
        yPercent: -40,
        opacity: 0.4,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      gsap.to('.hero-caption', {
        yPercent: -24,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom top', scrub: true },
      })
      // annotations drift off gently and fade early
      gsap.to('.hero-anno', {
        opacity: 0,
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top top', end: '45% top', scrub: true },
      })
      // floating scroll chip fades after 120px
      gsap.to('.hero-chip', {
        opacity: 0,
        ease: 'none',
        scrollTrigger: { start: 0, end: 120, scrub: true },
      })
      // COA stamp slow rotation
      gsap.to('.hero-stamp', { rotate: 4, duration: 6, yoyo: true, repeat: -1, ease: 'sine.inOut' })
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      className="relative min-h-[100dvh] overflow-hidden"
      style={{ minHeight: 'max(640px, 100dvh)' }}
    >
      {/* full-bleed photography — Diesel, senior Boerboel on cream.
          AVIF → WebP → PNG fallback; LCP image gets fetchpriority="high". */}
      <picture>
        <source srcSet="/hero-dog-main.avif" type="image/avif" />
        <source srcSet="/hero-dog-main.webp" type="image/webp" />
        <img
          src="/hero-dog-main.png"
          alt={t('hero.imgAlt')}
          fetchPriority="high"
          className="hero-img absolute inset-0 z-0 h-full w-full object-cover object-[50%_28%] md:object-[25%_30%]"
        />
      </picture>
      {/* warm gradient scrim: strong at bottom (mobile copy), gentle from left (desktop) */}
      <div
        className="hero-scrim absolute inset-0 z-[1]"
        style={{
          background:
            'linear-gradient(to top, rgba(247,241,229,0.97) 0%, rgba(247,241,229,0.55) 26%, rgba(247,241,229,0.12) 48%, transparent 66%)',
        }}
      />
      {/* mobile-only reinforcement — bottom ~55% scrim keeps headline, subcopy
          and CTAs at readable contrast over the photo at 360–414px */}
      <div
        className="hero-scrim absolute inset-0 z-[1] md:hidden"
        style={{
          background:
            'linear-gradient(to top, rgba(247,241,229,0.99) 0%, rgba(247,241,229,0.97) 30%, rgba(247,241,229,0.93) 50%, rgba(247,241,229,0.85) 65%, rgba(247,241,229,0.6) 78%, rgba(247,241,229,0.25) 88%, transparent 96%)',
        }}
      />
      <div
        className="hero-scrim absolute inset-0 z-[1] hidden md:block"
        style={{
          background:
            'linear-gradient(to right, rgba(247,241,229,0.72) 0%, rgba(247,241,229,0.28) 30%, transparent 52%)',
        }}
      />

      {/* floating annotation labels (desktop) */}
      {ANNOTATIONS.map((a) => (
        <div
          key={a.id}
          className="hero-anno pointer-events-none absolute z-[2] hidden md:block"
          style={{ top: a.top, left: a.left }}
        >
          {/* static shift layer — keeps the dot (not the chip edge) on the anchor;
              GSAP never touches this wrapper so its transform is safe */}
          <div style={a.dir === 'left' ? { transform: 'translateX(-100%)' } : undefined}>
            <div className="hero-anno-inner flex items-center">
            {a.dir === 'right' && <AnchorDot />}
            {a.dir === 'right' && <span className="h-px w-10 bg-espresso/45" />}
            <span className="mono-label whitespace-nowrap rounded-full border border-espresso/20 bg-warmwhite/85 px-3 py-1.5 !text-[10px] text-espresso shadow-[0_10px_30px_-12px_rgba(43,33,24,0.35)] backdrop-blur-sm">
              {t(`hero.anno.${a.id}`)}
            </span>
            {a.dir === 'left' && <span className="h-px w-10 bg-espresso/45" />}
            {a.dir === 'left' && <AnchorDot />}
            </div>
          </div>
        </div>
      ))}

      <div className="psa-container relative z-[3] grid min-h-[100dvh] grid-cols-1 content-end gap-8 pb-24 pt-40 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="hero-overline mono-label text-amber-deep" aria-label={t('hero.overline')}>
            <span aria-hidden="true">
              {t('hero.overline').split('').map((c, i) => (
                <span key={i}>{c === ' ' ? ' ' : c}</span>
              ))}
            </span>
          </p>
          <h1
            className="hero-headline mt-4 font-serif text-[clamp(3rem,7.5vw,6.5rem)] font-medium leading-[0.98] tracking-[-0.02em] text-espresso"
            aria-label={`${line1} ${line2}`}
          >
            <span className="block overflow-hidden pb-1" aria-hidden="true">
              {line1.split('').map((c, i) => (
                <span key={i} className="hero-char inline-block will-change-transform">
                  {c === ' ' ? ' ' : c}
                </span>
              ))}
            </span>
            <span className="block overflow-hidden pb-2 italic text-amber" aria-hidden="true">
              {line2.split('').map((c, i) => (
                <span key={i} className="hero-char inline-block will-change-transform">
                  {c === ' ' ? ' ' : c}
                </span>
              ))}
            </span>
          </h1>
          <p className="hero-sub mt-5 max-w-[540px] text-xl leading-relaxed text-espresso-70">
            {t('hero.sub')}
          </p>
          <div className="hero-ctas mt-8 flex flex-wrap items-center gap-4">
            <Link
              to="/quiz"
              className="rounded-full bg-amber px-8 py-4 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
            >
              {t('hero.ctaQuiz')}
            </Link>
            <a
              href="#waitlist"
              className="rounded-full border border-espresso/30 bg-warmwhite/70 px-8 py-4 font-serif text-lg font-semibold text-espresso backdrop-blur-sm transition-colors hover:border-amber hover:text-amber-deep"
            >
              {t('hero.ctaWaitlist')}
            </a>
          </div>

          {/* trust micro-strip */}
          <p className="hero-trust mono-label mt-6 !text-[10px] text-espresso-70">
            {t('hero.trust')}
          </p>

          {/* mobile stacked annotation chips */}
          <div className="mt-6 flex flex-wrap gap-2 md:hidden">
            {ANNOTATIONS.map((a) => (
              <span
                key={a.id}
                className="hero-anno-chip-sm mono-label rounded-full border border-espresso/20 bg-warmwhite/85 px-3 py-1.5 !text-[9px] text-espresso backdrop-blur-sm"
              >
                {t(`hero.anno.${a.id}`)}
              </span>
            ))}
          </div>
        </div>

        {/* waitlist-ticket caption + COA stamp */}
        <div className="hero-caption flex items-end gap-5 md:col-span-4 md:col-start-9 md:justify-end">
          <img
            src="/coa-stamp.svg"
            alt="COA verified, ≥99% HPLC"
            className="hero-stamp hidden h-[120px] w-[120px] sm:block"
            style={{ transform: 'rotate(-8deg)' }}
          />
          <div className="rounded-xl border border-sand bg-warmwhite/85 px-4 py-3 backdrop-blur-sm">
            <p className="mono-label !text-[11px] text-espresso">{t('hero.captionLine')}</p>
            <p className="mono-data mt-1 text-amber-deep">{t('hero.captionWaiting')}</p>
          </div>
        </div>
      </div>

      {/* floating centered scroll chip */}
      <div className="hero-chip pointer-events-none fixed bottom-6 left-1/2 z-[4] -translate-x-1/2">
        <span className="mono-label rounded-full border border-espresso/20 bg-cream/90 px-4 py-2 !text-[10px] text-espresso backdrop-blur-sm">
          {t('hero.scrollChip')}
        </span>
      </div>
    </section>
  )
}

/** Pulsing amber anchor dot for the annotation pointer lines. */
function AnchorDot() {
  return (
    <span className="hero-anno-dot relative flex h-2.5 w-2.5 shrink-0 items-center justify-center">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber opacity-60" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full border border-warmwhite bg-amber" />
    </span>
  )
}
