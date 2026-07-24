/**
 * PSA PETS — "Bring your vet" one-tap pack (round 6).
 *
 * Builds a compact vet-handout record per product (compound, evidence level,
 * key citation with PMC/DOI link, dosing summary, monitoring notes), plus the
 * WhatsApp share URL and a print helper for the styled handout card rendered
 * by `<VetPack />`. Pure functions — locale-aware via `translate()` from
 * `@/lib/i18n` (no hooks), so pages can call them in event handlers too.
 */
import { CITATION_RECORDS, LAUNCH_BATCH, getProductBySlug } from '@/lib/data'
import { translate } from '@/lib/i18n'
import type { Locale } from '@/lib/i18n'

export interface VetHandout {
  slug: string
  /** Display product name. */
  product: string
  /** Mono compound/spec line. */
  compound: string
  /** Evidence-level badge, e.g. CANINE PK STUDY / PRECLINICAL. */
  evidenceLevel: string
  /** One-line evidence summary. */
  evidenceSummary: string
  /** Key citation source line (journal / PMC / DOI). */
  citation: string
  /** Verifiable external record (PubMed/PMC/DOI) — null when none exists. */
  citationUrl: string | null
  /** Weight-band dosing table summary. */
  dosingSummary: string
  /** Monitoring + safety notes for the vet. */
  monitoring: string
  /** Launch batch on the label. */
  batch: string
}

/** Preferred evidence-library record per product (falls back to catalog). */
const RECORD_ID_BY_SLUG: Record<string, string> = {
  'bpc-157': 'REC-01',
  'mobility-collagen': 'REC-02',
  kpv: 'REC-05',
  'recovery-blend': 'REC-06',
}

/** Build the vet-handout record for one catalog product (null if unknown). */
export function handoutForProduct(slug: string, locale: Locale = 'en'): VetHandout | null {
  const product = getProductBySlug(slug)
  if (!product) return null

  const recordId = RECORD_ID_BY_SLUG[product.slug]
  const record = recordId ? CITATION_RECORDS.find((r) => r.id === recordId) : undefined
  const fallback = product.citations.find((c) => !c.honesty) ?? product.citations[0]

  const isCollagen = product.slug === 'mobility-collagen'
  const dosingSummary = isCollagen
    ? translate(locale, 'vetpack.dose.scoop')
    : translate(locale, 'vetpack.dose.drops')
  const monitoring = translate(
    locale,
    product.slug === 'immune-thymogen' ? 'vetpack.mon.immune' : 'vetpack.mon.default',
  )

  return {
    slug: product.slug,
    product: product.name,
    compound: product.spec,
    evidenceLevel: record?.badge ?? fallback?.badge ?? 'EVIDENCE GRADED',
    evidenceSummary: record?.summary ?? fallback?.summary ?? '',
    citation: record?.source ?? fallback?.source ?? '',
    citationUrl: record?.sourceUrl ?? null,
    dosingSummary,
    monitoring,
    batch: LAUNCH_BATCH,
  }
}

/**
 * Compact WhatsApp handout message — product, compound, evidence level, key
 * citation link, dosing summary, monitoring notes. One message can carry a
 * whole stack (PDP = 1 product, quiz = 2–3).
 */
export function buildVetWhatsAppText(
  handouts: VetHandout[],
  locale: Locale,
  link: string,
): string {
  const blocks = handouts
    .map((h, i) =>
      translate(locale, 'vetpack.waItem', {
        n: i + 1,
        product: h.product,
        compound: h.compound,
        evidence: h.evidenceLevel,
        citation: h.citationUrl ? `${h.citation} — ${h.citationUrl}` : h.citation,
        dosing: h.dosingSummary,
        monitoring: h.monitoring,
      }),
    )
    .join('\n\n')
  return translate(locale, 'vetpack.waMsg', { items: blocks, link })
}

/** wa.me share URL (no fixed recipient — the owner picks their vet's chat). */
export function buildVetWhatsAppLink(
  handouts: VetHandout[],
  locale: Locale,
  link: string,
): string {
  return `https://wa.me/?text=${encodeURIComponent(buildVetWhatsAppText(handouts, locale, link))}`
}

/**
 * Print only the marked handout/certificate (`.psa-print-area`) instead of
 * the whole page: tags <body> with `psa-printing` (scoped print rules live in
 * index.css), prints, then untags. Existing full-page print callers are
 * untouched.
 */
export function printArea(): void {
  try {
    document.body.classList.add('psa-printing')
    window.print()
  } finally {
    window.setTimeout(() => document.body.classList.remove('psa-printing'), 0)
  }
}
