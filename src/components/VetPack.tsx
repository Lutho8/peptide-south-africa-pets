import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Printer, Stethoscope } from 'lucide-react'
import { buildVetWhatsAppLink, printArea } from '@/lib/vetpack'
import type { VetHandout } from '@/lib/vetpack'
import { useI18n } from '@/lib/i18n'

/**
 * "Bring your vet" one-tap pack (round 6) — used on the PDP buy box and the
 * quiz results card. A clinical-green button opens a panel with a WhatsApp
 * share link (compact vet-handout message) and a print button that prints
 * only the styled A4-ish handout card (`.psa-print-area` + print rules in
 * index.css). The handout card is always mounted but screen-hidden.
 */
export default function VetPack({
  handouts,
  link,
  className,
}: {
  handouts: VetHandout[]
  /** Canonical details URL embedded in the WhatsApp message + handout. */
  link: string
  className?: string
}) {
  const [open, setOpen] = useState(false)
  const { t, locale } = useI18n()
  const waHref = useMemo(
    () => buildVetWhatsAppLink(handouts, locale, link),
    [handouts, locale, link],
  )

  if (handouts.length === 0) return null

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="mono-label inline-flex cursor-pointer items-center gap-2 rounded-full bg-clinical px-6 py-3.5 !text-[11px] text-cream transition-colors hover:bg-espresso"
      >
        <Stethoscope className="h-4 w-4" aria-hidden />
        {t('vetpack.cta')}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="mt-4 rounded-[20px] border border-clinical/30 bg-clinical-tint/40 p-6">
              <p className="font-serif text-xl font-semibold text-espresso">{t('vetpack.title')}</p>
              <p className="mt-1 text-sm leading-relaxed text-espresso-70">{t('vetpack.body')}</p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <a
                  href={waHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mono-label inline-flex items-center gap-2 rounded-full bg-clinical px-5 py-2.5 !text-[11px] text-cream transition-colors hover:bg-espresso"
                >
                  <img src="/icon-whatsapp.svg" alt="" className="h-4 w-4 invert" />
                  {t('vetpack.wa')}
                </a>
                <button
                  type="button"
                  onClick={printArea}
                  className="mono-label inline-flex cursor-pointer items-center gap-2 rounded-full border border-espresso/30 bg-warmwhite px-5 py-2.5 !text-[11px] text-espresso transition-colors hover:border-clinical hover:text-clinical"
                >
                  <Printer className="h-4 w-4" aria-hidden />
                  {t('vetpack.print')}
                </button>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="mono-label link-underline cursor-pointer !text-[10px] text-espresso-70"
                >
                  {t('vetpack.close')}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* print-only handout card (A4-ish, one block per product) */}
      <div className="psa-print-handout psa-print-area paper-texture border border-sand bg-warmwhite p-8 text-espresso">
        <div className="flex items-start justify-between border-b-2 border-espresso pb-4">
          <div>
            <p className="mono-label !text-[10px] text-espresso-70">{t('vetpack.docTitle')}</p>
            <p className="mono-data mt-1 !text-[10px] uppercase tracking-[0.08em] text-alert">
              {t('vetpack.docStatus')}
            </p>
          </div>
          <img src="/coa-stamp.svg" alt="" aria-hidden className="h-16 w-16 opacity-30" />
        </div>

        {handouts.map((h) => (
          <dl
            key={h.slug}
            className="mono-data mt-5 grid grid-cols-[10rem_1fr] gap-x-4 gap-y-2 border-b border-dashed border-sand pb-5 text-[11px] uppercase tracking-[0.04em]"
          >
            <dt className="text-espresso-70">{t('vetpack.row.product')}</dt>
            <dd className="font-bold">{h.product}</dd>
            <dt className="text-espresso-70">{t('vetpack.row.compound')}</dt>
            <dd>{h.compound}</dd>
            <dt className="text-espresso-70">{t('vetpack.row.evidence')}</dt>
            <dd className="font-bold">{h.evidenceLevel}</dd>
            <dt className="text-espresso-70">{t('vetpack.row.citation')}</dt>
            <dd>
              {h.citation}
              {h.citationUrl ? ` — ${h.citationUrl}` : ''}
            </dd>
            <dt className="text-espresso-70">{t('vetpack.row.dosing')}</dt>
            <dd>{h.dosingSummary}</dd>
            <dt className="text-espresso-70">{t('vetpack.row.monitoring')}</dt>
            <dd>{h.monitoring}</dd>
            <dt className="text-espresso-70">{t('vetpack.row.batch')}</dt>
            <dd className="font-bold">{h.batch}</dd>
          </dl>
        ))}

        <p className="mono-data mt-5 !text-[10px] uppercase leading-relaxed tracking-[0.08em] text-espresso-70">
          {t('vetpack.docFoot')}
        </p>
        <p className="mono-data mt-2 break-all !text-[10px] uppercase tracking-[0.08em] text-espresso-70">
          {link}
        </p>
      </div>
    </div>
  )
}
