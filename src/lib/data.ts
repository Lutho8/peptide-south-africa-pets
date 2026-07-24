export interface Citation {
  badge: string
  summary: string
  source?: string
  honesty?: boolean
}

export interface Product {
  slug: string
  name: string
  spec: string
  benefit: string
  price: string
  waiting: number
  image: string
  citations: Citation[]
  firstToLaunch?: boolean
}

export const PRODUCTS: Product[] = [
  {
    slug: 'bpc-157',
    name: 'BPC-157 Oral Drops',
    spec: 'BPC-157 · ORAL DROPS · 30-DAY SUPPLY',
    benefit: 'Mobility, soft-tissue & recovery support for dogs and cats.',
    price: 'FROM R895/MONTH',
    waiting: 438,
    image: '/product-bpc157.png',
    citations: [
      {
        badge: 'CANINE PK STUDY',
        summary:
          'In a 6-beagle pharmacokinetic study (2022), BPC-157 showed 45–51% intramuscular bioavailability and was well tolerated.',
        source: 'FRONT PHARMACOL 2022 · PMC9794587',
      },
      {
        badge: 'MARKET SIGNAL',
        summary:
          "US brands (e.g. Integrative Peptides' PetTides) sell BPC-157 pet sprays at $99–$149 — demand is established.",
        source: 'MARKET RESEARCH 2025',
      },
      {
        badge: 'HONESTY',
        summary:
          "No pet peptide is FDA/SAHPRA approved. We publish what exists — and what doesn't.",
        honesty: true,
      },
    ],
  },
  {
    slug: 'kpv',
    name: 'KPV Gut & Skin Drops',
    spec: 'KPV · ORAL DROPS · 30-DAY SUPPLY',
    benefit: 'Gut lining and skin support for sensitive pets.',
    price: 'FROM R795/MONTH',
    waiting: 212,
    image: '/product-kpv.png',
    citations: [
      {
        badge: 'PRECLINICAL',
        summary: 'KPV reduced intestinal inflammation in mouse colitis models.',
        source: 'PRECLINICAL RESEARCH',
      },
      {
        badge: 'HONESTY',
        summary: "No canine trials exist yet for KPV. We'll say that plainly.",
        honesty: true,
      },
    ],
  },
  {
    slug: 'recovery-blend',
    name: 'Recovery Blend (BPC-157 + TB-500)',
    spec: 'BPC-157 + TB-500 · DROPS · 30-DAY SUPPLY',
    benefit: "The 'Wolverine pairing' for injury rehab and post-surgery support.",
    price: 'FROM R1,195/MONTH',
    waiting: 301,
    image: '/product-recovery.png',
    citations: [
      {
        badge: 'COMMUNITY PRACTICE',
        summary:
          'US liquid blends (e.g. Protex Pets: BPC-157 250mcg + TB-500 100mcg, $64.99/30 servings) popularized this pairing.',
        source: 'MARKET RESEARCH 2025',
      },
      {
        badge: 'HONESTY',
        summary:
          'TB-500 has no canine efficacy trials. This pairing is community practice, not proven therapy.',
        honesty: true,
      },
    ],
  },
  {
    slug: 'immune-thymogen',
    name: 'Immune (Thymogen)',
    spec: 'THYMOGEN · ORAL DROPS · 30-DAY SUPPLY',
    benefit: 'Immune resilience support for seniors and frequent patients.',
    price: 'FROM R845/MONTH',
    waiting: 126,
    image: '/product-immune.png',
    citations: [
      {
        badge: 'MARKET SIGNAL',
        summary:
          'Thymic peptides (e.g. PetTides Immune-Peptide-A2) are established in US pet peptide catalogs.',
        source: 'MARKET RESEARCH 2025',
      },
      {
        badge: 'HONESTY',
        summary: 'Canine evidence is preliminary; veterinary guidance advised.',
        honesty: true,
      },
    ],
  },
  {
    slug: 'mobility-collagen',
    name: 'Mobility Collagen',
    spec: 'BIOACTIVE COLLAGEN PEPTIDES · DAILY SCOOP',
    benefit: 'The compliant lane: published canine RCT evidence behind every tub.',
    price: 'FROM R395/TUB',
    waiting: 127,
    image: '/product-collagen.png',
    firstToLaunch: true,
    citations: [
      {
        badge: 'CANINE RCT',
        summary:
          'In a 2024 randomized controlled trial (31 dogs, 12 weeks), bioactive collagen peptides (PETAGILE®) improved objective force-plate gait measures vs control.',
        source: 'PLOS ONE 2024',
      },
      {
        badge: 'CANINE STUDY',
        summary:
          'Undenatured type-II collagen (UC-II) matched robenacoxib on force-plate outcomes in canine osteoarthritis studies.',
        source: 'CANINE OA RESEARCH',
      },
      {
        badge: 'CALMING TRIALS',
        summary: 'αs1-casozepine showed placebo-controlled calming effects in cats and dogs.',
        source: 'VETERINARY BEHAVIOUR RESEARCH',
      },
    ],
  },
]

export const TOTAL_WAITING = PRODUCTS.reduce((sum, p) => sum + p.waiting, 0)

/* ================= Product detail page extras (additive) ================= */

export interface ProductDetail {
  /** One-liner under the H1 on the PDP. */
  headline: string
  /** Strikethrough anchor price, e.g. 'R1,050'. */
  estRetail: string
  /** Monthly autoship price (15% off), e.g. 'R760/MO'. */
  subPrice: string
  /** One-time price, e.g. 'R895'. */
  oneTimePrice: string
  /** Avg. new waitlist signups per day (mono readout). */
  avgPerDay: number
  /** Contextual lifestyle image for the "for scale" gallery tile. */
  scaleImage: string
  /** Benefit-bar pairs: mono label + serif line. */
  benefits: [string, string][]
  /** How-it-works steps (3). */
  steps: { title: string; body: string }[]
  /** Expanded citation records for the PDP evidence section. */
  fullCitations: Citation[]
  /** Short tagline used on related-product cards. */
  pairNote: string
}

const DROP_STEPS = [
  {
    title: 'One dropper daily',
    body: 'Flavourless drops onto food or directly into the mouth. No pills, no wrestling.',
  },
  {
    title: 'Every batch verified',
    body: 'Each lot is HPLC tested to ≥99% purity; the COA ships in the box and lives online.',
  },
  {
    title: 'Vet-reviewed protocol',
    body: 'Dosing guidance by weight class, written with veterinarians. Bring it to your next check-up.',
  },
]

export const PRODUCT_DETAILS: Record<string, ProductDetail> = {
  'bpc-157': {
    headline:
      'Mobility, soft-tissue & recovery support for dogs and cats — the compound SA pet owners ask us about most.',
    estRetail: 'R1,050',
    subPrice: 'R760/MO',
    oneTimePrice: 'R895',
    avgPerDay: 12,
    scaleImage: '/dog-portrait-2.png',
    benefits: [
      ['MOBILITY', 'comfortable movement'],
      ['RECOVERY', 'soft-tissue repair support'],
      ['GUT', 'lining integrity support'],
      ['SENIORS', 'formulated with aging pets in mind'],
    ],
    steps: DROP_STEPS,
    fullCitations: [
      {
        badge: 'CANINE PK STUDY',
        summary:
          'In a 2022 pharmacokinetic study in six beagle dogs, BPC-157 demonstrated 45–51% intramuscular bioavailability and was well tolerated across doses.',
        source: 'FRONT PHARMACOL 2022 · PMC9794587',
      },
      {
        badge: 'MARKET SIGNAL',
        summary:
          "US pet peptide brands (e.g. Integrative Peptides' PetTides BPC-157, $99–$149) and reporting in Men's Health (2026) reflect established consumer demand for BPC-157 in pets.",
        source: 'MARKET & MEDIA RESEARCH 2025–26',
      },
      {
        badge: 'HONESTY NOTE',
        summary:
          "No pet peptide product — including ours — is FDA or SAHPRA approved. BPC-157's canine efficacy trials are still limited; pharmacokinetic data establishes tolerability, not proven outcomes. Consult your veterinarian.",
        honesty: true,
      },
    ],
    pairNote: 'The one they ask for by name',
  },
  kpv: {
    headline:
      'Gut lining and skin support for sensitive pets — calm tummies, calmer skin, one dropper a day.',
    estRetail: 'R940',
    subPrice: 'R676/MO',
    oneTimePrice: 'R795',
    avgPerDay: 6,
    scaleImage: '/cat-portrait-1.png',
    benefits: [
      ['GUT', 'lining integrity support'],
      ['SKIN', 'itch & flare support'],
      ['SENSITIVE', 'gentle daily dosing'],
      ['CATS', 'formulated for fussy eaters'],
    ],
    steps: DROP_STEPS,
    fullCitations: [
      {
        badge: 'PRECLINICAL',
        summary:
          'In mouse colitis models, the tripeptide KPV reduced intestinal inflammation and supported mucosal healing — the basis for its gut-lining reputation.',
        source: 'PRECLINICAL GI RESEARCH',
      },
      {
        badge: 'MARKET SIGNAL',
        summary:
          'KPV appears across US pet peptide catalogs positioned for gut and skin support, reflecting established consumer demand ahead of formal trials.',
        source: 'MARKET RESEARCH 2025',
      },
      {
        badge: 'HONESTY NOTE',
        summary:
          'No canine efficacy trials exist yet for KPV. The evidence is preclinical and we say so plainly. Consult your veterinarian before any new supplement.',
        honesty: true,
      },
    ],
    pairNote: 'Gut & skin',
  },
  'recovery-blend': {
    headline:
      "The 'Wolverine pairing' — BPC-157 + TB-500 for injury rehab, post-surgery support and active dogs.",
    estRetail: 'R1,410',
    subPrice: 'R1,016/MO',
    oneTimePrice: 'R1,195',
    avgPerDay: 9,
    scaleImage: '/dog-portrait-2.png',
    benefits: [
      ['INJURY', 'rehab & post-surgery support'],
      ['MOBILITY', 'comfortable movement'],
      ['RECOVERY', 'two-compound pairing'],
      ['ACTIVE', 'for working & sport dogs'],
    ],
    steps: [
      {
        title: 'Two droppers daily',
        body: 'One of each formula onto food or directly into the mouth. No pills, no wrestling.',
      },
      DROP_STEPS[1],
      DROP_STEPS[2],
    ],
    fullCitations: [
      {
        badge: 'COMMUNITY PRACTICE',
        summary:
          'US liquid blends (e.g. Protex Pets: BPC-157 250mcg + TB-500 100mcg, $64.99 / 30 servings) popularized this pairing among performance and rehab communities.',
        source: 'MARKET RESEARCH 2025',
      },
      {
        badge: 'CANINE PK STUDY',
        summary:
          'The BPC-157 half of this blend carries 2022 beagle pharmacokinetic data: 45–51% intramuscular bioavailability, well tolerated across doses.',
        source: 'FRONT PHARMACOL 2022 · PMC9794587',
      },
      {
        badge: 'HONESTY NOTE',
        summary:
          'TB-500 has no canine efficacy trials. This pairing is community practice, not proven therapy. Consult your veterinarian — especially post-surgery.',
        honesty: true,
      },
    ],
    pairNote: 'The Wolverine pairing',
  },
  'immune-thymogen': {
    headline:
      'Immune resilience support for seniors and frequent patients — the thymic peptide lane.',
    estRetail: 'R995',
    subPrice: 'R718/MO',
    oneTimePrice: 'R845',
    avgPerDay: 4,
    scaleImage: '/dog-portrait-1.png',
    benefits: [
      ['IMMUNE', 'resilience support'],
      ['SENIORS', 'aging immune systems'],
      ['RECOVERY', 'bounce-back support'],
      ['VET-GUIDED', 'protocol reviewed by vets'],
    ],
    steps: DROP_STEPS,
    fullCitations: [
      {
        badge: 'MARKET SIGNAL',
        summary:
          'Thymic peptides (e.g. PetTides Immune-Peptide-A2) are established in US pet peptide catalogs for immune resilience positioning.',
        source: 'MARKET RESEARCH 2025',
      },
      {
        badge: 'HONESTY NOTE',
        summary:
          'Canine evidence for Thymogen is preliminary; veterinary guidance advised, particularly for pets on existing medication.',
        honesty: true,
      },
    ],
    pairNote: 'Senior resilience',
  },
  'mobility-collagen': {
    headline:
      'The compliant lane: bioactive collagen peptides with published canine RCT evidence behind every tub.',
    estRetail: 'R465',
    subPrice: 'R336/MO',
    oneTimePrice: 'R395',
    avgPerDay: 8,
    scaleImage: '/dog-portrait-1.png',
    benefits: [
      ['JOINTS', 'cartilage & mobility support'],
      ['EVIDENCE', 'published canine RCT'],
      ['DAILY', 'one scoop on food'],
      ['FIRST', 'first PSA PETS launch'],
    ],
    steps: [
      {
        title: 'One scoop daily',
        body: 'Bioactive peptides stirred over breakfast. Most dogs think it is part of the meal.',
      },
      DROP_STEPS[1],
      DROP_STEPS[2],
    ],
    fullCitations: [
      {
        badge: 'CANINE RCT',
        summary:
          'In a 2024 randomized controlled trial (31 dogs, 12 weeks), bioactive collagen peptides (PETAGILE®) improved objective force-plate gait measures vs control.',
        source: 'PLOS ONE 2024',
      },
      {
        badge: 'CANINE STUDY',
        summary:
          'Undenatured type-II collagen (UC-II) matched robenacoxib — a registered NSAID — on force-plate outcomes in canine osteoarthritis studies.',
        source: 'CANINE OA RESEARCH',
      },
      {
        badge: 'HONESTY NOTE',
        summary:
          'Collagen is a nutritional supplement, not a veterinary medicine. It supports joint health; it does not replace diagnosis or treatment. Consult your veterinarian.',
        honesty: true,
      },
    ],
    pairNote: 'First to launch',
  },
}

/** PDP lookup — tolerates the design-doc alias `immune` for `immune-thymogen`. */
export function getProductBySlug(slug?: string): Product | undefined {
  if (!slug) return undefined
  const normalized = slug === 'immune' ? 'immune-thymogen' : slug
  return PRODUCTS.find((p) => p.slug === normalized)
}

export function getProductDetail(slug?: string): ProductDetail | undefined {
  const product = getProductBySlug(slug)
  return product ? PRODUCT_DETAILS[product.slug] : undefined
}

export const WHATSAPP_NUMBER = '27790000000'

export function waLink(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
// PSA PETS — shared catalog + waitlist data layer.
// Additive module: safe, self-contained exports used by the science &
// waitlist pages. No side effects on import.

export interface PetProduct {
  slug: string;
  name: string;
  /** Mono spec row, e.g. "BPC-157 · 250MCG · ORAL DROPS" */
  spec: string;
  benefit: string;
  /** ZAR, VAT included */
  price: number;
  priceUnit: string;
  waiting: number;
  image: string;
  firstToLaunch?: boolean;
  /** Pipeline formula — waitlist-only, not part of the launch catalog. */
  comingSoon?: boolean;
}

export const PET_PRODUCTS: PetProduct[] = [
  {
    slug: 'bpc-157',
    name: 'BPC-157 Oral Drops',
    spec: 'BPC-157 · 250MCG · ORAL DROPS',
    benefit: 'Repair & mobility support for joints, tendons and gut lining.',
    price: 895,
    priceUnit: '/MO',
    waiting: 438,
    image: '/product-bpc157.png',
  },
  {
    slug: 'kpv',
    name: 'KPV Gut & Skin Drops',
    spec: 'KPV · TRIPEPTIDE · ORAL DROPS',
    benefit: 'Calms gut inflammation and reactive skin from the inside out.',
    price: 795,
    priceUnit: '/MO',
    waiting: 212,
    image: '/product-kpv.png',
  },
  {
    slug: 'recovery-blend',
    name: 'Recovery Blend',
    spec: 'BPC-157 + TB-500 · DUAL BOTTLE SET',
    benefit: 'The post-injury pairing — built for comebacks, not cages.',
    price: 1195,
    priceUnit: '/MO',
    waiting: 301,
    image: '/product-recovery.png',
  },
  {
    slug: 'immune-thymogen',
    name: 'Immune (Thymogen)',
    spec: 'THYMOGEN · IMMUNE PEPTIDE · ORAL DROPS',
    benefit: 'Senior-grade immune support for the grey-muzzle years.',
    price: 845,
    priceUnit: '/MO',
    waiting: 126,
    image: '/product-immune.png',
  },
  {
    slug: 'mobility-collagen',
    name: 'Mobility Collagen',
    spec: 'BIOACTIVE COLLAGEN PEPTIDES · DAILY SCOOP',
    benefit: 'Force-plate-proven joint support — the everyday foundation.',
    price: 395,
    priceUnit: '/TUB',
    waiting: 127,
    image: '/product-collagen.png',
    firstToLaunch: true,
  },
  /* ---------- Protocol pipeline (additive, waitlist-only teasers) ---------- */
  {
    slug: 'calm',
    name: 'PSA PETS Calm',
    spec: 'SELANK · CALMING BLEND · IN DEVELOPMENT',
    benefit: 'Calming support for storm-shakes, fireworks and separation stress.',
    price: 695,
    priceUnit: '/MO',
    waiting: 64,
    image: '/product-kpv.png',
    comingSoon: true,
  },
  {
    slug: 'immune-plus',
    name: 'PSA PETS Immune+',
    spec: 'TA-1 + KPV + GHK-CU · IN DEVELOPMENT',
    benefit: 'The immune-resilience stack for seniors and frequent patients.',
    price: 945,
    priceUnit: '/MO',
    waiting: 47,
    image: '/product-immune.png',
    comingSoon: true,
  },
  {
    slug: 'senior-vitality',
    name: 'PSA PETS Senior Vitality',
    spec: 'LONGEVITY BLEND · IN DEVELOPMENT',
    benefit: 'A longevity blend built around canine aging research.',
    price: 1095,
    priceUnit: '/MO',
    waiting: 89,
    image: '/product-bpc157.png',
    comingSoon: true,
  },
];

export function formatZAR(n: number): string {
  return `R${n.toLocaleString('en-ZA').replace(/,/g, ',')}`;
}

/* ------------------------------ Waitlist ------------------------------ */

export const WAITLIST_STORAGE_KEY = 'psa_pets_waitlist';
/** Sum of the five per-product counters — the public "owners waiting" base. */
export const WAITLIST_BASE_COUNT = PET_PRODUCTS.reduce((s, p) => s + p.waiting, 0);
/** PSA WhatsApp business line (placeholder — swap for the live number). */

export const PET_TYPES = [
  { id: 'dog', label: 'DOG', icon: '/icon-dog.svg' },
  { id: 'cat', label: 'CAT', icon: '/icon-cat.svg' },
  { id: 'horse', label: 'HORSE', icon: '/icon-horse.svg' },
  { id: 'other', label: 'OTHER', icon: null },
] as const;

export const CITIES = [
  'Cape Town',
  'Johannesburg',
  'Durban',
  'Pretoria',
  'Gqeberha',
  'Bloemfontein',
  'Other',
] as const;

export interface ConcernOption {
  id: string;
  label: string;
  /** Mono recommendation line shown on selection. */
  recommendation: string;
  /** Product slugs pre-checked in step 3. */
  products: string[];
}

export const CONCERNS: ConcernOption[] = [
  { id: 'mobility', label: 'MOBILITY', recommendation: 'RECOMMENDED: BPC-157 + COLLAGEN', products: ['bpc-157', 'mobility-collagen'] },
  { id: 'injury', label: 'INJURY / RECOVERY', recommendation: 'RECOMMENDED: RECOVERY BLEND', products: ['recovery-blend', 'bpc-157'] },
  { id: 'gut', label: 'GUT', recommendation: 'RECOMMENDED: KPV', products: ['kpv'] },
  { id: 'skin', label: 'SKIN', recommendation: 'RECOMMENDED: KPV', products: ['kpv'] },
  { id: 'anxiety', label: 'ANXIETY', recommendation: 'CALMING: IN DEVELOPMENT — JOIN TO HEAR FIRST', products: [] },
  { id: 'longevity', label: 'LONGEVITY / SENIOR CARE', recommendation: 'RECOMMENDED: IMMUNE + COLLAGEN', products: ['immune-thymogen', 'mobility-collagen'] },
];

export interface WaitlistTicket {
  code: string;
  queue: number;
  ownerName: string;
  email: string;
  /** SA local digits after +27 */
  whatsapp: string;
  city: string;
  petTypes: string[];
  petName: string;
  breed: string;
  petAge: number;
  concern: string;
  products: string[];
  createdAt: string;
  /** Referral code of the member who shared the link, if any (additive). */
  ref?: string | null;
}

export function generateTicketCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 4; i += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return `WL-PTD-${suffix}`;
}

/**
 * Shape-guard + normalize one stored waitlist record.
 *
 * Two writers have historically shared the `psa_pets_waitlist` key:
 * the funnel (`WaitlistTicket`: ownerName / petTypes[]) and the drawer &
 * landing form (`WaitlistEntry`: name / petType). This accepts BOTH shapes —
 * plus anything in between — and always returns a complete WaitlistTicket,
 * so a legacy entry can never crash a render. Returns null for junk.
 */
export function normalizeWaitlistTicket(raw: unknown): WaitlistTicket | null {
  if (typeof raw !== 'object' || raw === null) return null;
  const r = raw as Record<string, unknown>;

  const str = (v: unknown): string => (typeof v === 'string' ? v : '');
  const strArr = (v: unknown): string[] =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === 'string') : [];
  const num = (v: unknown, fallback: number): number =>
    typeof v === 'number' && Number.isFinite(v) ? v : fallback;

  // ownerName (ticket shape) falls back to name (entry shape).
  const ownerName = str(r.ownerName) || str(r.name);
  const email = str(r.email);
  const code = str(r.code);
  // A record with no identity at all is not a ticket — drop it.
  if (!ownerName && !email && !code) return null;

  // petTypes (ticket) falls back to [petType] (entry).
  const petTypes = strArr(r.petTypes);
  const singlePetType = str(r.petType);
  // WhatsApp: entries may carry "+27…" — tickets store local 9 digits.
  const whatsappDigits = str(r.whatsapp).replace(/\D/g, '');
  const whatsapp =
    whatsappDigits.length === 11 && whatsappDigits.startsWith('27')
      ? whatsappDigits.slice(2)
      : whatsappDigits;

  return {
    code: code || 'WL-PTD-XXXX',
    queue: num(r.queue, WAITLIST_BASE_COUNT + 1),
    ownerName,
    email,
    whatsapp,
    city: str(r.city),
    petTypes: petTypes.length > 0 ? petTypes : singlePetType ? [singlePetType] : [],
    petName: str(r.petName),
    breed: str(r.breed),
    petAge: num(r.petAge, 0),
    concern: str(r.concern),
    products: strArr(r.products),
    createdAt: str(r.createdAt) || new Date().toISOString(),
    ...(typeof r.ref === 'string' ? { ref: r.ref } : {}),
  };
}

/**
 * Read the waitlist store, normalizing legacy `WaitlistEntry` records into
 * the canonical `WaitlistTicket` shape. If any record needed normalization,
 * the migrated array is written back once so the store converges.
 * Never throws; junk records are dropped.
 */
export function readWaitlist(): WaitlistTicket[] {
  try {
    const raw = window.localStorage.getItem(WAITLIST_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    let migrated = false;
    const out: WaitlistTicket[] = [];
    for (const item of parsed) {
      const t = normalizeWaitlistTicket(item);
      if (!t) {
        migrated = true; // junk dropped
        continue;
      }
      // Detect legacy shape (missing ownerName/petTypes) to trigger write-back.
      const rec = item as Record<string, unknown>;
      if (typeof rec.ownerName !== 'string' || !Array.isArray(rec.petTypes)) migrated = true;
      out.push(t);
    }
    if (migrated && out.length > 0) writeWaitlist(out);
    return out;
  } catch {
    return [];
  }
}

export function writeWaitlist(entries: WaitlistTicket[]): void {
  try {
    window.localStorage.setItem(WAITLIST_STORAGE_KEY, JSON.stringify(entries));
  } catch {
    /* storage full / private mode — confirmation still renders */
  }
}

/** Duplicate detection: same email or same WhatsApp number keeps its ticket. */
export function findExistingTicket(
  entries: WaitlistTicket[],
  email: string,
  whatsapp: string,
): WaitlistTicket | null {
  const normalEmail = email.trim().toLowerCase();
  const normalPhone = whatsapp.replace(/\D/g, '');
  return (
    entries.find(
      (t) =>
        t.email.trim().toLowerCase() === normalEmail ||
        (normalPhone.length > 0 && t.whatsapp.replace(/\D/g, '') === normalPhone),
    ) ?? null
  );
}

export function buildWhatsAppLink(ticket: WaitlistTicket): string {
  const productNames = ticket.products
    .map((slug) => PET_PRODUCTS.find((p) => p.slug === slug)?.name ?? slug)
    .join(', ');
  const text = [
    `Hi PSA PETS — confirming my waitlist ticket.`,
    `Name: ${ticket.ownerName}`,
    `Pet: ${ticket.petName || '—'}${ticket.breed ? ` (${ticket.breed})` : ''}`,
    `Products: ${productNames || 'Everything'}`,
    `Code: ${ticket.code} · Queue #${String(ticket.queue).padStart(4, '0')}`,
  ].join('\n');
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/* --------------------------- Science library --------------------------- */

export type EvidenceTone = 'clinical' | 'amber' | 'alert';

export interface CitationRecord {
  id: string;
  badge: string;
  tone: EvidenceTone;
  /** Mono compound chip label; null = no chip. */
  chip: string | null;
  /** Product slug the chip links to; null = not a catalog product. */
  chipSlug: string | null;
  summary: string;
  source: string;
  /** Verifiable external record (PubMed/PMC/DOI/publisher). Null = no public record. */
  sourceUrl?: string | null;
}

export const CITATION_RECORDS: CitationRecord[] = [
  {
    id: 'REC-01',
    badge: 'CANINE PK STUDY',
    tone: 'clinical',
    chip: 'BPC-157',
    chipSlug: 'bpc-157',
    summary:
      'BPC-157 demonstrated 45–51% intramuscular bioavailability in six beagle dogs and was well tolerated across the doses tested, with no adverse findings reported.',
    source: 'FRONTIERS IN PHARMACOLOGY 2022 · PMC9794587 · N=6 BEAGLES',
    sourceUrl: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9794587/',
  },
  {
    id: 'REC-02',
    badge: 'CANINE RCT',
    tone: 'clinical',
    chip: 'MOBILITY COLLAGEN',
    chipSlug: 'mobility-collagen',
    summary:
      'In a 2024 randomized, placebo-controlled trial of 31 dogs with osteoarthritis, daily bioactive collagen peptides (PETAGILE®) produced statistically significant improvement in objective force-plate gait measures over 12 weeks versus control.',
    source: 'PLOS ONE 2024 · N=31 DOGS · 12 WEEKS · FORCE-PLATE ENDPOINTS',
    sourceUrl: 'https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0308378',
  },
  {
    id: 'REC-03',
    badge: 'CANINE DATA',
    tone: 'clinical',
    chip: 'MOBILITY COLLAGEN',
    chipSlug: 'mobility-collagen',
    summary:
      'Undenatured type-II collagen (UC-II) matched the NSAID robenacoxib on force-plate outcomes in canine osteoarthritis studies — a rare head-to-head against a registered veterinary drug.',
    source: 'CANINE OA FORCE-PLATE STUDIES · UC-II VS ROBENACOXIB',
  },
  {
    id: 'REC-04',
    badge: 'CANINE DATA',
    tone: 'clinical',
    chip: 'FUTURE: CALMING',
    chipSlug: null,
    summary:
      'αs1-casozepine, a milk-derived peptide, showed placebo-controlled calming effects in both cats and dogs across multiple veterinary behavior trials.',
    source: 'PLACEBO-CONTROLLED CALMING TRIALS · CATS & DOGS',
  },
  {
    id: 'REC-05',
    badge: 'PRECLINICAL',
    tone: 'amber',
    chip: 'KPV',
    chipSlug: 'kpv',
    summary:
      'The tripeptide KPV reduced intestinal inflammation in mouse models of colitis via PepT1-mediated uptake. No canine trials have been published — we grade this accordingly.',
    source: 'MOUSE COLITIS MODELS · PRECLINICAL',
  },
  {
    id: 'REC-06',
    badge: 'COMMUNITY PRACTICE',
    tone: 'amber',
    chip: 'RECOVERY BLEND',
    chipSlug: 'recovery-blend',
    summary:
      "The BPC-157 + TB-500 pairing ('Wolverine stack') is widespread in US pet products (e.g. Protex Pets: BPC-157 250mcg + TB-500 100mcg, $64.99/30 servings). TB-500 has no published canine efficacy trials; this pairing is community practice, not proven therapy.",
    source: 'MARKET RESEARCH 2025 · PROTEX PETS · PETTIDES',
  },
  {
    id: 'REC-07',
    badge: 'DEMAND PROOF',
    tone: 'clinical',
    chip: 'WHY WE EXIST',
    chipSlug: null,
    summary:
      'Loyal (loyal.com) is running the largest canine aging study in history — 1,317 dogs enrolled across 70 US veterinary practices — validating that pet owners will invest in longevity science for their animals.',
    source: 'LOYAL STAY TRIAL · 1,317 DOGS · 70 PRACTICES',
    sourceUrl: 'https://loyal.com/',
  },
  {
    id: 'REC-08',
    badge: 'MARKET SIGNAL',
    tone: 'amber',
    chip: 'BPC-157',
    chipSlug: 'bpc-157',
    summary:
      "US pet peptide retail pricing of $99–$149/month (Integrative Peptides PetTides) and mainstream media coverage (Men's Health, 2026) indicate established, growing demand — at prices PSA PETS will undercut locally.",
    source: 'MARKET & MEDIA RESEARCH 2025–26',
  },
];

export const COMPLIANCE_LINE =
  'ALL PSA PETS PRODUCTS ARE IN DEVELOPMENT AND NOT YET AVAILABLE FOR SALE · THESE ARE NOT VETERINARY MEDICINES · NO PET PEPTIDE PRODUCT IS FDA OR SAHPRA APPROVED · ALWAYS CONSULT YOUR VETERINARIAN';

/* --------------------- Launch Box cart meta (additive) --------------------- */

/**
 * Mono batch number printed on each launch label (display only).
 * Single source of truth — one launch batch across the catalog so the PDP
 * chip, cart drawer and label art can never disagree.
 */
export const LAUNCH_BATCH = 'PTD-2026-007'

export const BATCH_BY_SLUG: Record<string, string> = Object.fromEntries(
  PET_PRODUCTS.filter((p) => !p.comingSoon).map((p) => [p.slug, LAUNCH_BATCH]),
)

/** Numeric ZAR price per product for cart math (VAT included, per unit). */
export const PRICE_BY_SLUG: Record<string, number> = Object.fromEntries(
  PET_PRODUCTS.map((p) => [p.slug, p.price]),
)

/** Numeric price lookup with a safe fallback. */
export function priceForSlug(slug: string): number {
  return PRICE_BY_SLUG[slug] ?? 0
}

/** Catalog product lookup shared by cart + drawer. */
export function getPetProduct(slug: string): PetProduct | undefined {
  return PET_PRODUCTS.find((p) => p.slug === slug)
}
