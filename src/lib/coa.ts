/**
 * PSA PETS — batch → Certificate of Analysis lookup (round 6).
 *
 * Self-contained additive module. Today it serves a small SAMPLE certificate
 * dataset so the verification flow is real and testable before launch; every
 * record carries `sample: true` and the UI marks it with the honesty chip
 * ("SAMPLE CERTIFICATE — LIVE BATCH DATA ACTIVATES AT LAUNCH"). At launch the
 * same `findCertificate()` contract is backed by the lab's real records.
 *
 * The batch on every launch label is LAUNCH_BATCH (single source of truth in
 * `@/lib/data`), and the PDP buy box links here with `?batch=<batch>`.
 */

export interface Certificate {
  /** Mono batch / lot number, e.g. PTD-2026-007. */
  batch: string
  /** Catalog slug the batch belongs to. */
  productSlug: string
  /** Display product name (matches the label). */
  productName: string
  /** Mono spec row, e.g. 'BPC-157 · 250MCG · ORAL DROPS'. */
  spec: string
  /** ISO manufacturing date, displayed as-is. */
  mfgDate: string
  /** Expiry date, displayed as-is. */
  expiryDate: string
  /** Independent testing laboratory. */
  lab: string
  /** HPLC purity result, e.g. '99.4%'. */
  hplcPurity: string
  /** Heavy metals screen result (ICP-MS). */
  heavyMetals: string
  /** Endotoxin result (LAL assay). */
  endotoxin: string
  /** Microbial screen result. */
  microbial: string
  /** Net content confirmation, e.g. '30 mL ± 2%'. */
  netContent: string
  /** Analyst sign-off line. */
  analyst: string
  /** Always true for the pre-launch demo dataset. */
  sample: boolean
}

/** The demo batch printed in marketing + PDP buy box (matches LAUNCH_BATCH). */
export const DEMO_BATCH = 'PTD-2026-007'

export const SAMPLE_CERTIFICATES: Certificate[] = [
  {
    batch: 'PTD-2026-007',
    productSlug: 'bpc-157',
    productName: 'BPC-157 Oral Drops',
    spec: 'BPC-157 · 250MCG · ORAL DROPS',
    mfgDate: '2026-01-12',
    expiryDate: '2028-01-11',
    lab: 'MICROCHEM ANALYTICAL (PTY) LTD · CAPE TOWN · SANAS T0814 [SAMPLE]',
    hplcPurity: '99.4%',
    heavyMetals: 'PASS — Pb / As / Cd / Hg BELOW LOQ (ICP-MS)',
    endotoxin: '<0.05 EU/MG — PASS (LAL)',
    microbial: 'PASS — NO GROWTH (TAMC / TYMC)',
    netContent: '30 ML ± 2%',
    analyst: 'T. MOKOENA, PR.SCI.NAT. — REVIEWED & RELEASED [SAMPLE]',
    sample: true,
  },
  {
    batch: 'PTD-2026-005',
    productSlug: 'kpv',
    productName: 'KPV Gut & Skin Drops',
    spec: 'KPV · TRIPEPTIDE · ORAL DROPS',
    mfgDate: '2026-01-09',
    expiryDate: '2028-01-08',
    lab: 'MICROCHEM ANALYTICAL (PTY) LTD · CAPE TOWN · SANAS T0814 [SAMPLE]',
    hplcPurity: '99.1%',
    heavyMetals: 'PASS — Pb / As / Cd / Hg BELOW LOQ (ICP-MS)',
    endotoxin: '<0.05 EU/MG — PASS (LAL)',
    microbial: 'PASS — NO GROWTH (TAMC / TYMC)',
    netContent: '30 ML ± 2%',
    analyst: 'T. MOKOENA, PR.SCI.NAT. — REVIEWED & RELEASED [SAMPLE]',
    sample: true,
  },
  {
    batch: 'PTD-2026-006',
    productSlug: 'recovery-blend',
    productName: 'Recovery Blend (BPC-157 + TB-500)',
    spec: 'BPC-157 + TB-500 · DUAL BOTTLE SET',
    mfgDate: '2026-01-10',
    expiryDate: '2028-01-09',
    lab: 'MICROCHEM ANALYTICAL (PTY) LTD · CAPE TOWN · SANAS T0814 [SAMPLE]',
    hplcPurity: '99.2% / 98.9%',
    heavyMetals: 'PASS — Pb / As / Cd / Hg BELOW LOQ (ICP-MS)',
    endotoxin: '<0.05 EU/MG — PASS (LAL)',
    microbial: 'PASS — NO GROWTH (TAMC / TYMC)',
    netContent: '2 × 30 ML ± 2%',
    analyst: 'T. MOKOENA, PR.SCI.NAT. — REVIEWED & RELEASED [SAMPLE]',
    sample: true,
  },
  {
    batch: 'PTD-2026-003',
    productSlug: 'mobility-collagen',
    productName: 'Mobility Collagen',
    spec: 'BIOACTIVE COLLAGEN PEPTIDES · DAILY SCOOP',
    mfgDate: '2025-12-18',
    expiryDate: '2027-12-17',
    lab: 'MICROCHEM ANALYTICAL (PTY) LTD · CAPE TOWN · SANAS T0814 [SAMPLE]',
    hplcPurity: '98.7% PEPTIDE CONTENT',
    heavyMetals: 'PASS — Pb / As / Cd / Hg BELOW LOQ (ICP-MS)',
    endotoxin: 'N/A — NON-INJECTABLE NUTRITIONAL',
    microbial: 'PASS — NO GROWTH (TAMC / TYMC)',
    netContent: '300 G ± 2%',
    analyst: 'T. MOKOENA, PR.SCI.NAT. — REVIEWED & RELEASED [SAMPLE]',
    sample: true,
  },
]

/** Normalize user input: trim, uppercase, collapse spaces to single dashes. */
export function normalizeBatchInput(raw: string): string {
  return raw.trim().toUpperCase().replace(/\s+/g, '-')
}

/**
 * Exact-match certificate lookup (post-normalization). Returns null for
 * unknown batches — the UI shows the honest "not found" state with a
 * WhatsApp handoff rather than a fake result.
 */
export function findCertificate(batch: string): Certificate | null {
  const normalized = normalizeBatchInput(batch)
  if (!normalized) return null
  return SAMPLE_CERTIFICATES.find((c) => c.batch === normalized) ?? null
}
