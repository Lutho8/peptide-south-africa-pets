/**
 * PSA PETS — Supabase backend client.
 *
 * The publishable key is safe for the browser (RLS is insert-only on the
 * pets tables). Env vars override the bundled fallbacks so the static build
 * works with or without a .env file.
 *
 * Graceful degradation contract: every submit helper catches its own errors.
 * On network/RLS failure the payload is queued in localStorage under
 * `psa_pets_pending_sync` and retried by `syncPendingSubmissions()` (called
 * once from Layout on mount). Callers always get a boolean — never a throw.
 */
import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const FALLBACK_URL = 'https://eutszmrsukoqqeilzrbv.supabase.co'
const FALLBACK_KEY = 'sb_publishable_TUh1vZatXhOirPVOgcllYQ_HC9DCdYr'

const SUPABASE_URL = (import.meta.env.VITE_SUPABASE_URL as string | undefined) || FALLBACK_URL
const SUPABASE_KEY =
  (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined) || FALLBACK_KEY

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
})

/* ------------------------------- row types ------------------------------ */

export interface PetsWaitlistRow {
  ticket_code: string
  owner_name: string
  email: string
  whatsapp?: string | null
  pet_type?: string | null
  pet_breed?: string | null
  pet_age?: number | null
  city?: string | null
  products?: string[]
  primary_concern?: string | null
  /** The new member's own referral code (same as ticket_code). */
  referral_code?: string | null
  /** Code captured from ?ref= — the member who shared the link. */
  referred_by?: string | null
  source?: string | null
  locale?: string | null
  consent_popia?: boolean | null
  utm?: Record<string, string> | null
  quiz_answers?: Record<string, unknown> | null
}

export interface LaunchBoxItem {
  slug: string
  qty: number
}

export interface LaunchBoxRow {
  email: string
  /** null — anon role cannot SELECT waitlist ids, so rows are unlinked. */
  waitlist_id?: string | null
  items: LaunchBoxItem[]
  subtotal_zar: number
  founding_discount_pct: number
  status: 'reserved'
}

export interface CrmLeadRow {
  email: string
  first_name: string | null
  phone: string | null
  city: string | null
  stage: 'lead'
  source_site: 'pets.peptide-south-africa.com'
  consent_email: true
  consent_whatsapp: boolean
  notes: string
}

/* --------------------------- pending-sync queue ------------------------- */

export const PENDING_SYNC_KEY = 'psa_pets_pending_sync'

type PendingItem =
  | { kind: 'waitlist'; payload: PetsWaitlistRow }
  | { kind: 'launch_box'; payload: LaunchBoxRow }
  | { kind: 'lead'; payload: CrmLeadRow }

function readPending(): PendingItem[] {
  try {
    const raw = window.localStorage.getItem(PENDING_SYNC_KEY)
    const parsed: unknown = raw ? JSON.parse(raw) : []
    return Array.isArray(parsed) ? (parsed as PendingItem[]) : []
  } catch {
    return []
  }
}

function writePending(items: PendingItem[]): void {
  try {
    if (items.length === 0) window.localStorage.removeItem(PENDING_SYNC_KEY)
    else window.localStorage.setItem(PENDING_SYNC_KEY, JSON.stringify(items))
  } catch {
    /* storage full / private mode — payload is lost, UX unaffected */
  }
}

function queuePendingSync(item: PendingItem): void {
  writePending([...readPending(), item])
}

async function flushOne(item: PendingItem): Promise<boolean> {
  try {
    if (item.kind === 'waitlist') {
      const { error } = await supabase.from('psa_pets_waitlist').insert(item.payload)
      return !error
    }
    if (item.kind === 'launch_box') {
      const { error } = await supabase.from('psa_pets_launch_box').insert(item.payload)
      return !error
    }
    const { error } = await supabase
      .from('psa_leads')
      .upsert(item.payload, { onConflict: 'email', ignoreDuplicates: true })
    return !error
  } catch {
    return false
  }
}

let syncing = false

/**
 * Retry everything queued in `psa_pets_pending_sync`. Fire-and-forget —
 * failures stay queued for the next page load. Call once on app mount.
 */
export function syncPendingSubmissions(): void {
  if (syncing || typeof window === 'undefined') return
  const pending = readPending()
  if (pending.length === 0) return
  syncing = true
  void (async () => {
    const remaining: PendingItem[] = []
    for (const item of pending) {
      const ok = await flushOne(item)
      if (!ok) remaining.push(item)
    }
    writePending(remaining)
    syncing = false
  })()
}

/* ------------------------------ submit API ------------------------------ */

/** Insert a waitlist row. Queues for retry on failure; returns success. */
export async function submitPetsWaitlist(entry: PetsWaitlistRow): Promise<boolean> {
  try {
    const { error } = await supabase.from('psa_pets_waitlist').insert(entry)
    if (!error) return true
  } catch {
    /* fall through to queue */
  }
  queuePendingSync({ kind: 'waitlist', payload: entry })
  return false
}

/** Insert a Launch Box reservation. Queues for retry on failure. */
export async function submitLaunchBox(reservation: LaunchBoxRow): Promise<boolean> {
  try {
    const { error } = await supabase.from('psa_pets_launch_box').insert(reservation)
    if (!error) return true
  } catch {
    /* fall through to queue */
  }
  queuePendingSync({ kind: 'launch_box', payload: reservation })
  return false
}

/** Upsert the CRM lead (deduped on email). Queues for retry on failure. */
export async function upsertPetsLead(lead: CrmLeadRow): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('psa_leads')
      .upsert(lead, { onConflict: 'email', ignoreDuplicates: true })
    if (!error) return true
  } catch {
    /* fall through to queue */
  }
  queuePendingSync({ kind: 'lead', payload: lead })
  return false
}

/* --------------------------- live waitlist count ------------------------ */

const COUNT_CACHE_KEY = 'psa_pets_waitlist_count_cache'
const COUNT_TTL_MS = 5 * 60 * 1000

interface CountCache {
  count: number
  at: number
}

function readCountCache(): CountCache | null {
  try {
    const raw = window.sessionStorage.getItem(COUNT_CACHE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as CountCache
    return typeof parsed?.count === 'number' ? parsed : null
  } catch {
    return null
  }
}

/** Last known real row count (0 until the first successful RPC). */
export function getCachedWaitlistCount(): number {
  return readCountCache()?.count ?? 0
}

/**
 * Real waitlist row count via the `psa_pets_waitlist_count()` RPC.
 * Cached in sessionStorage for 5 minutes; falls back to the stale cache
 * (or 0) when the RPC is unreachable.
 */
export async function fetchWaitlistCount(): Promise<number> {
  const cached = readCountCache()
  if (cached && Date.now() - cached.at < COUNT_TTL_MS) return cached.count
  try {
    const { data, error } = await supabase.rpc('psa_pets_waitlist_count')
    if (error || typeof data !== 'number') return cached?.count ?? 0
    try {
      window.sessionStorage.setItem(
        COUNT_CACHE_KEY,
        JSON.stringify({ count: data, at: Date.now() } satisfies CountCache),
      )
    } catch {
      /* sessionStorage unavailable — still return the live number */
    }
    return data
  } catch {
    return cached?.count ?? 0
  }
}

/**
 * React hook — real waitlist row count, fetched on mount (5-min cache).
 * Display as `TOTAL_WAITING + count` (marketing base + actual rows).
 */
export function useLiveWaitlistCount(): number {
  const [count, setCount] = useState<number>(() => getCachedWaitlistCount())
  useEffect(() => {
    let live = true
    void fetchWaitlistCount().then((c) => {
      if (live) setCount(c)
    })
    return () => {
      live = false
    }
  }, [])
  return count
}

/* -------------------------------- helpers ------------------------------- */

/** Collect utm_* params from the current URL (null when none present). */
export function getUtmFromUrl(): Record<string, string> | null {
  try {
    const params = new URLSearchParams(window.location.search)
    const utm: Record<string, string> = {}
    for (const key of ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content']) {
      const value = params.get(key)
      if (value) utm[key] = value
    }
    return Object.keys(utm).length > 0 ? utm : null
  } catch {
    return null
  }
}

/** WL-PTD-XXXX — same alphabet/shape as the client-side ticket codes. */
export function generateTicketCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 4; i += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `WL-PTD-${suffix}`
}
