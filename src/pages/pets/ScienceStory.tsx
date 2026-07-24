import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useI18n } from '@/lib/i18n'
import { CountUp } from './shared'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const STATS: { n: number; key: number }[] = [
  { n: 1317, key: 1 },
  { n: 70, key: 2 },
  { n: 5, key: 3 },
]

/** Section 5 — editorial science story: layered grid + z-index depth. GSAP island. */
export default function ScienceStory() {
  const root = useRef<HTMLElement>(null)
  const { t } = useI18n()

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.ss-grid', start: 'top 75%', once: true },
        defaults: { ease: 'power3.out' },
      })
      tl.fromTo(
        '.ss-img1',
        { clipPath: 'inset(100% 0 0 0)' },
        { clipPath: 'inset(0% 0 0 0)', duration: 1 },
      )
        .fromTo('.ss-quote', { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.8 }, 0.15)
        .fromTo(
          '.ss-img2',
          { clipPath: 'inset(0 0 0 100%)' },
          { clipPath: 'inset(0 0 0 0%)', duration: 1 },
          0.3,
        )

      // subtle parallax depth
      gsap.to('.ss-quote', {
        yPercent: -6,
        ease: 'none',
        scrollTrigger: { trigger: '.ss-grid', start: 'top bottom', end: 'bottom top', scrub: true },
      })
      gsap.to('.ss-img2', {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: { trigger: '.ss-grid', start: 'top bottom', end: 'bottom top', scrub: true },
      })
    },
    { scope: root },
  )

  return (
    <section ref={root} className="paper-texture section-pad bg-cream-2">
      <div className="psa-container relative">
        {/* layered editorial collage */}
        <div className="ss-grid grid grid-cols-1 gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <img
loading="lazy"               src="/dog-portrait-1.png"
              alt="An old grey-muzzled dog resting in warm light"
              className="ss-img1 relative z-[1] aspect-[3/4] w-full rounded-2xl object-cover"
            />
          </div>
          <div className="relative z-[2] md:col-span-4 md:-ml-16 md:mt-[120px]">
            <figure className="ss-quote rounded-[20px] border border-sand bg-warmwhite p-7 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)]">
              <blockquote className="font-serif text-2xl font-medium italic leading-snug text-espresso">
                {t('ss.quote')}
              </blockquote>
              <figcaption className="mono-label mt-4 !text-[10px] text-espresso-70">
                {t('ss.quoteCaption')}
              </figcaption>
            </figure>
          </div>
          <div className="relative z-[3] md:col-span-4 md:-ml-8 md:-mt-[60px]">
            <div className="relative">
              <img
loading="lazy"                 src="/dog-portrait-2.png"
                alt="An athletic dog mid-stride on a beach at dawn"
                className="ss-img2 aspect-[4/3] w-full rounded-2xl object-cover"
              />
              <p className="mono-label absolute -bottom-3 left-4 rounded-md bg-espresso px-3 py-1.5 !text-[10px] text-cream">
                {t('ss.chip')}
              </p>
            </div>
          </div>
        </div>

        {/* copy + stat rail */}
        <div className="mt-20 grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="font-serif text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[1.02] text-espresso">
              {t('ss.h1a')} <em className="text-amber">{t('ss.h1em')}</em>
            </h2>
            <div className="mt-6 max-w-xl space-y-5 text-[1.0625rem] leading-[1.65] text-espresso-70">
              <p>{t('ss.p1')}</p>
              <p>{t('ss.p2')}</p>
            </div>
          </div>
          <div className="md:col-span-4 md:col-start-9">
            <div className="space-y-8 md:mt-2">
              {STATS.map((s) => (
                <div key={s.key} className="border-l-2 border-amber pl-5">
                  <p className="font-serif text-5xl font-semibold text-espresso">
                    <CountUp target={s.n} />{' '}
                    <span className="mono-label align-middle !text-[11px] text-amber-deep">
                      {t(`ss.stat${s.key}.label`)}
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-espresso-70">{t(`ss.stat${s.key}.text`)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
