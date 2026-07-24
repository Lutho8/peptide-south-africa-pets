import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { FileCheck2 } from 'lucide-react'
import { DEMO_BATCH } from '@/lib/coa'
import { useI18n } from '@/lib/i18n'

/**
 * Homepage batch-transparency strip (round 6) — sits right after the trust
 * bar. The demo button deep-links the sample launch batch into /verify.
 */
export default function CoaStrip() {
  const { t } = useI18n()
  return (
    <section className="border-b border-sand bg-espresso py-12">
      <div className="psa-container flex flex-col items-center gap-6 text-center md:flex-row md:justify-between md:text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl"
        >
          <p className="mono-label flex items-center justify-center gap-2 !text-[11px] text-amber md:justify-start">
            <FileCheck2 className="h-4 w-4" aria-hidden />
            {t('coas.overline')}
          </p>
          <h2 className="mt-3 font-serif text-[clamp(1.8rem,3.5vw,2.8rem)] font-medium leading-[1.05] text-cream">
            {t('coas.title')}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-cream/70 md:text-base">
            {t('coas.body')}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ delay: 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex shrink-0 flex-col items-center gap-3"
        >
          <Link
            to={`/verify?batch=${DEMO_BATCH}`}
            className="mono-label rounded-full bg-clinical px-6 py-3.5 !text-[11px] text-cream transition-colors hover:bg-cream hover:text-clinical"
          >
            {t('coas.demo')}
          </Link>
          <Link
            to="/verify"
            className="mono-label link-underline !text-[10px] text-cream/70 hover:text-cream"
          >
            {t('coas.verify')}
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
