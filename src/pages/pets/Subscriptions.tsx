import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { SectionHeader, CountUp } from './shared'

const PERKS: {
  key: number
  stat?: number
  statPrefix?: string
  statSuffix?: string
  statText?: string
}[] = [
  { key: 1, stat: 15, statSuffix: '% OFF' },
  { key: 2, stat: 1500, statPrefix: 'R', statSuffix: '+' },
  { key: 3, statText: 'WHATSAPP' },
]

/** Section 8 — subscription model, copied from market leaders. */
export default function Subscriptions() {
  const { t } = useI18n()
  return (
    <section id="subscriptions" className="section-pad bg-espresso text-cream">
      <div className="psa-container">
        <SectionHeader
          dark
          overline={t('subs.overline')}
          title={
            <>
              {t('subs.titleA')} <em className="text-amber">{t('subs.titleEm')}</em>
            </>
          }
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PERKS.map((perk, i) => (
            <motion.div
              key={perk.key}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -6 }}
              className="rounded-[20px] border border-cream/10 bg-warmwhite/[0.08] p-7 transition-colors hover:border-amber/30"
            >
              <p className="mono-label text-amber">
                {perk.statText ?? (
                  <>
                    {perk.statPrefix}
                    <CountUp target={perk.stat ?? 0} format={perk.stat !== 15} />
                    {perk.statSuffix}
                  </>
                )}
              </p>
              <p className="mt-4 font-serif text-2xl font-semibold">{t(`subs.perk${perk.key}.title`)}</p>
              <p className="mt-2 text-sm leading-relaxed text-cream/70">{t(`subs.perk${perk.key}.body`)}</p>
            </motion.div>
          ))}
        </div>

        {/* multi-pet bundle strip */}
        <div className="mt-14 grid items-center gap-8 overflow-hidden rounded-[20px] border border-cream/10 bg-warmwhite/[0.06] md:grid-cols-2">
          <div className="h-full overflow-hidden">
            <motion.img
              src="/cat-portrait-1.png"
              alt="A ginger cat stretched on a sunlit windowsill"
              initial={{ scale: 1.12 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="aspect-[4/3] h-full w-full object-cover"
            />
          </div>
          <div className="p-8 md:p-10">
            <motion.span
              initial={{ x: 40, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mono-label inline-block rounded-full border border-amber/50 px-3 py-1.5 !text-[10px] text-amber"
            >
              {t('subs.multipet.chip')}
            </motion.span>
            <p className="mt-5 font-serif text-3xl font-medium leading-snug">
              {t('subs.multipet.titleA')} <em className="text-amber">{t('subs.multipet.titleEm')}</em>
            </p>
            <p className="mt-3 text-cream/70">{t('subs.multipet.body')}</p>
          </div>
        </div>

        {/* founding member banner */}
        <motion.div
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          whileInView={{ clipPath: 'inset(0% 0 0 0)' }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 flex flex-col items-center gap-6 rounded-[20px] bg-clinical p-10 text-center md:flex-row md:justify-between md:text-left"
        >
          <div>
            <p className="mono-label !text-[11px] text-cream/70">{t('subs.founding.label')}</p>
            <p className="mt-2 font-serif text-2xl font-medium md:text-3xl">
              {t('subs.founding.title')}
            </p>
          </div>
          <a
            href="#waitlist"
            className="relative shrink-0 overflow-hidden rounded-full bg-amber px-8 py-4 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
          >
            {t('subs.founding.cta')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
