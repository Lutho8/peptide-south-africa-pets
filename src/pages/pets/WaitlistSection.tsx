import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import WaitlistForm from '@/components/WaitlistForm'
import { PRODUCTS } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
import { SectionHeader } from './shared'
import { cn } from '@/lib/utils'

const SHORT: Record<string, string> = {
  'bpc-157': 'BPC-157',
  kpv: 'KPV',
  'recovery-blend': 'RECOVERY',
  'immune-thymogen': 'IMMUNE',
  'mobility-collagen': 'COLLAGEN',
}

/** Live counters that nudge +1 occasionally with a subtle amber flash. */
function LiveCounters() {
  const [counts, setCounts] = useState<Record<string, number>>(() =>
    Object.fromEntries(PRODUCTS.map((p) => [p.slug, p.waiting])),
  )
  const [flash, setFlash] = useState<string | null>(null)

  useEffect(() => {
    let timer: number
    const schedule = () => {
      timer = window.setTimeout(() => {
        const slug = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)].slug
        setCounts((c) => ({ ...c, [slug]: c[slug] + 1 }))
        setFlash(slug)
        window.setTimeout(() => setFlash(null), 500)
        schedule()
      }, 20000 + Math.random() * 40000)
    }
    schedule()
    return () => window.clearTimeout(timer)
  }, [])

  return (
    <div className="mono-data flex flex-wrap gap-x-4 gap-y-2 text-espresso-70">
      {PRODUCTS.map((p) => (
        <motion.span
          key={p.slug}
          animate={flash === p.slug ? { scale: [1, 1.15, 1], color: '#D97E3F' } : {}}
          transition={{ duration: 0.4 }}
          className={cn(flash === p.slug && 'text-amber')}
        >
          {SHORT[p.slug]}: {counts[p.slug]}
        </motion.span>
      ))}
    </div>
  )
}

/** Section 9 — global waitlist capture. */
export default function WaitlistSection() {
  const { t } = useI18n()
  return (
    <section id="waitlist" className="paper-texture section-pad bg-cream-2">
      <div className="psa-container relative grid gap-12 lg:grid-cols-12">
        <motion.div
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative lg:col-span-5"
        >
          <img
loading="lazy"             src="/dog-portrait-3.png"
            alt="A person's hands gently holding a senior dog's paw"
            className="h-full max-h-[720px] w-full rounded-2xl object-cover"
          />
          <p className="mono-label absolute bottom-4 left-4 rounded-md bg-espresso px-3 py-1.5 !text-[10px] text-cream">
            {t('wsec.caption')}
          </p>
        </motion.div>

        <div className="lg:col-span-7">
          <SectionHeader
            overline={t('wsec.overline')}
            title={
              <>
                {t('wsec.titleA')} <em className="text-amber">{t('wsec.titleEm')}</em>
              </>
            }
          />
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.6 }}
            className="mt-10 rounded-[20px] border border-sand bg-cream p-6 md:p-8"
          >
            <WaitlistForm />
            <div className="mt-6 border-t border-sand pt-5">
              <LiveCounters />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
