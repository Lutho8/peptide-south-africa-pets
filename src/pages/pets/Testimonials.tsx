import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Pause, Play, Star } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { SectionHeader } from './shared'

gsap.registerPlugin(ScrollTrigger, useGSAP)

/* ------------------------------------------------------------------ */
/* Featured story — GSAP island (no framer-motion inside this tree).  */
/* ------------------------------------------------------------------ */

function FeaturedStory() {
  const root = useRef<HTMLElement>(null)
  const { t } = useI18n()

  useGSAP(
    () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce) return

      const tl = gsap.timeline({
        scrollTrigger: { trigger: '.tm-feat-grid', start: 'top 78%', once: true },
        defaults: { ease: 'power3.out' },
      })
      tl.fromTo('.tm-feat-quote', { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1 })
        .fromTo('.tm-feat-proto', { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1 }, 0.2)
        .fromTo(
          '.tm-feat-close',
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 0.9 },
          0.45,
        )

      // subtle scroll parallax depth between the layered cards
      gsap.to('.tm-feat-quote', {
        yPercent: -5,
        ease: 'none',
        scrollTrigger: {
          trigger: '.tm-feat-grid',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
      gsap.to('.tm-feat-proto', {
        yPercent: 6,
        ease: 'none',
        scrollTrigger: {
          trigger: '.tm-feat-grid',
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      })
    },
    { scope: root },
  )

  return (
    <div ref={root as React.RefObject<HTMLDivElement>} className="mt-14">
      <div className="tm-feat-grid grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* pull-quote card */}
        <figure className="tm-feat-quote relative z-[2] md:col-span-7">
          <div className="paper-texture overflow-hidden rounded-[24px] border border-sand bg-warmwhite p-8 shadow-[0_30px_70px_-30px_rgba(43,33,24,0.25)] md:p-12">
            <p className="mono-label !text-[10px] text-amber-deep">{t('tm.feat.kicker')}</p>
            <span
              aria-hidden
              className="pointer-events-none absolute -top-6 right-6 select-none font-serif text-[10rem] leading-none text-amber/15"
            >
              ”
            </span>
            <blockquote className="relative mt-6 font-serif text-[clamp(1.35rem,2.4vw,1.9rem)] font-medium italic leading-[1.35] text-espresso">
              {t('tm.feat.quote1')}
            </blockquote>
            <figcaption className="mono-label mt-8 !text-[10px] text-espresso-70">
              {t('tm.feat.attr')}
            </figcaption>
          </div>
        </figure>

        {/* protocol lab-stub card, layered over the quote on desktop */}
        <div className="relative z-[3] md:col-span-5 md:-ml-10 md:mt-[72px]">
          <div className="tm-feat-proto rounded-[24px] border border-cream/10 bg-espresso p-8 text-cream shadow-[0_30px_70px_-30px_rgba(43,33,24,0.45)]">
            <p className="mono-label !text-[10px] text-amber">{t('tm.feat.protocolTitle')}</p>
            <ol className="mt-6 space-y-6">
              {[1, 2, 3].map((n) => (
                <li key={n} className="border-l-2 border-amber/50 pl-4">
                  <p className="mono-data font-bold tracking-[0.06em] text-cream">
                    {t(`tm.feat.proto${n}.title`)}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-cream/70">
                    {t(`tm.feat.proto${n}.body`)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
          <p className="mono-data mt-4 !text-[10px] leading-relaxed tracking-[0.04em] text-espresso-70">
            {t('tm.feat.disclaimer')}
          </p>
        </div>
      </div>

      {/* closing line — full-width clip reveal */}
      <div className="relative z-[1] mt-10 overflow-hidden md:-mt-[40px] md:pl-[10%]">
        <div className="tm-feat-close rounded-[24px] bg-clinical-tint p-8 md:p-10">
          <blockquote className="mx-auto max-w-3xl font-serif text-[clamp(1.2rem,2vw,1.6rem)] font-medium italic leading-snug text-clinical">
            {t('tm.feat.quote2')}
          </blockquote>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Video testimonial cards (framer-motion UI, no GSAP inside).        */
/* ------------------------------------------------------------------ */

const VIDEOS = [
  { key: 1, src: '/testimonial-running.mp4', poster: '/testimonial-running.jpg' },
  { key: 2, src: '/testimonial-patio.mp4', poster: '/testimonial-patio.jpg' },
  { key: 3, src: '/testimonial-walk.mp4', poster: '/testimonial-walk.jpg' },
] as const

function VideoCard({
  src,
  poster,
  index,
  playing,
  onPlay,
  onPause,
}: {
  src: string
  poster: string
  index: number
  playing: boolean
  onPlay: (i: number) => void
  onPause: (i: number) => void
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const { t } = useI18n()
  const n = index + 1

  // Pause this element when another card takes over playback.
  useEffect(() => {
    if (!playing && ref.current && !ref.current.paused) ref.current.pause()
  }, [playing])

  const play = useCallback(() => {
    const v = ref.current
    if (!v) return
    void v
      .play()
      .then(() => onPlay(index))
      .catch(() => onPause(index))
  }, [index, onPlay, onPause])

  const pause = useCallback(() => {
    ref.current?.pause()
    onPause(index)
  }, [index, onPause])

  const toggle = useCallback(() => {
    if (ref.current?.paused) play()
    else pause()
  }, [play, pause])

  return (
    <motion.figure
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ delay: index * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="group"
    >
      <div className="relative overflow-hidden rounded-[20px] border border-sand bg-espresso shadow-[0_20px_50px_-20px_rgba(43,33,24,0.25)]">
        <video
          ref={ref}
          src={src}
          poster={poster}
          className="aspect-[9/16] w-full object-cover"
          preload="none"
          muted
          loop
          playsInline
          onClick={toggle}
          onPointerEnter={(e) => {
            if (e.pointerType === 'mouse') play()
          }}
          onPointerLeave={(e) => {
            if (e.pointerType === 'mouse') pause()
          }}
        />
        {/* honesty chip */}
        <span className="mono-label absolute left-3 top-3 rounded-full bg-espresso/80 px-2.5 py-1 !text-[9px] text-cream backdrop-blur-sm">
          {t('tm.aiChip')}
        </span>
        {/* play / pause overlay */}
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? t('tm.pause') : t('tm.play')}
          className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
            playing ? 'opacity-0 group-hover:opacity-100' : 'opacity-100'
          }`}
        >
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-amber/95 text-warmwhite shadow-[0_10px_30px_-10px_rgba(43,33,24,0.6)] transition-transform duration-300 hover:scale-105">
            {playing ? <Pause className="h-6 w-6" /> : <Play className="ml-1 h-6 w-6" />}
          </span>
        </button>
        {/* caption strip */}
        <span className="mono-label pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-espresso/90 to-transparent px-4 pb-3 pt-10 !text-[9px] text-cream">
          {t(`tm.v${n}.cap`)}
        </span>
      </div>
      <blockquote className="mt-4 font-serif text-lg font-medium italic leading-snug text-espresso">
        {t(`tm.v${n}.quote`)}
      </blockquote>
      <figcaption className="mono-label mt-2 !text-[10px] text-espresso-70">
        {t(`tm.v${n}.meta`)}
      </figcaption>
    </motion.figure>
  )
}

/* ------------------------------------------------------------------ */
/* Section                                                            */
/* ------------------------------------------------------------------ */

const WRITTEN: { key: number; rotate: number }[] = [
  { key: 1, rotate: -1 },
  { key: 2, rotate: 1 },
  { key: 3, rotate: -0.5 },
  { key: 4, rotate: 0.75 },
]

/** Testimonials — featured comeback story, AI-labelled video re-enactments,
 *  written community quotes, quiz CTA. Replaces the old SocialProof section. */
export default function Testimonials() {
  const { t } = useI18n()
  const [playingIdx, setPlayingIdx] = useState<number | null>(null)

  // Only one video plays at a time.
  const handlePlay = useCallback((i: number) => setPlayingIdx(i), [])
  const handlePause = useCallback((i: number) => {
    setPlayingIdx((cur) => (cur === i ? null : cur))
  }, [])

  return (
    <section className="paper-texture section-pad bg-cream">
      <div className="psa-container">
        <SectionHeader
          center
          overline={t('tm.overline')}
          title={t('tm.title')}
          sub={t('tm.sub')}
        />

        <FeaturedStory />

        {/* video testimonial row */}
        <div className="mt-16 grid gap-8 sm:grid-cols-2 md:mt-20 lg:grid-cols-3">
          {VIDEOS.map((v, i) => (
            <VideoCard
              key={v.key}
              src={v.src}
              poster={v.poster}
              index={i}
              playing={playingIdx === i}
              onPlay={handlePlay}
              onPause={handlePause}
            />
          ))}
        </div>

        {/* short written testimonials — scrapbook grid */}
        <div className="mt-20">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mono-label text-center !text-[10px] text-amber-deep"
          >
            {t('tm.grid.kicker')}
          </motion.p>
          <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {WRITTEN.map((tm, i) => (
              <motion.figure
                key={tm.key}
                initial={{ opacity: 0, y: 40, rotate: tm.rotate }}
                whileInView={{ opacity: 1, y: 0, rotate: tm.rotate }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ rotate: tm.rotate > 0 ? 1.5 : -1.5 }}
                className="flex flex-col rounded-[20px] border border-sand bg-warmwhite p-6 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.12)]"
              >
                <div
                  className="flex items-center gap-1 text-amber"
                  aria-label="5 out of 5 stars"
                >
                  {Array.from({ length: 5 }, (_, s) => (
                    <Star key={s} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 font-serif text-[1.05rem] font-medium italic leading-snug text-espresso">
                  “{t(`tm.q${tm.key}.quote`)}”
                </blockquote>
                <figcaption className="mono-label mt-5 !text-[9px] leading-relaxed text-espresso-70">
                  {t(`tm.q${tm.key}.meta`)}
                  <span className="mono-data mt-1 block !text-[9px] text-clinical">
                    {t('tm.verified')}
                  </span>
                </figcaption>
              </motion.figure>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 text-center"
        >
          <Link
            to="/quiz"
            className="group inline-flex items-center gap-3 rounded-full bg-amber px-8 py-4 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
          >
            {t('tm.cta')}
            <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
