import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Check, Copy, Ticket } from 'lucide-react'
import { PET_PRODUCTS, TOTAL_WAITING } from '@/lib/data'
import {
  REFERRAL_BOOST_SPOTS,
  buildReferralLink,
  buildReferralWhatsAppLink,
  effectiveQueue,
  getWaitlistEntries,
  liveWaitlistTotal,
  referralCountFor,
} from '@/lib/waitlist'
import { useLiveWaitlistCount } from '@/lib/supabase'
import { useI18n } from '@/lib/i18n'

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]
/** Founding-cap cohort counter — same source as FoundingRing (BPC-157 list). */
const FOUNDING_CAP = 500
const FOUNDING_BASE = PET_PRODUCTS.find((p) => p.slug === 'bpc-157')?.waiting ?? 438

/**
 * /queue — living queue dashboard for waitlist members.
 * Position recomputes with the same honest math as the navbar counter
 * (public base + local entries + live Supabase rows via RPC) minus referral
 * boosts (simulated locally, and labeled as such). Non-members get a CTA.
 */
export default function QueuePage() {
  const { t } = useI18n()
  const reduced = useReducedMotion()
  const liveCount = useLiveWaitlistCount()

  const entries = getWaitlistEntries()
  const entry = entries.length > 0 ? entries[entries.length - 1] : null

  if (!entry) return <JoinCta reduced={!!reduced} />

  // Same base + RPC count logic as Navbar/FoundingRing, minus referral boosts.
  const position = effectiveQueue(entry) + liveCount
  const totalWaiting = liveWaitlistTotal(TOTAL_WAITING) + liveCount
  const referredByMe = referralCountFor(entry.code)
  const spotsGained =
    (entry.ref ? REFERRAL_BOOST_SPOTS : 0) + referredByMe * REFERRAL_BOOST_SPOTS
  const claimed = Math.min(FOUNDING_CAP, FOUNDING_BASE + liveCount)
  const foundingPct = Math.round((claimed / FOUNDING_CAP) * 100)

  const products = entry.products
    .map((slug) => PET_PRODUCTS.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => p != null)

  const firstName = entry.name.trim().split(/\s+/)[0] || 'PSA PETS member'

  return (
    <div className="section-pad bg-cream">
      <div className="psa-container max-w-5xl">
        {/* header */}
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
          className="text-center"
        >
          <p className="mono-label text-amber-deep">{t('queue.overline')}</p>
          <h1 className="mt-4 font-serif text-[clamp(2.4rem,5vw,4rem)] font-medium leading-[1.02] text-espresso">
            {t('queue.title')}
          </h1>
          <p className="mx-auto mt-3 max-w-lg text-lg leading-relaxed text-espresso-70">
            {t('queue.sub')}
          </p>
        </motion.div>

        {/* position + founding progress */}
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.6, ease: EASE }}
            className="rounded-[20px] border border-sand bg-warmwhite p-7 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)]"
          >
            <p className="mono-label !text-[11px] text-espresso-70">{t('queue.position')}</p>
            <p className="mono-data mt-3 text-5xl font-bold tabular-nums text-amber-deep">
              #{String(position).padStart(4, '0')}
            </p>
            <p className="mono-data mt-3 !text-[11px] uppercase tracking-[0.08em] text-espresso-70">
              {t('queue.total', { count: totalWaiting.toLocaleString('en-ZA') })}
            </p>
            <p className="mono-data mt-4 border-t border-dashed border-sand pt-3 !text-[9px] uppercase leading-relaxed tracking-[0.08em] text-espresso-70/80">
              {t('queue.honest')}
            </p>

            {/* queue movement ticker (simulated locally, labeled) */}
            <div className="mt-5 rounded-2xl border border-clinical/30 bg-clinical-tint/40 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="mono-label !text-[10px] text-clinical">{t('queue.ticker')}</p>
                <span className="mono-data !text-[8px] uppercase tracking-[0.08em] text-espresso-70">
                  {t('queue.sim')}
                </span>
              </div>
              <MovementTicker
                joinedVia={entry.ref ?? null}
                referrals={referredByMe}
                spots={REFERRAL_BOOST_SPOTS}
                reduced={!!reduced}
              />
            </div>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.16, duration: 0.6, ease: EASE }}
            className="flex flex-col rounded-[20px] border border-sand bg-warmwhite p-7 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)]"
          >
            <div className="flex items-baseline justify-between gap-3">
              <p className="mono-label !text-[11px] text-espresso-70">
                {t('queue.founding', { cap: FOUNDING_CAP })}
              </p>
              <p className="mono-data !text-[11px] tabular-nums text-espresso">
                {t('queue.claimed', { claimed, cap: FOUNDING_CAP })}
              </p>
            </div>
            <div
              className="mt-4 h-3 overflow-hidden rounded-full bg-cream-2"
              role="progressbar"
              aria-valuenow={foundingPct}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <motion.div
                initial={reduced ? false : { width: 0 }}
                animate={{ width: `${foundingPct}%` }}
                transition={{ delay: 0.4, duration: 1.1, ease: EASE }}
                className="h-full rounded-full bg-amber"
              />
            </div>
            <p className="mt-3 text-sm leading-relaxed text-espresso-70">
              {t('queue.foundingBody', { cap: FOUNDING_CAP })}
            </p>

            {/* referral tools */}
            <div className="mt-6 border-t border-dashed border-sand pt-5">
              <p className="mono-label !text-[10px] text-amber-deep">{t('queue.refTitle')}</p>
              <p className="mt-1 text-sm leading-relaxed text-espresso-70">
                {t('queue.refBody', { spots: REFERRAL_BOOST_SPOTS })}
              </p>
              <ReferralTools code={entry.code} firstName={firstName} />
            </div>
          </motion.div>
        </div>

        {/* ticket card + products */}
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="relative overflow-hidden rounded-[20px] border border-sand bg-warmwhite p-7 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)]"
          >
            <img
              src="/coa-stamp.svg"
              alt=""
              aria-hidden
              className="pointer-events-none absolute -bottom-8 -right-8 w-44 opacity-[0.08]"
            />
            <p className="mono-label flex items-center gap-2 !text-[11px] text-espresso">
              <Ticket className="h-4 w-4 text-amber-deep" aria-hidden />
              {t('queue.ticket')}
            </p>
            <div className="my-4 border-t border-dashed border-sand" />
            <dl className="mono-data space-y-3 !text-[11px] uppercase tracking-[0.06em] text-espresso">
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-espresso-70">{t('wlp.rowOwner')}</dt>
                <dd className="text-right font-bold">{entry.name.toUpperCase() || '—'}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-espresso-70">{t('wlp.rowQueue')}</dt>
                <dd className="text-right text-xl font-bold text-amber-deep">
                  #{String(position).padStart(4, '0')}
                </dd>
              </div>
              {spotsGained > 0 && (
                <div className="flex items-baseline justify-between gap-4">
                  <dt className="text-espresso-70">{t('queue.ticker')}</dt>
                  <dd className="text-right font-bold text-clinical">+{spotsGained}</dd>
                </div>
              )}
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-espresso-70">{t('wlp.rowCode')}</dt>
                <dd className="text-right font-bold">{entry.code}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4">
                <dt className="text-espresso-70">{t('wlp.perkRow')}</dt>
                <dd className="text-right font-bold text-clinical">{t('wlp.perkValue')}</dd>
              </div>
            </dl>
          </motion.div>

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: 0.08, duration: 0.6, ease: EASE }}
            className="rounded-[20px] border border-sand bg-warmwhite p-7 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)]"
          >
            <p className="mono-label !text-[11px] text-espresso">{t('queue.products')}</p>
            <div className="my-4 border-t border-dashed border-sand" />
            {products.length === 0 ? (
              <p className="text-sm text-espresso-70">{t('wlp.everything')}</p>
            ) : (
              <ul className="space-y-4">
                {products.map((p) => (
                  <li key={p.slug} className="flex items-center gap-4">
                    <img
                      src={p.image}
                      alt=""
                      className="h-12 w-12 shrink-0 rounded-xl border border-sand object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <Link
                        to={`/product/${p.slug}`}
                        className="link-underline font-serif text-base font-semibold text-espresso"
                      >
                        {p.name}
                      </Link>
                      <p className="mono-data !text-[9px] uppercase tracking-[0.08em] text-espresso-70">
                        {p.spec}
                      </p>
                    </div>
                    <span className="mono-data shrink-0 !text-[10px] tabular-nums text-amber-deep">
                      {t('queue.waiting', { count: p.waiting })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

/* ------------------------- queue movement ticker ------------------------- */

function MovementTicker({
  joinedVia,
  referrals,
  spots,
  reduced,
}: {
  joinedVia: string | null
  referrals: number
  spots: number
  reduced: boolean
}) {
  const { t } = useI18n()
  const events = useMemo(() => {
    const list: string[] = []
    if (joinedVia) list.push(t('queue.ticker.join', { ref: joinedVia, spots }))
    for (let i = 0; i < referrals; i += 1) {
      list.push(t('queue.ticker.ref', { code: 'WL-PTD-····', spots }))
    }
    return list.length > 0 ? list : [t('queue.ticker.idle')]
  }, [joinedVia, referrals, spots, t])

  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (events.length < 2) return
    const id = window.setInterval(() => setIdx((i) => (i + 1) % events.length), 2600)
    return () => window.clearInterval(id)
  }, [events.length])

  return (
    <div className="mt-2 min-h-6">
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={reduced ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="mono-data !text-[11px] uppercase tracking-[0.06em] text-espresso"
        >
          {events[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  )
}

/* ------------------------------ referral tools ---------------------------- */

function ReferralTools({ code, firstName }: { code: string; firstName: string }) {
  const { t } = useI18n()
  const [copied, setCopied] = useState(false)
  const link = buildReferralLink(code)

  async function copy() {
    try {
      await navigator.clipboard.writeText(link)
    } catch {
      /* clipboard blocked — the link is still visible below */
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <div className="mt-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          readOnly
          value={link}
          aria-label={t('form.refAria')}
          onFocus={(e) => e.target.select()}
          className="mono-data flex-1 rounded-xl border border-sand bg-cream px-3 py-2.5 !text-[11px] text-espresso focus:outline-none"
        />
        <button
          type="button"
          onClick={copy}
          className="mono-label inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-espresso px-4 py-2.5 !text-[10px] text-cream transition-colors hover:bg-clinical"
        >
          {copied ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
          {copied ? t('queue.copied') : t('queue.copy')}
        </button>
      </div>
      <a
        href={buildReferralWhatsAppLink(code, firstName)}
        target="_blank"
        rel="noreferrer"
        className="mono-label mt-3 inline-flex items-center gap-2 rounded-full bg-clinical px-5 py-2.5 !text-[10px] text-cream transition-colors hover:bg-espresso"
      >
        <img src="/icon-whatsapp.svg" alt="" className="h-4 w-4 invert" />
        {t('queue.shareWa')}
      </a>
    </div>
  )
}

/* ------------------------------ not a member ------------------------------ */

function JoinCta({ reduced }: { reduced: boolean }) {
  const { t } = useI18n()
  return (
    <div className="section-pad bg-cream">
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="psa-container max-w-xl text-center"
      >
        <p className="mono-label text-amber-deep">{t('queue.overline')}</p>
        <h1 className="mt-4 font-serif text-[clamp(2.2rem,4.5vw,3.6rem)] font-medium leading-[1.05] text-espresso">
          {t('queue.notMember.title')}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-espresso-70">
          {t('queue.notMember.body')}
        </p>
        <Link
          to="/waitlist"
          className="mt-8 inline-block rounded-full bg-amber px-8 py-4 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
        >
          {t('queue.notMember.cta')}
        </Link>
        <p className="mt-4">
          <Link to="/pets" className="mono-label link-underline !text-[11px] text-espresso-70">
            {t('queue.browse')}
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
