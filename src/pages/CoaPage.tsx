import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useSearchParams } from 'react-router'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { FileCheck2, Printer, SearchX } from 'lucide-react'
import { SAMPLE_CERTIFICATES, findCertificate, normalizeBatchInput } from '@/lib/coa'
import type { Certificate } from '@/lib/coa'
import { waLink } from '@/lib/data'
import { printArea } from '@/lib/vetpack'
import { useI18n } from '@/lib/i18n'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

type LookupState =
  | { status: 'idle' }
  | { status: 'found'; cert: Certificate }
  | { status: 'missing'; batch: string }

/**
 * /verify — batch → Certificate of Analysis lookup.
 * Pre-launch the ledger is the honest SAMPLE dataset (every document carries
 * the sample chip); unknown batches get a WhatsApp handoff, never a fake.
 */
export default function CoaPage() {
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const [params, setParams] = useSearchParams()
  const [input, setInput] = useState('')
  const [state, setState] = useState<LookupState>({ status: 'idle' })
  const autoRan = useRef(false)

  function lookup(raw: string) {
    const batch = normalizeBatchInput(raw)
    if (!batch) return
    const cert = findCertificate(batch)
    setState(cert ? { status: 'found', cert } : { status: 'missing', batch })
    setInput(batch)
  }

  // Deep link: /verify?batch=PTD-2026-007 (PDP buy box + homepage demo button).
  useEffect(() => {
    if (autoRan.current) return
    const batch = params.get('batch')
    if (batch) {
      autoRan.current = true
      lookup(batch)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    lookup(input)
    const batch = normalizeBatchInput(input)
    if (batch) setParams({ batch }, { replace: true })
  }

  return (
    <div className="bg-cream">
      {/* lookup hero */}
      <section className="section-pad pb-10">
        <div className="psa-container max-w-3xl text-center">
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="mono-label text-amber-deep"
          >
            {t('coa.overline')}
          </motion.p>
          <motion.h1
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.7, ease: EASE }}
            className="mt-4 font-serif text-[clamp(2.4rem,5vw,4.2rem)] font-medium leading-[1.02] text-espresso"
          >
            {t('coa.titleA')} <em className="text-clinical">{t('coa.titleEm')}</em>{' '}
            {t('coa.titleB')}
          </motion.h1>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.7, ease: EASE }}
            className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-espresso-70"
          >
            {t('coa.sub')}
          </motion.p>

          <motion.form
            onSubmit={onSubmit}
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.24, duration: 0.7, ease: EASE }}
            className="mx-auto mt-10 max-w-xl"
          >
            <label htmlFor="coa-batch" className="mono-label block text-left !text-[11px] text-espresso-70">
              {t('coa.inputLabel')}
            </label>
            <div className="mt-2 flex flex-col gap-3 sm:flex-row">
              <input
                id="coa-batch"
                value={input}
                onChange={(e) => setInput(e.target.value.toUpperCase())}
                placeholder={t('coa.inputPh')}
                autoComplete="off"
                spellCheck={false}
                className="mono-data flex-1 rounded-xl border border-sand bg-warmwhite px-4 py-3.5 !text-sm uppercase tracking-[0.08em] text-espresso placeholder:text-espresso-70/50 focus:border-clinical focus:outline-none"
              />
              <button
                type="submit"
                className="mono-label cursor-pointer rounded-xl bg-clinical px-6 py-3.5 !text-[11px] text-cream transition-colors hover:bg-espresso"
              >
                {t('coa.lookup')}
              </button>
            </div>
            <div className="mono-data mt-4 flex flex-wrap items-center justify-center gap-2 !text-[10px] uppercase tracking-[0.08em] text-espresso-70">
              <span>{t('coa.trySample')}</span>
              {SAMPLE_CERTIFICATES.map((c) => (
                <button
                  key={c.batch}
                  type="button"
                  onClick={() => {
                    lookup(c.batch)
                    setParams({ batch: c.batch }, { replace: true })
                  }}
                  className="cursor-pointer rounded-full border border-sand bg-warmwhite px-2.5 py-1 text-espresso transition-colors hover:border-amber hover:text-amber-deep"
                >
                  {c.batch}
                </button>
              ))}
            </div>
          </motion.form>
        </div>
      </section>

      {/* result */}
      <section className="psa-container max-w-3xl pb-24">
        <AnimatePresence mode="wait">
          {state.status === 'found' && (
            <CertificateDocument key={state.cert.batch} cert={state.cert} reduced={!!reduced} />
          )}
          {state.status === 'missing' && (
            <NotFound key={state.batch} batch={state.batch} reduced={!!reduced} />
          )}
        </AnimatePresence>
      </section>
    </div>
  )
}

/* --------------------------- certificate document --------------------------- */

function CertificateDocument({ cert, reduced }: { cert: Certificate; reduced: boolean }) {
  const { t } = useI18n()

  const rows: { label: string; value: string }[] = [
    { label: t('coa.row.product'), value: cert.productName.toUpperCase() },
    { label: t('coa.row.spec'), value: cert.spec },
    { label: t('coa.row.batch'), value: cert.batch },
    { label: t('coa.row.mfg'), value: cert.mfgDate },
    { label: t('coa.row.expiry'), value: cert.expiryDate },
    { label: t('coa.row.lab'), value: cert.lab },
    { label: t('coa.row.purity'), value: cert.hplcPurity },
    { label: t('coa.row.metals'), value: cert.heavyMetals },
    { label: t('coa.row.endotoxin'), value: cert.endotoxin },
    { label: t('coa.row.microbial'), value: cert.microbial },
    { label: t('coa.row.net'), value: cert.netContent },
    { label: t('coa.row.analyst'), value: cert.analyst },
  ]

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.6, ease: EASE }}
    >
      {/* green VERIFIED banner */}
      <div className="mono-label flex items-center justify-center gap-2 rounded-t-[20px] bg-clinical px-4 py-3 !text-[11px] text-cream">
        <FileCheck2 className="h-4 w-4" aria-hidden />
        {t('coa.verified')}
      </div>

      {/* printable document */}
      <div className="psa-print-area paper-texture relative overflow-hidden rounded-b-[20px] border border-t-0 border-sand bg-warmwhite p-6 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)] md:p-10">
        <img
          src="/coa-stamp.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-6 h-36 w-36 rotate-12 opacity-20"
        />

        <div className="relative flex flex-wrap items-start justify-between gap-4 border-b-2 border-espresso pb-5">
          <div>
            <p className="mono-label !text-[10px] text-espresso-70">{t('coa.doc.kicker')}</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-espresso md:text-4xl">
              {t('coa.doc.title')}
            </h2>
          </div>
          <p className="mono-data border-2 border-espresso px-4 py-2 !text-sm font-bold tracking-[0.1em] text-espresso">
            {cert.batch}
          </p>
        </div>

        {/* honesty chip — demo certificates are always marked */}
        {cert.sample && (
          <p className="mono-label relative mt-4 inline-block rounded-full border border-amber bg-amber/10 px-3 py-1.5 !text-[9px] leading-snug text-amber-deep">
            {t('coa.sampleChip')}
          </p>
        )}

        <dl className="mono-data relative mt-6 divide-y divide-sand text-[12px] uppercase tracking-[0.04em] text-espresso">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-1 gap-1 py-2.5 sm:grid-cols-[minmax(0,14rem)_1fr] sm:gap-4"
            >
              <dt className="text-espresso-70">{row.label}</dt>
              <dd className="font-bold">{row.value}</dd>
            </div>
          ))}
        </dl>

        <p className="mono-data relative mt-6 border-t border-dashed border-sand pt-4 !text-[10px] uppercase tracking-[0.08em] text-espresso-70">
          {t('coa.doc.foot')}
        </p>
      </div>

      <button
        type="button"
        onClick={printArea}
        className="mono-label mt-5 inline-flex cursor-pointer items-center gap-2 rounded-full border border-espresso/30 bg-warmwhite px-5 py-2.5 !text-[11px] text-espresso transition-colors hover:border-clinical hover:text-clinical"
      >
        <Printer className="h-4 w-4" aria-hidden />
        {t('coa.print')}
      </button>
    </motion.div>
  )
}

/* -------------------------------- not found -------------------------------- */

function NotFound({ batch, reduced }: { batch: string; reduced: boolean }) {
  const { t } = useI18n()
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.6, ease: EASE }}
      className="rounded-[20px] border border-sand bg-warmwhite p-8 text-center shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)]"
    >
      <SearchX className="mx-auto h-8 w-8 text-amber-deep" aria-hidden />
      <h2 className="mt-4 font-serif text-3xl font-semibold text-espresso">
        {t('coa.notFound.title')}
      </h2>
      <p className="mono-data mt-2 !text-xs uppercase tracking-[0.08em] text-espresso-70">
        {batch}
      </p>
      <p className="mx-auto mt-3 max-w-md leading-relaxed text-espresso-70">
        {t('coa.notFound.body')}
      </p>
      <a
        href={waLink(t('coa.notFound.waMsg', { batch }))}
        target="_blank"
        rel="noreferrer"
        className="mono-label mt-6 inline-flex items-center gap-2 rounded-full bg-clinical px-6 py-3 !text-[11px] text-cream transition-colors hover:bg-espresso"
      >
        <img src="/icon-whatsapp.svg" alt="" className="h-4 w-4 invert" />
        {t('coa.notFound.cta')}
      </a>
    </motion.div>
  )
}
