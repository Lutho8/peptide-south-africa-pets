import { motion } from 'framer-motion'
import { ArrowRight, FlaskConical, Quote } from 'lucide-react'
import { Link } from 'react-router'
import { useI18n } from '@/lib/i18n'
import { SectionHeader } from './shared'

/**
 * Founder story plus a clear evidence boundary. We deliberately avoid
 * anonymous star ratings or "verified" testimonials until real, moderated
 * submissions exist.
 */
export default function Testimonials() {
  const { t } = useI18n()

  return (
    <section className="paper-texture section-pad bg-cream">
      <div className="psa-container">
        <SectionHeader
          center
          overline={t('tm.overline')}
          title={t('tm.title')}
          sub={t('tm.sub')}
        />

        <div className="mx-auto mt-14 grid max-w-5xl gap-6 lg:grid-cols-5">
          <motion.figure
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="relative overflow-hidden rounded-[24px] border border-sand bg-warmwhite p-8 shadow-[0_24px_60px_-28px_rgba(43,33,24,0.24)] md:p-10 lg:col-span-3"
          >
            <Quote className="h-8 w-8 text-amber" aria-hidden />
            <p className="mono-label mt-6 !text-[10px] text-amber-deep">
              {t('tm.feat.kicker')}
            </p>
            <blockquote className="mt-5 font-serif text-[clamp(1.35rem,2.5vw,2rem)] font-medium italic leading-[1.35] text-espresso">
              {t('tm.feat.quote1')}
            </blockquote>
            <figcaption className="mono-label mt-7 !text-[10px] text-espresso-70">
              {t('tm.feat.attr')}
            </figcaption>
            <p className="mono-data mt-5 border-t border-sand pt-5 !text-[10px] leading-relaxed tracking-[0.04em] text-espresso-70">
              {t('tm.feat.disclaimer')}
            </p>
          </motion.figure>

          <motion.aside
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: 0.1, duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-[24px] border border-clinical/25 bg-clinical-tint p-8 lg:col-span-2"
          >
            <FlaskConical className="h-7 w-7 text-clinical" aria-hidden />
            <p className="mono-label mt-5 !text-[10px] text-clinical">
              {t('tm.evidence.kicker')}
            </p>
            <h3 className="mt-3 font-serif text-2xl font-semibold text-espresso">
              {t('tm.evidence.title')}
            </h3>
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-espresso-70">
              <li>{t('tm.evidence.rats')}</li>
              <li>{t('tm.evidence.beagles')}</li>
              <li>{t('tm.evidence.gap')}</li>
            </ul>
            <Link
              to="/science"
              className="mono-label link-underline mt-6 inline-flex items-center gap-2 !text-[10px] text-clinical"
            >
              {t('tm.evidence.link')}
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </motion.aside>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="mt-12 text-center"
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
