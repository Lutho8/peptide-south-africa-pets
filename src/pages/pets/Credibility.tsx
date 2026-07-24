import { motion } from 'framer-motion'
import { FlaskConical } from 'lucide-react'
import { ADVISORY_VET, TESTING_LAB } from '@/lib/credibility'
import { useI18n } from '@/lib/i18n'
import { SectionHeader } from './shared'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

/**
 * Credibility block (round 6) — advisory vet + independent lab, rendered
 * after Testimonials. Placeholder identities from `@/lib/credibility` (the
 * client swaps real names at launch); the portrait is deliberately a
 * monogram tile, not a fabricated photo, and the section carries the
 * "ADVISORY DETAILS FINALIZED AT LAUNCH" disclaimer chip.
 */
export default function Credibility() {
  const { t, locale } = useI18n()
  const vetBio = locale === 'af' ? ADVISORY_VET.bioAf : ADVISORY_VET.bio
  const labNote = locale === 'af' ? TESTING_LAB.noteAf : TESTING_LAB.note

  return (
    <section className="section-pad bg-cream-2">
      <div className="psa-container">
        <SectionHeader overline={t('cred.overline')} title={t('cred.title')} sub={t('cred.sub')} />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {/* advisory vet card — monogram portrait, never a fabricated photo */}
          <motion.article
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="rounded-[20px] border border-sand bg-warmwhite p-7 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)] md:p-9"
          >
            <p className="mono-label !text-[10px] text-clinical">{t('cred.vet.card')}</p>
            <div className="mt-5 flex items-center gap-5">
              <span
                aria-hidden
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-clinical font-serif text-3xl font-semibold text-cream"
              >
                {ADVISORY_VET.initials}
              </span>
              <div>
                <h3 className="font-serif text-2xl font-semibold text-espresso">
                  {ADVISORY_VET.name}
                </h3>
                <p className="mono-label mt-1 !text-[10px] text-espresso-70">
                  {ADVISORY_VET.title}
                </p>
                <p className="mono-data mt-1 !text-[10px] uppercase tracking-[0.08em] text-amber-deep">
                  {ADVISORY_VET.reg}
                </p>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-espresso-70">{vetBio}</p>
          </motion.article>

          {/* independent testing lab card */}
          <motion.article
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.1, duration: 0.7, ease: EASE }}
            className="rounded-[20px] border border-sand bg-warmwhite p-7 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)] md:p-9"
          >
            <p className="mono-label !text-[10px] text-clinical">{t('cred.lab.card')}</p>
            <div className="mt-5 flex items-center gap-5">
              <span
                aria-hidden
                className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-espresso text-amber"
              >
                <FlaskConical className="h-9 w-9" />
              </span>
              <div>
                <h3 className="mono-data font-bold uppercase tracking-[0.06em] text-espresso">
                  {TESTING_LAB.name}
                </h3>
                <p className="mono-label mt-2 !text-[10px] text-espresso-70">HPLC · ICP-MS · LAL</p>
              </div>
            </div>
            <p className="mt-5 leading-relaxed text-espresso-70">{labNote}</p>
            <img
              src="/coa-stamp.svg"
              alt=""
              aria-hidden
              className="mt-5 h-16 w-16 -rotate-6 opacity-30"
            />
          </motion.article>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mono-label mt-8 inline-block rounded-full border border-amber bg-amber/10 px-4 py-2 !text-[10px] text-amber-deep"
        >
          {t('cred.disclaimer')}
        </motion.p>
      </div>
    </section>
  )
}
