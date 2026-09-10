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
  launchResearch: string
  launchResearchStatus: string
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
  heroH1: 'Pet research, made clear.',
  heroSub:
    'Mobility Collagen is live as a pet nutritional supplement. Experimental peptide profiles remain research information only — clearly separated from products offered for animal use.',
  heroCtaQuiz: 'Explore the research catalogue',
  heroCtaShop: 'View the catalogue',
  heroTrust1: 'Evidence graded',
  heroTrust2: 'Report scope shown',
  heroTrust3: 'South African fulfilment',

  launchOverline: 'THE LAUNCH BATCH',
  launchTitle: 'One live product. Four research profiles.',
  launchSub: 'Order Mobility Collagen by EFT for delivery in South Africa. Experimental peptide pages publish the evidence and gaps but do not offer animal-use products or protocols.',
  launchAdd: 'Add',
  launchAdded: 'Added ✓',
  launchDetails: 'DETAILS →',
  launchCitations: 'KEY EVIDENCE ({count})',
  launchHplc: '≥99% HPLC',
  launchResearch: 'EVIDENCE GRADED',
  launchResearchStatus: 'RESEARCH PROFILE · NOT FOR SALE',
  launchNote: 'MOBILITY COLLAGEN IS A NUTRITIONAL SUPPLEMENT · EXPERIMENTAL PEPTIDES ARE RESEARCH INFORMATION ONLY · NO ANIMAL-USE PROTOCOLS',

  qtOverline: '60-SECOND QUIZ',
  qtTitle: 'A clearer research starting point.',
  qtSub: 'Three quick steps — the navigator organises the evidence.',
  qtStep1Title: 'Tell us about your pet',
  qtStep1Body: 'Species, age, size and what matters most.',
  qtStep2Title: 'Compare evidence profiles',
  qtStep2Body: 'See study type, evidence gaps and document scope side by side.',
  qtStep3Title: 'Save research interests',
  qtStep3Body: 'Join research updates — no payment and no treatment recommendation.',
  qtCta: 'Open the navigator',

  proofLine: 'STUDY TYPE SHOWN · REPORT SCOPE DISCLOSED · EVIDENCE GAPS PUBLISHED',
  proofLink: 'READ THE SCIENCE',
}

const af: ConversionCopy = {
  heroOverline: 'PEPTIDES4PETS · SUID-AFRIKA',
  heroH1: 'Troeteldiernavorsing, duidelik gemaak.',
  heroSub:
    'Mobility Collagen is beskikbaar as ’n voedingsaanvulling vir troeteldiere. Eksperimentele peptiedprofiele bly slegs navorsingsinligting — duidelik apart van produkte vir gebruik by diere.',
  heroCtaQuiz: 'Verken die navorsingskatalogus',
  heroCtaShop: 'Bekyk die katalogus',
  heroTrust1: 'Bewyse gegradeer',
  heroTrust2: 'Verslagomvang gewys',
  heroTrust3: 'Suid-Afrikaanse vervulling',

  launchOverline: 'DIE BEKENDSTELLINGSLOT',
  launchTitle: 'Een lewendige produk. Vier navorsingsprofiele.',
  launchSub:
    'Bestel Mobility Collagen per EFT vir aflewering in Suid-Afrika. Eksperimentele peptiedbladsye publiseer die bewyse en gapings, maar bied nie produkte of protokolle vir diergebruik aan nie.',
  launchAdd: 'Voeg by',
  launchAdded: 'Bygevoeg ✓',
  launchDetails: 'BESONDERHEDE →',
  launchCitations: 'SLEUTELBEWYSE ({count})',
  launchHplc: '≥99% HPLC',
  launchResearch: 'BEWYSE GEGRADEER',
  launchResearchStatus: 'NAVORSINGSPROFIEL · NIE TE KOOP NIE',
  launchNote:
    'MOBILITY COLLAGEN IS ’N VOEDINGSAANVULLING · EKSPERIMENTELE PEPTIEDE IS SLEGS NAVORSINGSINLIGTING · GEEN DIERGEBRUIKPROTOKOLLE',

  qtOverline: '60-SEKONDE-QUIZ',
  qtTitle: '’n Duideliker navorsingsbeginpunt.',
  qtSub: 'Drie vinnige stappe — die navigator organiseer die bewyse.',
  qtStep1Title: 'Vertel ons van jou troeteldier',
  qtStep1Body: 'Spesie, ouderdom, grootte en wat die belangrikste is.',
  qtStep2Title: 'Vergelyk bewysprofiele',
  qtStep2Body: 'Sien studietipe, bewysgapings en dokumentomvang langs mekaar.',
  qtStep3Title: 'Stoor navorsingsbelangstellings',
  qtStep3Body: 'Sluit aan vir navorsingsopdaterings — geen betaling of behandelingsaanbeveling nie.',
  qtCta: 'Open die navigator',

  proofLine:
    'STUDIETIPE GEWYS · VERSLAGOMVANG VERKLAAR · BEWYSGAPINGS GEPUBLISEER',
  proofLink: 'LEES DIE WETENSKAP',
}

const COPY: Record<'en' | 'af', ConversionCopy> = { en, af }

/** Locale-aware conversion copy; falls back to English for unknown locales. */
export function useConversionCopy(): ConversionCopy {
  const { locale } = useI18n()
  return COPY[locale] ?? en
}
