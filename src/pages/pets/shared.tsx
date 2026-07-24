import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

/** Mono/serif section header trio used across the landing page. */
export function SectionHeader({
  overline,
  title,
  sub,
  dark = false,
  center = false,
}: {
  overline: string
  title: React.ReactNode
  sub?: string
  dark?: boolean
  center?: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className={cn(center && 'text-center')}
    >
      <p className={cn('mono-label', dark ? 'text-amber' : 'text-amber-deep')}>{overline}</p>
      <h2
        className={cn(
          'mt-4 font-serif text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[1.02]',
          dark ? 'text-cream' : 'text-espresso',
        )}
      >
        {title}
      </h2>
      {sub && (
        <p
          className={cn(
            'mt-4 max-w-xl text-lg leading-relaxed',
            dark ? 'text-cream/70' : 'text-espresso-70',
            center && 'mx-auto',
          )}
        >
          {sub}
        </p>
      )}
    </motion.div>
  )
}

/** Count-up number that starts when scrolled into view (mono tabular). */
export function CountUp({
  target,
  duration = 1400,
  className,
  format = true,
}: {
  target: number
  duration?: number
  className?: string
  format?: boolean
}) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || started.current) return
        started.current = true
        const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reduce) {
          setValue(target)
          return
        }
        const t0 = performance.now()
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration)
          setValue(Math.round(target * (1 - Math.pow(1 - p, 3))))
          if (p < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.6 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [target, duration])

  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {format ? value.toLocaleString('en-ZA') : value}
    </span>
  )
}
