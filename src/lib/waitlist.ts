import {
  WAITLIST_BASE_COUNT,
  readWaitlist,
  writeWaitlist,
} from '@/lib/data'
import type { WaitlistTicket } from '@/lib/data'

export interface WaitlistEntry {
  name: string
  email: string
  whatsapp: string
  petType: string
  breed: string
  petAge: number
  city: string
  products: string[]
  concern: string
  queue: number
  code: string
  createdAt: string
  /** Referral code (WL-PTD-XXXX) of the member who shared the link, if any. */
  ref?: string | null
}

/**
 * STORAGE CONTRACT: the `psa_pets_waitlist` key holds canonical
 * `WaitlistTicket` records (see `@/lib/data`). `WaitlistEntry` remains the
 * UI-facing shape for the drawer/landing form; these two mappers are the
 * single conversion point both libs use, so the shapes can never drift.
 */
function ticketToEntry(t: WaitlistTicket): WaitlistEntry {
  return {
    name: t.ownerName,
    email: t.email,
    whatsapp: t.whatsapp,
    petType: t.petTypes[0] ?? 'dog',
    breed: t.breed,
    petAge: t.petAge,
    city: t.city,
    products: t.products,
    concern: t.concern,
    queue: t.queue,
    code: t.code,
    createdAt: t.createdAt,
    ...(t.ref ? { ref: t.ref } : {}),
  }
}

function entryToTicket(e: WaitlistEntry): WaitlistTicket {
  return {
    code: e.code,
    queue: e.queue,
    ownerName: e.name,
    email: e.email,
    whatsapp: e.whatsapp.replace(/\D/g, '').replace(/^27(?=\d{9}$)/, ''),
    city: e.city,
    petTypes: e.petType ? [e.petType] : [],
    petName: '',
    breed: e.breed,
    petAge: e.petAge,
    concern: e.concern,
    products: e.products,
    createdAt: e.createdAt,
    ...(e.ref ? { ref: e.ref } : {}),
  }
}

export function getWaitlistEntries(): WaitlistEntry[] {
  // readWaitlist() shape-guards and normalizes legacy records on read.
  return readWaitlist().map(ticketToEntry)
}

function randomCode(): string {
  const alphabet = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 4; i += 1) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `WL-PTD-${out}`
}

/**
 * Base queue offset so positions continue from the public counters.
 * Single-sourced from `@/lib/data` (WAITLIST_BASE_COUNT) so the two libs
 * can never drift.
 */
const QUEUE_BASE = WAITLIST_BASE_COUNT

export function addWaitlistEntry(
  data: Omit<WaitlistEntry, 'queue' | 'code' | 'createdAt'>,
): WaitlistEntry {
  const entries = getWaitlistEntries()
  const entry: WaitlistEntry = {
    ...data,
    queue: QUEUE_BASE + entries.length + 1,
    code: randomCode(),
    createdAt: new Date().toISOString(),
    // Capture the referral once, at join time (additive — old entries simply lack it).
    ref: data.ref ?? getRefFromUrl(),
  }
  // Persist in the canonical ticket shape (writeWaitlist never throws).
  writeWaitlist([...readWaitlist(), entryToTicket(entry)])
  return entry
}

export function liveWaitlistTotal(base: number): number {
  return base + getWaitlistEntries().length
}

/* -------------------- Referral boost (additive) -------------------- */

/** Simulated queue boost granted when joining via a referral link. */
export const REFERRAL_BOOST_SPOTS = 3

/** Read `?ref=WL-PTD-XXXX` from the current URL (null when absent/invalid). */
export function getRefFromUrl(): string | null {
  try {
    const ref = new URLSearchParams(window.location.search).get('ref')
    return ref && /^WL-PTD-[A-Z0-9]{4}$/.test(ref) ? ref : null
  } catch {
    return null
  }
}

/** Read `?product=<slug>` from the current URL (null when absent). */
export function getProductFromUrl(): string | null {
  try {
    const slug = new URLSearchParams(window.location.search).get('product')
    return slug && slug.length > 0 ? slug : null
  } catch {
    return null
  }
}

/** Shareable referral link for a confirmed member. */
export function buildReferralLink(code: string): string {
  return `${window.location.origin}/pets?ref=${encodeURIComponent(code)}`
}

/** WhatsApp share URL pre-filled with the member's referral link. */
export function buildReferralWhatsAppLink(code: string, firstName: string): string {
  const link = buildReferralLink(code)
  const text =
    `${firstName} here — I've joined the PSA PETS founding waitlist (COA-verified pet peptides, ` +
    `launching in SA). Use my link and we both move up the queue: ${link}`
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

/** How many entries a given code has referred (local simulation). */
export function referralCountFor(code: string): number {
  return getWaitlistEntries().filter((e) => e.ref === code).length
}

/**
 * Effective queue position after referral boosts.
 * Joining via a ref link grants an immediate boost; each friend who joins via
 * your link bumps you 3 more spots (simulated locally).
 */
export function effectiveQueue(entry: WaitlistEntry): number {
  const joinBoost = entry.ref ? REFERRAL_BOOST_SPOTS : 0
  const shareBoost = referralCountFor(entry.code) * REFERRAL_BOOST_SPOTS
  return Math.max(1, entry.queue - joinBoost - shareBoost)
}
