/**
 * Checkout + EFT-instructions copy — co-located with the checkout pages so the
 * shared i18n dictionary stays untouched (same pattern as
 * pets/conversionCopy.ts). Transactional copy, EN/AF.
 */
import { useI18n } from '@/lib/i18n'

export interface CheckoutCopy {
  seoTitle: string
  seoDesc: string
  kicker: string
  title: string
  sub: string
  checking: string
  authKicker: string
  authTitle: string
  googleCta: string
  orEmail: string
  magicSent: string
  emailPlaceholder: string
  magicCta: string
  sessionActive: string
  firstName: string
  lastName: string
  email: string
  mobile: string
  mobilePlaceholder: string
  street: string
  city: string
  province: string
  postalCode: string
  petName: string
  petSpecies: string
  speciesDog: string
  speciesCat: string
  speciesHorse: string
  ageConsent: string
  nutritionalConsent: string
  labelUseConsent: string
  reportScopeConsent: string
  marketingConsent: string
  validationError: string
  busyLabel: string
  submitPrefix: string
  summaryKicker: string
  productName: string
  quantity: string
  courier: string
  courierFree: string
  totalLabel: string
  trust1: string
  trust2: string
  trust3: string
  /* ---------------- EFT instructions page ---------------- */
  eftSeoTitle: string
  eftSeoDesc: string
  eftMissingTitle: string
  eftMissingBody: string
  eftMissingCta: string
  eftKicker: string
  eftPayPrefix: string
  eftBody: string
  eftAccountName: string
  eftBank: string
  eftAccountNumber: string
  eftBranchCode: string
  eftReference: string
  eftCopyAria: string
  eftPendingTitle: string
  /** Contains a `{order}` placeholder — replace at the call site. */
  eftPendingBody: string
  eftRefTitle: string
  eftRefBody: string
  eftFoot: string
}

const en: CheckoutCopy = {
  seoTitle: 'Secure EFT Checkout — Peptides4Pets',
  seoDesc: 'Complete your Peptides4Pets order with secure direct EFT.',
  kicker: 'SECURE EFT CHECKOUT',
  title: 'Delivery & owner details',
  sub: 'We collect only what is needed to authenticate the order, deliver it and contact you about fulfilment. No card data and no medical record.',
  checking: 'Checking secure session…',
  authKicker: 'STEP 1 · SECURE YOUR ORDER',
  authTitle: 'Sign in without creating another password.',
  googleCta: 'Continue with Google',
  orEmail: 'or email link',
  magicSent: 'Check your inbox, open the secure link, then return here.',
  emailPlaceholder: 'you@example.com',
  magicCta: 'Email secure link',
  sessionActive: 'Secure session active',
  firstName: 'First name',
  lastName: 'Last name',
  email: 'Email',
  mobile: 'Mobile',
  mobilePlaceholder: '+27 82 000 0000',
  street: 'Street address',
  city: 'City',
  province: 'Province',
  postalCode: 'Postal code',
  petName: 'Pet name',
  petSpecies: 'Pet',
  speciesDog: 'Dog',
  speciesCat: 'Cat',
  speciesHorse: 'Horse',
  ageConsent: 'I confirm that I am 18 years of age or older and authorised to place this order.',
  nutritionalConsent:
    'I understand Mobility Collagen is a pet nutritional supplement, not a veterinary medicine or a substitute for veterinary diagnosis or treatment.',
  labelUseConsent:
    'I will use the product only as directed on its label and consult a veterinarian for illness, injury, medicine interactions or persistent symptoms.',
  reportScopeConsent:
    'I understand published reports describe only the identified sample and test method and do not guarantee an outcome for an individual animal.',
  marketingConsent: 'Optional: send me Peptides4Pets research and product updates.',
  validationError:
    'Complete every delivery field, use a four-digit postal code and accept all required acknowledgements.',
  busyLabel: 'Creating secure order…',
  submitPrefix: 'Place order · get EFT details ·',
  summaryKicker: 'ORDER SUMMARY',
  productName: 'Mobility Collagen',
  quantity: 'Quantity {qty}',
  courier: 'Local courier',
  courierFree: 'Free',
  totalLabel: 'Total',
  trust1: 'Unique EFT reference issued after order creation.',
  trust2: 'Server calculates amount; client price is never trusted.',
  trust3: 'POPIA-scoped private fulfilment record.',

  eftSeoTitle: 'EFT Instructions — Peptides4Pets',
  eftSeoDesc: 'Bank details for your pending Peptides4Pets EFT order.',
  eftMissingTitle: 'No EFT order found.',
  eftMissingBody: 'Bank details appear here immediately after a secure order is created.',
  eftMissingCta: 'Back to the catalog',
  eftKicker: 'ORDER RESERVED · AWAITING EFT',
  eftPayPrefix: 'Pay',
  eftBody:
    'Use the reference exactly. Your order is confirmed only after the matching deposit is verified.',
  eftAccountName: 'Account name',
  eftBank: 'Bank',
  eftAccountNumber: 'Account number',
  eftBranchCode: 'Branch code',
  eftReference: 'Reference',
  eftCopyAria: 'Copy {label}',
  eftPendingTitle: 'Pending, not paid',
  eftPendingBody: 'Order {order} remains awaiting EFT until the exact deposit is matched.',
  eftRefTitle: 'Reference-first',
  eftRefBody:
    'The payment team matches both the unique reference and exact amount before fulfilment.',
  eftFoot:
    'A copy of these instructions is queued to your order email. Need help? Contact hello@peptide-south-africa.com.',
}

const af: CheckoutCopy = {
  seoTitle: 'Veilige EFT-betaling — Peptides4Pets',
  seoDesc: 'Voltooi jou Peptides4Pets-bestelling met veilige direkte EFT.',
  kicker: 'VEILIGE EFT-BETALING',
  title: 'Aflewerings- en eienaarsbesonderhede',
  sub: 'Ons versamel net wat nodig is om die bestelling te bekragtig, af te lewer en jou oor vervulling te kontak. Geen kaartdata en geen mediese rekord nie.',
  checking: 'Veilige sessie word nagegaan…',
  authKicker: 'STAP 1 · BEVEILIG JOU BESTELLING',
  authTitle: 'Meld aan sonder om nog ’n wagwoord te skep.',
  googleCta: 'Gaan voort met Google',
  orEmail: 'of e-pos-skakel',
  magicSent: 'Kyk in jou inkassie, open die veilige skakel en kom dan hierna toe terug.',
  emailPlaceholder: 'jy@voorbeeld.co.za',
  magicCta: 'E-pos veilige skakel',
  sessionActive: 'Veilige sessie aktief',
  firstName: 'Voornaam',
  lastName: 'Van',
  email: 'E-pos',
  mobile: 'Selfoon',
  mobilePlaceholder: '+27 82 000 0000',
  street: 'Straatadres',
  city: 'Stad',
  province: 'Provinsie',
  postalCode: 'Poskode',
  petName: 'Troeteldier se naam',
  petSpecies: 'Troeteldier',
  speciesDog: 'Hond',
  speciesCat: 'Kat',
  speciesHorse: 'Perd',
  ageConsent: 'Ek bevestig dat ek 18 jaar of ouer is en gemagtig is om hierdie bestelling te plaas.',
  nutritionalConsent:
    'Ek verstaan dat Mobility Collagen ’n voedingsaanvulling vir troeteldiere is, nie ’n veeartsenymiddel of plaasvervanger vir veeartsenykundige diagnose of behandeling nie.',
  labelUseConsent:
    'Ek sal die produk slegs volgens die etiket gebruik en ’n veearts raadpleeg vir siekte, besering, medisyne-interaksies of aanhoudende simptome.',
  reportScopeConsent:
    'Ek verstaan gepubliseerde verslae beskryf slegs die geïdentifiseerde monster en toetsmetode en waarborg nie ’n uitkoms vir ’n individuele dier nie.',
  marketingConsent: 'Opsioneel: stuur vir my Peptides4Pets-navorsing- en produkopdaterings.',
  validationError:
    'Voltooi elke afleweringsveld, gebruik ’n viersyfer-poskode en aanvaar al die vereiste erkennings.',
  busyLabel: 'Veilige bestelling word geskep…',
  submitPrefix: 'Plaas bestelling · kry EFT-besonderhede ·',
  summaryKicker: 'BESTELLINGOPSOMMING',
  productName: 'Mobility Collagen',
  quantity: 'Hoeveelheid {qty}',
  courier: 'Plaaslike koerier',
  courierFree: 'Gratis',
  totalLabel: 'Totaal',
  trust1: 'Unieke EFT-verwysing word na bestellingskepping uitgereik.',
  trust2: 'Die bediener bereken die bedrag; die kliëntprys word nooit vertrou nie.',
  trust3: 'POPIA-beperkte private vervullingsrekord.',

  eftSeoTitle: 'EFT-instruksies — Peptides4Pets',
  eftSeoDesc: 'Bankbesonderhede vir jou hangende Peptides4Pets-EFT-bestelling.',
  eftMissingTitle: 'Geen EFT-bestelling gevind nie.',
  eftMissingBody:
    'Bankbesonderhede verskyn hier dadelik nadat ’n veilige bestelling geskep is.',
  eftMissingCta: 'Terug na die katalogus',
  eftKicker: 'BESTELLING BESPREEK · WAG OP EFT',
  eftPayPrefix: 'Betaal',
  eftBody:
    'Gebruik die verwysing presies soos dit is. Jou bestelling word eers bevestig sodra die passende deposito geverifieer is.',
  eftAccountName: 'Rekeningnaam',
  eftBank: 'Bank',
  eftAccountNumber: 'Rekeningnommer',
  eftBranchCode: 'Takkode',
  eftReference: 'Verwysing',
  eftCopyAria: 'Kopieer {label}',
  eftPendingTitle: 'Hangende, nie betaal nie',
  eftPendingBody:
    'Bestelling {order} bly in afwagting van EFT totdat die presiese deposito pasgemaak is.',
  eftRefTitle: 'Verwysing eerste',
  eftRefBody:
    'Die betalingspan pas beide die unieke verwysing en die presiese bedrag voor vervulling.',
  eftFoot:
    '’n Afskrif van hierdie instruksies word na jou bestelling se e-pos gestuur. Benodig hulp? Kontak hello@peptide-south-africa.com.',
}

const COPY: Record<'en' | 'af', CheckoutCopy> = { en, af }

/** Locale-aware checkout copy; falls back to English for unknown locales. */
export function useCheckoutCopy(): CheckoutCopy {
  const { locale } = useI18n()
  return COPY[locale] ?? en
}
