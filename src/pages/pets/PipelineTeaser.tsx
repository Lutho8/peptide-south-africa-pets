import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowUpRight, FlaskConical } from 'lucide-react'
import { useI18n } from '@/lib/i18n'
import { SectionHeader } from './shared'

const PIPELINE = [
  { slug: 'calm', key: 'calm' },
  { slug: 'immune-plus', key: 'immune' },
  { slug: 'senior-vitality', key: 'senior' },
] as const

/** Protocol pipeline teaser — in-development formulas with early-list links. */
export default function PipelineTeaser() {
  const { t } = useI18n()
  return (
    <section className="section-pad bg-cream-2">
      <div className="psa-container">
        <SectionHeader
          overline={t('pipe.overline')}
          title={
            <>
              {t('pipe.titleA')} <em className="text-amber">{t('pipe.titleEm')}</em>
            </>
          }
          sub={t('pipe.sub')}
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {PIPELINE.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col rounded-[20px] border border-dashed border-espresso/30 bg-warmwhite p-7"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="mono-label coming-soon-pulse inline-flex items-center gap-1.5 rounded-full bg-clinical-tint px-3 py-1.5 !text-[9px] text-clinical">
                  <FlaskConical className="h-3 w-3" />
                  {t('pipe.badge')}
                </span>
              </div>
              <h3 className="mt-5 font-serif text-2xl font-semibold leading-tight text-espresso">
                {t(`pipe.${p.key}.name`)}
              </h3>
              <p className="mono-data mt-2 !text-[11px] tracking-[0.04em] text-amber-deep">
                {t(`pipe.${p.key}.spec`)}
              </p>
              <p className="mt-3 flex-1 leading-relaxed text-espresso-70">
                {t(`pipe.${p.key}.desc`)}
              </p>
              <Link
                to={`/waitlist?product=${p.slug}`}
                className="mono-label mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-espresso/25 px-5 py-2.5 !text-[10px] text-espresso transition-colors hover:border-amber hover:bg-amber hover:text-warmwhite"
              >
                {t('pipe.cta')}
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
