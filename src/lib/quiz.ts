/**
 * PSA PETS — personalization quiz engine (keeps.com-style funnel).
 *
 * Self-contained module owned by the quiz page. Imports the shared catalog
 * read-only from `@/lib/data` and writes to two localStorage contracts:
 *   - `psa_pets_quiz_lead`  (mid-funnel lead capture)
 *   - `psa_pets_cart`       (cart: Array<{ slug: string; qty: number }>)
 * and dispatches `psa-cart-change` after cart writes.
 */
import { PRODUCTS } from '@/lib/data'
import type { Product } from '@/lib/data'

/* ------------------------------- Types -------------------------------- */

export type PetType = 'dog' | 'cat' | 'horse'
export type SizeBand = 'S' | 'M' | 'L' | 'XL'
export type ConcernId =
  | 'mobility'
  | 'injury'
  | 'gut'
  | 'skin'
  | 'senior'
  | 'anxiety'
  | 'prevention'

export interface QuizAnswers {
  petType: PetType
  petName: string
  breed: string
  ageYears: number
  senior: boolean
  size: SizeBand
  concerns: ConcernId[]
  supplements: string
  hasVet: boolean
}

/* --------------------------- Option constants ------------------------- */

export interface PetTypeOption {
  id: PetType
  label: string
  icon: string
  tagline: string
  /** Afrikaans label (additive — `label` stays the English source of truth). */
  labelAf?: string
  /** Afrikaans tagline (additive). */
  taglineAf?: string
}

export const PET_TYPE_OPTIONS: PetTypeOption[] = [
  { id: 'dog', label: 'DOG', icon: '/icon-dog.svg', tagline: 'The shadow that follows you room to room', labelAf: 'HOND', taglineAf: 'Die skaduwee wat jou van kamer tot kamer volg' },
  { id: 'cat', label: 'CAT', icon: '/icon-cat.svg', tagline: 'The landlord. You just pay the rent', labelAf: 'KAT', taglineAf: 'Die verhuurder. Jy betaal net die huur' },
  { id: 'horse', label: 'HORSE', icon: '/icon-horse.svg', tagline: 'The athlete with hooves', labelAf: 'PERD', taglineAf: 'Die atleet met hoewe' },
]

export interface SizeBandOption {
  id: SizeBand
  range: string
  note: string
  /** Afrikaans range label (additive). */
  rangeAf?: string
  /** Afrikaans note (additive). */
  noteAf?: string
}

const PET_SIZE_BANDS: SizeBandOption[] = [
  { id: 'S', range: 'UNDER 10KG', note: 'Toy breeds, cats, the pocket rockets', rangeAf: 'ONDER 10KG', noteAf: 'Speelgoedrasse, katte, die sak-vuurpyle' },
  { id: 'M', range: '10–25KG', note: 'Border Collies, Spaniels, most rescues', rangeAf: '10–25KG', noteAf: 'Border Collies, Spaniels, meeste plakkies' },
  { id: 'L', range: '25–45KG', note: 'Labs, Shepherds, Ridgebacks', rangeAf: '25–45KG', noteAf: 'Labs, Herdershonde, Ridgebacks' },
  { id: 'XL', range: 'OVER 45KG', note: 'Boerboel-friendly — big frames welcome here', rangeAf: 'BO 45KG', noteAf: 'Boerboel-vriendelik — groot rame is hier welkom' },
]

const HORSE_SIZE_BANDS: SizeBandOption[] = [
  { id: 'S', range: 'UNDER 200KG', note: 'Minis and Shetlands — yes, really', rangeAf: 'ONDER 200KG', noteAf: "Mini's en Shetlands — ja, regtig" },
  { id: 'M', range: '200–400KG', note: 'Ponies and light youngsters', rangeAf: '200–400KG', noteAf: 'Ponys en ligte jonges' },
  { id: 'L', range: '400–600KG', note: 'Most riding horses', rangeAf: '400–600KG', noteAf: 'Die meeste ryperde' },
  { id: 'XL', range: 'OVER 600KG', note: 'Heavy breeds and gentle giants', rangeAf: 'BO 600KG', noteAf: 'Swaar rasse en saggeaarde reuse' },
]

export function sizeBandsFor(petType: PetType | null): SizeBandOption[] {
  return petType === 'horse' ? HORSE_SIZE_BANDS : PET_SIZE_BANDS
}

export interface ConcernOption {
  id: ConcernId
  label: string
  desc: string
  /** Afrikaans label (additive). */
  labelAf?: string
  /** Afrikaans description (additive). */
  descAf?: string
}

export const CONCERN_OPTIONS: ConcernOption[] = [
  { id: 'mobility', label: 'MOBILITY / STIFFNESS', desc: 'Slow to rise, stiff after rest, hesitant on stairs', labelAf: 'MOBILITEIT / STYFHEID', descAf: 'Stadig om op te staan, styf ná rus, huiwerig op trappe' },
  { id: 'injury', label: 'INJURY RECOVERY', desc: 'Rehab, post-surgery, soft-tissue knocks', labelAf: 'BESERING-HERSTEL', descAf: 'Rehab, na operasie, sagteweefsel-knoeie' },
  { id: 'gut', label: 'GUT ISSUES', desc: 'Sensitive tummy, loose stools, picky eating', labelAf: 'DERMPROBLEME', descAf: 'Sensitiewe maag, los ontlasting, kieskeurige eet' },
  { id: 'skin', label: 'ITCHY SKIN', desc: 'Scratching, hot spots, seasonal flare-ups', labelAf: 'JEUKERIGE VEL', descAf: 'Krap, warm kolle, seisoenale opvlamming' },
  { id: 'senior', label: 'LOW ENERGY / SENIOR', desc: 'Grey muzzle, slower days, aging support', labelAf: 'LAE ENERGIE / SENIOR', descAf: 'Grys snuit, stadiger dae, verouderingsondersteuning' },
  { id: 'anxiety', label: 'ANXIETY', desc: 'Storms, fireworks, separation stress', labelAf: 'ANGS', descAf: 'Storms, vuurwerke, skeidingstres' },
  { id: 'prevention', label: 'PREVENTION / LONGEVITY', desc: 'Healthy now — and planning to keep it that way', labelAf: 'VOORKOMING / LANGLEWENDHEID', descAf: 'Nou gesond — en beplan om dit so te hou' },
]

export const MAX_CONCERNS = 3

export function concernLabel(id: ConcernId): string {
  return CONCERN_OPTIONS.find((c) => c.id === id)?.label ?? id.toUpperCase()
}

/** Locale-aware concern label (additive — `concernLabel` stays English). */
export function concernLabelLocalized(id: ConcernId, locale: 'en' | 'af'): string {
  const opt = CONCERN_OPTIONS.find((c) => c.id === id)
  if (!opt) return id.toUpperCase()
  return locale === 'af' ? (opt.labelAf ?? opt.label) : opt.label
}

/** Senior thresholds by species (dogs: 7+, cats: 10+, horses: 15+). */
export function isSenior(petType: PetType | null, ageYears: number): boolean {
  if (petType === 'cat') return ageYears >= 10
  if (petType === 'horse') return ageYears >= 15
  return ageYears >= 7
}

/* --------------------------- Rule-based engine ------------------------ */

export type EvidenceTone = 'clinical' | 'amber' | 'neutral'

export interface StackItem {
  product: Product
  /** One-line "why for {petName}" (English source of truth). */
  why: string
  /**
   * i18n key for the localized "why" line (additive — resolves via
   * `t(whyKey, { name, breed, age })`, falling back to `why` in English).
   */
  whyKey?: string
  /** Mono evidence-level badge, e.g. CANINE RCT / PRECLINICAL. */
  evidenceBadge: string
  evidenceTone: EvidenceTone
  /** Honesty line from the catalog (shown where evidence is thin). */
  honesty: string | null
  /** True when the compound's pet evidence is preclinical only. */
  preclinical: boolean
}

export interface StackResult {
  items: StackItem[]
  slugs: string[]
  /** Anxiety was selected — calming formula is still in development. */
  calming: boolean
  /** Overall honesty line, present when any item is preclinical. */
  honestyLine: string | null
  /** i18n key for the localized honesty line (additive). */
  honestyLineKey?: string
  /** Mono plan reference, e.g. PTD-8K2Q. */
  ref: string
}

const CLINICAL_BADGES = new Set(['CANINE RCT', 'CANINE PK STUDY', 'CANINE STUDY', 'CANINE DATA'])
const AMBER_BADGES = new Set(['PRECLINICAL', 'COMMUNITY PRACTICE', 'MARKET SIGNAL'])

function toneFor(badge: string): EvidenceTone {
  if (CLINICAL_BADGES.has(badge)) return 'clinical'
  if (AMBER_BADGES.has(badge)) return 'amber'
  return 'neutral'
}

function planRef(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let suffix = ''
  for (let i = 0; i < 4; i += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)]
  }
  return `PTD-${suffix}`
}

/**
 * Maps concerns + senior flag to a 2–3 product stack from the catalog.
 * Deterministic ordering: concern order → senior top-up → foundation fallback.
 */
export function buildStack(a: QuizAnswers): StackResult {
  const name = a.petName.trim() || 'your pet'
  const breed = a.breed.trim() || a.petType
  const slugs: string[] = []
  const whyBySlug = new Map<string, string>()
  const whyKeyBySlug = new Map<string, string>()

  const push = (slug: string, why: string, whyKey?: string) => {
    if (!slugs.includes(slug)) {
      slugs.push(slug)
      whyBySlug.set(slug, why)
      if (whyKey) whyKeyBySlug.set(slug, whyKey)
    }
  }

  for (const concern of a.concerns) {
    switch (concern) {
      case 'mobility':
        push(
          'mobility-collagen',
          `Published canine RCT data — the daily joint foundation for ${name}'s stiffness.`,
          'quiz.why.mc.mobility',
        )
        push(
          'bpc-157',
          `The compound SA owners ask for most — soft-tissue support for a ${a.ageYears}-year-old ${breed}.`,
          'quiz.why.bpc.mobility',
        )
        break
      case 'injury':
        push(
          'recovery-blend',
          `The rehab pairing — built for ${name}'s comeback, not the couch.`,
          'quiz.why.rb.injury',
        )
        push(
          'mobility-collagen',
          `Long-game joint support while ${name} heals.`,
          'quiz.why.mc.injury',
        )
        break
      case 'gut':
        push(
          'kpv',
          `Gut-lining support for ${name}'s sensitive system — one dropper a day.`,
          'quiz.why.kpv.gut',
        )
        break
      case 'skin':
        push(
          'kpv',
          `Skin-flare support from the inside out, dosed for ${name}.`,
          'quiz.why.kpv.skin',
        )
        break
      case 'senior':
        push(
          'immune-thymogen',
          `Senior-grade immune support for ${name}'s grey-muzzle years.`,
          'quiz.why.it.senior',
        )
        push(
          'mobility-collagen',
          `Keeps the daily foundation under an aging frame.`,
          'quiz.why.mc.senior',
        )
        break
      case 'anxiety':
        /* No calming product yet — handled via the in-development note. */
        break
      case 'prevention':
        push(
          'mobility-collagen',
          `Prevention done properly — the evidence-backed daily habit.`,
          'quiz.why.mc.prevention',
        )
        push(
          'immune-thymogen',
          `Resilience support before ${name} ever needs it.`,
          'quiz.why.it.prevention',
        )
        break
    }
  }

  // Age-based senior flag tops up immune support (e.g. dog 7+).
  if (a.senior) {
    push(
      'immune-thymogen',
      `Age ${a.ageYears} puts ${name} in our senior protocol — immune resilience matters now.`,
      'quiz.why.it.age',
    )
  }

  const calming = a.concerns.includes('anxiety')

  // Fallback when nothing concrete mapped (e.g. anxiety-only selections).
  if (slugs.length === 0) {
    push(
      'mobility-collagen',
      `The everyday foundation — published canine RCT data behind every tub.`,
      'quiz.why.mc.fallback',
    )
    push(
      'immune-thymogen',
      `Gentle daily resilience support while our calming formula is in development.`,
      'quiz.why.it.fallback',
    )
  }

  const finalSlugs = slugs.slice(0, 3)

  const items: StackItem[] = finalSlugs
    .map((slug) => {
      const product = PRODUCTS.find((p) => p.slug === slug)
      if (!product) return null
      const badge = product.citations[0]?.badge ?? 'EVIDENCE GRADED'
      const honesty = product.citations.find((c) => c.honesty)?.summary ?? null
      const preclinical = product.citations.some((c) => c.badge === 'PRECLINICAL')
      const whyKey = whyKeyBySlug.get(slug)
      return {
        product,
        why: whyBySlug.get(slug) ?? product.benefit,
        ...(whyKey ? { whyKey } : {}),
        evidenceBadge: badge,
        evidenceTone: toneFor(badge),
        honesty,
        preclinical,
      }
    })
    .filter((i): i is StackItem => i !== null)

  const honestyLine = items.some((i) => i.preclinical)
    ? `Printed plainly: part of ${name}'s stack is backed by preclinical evidence only — no canine trials yet. We publish what exists, and what doesn't. Your vet gets the full citation pack.`
    : null

  return {
    items,
    slugs: items.map((i) => i.product.slug),
    calming,
    honestyLine,
    honestyLineKey: honestyLine ? 'quiz.why.honesty' : undefined,
    ref: planRef(),
  }
}

/* --------------------------- Lead capture store ----------------------- */

export interface QuizLead {
  ownerName: string
  email: string
  whatsapp: string
  popiaConsent: boolean
  petName: string
  petType: PetType
  stack: string[]
  capturedAt: string
}

export const QUIZ_LEAD_KEY = 'psa_pets_quiz_lead'

export function saveQuizLead(lead: QuizLead): void {
  try {
    window.localStorage.setItem(QUIZ_LEAD_KEY, JSON.stringify(lead))
  } catch {
    /* storage full / private mode — funnel still completes */
  }
}

export function readQuizLead(): QuizLead | null {
  try {
    const raw = window.localStorage.getItem(QUIZ_LEAD_KEY)
    if (!raw) return null
    return JSON.parse(raw) as QuizLead
  } catch {
    return null
  }
}

/* ------------------------------ Cart contract ------------------------- */

export interface CartLine {
  slug: string
  qty: number
}

export const CART_STORAGE_KEY = 'psa_pets_cart'
export const CART_CHANGE_EVENT = 'psa-cart-change'

export function readCart(): CartLine[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (l): l is CartLine =>
        typeof l === 'object' &&
        l !== null &&
        typeof (l as CartLine).slug === 'string' &&
        typeof (l as CartLine).qty === 'number',
    )
  } catch {
    return []
  }
}

/**
 * Merges the stack into the cart (qty 1 per product, incrementing existing
 * lines), persists, and notifies any cart drawer/listener.
 */
export function addStackToCart(slugs: string[]): void {
  const cart = readCart()
  for (const slug of slugs) {
    const line = cart.find((l) => l.slug === slug)
    if (line) line.qty += 1
    else cart.push({ slug, qty: 1 })
  }
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
  } catch {
    /* storage full / private mode */
  }
  window.dispatchEvent(new CustomEvent(CART_CHANGE_EVENT))
}
