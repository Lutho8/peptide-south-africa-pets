import { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { useI18n } from '@/lib/i18n'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PANELS = [{ n: '01' }, { n: '02' }, { n: '03' }, { n: '04' }]

/**
 * Section 6 — the centerpiece. GSAP ScrollTrigger pin (220vh): the BPC-157 vial
 * stays dead-center while 4 benefit panels scroll beneath it. A position:fixed,
 * transform-centered mono chip tracks the active panel.
 */
export default function PinnedVial() {
  const root = useRef<HTMLElement>(null)
  const chipNum = useRef<HTMLSpanElement>(null)
  const { t } = useI18n()

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      // gentle float loop layered under the scroll-driven transforms
      gsap.to('.pv-float', { y: -10, duration: 3, yoyo: true, repeat: -1, ease: 'sine.inOut' })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '.pv-stage',
          start: 'top top',
          end: '+=220%',
          pin: true,
          scrub: 0.8,
          onToggle(self) {
            gsap.to('.pv-chip', { autoAlpha: self.isActive ? 1 : 0, duration: 0.25 })
          },
          onUpdate(self) {
            const idx = Math.min(PANELS.length - 1, Math.floor(self.progress * PANELS.length))
            const label = `0${idx + 1}`
            if (chipNum.current && chipNum.current.textContent !== label) {
              gsap.fromTo(
                chipNum.current,
                { y: 12, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, ease: 'power3.out' },
              )
              chipNum.current.textContent = label
            }
            gsap.set('.pv-progress', { scaleX: self.progress })
            gsap.set('.pv-glow', { opacity: 0.12 + self.progress * 0.14 })
          },
        },
        defaults: { ease: 'power2.inOut' },
      })

      PANELS.forEach((_, i) => {
        const at = i
        tl.fromTo(
          `.pv-panel-${i}`,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.35 },
          at + 0.08,
        )
        // bottle twist + pulse at each boundary
        tl.to(
          '.pv-bottle',
          { rotate: i % 2 === 0 ? 2 : -2, scale: 1.03, duration: 0.18 },
          at + 0.05,
        ).to('.pv-bottle', { rotate: 0, scale: 1, duration: 0.2 }, at + 0.25)
        if (i < PANELS.length - 1) {
          tl.to(`.pv-panel-${i}`, { y: -80, opacity: 0, duration: 0.35 }, at + 0.6)
        }
      })
      // pin release: bottle hands off to the catalog
      tl.to(`.pv-panel-${PANELS.length - 1}`, { y: -80, opacity: 0, duration: 0.35 }, PANELS.length - 0.4)
      tl.to('.pv-bottle', { scale: 0.9, opacity: 0, duration: 0.4 }, PANELS.length - 0.35)
      // closing CTA takes the bottle's place at the end of the pin
      tl.fromTo(
        '.pv-cta',
        { autoAlpha: 0, y: 40 },
        { autoAlpha: 1, y: 0, duration: 0.4, ease: 'power3.out' },
        PANELS.length - 0.15,
      )
    },
    { scope: root },
  )

  return (
    <section ref={root} className="relative bg-espresso text-cream">
      <div className="pv-stage relative flex min-h-[100dvh] items-center justify-center overflow-hidden">
        {/* ambient radial glow */}
        <div
          className="pv-glow pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(217,126,63,1) 0%, transparent 65%)', opacity: 0.12 }}
        />

        {/* floating centered mono chip — technique #4, explicit */}
        <div
          className="pv-chip pointer-events-none invisible z-[1] opacity-0"
          style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }}
        >
          <div className="flex flex-col items-center">
            <span className="mono-label rounded-full border border-cream/20 bg-espresso/80 px-4 py-2 !text-[11px] text-cream/80 backdrop-blur-sm">
              BPC-157 · <span ref={chipNum}>01</span>/04
            </span>
            <span className="mt-2 block h-px w-24 overflow-hidden bg-cream/15">
              <span className="pv-progress block h-full w-full origin-left scale-x-0 bg-amber" />
            </span>
          </div>
        </div>

        {/* the vial — dead center */}
        <div className="pv-float relative z-[2]">
          <img
loading="lazy"             src="/product-bpc157.png"
            alt="PSA PETS BPC-157 oral drops — amber glass dropper bottle"
            className="pv-bottle h-[340px] w-auto rounded-2xl object-cover md:h-[420px]"
          />
        </div>

        {/* benefit panels */}
        {PANELS.map((p, i) => (
          <div
            key={p.n}
            className={cn(
              'pv-panel',
              `pv-panel-${i}`,
              'absolute inset-0 z-[3] flex items-center px-6',
              i % 2 === 0 ? 'justify-start md:pl-[10%]' : 'justify-end md:pr-[10%]',
            )}
          >
            <div className="max-w-[380px]">
              <p className="mono-label text-amber">
                {p.n} — {t(`pv.${i + 1}.title`)}
              </p>
              <p className="mt-3 font-serif text-2xl font-medium leading-snug text-cream md:text-3xl">
                {t(`pv.${i + 1}.text`)}
              </p>
            </div>
          </div>
        ))}

        {/* closing CTA — end of the pin sequence, scrolls to the catalog */}
        <div className="pv-cta absolute inset-0 z-[3] flex items-center justify-center px-6">
          <div className="text-center">
            <p className="mono-label !text-[11px] text-amber">{t('pv.cta.kicker')}</p>
            <a
              href="#catalog"
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-amber px-8 py-4 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-cream hover:text-espresso"
            >
              {t('pv.cta.label')} <span aria-hidden>→</span>
            </a>
            <p className="mono-data mt-3 !text-[10px] uppercase tracking-[0.08em] text-cream/60">
              {t('pv.cta.sub')}
            </p>
          </div>
        </div>

        {/* bottom honesty line */}
        <p className="mono-label absolute bottom-8 left-1/2 z-[4] -translate-x-1/2 whitespace-nowrap !text-[10px] text-clinical-tint">
          {t('pv.honesty')}
        </p>
      </div>
    </section>
  )
}
