import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation } from 'react-router'
import { Check, Clipboard, Clock3, Landmark, ShieldCheck } from 'lucide-react'
import { EFT_SESSION_KEY } from '@/lib/eftCheckout'
import type { EftInstructionsState } from '@/lib/eftCheckout'
import { zar } from '@/lib/cart'
import { useCheckoutCopy } from '@/pages/checkoutCopy'
import Seo from '@/components/Seo'

/**
 * /checkout/eft-instructions — bank details for the pending EFT order.
 * Reads the routed state first, then the sessionStorage fallback written by
 * the checkout page (survives a refresh, never leaves the device).
 */
export default function EftInstructionsPage() {
  const location = useLocation()
  const copy = useCheckoutCopy()
  const [copied, setCopied] = useState('')
  const state = (() => {
    const routed = location.state as EftInstructionsState | null
    if (routed?.paymentReference) return routed
    try {
      return JSON.parse(sessionStorage.getItem(EFT_SESSION_KEY) || 'null') as EftInstructionsState | null
    } catch {
      return null
    }
  })()

  if (!state) {
    return (
      <>
        <Seo title={copy.eftSeoTitle} description={copy.eftSeoDesc} path="/checkout/eft-instructions" noindex />
        <div className="section-pad bg-cream text-center">
          <div className="psa-container max-w-2xl">
            <h1 className="font-serif text-[clamp(2rem,4vw,3rem)] font-medium text-espresso">
              {copy.eftMissingTitle}
            </h1>
            <p className="mt-4 text-espresso-70">{copy.eftMissingBody}</p>
            <Link
              to="/pets"
              className="mt-8 inline-block rounded-full bg-amber px-6 py-3 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
            >
              {copy.eftMissingCta}
            </Link>
          </div>
        </div>
      </>
    )
  }

  const rows: [string, string][] = [
    [copy.eftAccountName, state.bank.account_name],
    [copy.eftBank, state.bank.bank],
    [copy.eftAccountNumber, state.bank.account_number],
    [copy.eftBranchCode, state.bank.branch_code],
    [copy.eftReference, state.paymentReference],
  ]

  const copyValue = async (label: string, value: string) => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      /* clipboard blocked — the value is still visible */
    }
    setCopied(label)
    window.setTimeout(() => setCopied(''), 1600)
  }

  return (
    <>
      <Seo title={copy.eftSeoTitle} description={copy.eftSeoDesc} path="/checkout/eft-instructions" noindex />
      <div className="min-h-[100dvh] bg-cream py-12">
        <div className="psa-container max-w-[760px]">
          <div className="rounded-[20px] bg-espresso p-6 text-cream sm:p-10">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-amber text-espresso">
              <Landmark />
            </span>
            <p className="mono-label mt-8 !text-[10px] text-amber">{copy.eftKicker}</p>
            <h1 className="mt-4 font-serif text-[clamp(2.2rem,4.5vw,3.5rem)] font-medium leading-[1.02]">
              {copy.eftPayPrefix} {zar(state.amount)}
            </h1>
            <p className="mt-4 text-sm leading-relaxed text-cream/70">{copy.eftBody}</p>
            <div className="mt-8 overflow-hidden rounded-2xl bg-warmwhite text-espresso">
              {rows.map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 border-b border-sand px-4 py-4 last:border-0"
                >
                  <div>
                    <p className="mono-label !text-[9px] text-espresso-70">{label}</p>
                    <p
                      className={`mono-data mt-1 font-semibold ${
                        label === copy.eftReference ? 'text-lg text-clinical' : ''
                      }`}
                    >
                      {value}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyValue(label, value)}
                    className="cursor-pointer rounded-full border border-sand p-2 transition-colors hover:border-amber hover:text-amber-deep"
                    aria-label={copy.eftCopyAria.replace('{label}', label)}
                  >
                    {copied === label ? (
                      <Check className="h-4 w-4 text-clinical" />
                    ) : (
                      <Clipboard className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <Info
              icon={<Clock3 />}
              title={copy.eftPendingTitle}
              text={copy.eftPendingBody.replace('{order}', state.orderId.slice(0, 8).toUpperCase())}
            />
            <Info icon={<ShieldCheck />} title={copy.eftRefTitle} text={copy.eftRefBody} />
          </div>
          <p className="mt-8 text-center text-xs leading-relaxed text-espresso-70">{copy.eftFoot}</p>
        </div>
      </div>
    </>
  )
}

function Info({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-[20px] border border-sand bg-warmwhite p-5">
      <span className="text-clinical">{icon}</span>
      <h2 className="mt-4 font-serif text-lg font-semibold text-espresso">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-espresso-70">{text}</p>
    </div>
  )
}
