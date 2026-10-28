import { useEffect, useState } from 'react'

export type PetsPolicy = {
  policy_version: string; commission_rate_bps: number; attribution_window_days: number;
  validation_days: number; minimum_payout_cents: number; payout_frequency: string;
  repeat_order_rule: string; code_precedence: string; customer_discount_bps: number; terms_sha256: string
}
export function usePartnerProgramme() {
  const [programme, setProgramme] = useState<{ accepting_applications: boolean; financial_activation: boolean; policy: PetsPolicy | null } | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  useEffect(() => {
    let live = true
    void fetch('/api/partner-programme').then(async response => {
      if (!response.ok) throw new Error('Programme unavailable')
      return response.json()
    }).then(data => { if (live) setProgramme(data) }).catch(() => { if (live) setUnavailable(true) })
    return () => { live = false }
  }, [])
  return { programme, unavailable }
}
