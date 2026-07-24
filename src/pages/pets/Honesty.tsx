import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { useI18n } from '@/lib/i18n'
import { SectionHeader } from './shared'

const LEDGER = [
  { compound: 'MOBILITY COLLAGEN', level: 'CANINE RCT', statusKey: 'strong', dot: '#1E4D3B' },
  { compound: 'BPC-157', level: 'CANINE PK DATA', statusKey: 'emerging', dot: '#1E4D3B' },
  { compound: 'KPV', level: 'PRECLINICAL', statusKey: 'early', dot: '#D97E3F' },
  { compound: 'TB-500', level: 'PRECLINICAL', statusKey: 'early', dot: '#D97E3F' },
  { compound: 'THYMOGEN', level: 'PRELIMINARY', statusKey: 'early', dot: '#D97E3F' },
]

/** Section 11 — honesty & compliance, the trust differentiator. Deliberately calm. */
export default function Honesty() {
  const { t } = useI18n()
  return (
    <section className="section-pad bg-clinical-tint">
      <div className="psa-container grid gap-12 md:grid-cols-12">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="md:col-span-7"
        >
          <SectionHeader
            overline={t('hon.overline')}
            title={
              <>
                {t('hon.titleA')} <em className="text-clinical">{t('hon.titleEm')}</em>{' '}
                {t('hon.titleB')}
              </>
            }
          />
          <div className="mt-8 max-w-xl space-y-5 text-[1.0625rem] leading-[1.65] text-espresso-70">
            <p>{t('hon.p1')}</p>
            <p>{t('hon.p2')}</p>
          </div>
          <Link
            to="/science"
            className="mono-label link-underline mt-8 inline-block text-clinical"
          >
            {t('hon.link')}
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8 }}
          className="md:col-span-5"
        >
          <div className="rounded-[20px] border border-sand bg-warmwhite p-6">
            <p className="mono-label !text-[11px] text-espresso">{t('hon.ledger')}</p>
            <div className="mt-4 divide-y divide-sand">
              {LEDGER.map((row, i) => (
                <motion.div
                  key={row.compound}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.4 }}
                  className="flex items-center justify-between gap-3 py-3"
                >
                  <div>
                    <p className="mono-data font-bold text-espresso">{row.compound}</p>
                    <p className="mono-data !text-[11px] text-espresso-70">{row.level}</p>
                  </div>
                  <span className="mono-label flex items-center gap-2 !text-[10px] text-espresso-70">
                    <span
                      className="inline-block h-2 w-2 rounded-full"
                      style={{ backgroundColor: row.dot }}
                    />
                    {t(`hon.status.${row.statusKey}`)}
                  </span>
                </motion.div>
              ))}
            </div>
            <p className="mono-data mt-4 border-t border-sand pt-3 !text-[10px] text-espresso-70">
              {t('hon.note')}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
