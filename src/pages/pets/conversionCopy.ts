/**
 * Conversion copy for the simplified landing flow (hero, launch catalog,
 * quiz teaser, proof strip) — co-located with the pets sections so the
 * shared i18n dictionary stays untouched. Long-form/science/article copy
 * remains in `src/lib/i18n.tsx`.
 */
import { useI18n } from '@/lib/i18n'

export interface ConversionCopy {
  /* ---------------- Hero ---------------- */
  heroOverline: string
  heroH1: string
  heroSub: string
  heroCtaQuiz: string
  heroCtaShop: string
  heroTrust1: string
  heroTrust2: string
  heroTrust3: string
  /* ---------------- Launch catalog ---------------- */
  launchOverline: string
  launchTitle: string
  launchSub: string
  launchAdd: string
  launchAdded: string
  launchDetails: string
  /** Contains a `{count}` placeholder — replace at the call site. */
  launchCitations: string
  launchHplc: string
  launchNote: string
  /* ---------------- Quiz teaser ---------------- */
  qtOverline: string
  qtTitle: string
  qtSub: string
  qtStep1Title: string
  qtStep1Body: string
  qtStep2Title: string
  qtStep2Body: string
  qtStep3Title: string
  qtStep3Body: string
  qtCta: string
  /* ---------------- Proof strip ---------------- */
  proofLine: string
  proofLink: string
}

const en: ConversionCopy = {
  heroOverline: 'PEPTIDES4PETS · SOUTH AFRICA',
  heroH1: 'More good years, made simple.',
  heroSub:
    'Vet-minded peptide protocols for South African dogs and cats. Join the launch waitlist — no payment today.',
  heroCtaQuiz: 'Build my pet’s plan',
  heroCtaShop: 'Shop the launch batch',
  heroTrust1: '≥99% HPLC COA',
  heroTrust2: '60-day guarantee',
  heroTrust3: 'Free shipping over R1,500',

  launchOverline: 'THE LAUNCH BATCH',
  launchTitle: 'Five formulas. One batch.',
  launchSub: 'Reserve at founding pricing today — nothing is charged until we ship.',
  launchAdd: 'Add',
  launchAdded: 'Added ✓',
  launchDetails: 'DETAILS →',
  launchCitations: 'KEY EVIDENCE ({count})',
  launchHplc: '≥99% HPLC',
  launchNote: 'ALL PRODUCTS IN DEVELOPMENT · NOT VETERINARY MEDICINES · CONSULT YOUR VET',

  qtOverline: '60-SECOND QUIZ',
  qtTitle: 'A plan built for your pet.',
  qtSub: 'Three quick steps — the quiz does the rest.',
  qtStep1Title: 'Tell us about your pet',
  qtStep1Body: 'Species, age, size and what matters most.',
  qtStep2Title: 'Get a vet-minded stack',
  qtStep2Body: 'Rule-based recommendations with the evidence graded honestly.',
  qtStep3Title: 'Reserve launch pricing',
  qtStep3Body: 'Join the waitlist — no payment today.',
  qtCta: 'Start the quiz',

  proofLine: 'PUBLISHED CANINE RCTs · ≥99% HPLC EVERY BATCH · EVERY CLAIM GRADED',
  proofLink: 'READ THE SCIENCE',
}

const af: ConversionCopy = {
  heroOverline: 'PEPTIDES4PETS · SUID-AFRIKA',
  heroH1: 'Meer goeie jare, eenvoudig gemaak.',
  heroSub:
    'Veearts-gesinde peptiedprotokolle vir Suid-Afrikaanse honde en katte. Sluit aan by die bekendstellingswaglys — geen betaling vandag nie.',
  heroCtaQuiz: 'Bou my troeteldier se plan',
  heroCtaShop: 'Koop die bekendstellingslot',
  heroTrust1: '≥99% HPLC-COA',
  heroTrust2: '60-dae-waarborg',
  heroTrust3: 'Gratis aflewering bo R1,500',

  launchOverline: 'DIE BEKENDSTELLINGSLOT',
  launchTitle: 'Vyf formules. Een lot.',
  launchSub:
    'Bespreek teen stigterspryse vandag — niks word gevorder voordat ons stuur nie.',
  launchAdd: 'Voeg by',
  launchAdded: 'Bygevoeg ✓',
  launchDetails: 'BESONDERHEDE →',
  launchCitations: 'SLEUTELBEWYSE ({count})',
  launchHplc: '≥99% HPLC',
  launchNote:
    'ALLE PRODUKTE IN ONTWIKKELING · NIE VEEARTSENYMIDDELS NIE · RAADPLEEG JOU VEEARTS',

  qtOverline: '60-SEKONDE-QUIZ',
  qtTitle: '’n Plan gebou vir jou troeteldier.',
  qtSub: 'Drie vinnige stappe — die quiz doen die res.',
  qtStep1Title: 'Vertel ons van jou troeteldier',
  qtStep1Body: 'Spesie, ouderdom, grootte en wat die belangrikste is.',
  qtStep2Title: 'Kry ’n veearts-gesinde stapel',
  qtStep2Body: 'Reëlgebaseerde aanbevelings met die bewyse eerlik beoordeel.',
  qtStep3Title: 'Bespreek bekendstellingspryse',
  qtStep3Body: 'Sluit aan by die waglys — geen betaling vandag nie.',
  qtCta: 'Begin die quiz',

  proofLine:
    'GEPUBLISEERDE HONDE-RCT’s · ≥99% HPLC BY ELKE LOT · ELKE EIS BEOORDEEL',
  proofLink: 'LEES DIE WETENSKAP',
}

const COPY: Record<'en' | 'af', ConversionCopy> = { en, af }

/** Locale-aware conversion copy; falls back to English for unknown locales. */
export function useConversionCopy(): ConversionCopy {
  const { locale } = useI18n()
  return COPY[locale] ?? en
}
