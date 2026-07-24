/**
 * PSA PETS — credibility block constants (round 6).
 *
 * Advisory-vet and partner-lab identity, rendered on the homepage
 * ("REVIEWED BY PEOPLE WHO ANSWER FOR IT."). These are PLACEHOLDERS the
 * client swaps at launch — the section carries the mono disclaimer chip
 * "ADVISORY DETAILS FINALIZED AT LAUNCH" so nothing here pretends to be
 * final. Keep `initials` in sync with `name` (the portrait is a monogram
 * tile by design — no fabricated human photo).
 */
export const ADVISORY_VET = {
  name: 'Dr. A. Nkosi',
  /** Monogram tile initials (rendered instead of a photo). */
  initials: 'AN',
  title: 'SAVC-Registered Veterinary Advisor',
  reg: 'SAVC Reg. No. — [TO CONFIRM]',
  bio: 'Small-animal practitioner with a decade in referral medicine. Reviews every PSA PETS dosing chart, evidence grade and honesty note before it ships — and answers for them by name.',
  bioAf:
    'Kleindierpraktisyn met ’n dekade in verwysingsmedisyne. Hersien elke PSA PETS-doseringstabel, bewysgraad en eerlikheidsnota voordat dit versend — en staan daarvoor in naam.',
}

export const TESTING_LAB = {
  name: '[SANAS-ACCREDITED PARTNER LAB]',
  note: 'Independent HPLC purity + identity testing on every batch — heavy metals, endotoxins and microbial screens included.',
  noteAf:
    'Onafhanklike HPLC-suiwerheid- en identiteitstoetsing op elke lot — swaarmetale, endotoksiene en mikrobiese siftings ingesluit.',
}
