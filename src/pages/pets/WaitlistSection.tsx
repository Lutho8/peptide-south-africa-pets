import { motion } from 'framer-motion'
import WaitlistForm from '@/components/WaitlistForm'
import { useLiveWaitlistCount } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n'
import { SectionHeader } from './shared'

/** Section 9 — global waitlist capture. */
export default function WaitlistSection() {
  const { t } = useI18n()
  const confirmedJoins = useLiveWaitlistCount()
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
              <p className="mono-data text-espresso-70">
                {confirmedJoins > 0
                  ? t('wlp.confirmedJoins', { count: confirmedJoins.toLocaleString('en-ZA') })
                  : t('nav.waitlistOpen')}
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
