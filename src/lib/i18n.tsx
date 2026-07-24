/**
 * PSA PETS — lightweight EN/AF localization (no external i18n library).
 *
 * `I18nProvider` holds the active locale (persisted to localStorage under
 * `psa_pets_locale`, mirrored to `<html lang>`). `useI18n()` exposes
 * `{ locale, setLocale, t }`. `t(key, vars?)` looks up STRINGS[locale][key]
 * with fallback to English and replaces `{var}` placeholders.
 */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'

export type Locale = 'en' | 'af'

const STORAGE_KEY = 'psa_pets_locale'

type Dict = Record<string, string>

/* ============================== English ============================== */

const en: Dict = {
  /* ---------------- Navbar ---------------- */
  'nav.catalog': 'Catalog',
  'nav.science': 'Science',
  'nav.waitlist': 'Waitlist',
  'nav.marquee':
    'COMING SOON — PEPTIDES FOR PETS · JOIN THE WAITLIST · FOUNDING MEMBERS LOCK 20% OFF FIRST 3 MONTHS · ',
  'nav.dismissAnnouncement': 'Dismiss announcement',
  'nav.waitingChip': '{count} SA PET OWNERS WAITING',
  'nav.cartAria': 'Open your Launch Box, {count} items',
  'nav.cta': 'Join the waitlist',
  'nav.waMsg': 'Hi PSA PETS! I have a question about the pet peptide waitlist.',
  'nav.waAria': 'WhatsApp us',
  'nav.close': '✕ CLOSE',
  'nav.openMenu': 'Open menu',
  'nav.closeMenu': 'Close menu',
  'nav.langAria': 'Switch language to {lang}',

  /* ---------------- Hero ---------------- */
  'hero.overline': 'PEPTIDE SOUTH AFRICA · PRESENTS',
  'hero.line1': 'Give them more',
  'hero.line2': 'good years.',
  'hero.sub':
    'South Africa’s first COA-verified pet peptide line — research-grade peptides and collagen for dogs, cats and horses, with a batch number on every label. Launching soon.',
  'hero.ctaQuiz': 'Take the 60-second pet quiz',
  'hero.ctaWaitlist': 'Join the waitlist',
  'hero.trust': '≥99% HPLC · COA EVERY BATCH · VAT INCL · FREE SHIPPING OVER R1,500',
  'hero.anno.recovery': 'RECOVERY → WOLVERINE BLEND',
  'hero.anno.senior': 'SENIOR YEARS → IMMUNE',
  'hero.anno.joints': 'JOINTS & MOBILITY → COLLAGEN + BPC-157',
  'hero.anno.gut': 'GUT LINING → KPV',
  'hero.captionLine': 'DIESEL · AGE 9 · CAPE TOWN',
  'hero.captionWaiting': 'WAITING #0037',
  'hero.scrollChip': 'SCROLL — THE SCIENCE ↓',
  'hero.imgAlt': 'Diesel, a dignified nine-year-old Boerboel on a warm cream background',

  /* ---------------- Trust strip ---------------- */
  'trust.1.label': '≥99% HPLC TESTED',
  'trust.1.text': 'Purity verified on every batch',
  'trust.2.label': 'COA INCLUDED',
  'trust.2.text': 'Certificate of Analysis, every product',
  'trust.3.label': 'VET-REVIEWED PROTOCOLS',
  'trust.3.text': 'Dosing guidance written with veterinarians',
  'trust.4.label': 'PRICES INCLUDE VAT',
  'trust.4.text': 'No surprises at launch',
  'trust.5.label': 'POPIA COMPLIANT',
  'trust.5.text': 'Your data stays yours',

  /* ---------------- Proof ticker ---------------- */
  'ticker.1': 'LERATO · CAPE TOWN · 2 BOERBOELS · JOINED BPC-157 LIST',
  'ticker.2': 'PIETER · STELLENBOSCH · RIDGEBACK AGE 10 · JOINED COLLAGEN LIST',
  'ticker.3': 'AYESHA · DURBAN · 3 CATS · JOINED KPV LIST',
  'ticker.4': 'THABO · JOHANNESBURG · PITBULL AGE 5 · JOINED RECOVERY LIST',
  'ticker.5': 'MARIE · PAARL · SENIOR BOERBOEL · JOINED IMMUNE LIST',
  'ticker.6': 'SIPHO · GQEBERHA · GERMAN SHEPHERD · JOINED BPC-157 LIST',
  'ticker.7': 'ANNERIE · PRETORIA · BOERBOEL AGE 11 · JOINED COLLAGEN LIST',
  'ticker.8': 'DANIEL · CAPE TOWN · TABBY AGE 7 · JOINED KPV LIST',
  'ticker.9': 'NOLWAZI · BLOEMFONTEIN · 2 HORSES · JOINED RECOVERY LIST',
  'ticker.10': 'JOHAN · SOMERSET WEST · LABRADOR AGE 12 · JOINED IMMUNE LIST',
  'ticker.tag': 'SIMULATED PREVIEW FEED',

  /* ---------------- Science story ---------------- */
  'ss.quote':
    '“Aging is the most significant modifiable risk factor for the diseases that take our dogs too soon.”',
  'ss.quoteCaption': '— WHY WE’RE BUILDING THIS',
  'ss.chip': 'ATHLETES COME IN FOUR LEGS TOO',
  'ss.h1a': 'The science of aging pets is finally here — and it’s coming to',
  'ss.h1em': 'South Africa.',
  'ss.p1':
    'For decades, longevity research focused on humans. That’s changing. In the US, companies like Loyal are running the largest canine aging study in history — 1,317 dogs across 70 veterinary practices. The demand signal is unmistakable: pet owners want more healthy years with their animals.',
  'ss.p2':
    'PSA PETS brings that ambition home. We’re adapting the compounds pet owners worldwide already ask for — BPC-157, KPV, collagen peptides — to South African shelves, with South African pricing, VAT included, and a certificate of analysis on every batch.',
  'ss.stat1.label': 'DOGS',
  'ss.stat1.text': "in Loyal's landmark STAY trial",
  'ss.stat2.label': 'CLINICS',
  'ss.stat2.text': 'running canine longevity research today',
  'ss.stat3.label': 'PRODUCTS',
  'ss.stat3.text': 'in development for SA pets',

  /* ---------------- Pinned vial ---------------- */
  'pv.1.title': 'MOBILITY',
  'pv.1.text': 'Supports comfortable movement in aging joints and soft tissue.',
  'pv.2.title': 'RECOVERY',
  'pv.2.text': "Supports the body's natural soft-tissue repair after injury or surgery.",
  'pv.3.title': 'GUT & SKIN',
  'pv.3.text': 'Supports gut lining integrity and calm, healthy skin.',
  'pv.4.title': 'LONGEVITY',
  'pv.4.text': "More comfortable years. That's the whole point.",
  'pv.honesty': '* SUPPORTS — NOT TREATS. SEE CITATIONS ↓',
  'pv.cta.kicker': 'READY WHEN WE LAUNCH',
  'pv.cta.label': 'Reserve BPC-157',
  'pv.cta.sub': 'FOUNDING MEMBERS LOCK 20% OFF · NO PAYMENT TODAY',
  'sci.viewSource': 'VIEW SOURCE',

  /* ---------------- Catalog ---------------- */
  'cat.overline': 'THE CATALOG · COMING SOON',
  'cat.titleA': 'Five formulas.',
  'cat.titleEm': 'One waitlist each.',
  'cat.sub':
    "Join any product's list — founding members lock 20% off their first 3 subscription months at launch.",
  'cat.shortlist': 'YOUR SHORTLIST',
  'cat.waiting': 'WAITING',
  'cat.ownersOnLists': '{count} SA OWNERS ON OUR LISTS',
  'cat.joinCta': 'Join a waitlist ↓',
  'cat.howSubs': 'HOW SUBSCRIPTIONS WORK',
  'cat.firstLaunch': '★ FIRST TO LAUNCH — EST. Q1 2026',
  'cat.joinWaitlist': 'Join waitlist',
  'cat.productPage': 'PRODUCT PAGE →',
  'product.benefit.bpc-157': 'Mobility, soft-tissue & recovery support for dogs and cats.',
  'product.benefit.kpv': 'Gut lining and skin support for sensitive pets.',
  'product.benefit.recovery-blend':
    "The 'Wolverine pairing' for injury rehab and post-surgery support.",
  'product.benefit.immune-thymogen': 'Immune resilience support for seniors and frequent patients.',
  'product.benefit.mobility-collagen':
    'The compliant lane: published canine RCT evidence behind every tub.',

  /* ---------------- Badges / shared molecules ---------------- */
  'badge.comingSoon': 'COMING SOON',
  'addbox.add': 'ADD TO LAUNCH BOX',
  'addbox.added': 'IN YOUR LAUNCH BOX ✓',
  'cite.header': 'EVIDENCE & CITATIONS ({count})',
  'cite.open': 'OPEN',
  'cite.close': 'CLOSE',

  /* ---------------- Subscriptions ---------------- */
  'subs.overline': 'HOW IT WILL WORK',
  'subs.titleA': 'Subscribe. Save.',
  'subs.titleEm': 'Never run out.',
  'subs.perk1.title': 'Every autoship order',
  'subs.perk1.body': 'The Chewy and PetTides standard — 10–15% off, every month, no codes.',
  'subs.perk2.title': 'Free shipping',
  'subs.perk2.body': 'Free delivery over R1,500, VAT always included, anywhere in SA.',
  'subs.perk3.title': 'Pause or cancel anytime',
  'subs.perk3.body': 'One WhatsApp message pauses, skips or cancels. No phone trees, no guilt.',
  'subs.multipet.chip': 'MULTI-PET BUNDLE · +5% OFF PER PET',
  'subs.multipet.titleA': '66% of pet households have',
  'subs.multipet.titleEm': 'more than one animal.',
  'subs.multipet.body':
    'Multi-pet bundles will stack an extra 5% off per additional pet — the dog, the cat and the old horse all count.',
  'subs.founding.label': 'WAITLIST PERK',
  'subs.founding.title': 'Founding members lock 20% off their first 3 subscription months.',
  'subs.founding.cta': 'Secure my spot',

  /* ---------------- Founding ring ---------------- */
  'ring.label': 'FOUNDING 20% SPOTS — HONEST COUNT',
  'ring.standard': '+{count} STANDARD WAITLIST',
  'ring.title': '{claimed} of {cap} founding spots claimed.',
  'ring.body':
    'We cap founding memberships at {cap} so early supporters keep their 20% lock and first-batch allocation. This counter reflects real waitlist joins — no fake countdown timers here.',

  /* ---------------- Waitlist section ---------------- */
  'wsec.caption': 'THE WHOLE REASON · EVERY OWNER KNOWS THIS FEELING',
  'wsec.overline': 'THE WAITLIST',
  'wsec.titleA': 'Tell us about your',
  'wsec.titleEm': 'best friend.',

  /* ---------------- Social proof ---------------- */
  'sp.overline': 'EARLY BELIEVERS',
  'sp.titleA': 'South African pet owners are',
  'sp.titleEm': 'already in line.',
  'sp.stats': '1,204 ON THE WAITLIST · 4.9★ PSA STORE RATING · 1,200+ PSA REVIEWS',
  'sp.1.quote':
    'My 11-year-old Boerboel struggles on our farm’s steps. If the collagen does half of what the studies say, I’m first in line.',
  'sp.1.meta': 'ANNERIE V. · PRETORIA · BOERBOEL, AGE 11',
  'sp.2.quote':
    'I buy PSA’s human peptides already. COA on every batch is why I trust them with my cat.',
  'sp.2.meta': 'DANIEL K. · CAPE TOWN · TABBY, AGE 7',
  'sp.3.quote':
    'We spent R40k on our Ridgeback’s cruciate surgery. Recovery support can’t come soon enough.',
  'sp.3.meta': 'SIPHO M. · DURBAN · RIDGEBACK, AGE 4',

  /* ---------------- Honesty ---------------- */
  'hon.overline': 'STRAIGHT TALK',
  'hon.titleA': 'We’d rather earn your',
  'hon.titleEm': 'trust',
  'hon.titleB': 'than your pre-order.',
  'hon.p1':
    'No pet peptide product — ours or anyone’s — is approved by the FDA or SAHPRA. Evidence levels vary by compound: collagen peptides have published canine RCTs; BPC-157 has canine pharmacokinetic data; KPV and TB-500 remain preclinical. We label every claim with its evidence level, and we always recommend you talk to your veterinarian first.',
  'hon.p2':
    'Everything on this page is in development. Joining the waitlist costs nothing and commits you to nothing — it simply puts your pet first in line, with founding-member pricing locked in.',
  'hon.link': 'READ THE FULL EVIDENCE LIBRARY →',
  'hon.ledger': 'EVIDENCE LEDGER',
  'hon.status.strong': 'STRONG',
  'hon.status.emerging': 'EMERGING',
  'hon.status.early': 'EARLY',
  'hon.note': 'UPDATED QUARTERLY · SOURCES ON /SCIENCE',

  /* ---------------- FAQ ---------------- */
  'faq.titleA': 'Honest',
  'faq.titleEm': 'answers.',
  'faq.1.q': 'When will PSA PETS launch?',
  'faq.1.a':
    'Mobility Collagen is targeted for Q1 2026; peptide drops follow as quality and regulatory reviews complete. Waitlist members hear first.',
  'faq.2.q': 'Are these products safe for my pet?',
  'faq.2.a':
    'We publish every citation and every evidence level. Nothing here is a veterinary medicine, and you should consult your vet before starting any supplement.',
  'faq.3.q': 'What does joining the waitlist cost?',
  'faq.3.a':
    'Nothing. It reserves your founding-member pricing (20% off your first 3 subscription months) and your queue position.',
  'faq.4.q': 'Which pets are these for?',
  'faq.4.a':
    'Formulas are being developed for dogs and cats first, with equine dosing under veterinary review.',
  'faq.5.q': 'How do subscriptions work?',
  'faq.5.a':
    'Monthly autoship at 15% off, free shipping over R1,500, VAT included, pause or cancel anytime via WhatsApp.',
  'faq.6.q': 'Is my data safe?',
  'faq.6.a':
    "Yes. We're POPIA compliant and only contact you about pet products you asked about.",

  /* ---------------- Conversion bar ---------------- */
  'cb.waiting': '{count} SA OWNERS WAITING',
  'cb.quiz': 'Take the quiz →',
  'cb.box': 'LAUNCH BOX',

  /* ---------------- Exit toast ---------------- */
  'et.label': 'BEFORE YOU GO',
  'et.title': '20% founding-member lock ends soon.',
  'et.body': 'Join the waitlist now and your discount is pinned to your ticket at launch.',
  'et.cta': 'Lock my 20% →',
  'et.dismiss': 'Dismiss',
}

Object.assign(en, {
  /* ---------------- Cart drawer ---------------- */
  'cart.overline': 'RESERVATION CART — NO PAYMENT YET',
  'cart.title': 'Your Launch Box',
  'cart.close': 'Close Launch Box',
  'cart.back': '← BACK TO LAUNCH BOX',
  'cart.reserveTitle.one': 'Reserve it — free.',
  'cart.reserveTitle.many': 'Reserve your {count} formulas — free.',
  'cart.reserveBody':
    'Join the waitlist with your Launch Box preselected. Founding pricing ({pct}% off) is locked to your ticket.',
  'cart.emptyTitle': 'Your Launch Box is empty.',
  'cart.emptyBody':
    'Reserve your pet’s stack at founding-member pricing — nothing is charged until launch.',
  'cart.browse': 'Browse the catalog',
  'cart.removeAria': 'Remove {name}',
  'cart.qtyDec': 'Decrease quantity',
  'cart.qtyInc': 'Increase quantity',
  'cart.shipRemaining': '{amount} TO FREE SHIPPING',
  'cart.shipUnlocked': '✓ FREE SHIPPING UNLOCKED',
  'cart.subtotal': 'SUBTOTAL',
  'cart.founding': 'FOUNDING MEMBER −{pct}%',
  'cart.reservedTotal': 'RESERVED TOTAL',
  'cart.reserveCta': 'RESERVE WITH WAITLIST — NO PAYMENT YET →',
  'cart.footer': 'VAT INCL · PRICE LOCKED TO YOUR TICKET · CANCEL ANYTIME',

  /* ---------------- Waitlist form ---------------- */
  'form.name': 'YOUR NAME',
  'form.namePh': 'Annerie van Wyk',
  'form.email': 'EMAIL',
  'form.emailPh': 'you@example.co.za',
  'form.whatsapp': 'WHATSAPP NUMBER',
  'form.waPh': '+27 82 000 0000',
  'form.breed': "PET'S BREED",
  'form.breedPh': 'Boerboel',
  'form.petType': 'PET TYPE',
  'form.pet.dog': 'Dog',
  'form.pet.cat': 'Cat',
  'form.pet.horse': 'Horse',
  'form.pet.other': 'Other',
  'form.age': 'PET AGE — {age} YRS',
  'form.seniorNote': 'The senior years are exactly who we built this for.',
  'form.city': 'CITY',
  'form.city.Cape Town': 'Cape Town',
  'form.city.Johannesburg': 'Johannesburg',
  'form.city.Durban': 'Durban',
  'form.city.Pretoria': 'Pretoria',
  'form.city.Gqeberha': 'Gqeberha',
  'form.city.Bloemfontein': 'Bloemfontein',
  'form.city.Other': 'Other',
  'form.products': 'PRODUCTS OF INTEREST',
  'form.concern': 'BIGGEST CONCERN',
  'form.concern.mobility': 'mobility',
  'form.concern.injury': 'injury',
  'form.concern.gut': 'gut',
  'form.concern.skin': 'skin',
  'form.concern.anxiety': 'anxiety',
  'form.concern.longevity': 'longevity',
  'form.submit': 'Join the waitlist',
  'form.submitting': 'RESERVING YOUR SPOT…',
  'form.popia':
    'POPIA COMPLIANT. WE’LL ONLY WHATSAPP/EMAIL YOU ABOUT PET PRODUCTS. UNSUBSCRIBE ANYTIME.',
  'form.err.name': 'TELL US YOUR NAME',
  'form.err.email': 'VALID EMAIL REQUIRED',
  'form.err.whatsapp': 'SA FORMAT: +27… (9 DIGITS AFTER)',
  'form.err.breed': 'BREED HELPS US DOSE RIGHT',
  'form.err.products': 'PICK AT LEAST ONE PRODUCT',
  'form.confirmed': 'WAITLIST CONFIRMED',
  'form.youreIn': "You're in, {name}.",
  'form.queueLine': 'YOU ARE #{queue} IN LINE · CODE {code}',
  'form.referred': 'VIA {ref} — YOU MOVED UP {spots} SPOTS (SIMULATED LOCALLY)',
  'form.synced': 'SYNCED TO PSA CRM ✓',
  'form.syncQueued': 'SAVED LOCALLY — WILL SYNC',
  'form.foundingNote':
    'Founding-member pricing is locked: 20% off your first 3 subscription months at launch.',
  'form.refTitle': 'MOVE UP THE QUEUE — SHARE YOUR LINK',
  'form.refBody': 'Every friend who joins with your link bumps you up {spots} more spots.',
  'form.refAria': 'Your referral link',
  'form.copy': 'COPY LINK',
  'form.copied': '✓ COPIED',
  'form.shareWa': 'SHARE ON WHATSAPP',
  'form.refWaText':
    '{name} here — I’ve joined the PSA PETS founding waitlist (COA-verified pet peptides, launching in SA). Use my link and we both move up the queue: {link}',
  'form.confirmWa': 'Confirm faster on WhatsApp',
  'form.waMessage':
    "Hi PSA PETS! I'm {name}, on the waitlist for {products} for my {petType}, {breed}, age {age}. Code {code}.",
  'form.popiaFoot':
    'POPIA COMPLIANT · WE’LL ONLY CONTACT YOU ABOUT PET PRODUCTS · UNSUBSCRIBE ANYTIME',

  /* ---------------- Quiz ---------------- */
  'quiz.overline': 'PSA PETS · PERSONALIZATION QUIZ',
  'quiz.hookTitle': 'Build your dog’s (or cat’s) peptide plan in 60 seconds.',
  'quiz.hookSub':
    'Seven quick taps. A rule-based, vet-reviewed stack for your pet’s age, size and biggest concern — with the evidence graded honestly.',
  'quiz.hookCta': 'Start my pet’s plan',
  'quiz.hookMeta': 'FREE · VET-REVIEWED LOGIC · NO PAYMENT',
  'quiz.back': '← BACK',
  'quiz.continue': 'Continue',
  'quiz.species.dog': 'dog',
  'quiz.species.cat': 'cat',
  'quiz.species.horse': 'horse',
  'quiz.species.pet': 'pet',
  'quiz.step1.kicker': 'FIRST THINGS FIRST',
  'quiz.step1.title': 'Who are we building the plan for?',
  'quiz.step1.sub': 'Tap one — cats and horses get their own logic.',
  'quiz.enc.petType': 'Lovely — every {pet} gets vet-reviewed logic here.',
  'quiz.step2.kicker': 'THE PATIENT FILE',
  'quiz.step2.title': 'Tell us about your {pet}.',
  'quiz.step2.sub': 'Name, breed and age — the senior flag changes the plan.',
  'quiz.petName.pet': 'PET’S NAME',
  'quiz.petName.horse': 'HORSE’S NAME',
  'quiz.err.petName': 'A NAME HELPS US PERSONALIZE THE PLAN',
  'quiz.err.age': 'AGE MUST BE 1–30 YEARS',
  'quiz.enc.profile': 'Great — {name} is in good hands.',
  'quiz.breed': 'BREED',
  'quiz.optional': '(OPTIONAL)',
  'quiz.breedPh': 'Boerboel, rescue special, unknown…',
  'quiz.ageLabel': 'AGE — {age} YRS',
  'quiz.seniorOn': 'SENIOR LOGIC: ON — {threshold} YRS',
  'quiz.step3.kicker': 'DOSING GEOMETRY',
  'quiz.step3.title': 'How big is {name}?',
  'quiz.step3.sub': 'Weight bands drive the dosing guide — XL is Boerboel-proof.',
  'quiz.enc.size': 'Noted — dosing guidance scales to {name}’s frame.',
  'quiz.step4.kicker': 'WHAT MATTERS MOST',
  'quiz.step4.title': 'What’s {name} dealing with?',
  'quiz.step4.sub': 'Pick up to {max}. The stack builds around these.',
  'quiz.selected': '{count} / {max} SELECTED',
  'quiz.calmingDev': 'CALMING: IN DEVELOPMENT',
  'quiz.err.concerns': 'PICK AT LEAST ONE — WHAT MATTERS MOST?',
  'quiz.enc.concerns': 'Got it — we’re building around what matters most for {name}.',
  'quiz.step5.kicker': 'SAFETY CHECK',
  'quiz.step5.title': 'What is {name} already on?',
  'quiz.step5.sub': 'Supplements, chronic meds — and whether a vet is in the picture.',
  'quiz.suppsLabel': 'CURRENT SUPPLEMENTS / MEDS',
  'quiz.suppsPh': 'e.g. joint chews, chronic anti-inflammatories, nothing yet…',
  'quiz.suppsNote': 'WE FLAG INTERACTIONS IN YOUR PLAN NOTES — YOUR VET GETS THE FULL LIST.',
  'quiz.vetQ': 'DO YOU HAVE A VET FOR {name}?',
  'quiz.vetYes': 'YES — HAVE A VET',
  'quiz.vetNo': 'NO VET YET',
  'quiz.err.vet': 'ONE TAP — DO YOU HAVE A VET?',
  'quiz.noVetNote':
    'No vet yet? {name}’s plan ships with vet-reviewed dosing guidance — and we’ll always nudge you toward a consult before starting anything new.',
  'quiz.enc.vetYes': 'Perfect — bring {name}’s plan to your next consult.',
  'quiz.enc.vetNo': 'No vet yet? We’ll always nudge you toward one — promise.',
  'quiz.step6.kicker': 'ALMOST THERE',
  'quiz.step6.title': 'Where do we send {name}’s plan?',
  'quiz.step6.sub': 'Your stack is ready. One last step before the reveal.',
  'quiz.yourName': 'YOUR NAME',
  'quiz.email': 'EMAIL',
  'quiz.whatsapp': 'WHATSAPP NUMBER',
  'quiz.popia':
    'I’m happy for PSA PETS to contact me about {name}’s plan and pet product launches. POPIA compliant — unsubscribe anytime.',
  'quiz.err.owner': 'TELL US YOUR NAME',
  'quiz.err.email': 'VALID EMAIL REQUIRED',
  'quiz.err.whatsapp': 'SA FORMAT: +27… OR 0… (9 DIGITS)',
  'quiz.err.popia': 'POPIA CONSENT REQUIRED',
  'quiz.seePlan': 'See {name}’s plan →',
  'quiz.leadFoot':
    'POPIA COMPLIANT · WE’LL ONLY WHATSAPP/EMAIL YOU ABOUT PET PRODUCTS · NO PAYMENT REQUIRED',
  'quiz.readyLine': 'PLAN READY · {date} · REF {ref}',
  'quiz.resultsTitle': 'The PSA PETS stack for {name}.',
  'quiz.results.count': '{count} products',
  'quiz.results.countOne': '1 product',
  'quiz.results.matched': 'matched to {concerns}',
  'quiz.results.wellness': 'everyday wellness',
  'quiz.results.senior': ' — with senior logic applied',
  'quiz.protocol': 'PSA PETS · PERSONALIZED PROTOCOL',
  'quiz.patient': 'PATIENT',
  'quiz.speciesLabel': 'SPECIES',
  'quiz.breedRow': 'BREED',
  'quiz.ageRow': 'AGE',
  'quiz.yrs': 'YRS',
  'quiz.seniorTag': 'SENIOR',
  'quiz.sizeBand': 'SIZE BAND',
  'quiz.vetOnFile': 'VET ON FILE',
  'quiz.yes': 'YES',
  'quiz.notYet': 'NOT YET',
  'quiz.itemX': 'ITEM {a} / {b}',
  'quiz.calmingBadge': 'IN DEVELOPMENT',
  'quiz.calmingTitle': 'Calming formula — coming for {name}',
  'quiz.calmingBody':
    'For the storm-shakes and fireworks: our calming peptide (αs1-casozepine class, placebo-controlled in cats and dogs) is in development. Join the waitlist and you’ll hear first.',
  'quiz.disclaimer': 'NOT VETERINARY MEDICINES · NOT YET FOR SALE · ALWAYS CONSULT YOUR VET',
  'quiz.skipLead': 'Show my plan first →',
  'quiz.save.kicker': 'SAVE YOUR PLAN',
  'quiz.save.title': 'Save {name}’s plan + reserve founding price',
  'quiz.save.sub':
    'We’ll WhatsApp/email the plan and hold your founding-member spot. No payment, unsubscribe anytime.',
  'quiz.save.cta': 'Save my plan →',
  'quiz.save.done': 'PLAN SAVED — WE’LL BE IN TOUCH',
  'quiz.stackToast': 'STACK ADDED — RESERVE IT BELOW',
  'quiz.dose.title': 'DOSING GUIDE — BY WEIGHT BAND',
  'quiz.dose.band': 'BAND {band}',
  'quiz.dose.drops.S': '0.25 ML (5 DROPS)/DAY',
  'quiz.dose.drops.M': '0.5 ML (10 DROPS)/DAY',
  'quiz.dose.drops.L': '0.75 ML (15 DROPS)/DAY',
  'quiz.dose.drops.XL': '1 ML (20 DROPS)/DAY',
  'quiz.dose.scoop.S': '½ SCOOP/DAY',
  'quiz.dose.scoop.M': '1 SCOOP/DAY',
  'quiz.dose.scoop.L': '1½ SCOOPS/DAY',
  'quiz.dose.scoop.XL': '2 SCOOPS/DAY',
  'quiz.dose.cycle': 'ONCE DAILY ON FOOD · 5 DAYS ON / 2 DAYS OFF',
  'quiz.dose.dailyFood': 'ONCE DAILY, STIRRED INTO FOOD',
  'quiz.dose.equine': 'EQUINE CHART',
  'quiz.dose.vetGuided': 'DOSE SET WITH YOUR VET',
  'quiz.dose.intro': 'START AT HALF DOSE FOR WEEK 1 — CONSERVATIVE INTRO, THEN TITRATE UP',
  'quiz.dose.chart': 'VET-REVIEWED DOSING CHART SHIPS WITH EVERY ORDER',
  'quiz.dose.print': 'DOWNLOAD / PRINT VET HANDOUT',
  'quiz.addStack': 'Add my stack to my launch box',
  'quiz.joinStack': 'Join waitlist for my stack',
  'quiz.retake': 'Not right? Retake the quiz',
  'quiz.evidenceLink': 'See the evidence behind every recommendation →',
  /* stack "why" lines (quiz.ts emits whyKey alongside the English `why`) */
  'quiz.why.mc.mobility':
    "Published canine RCT data — the daily joint foundation for {name}'s stiffness.",
  'quiz.why.bpc.mobility':
    'The compound SA owners ask for most — soft-tissue support for a {age}-year-old {breed}.',
  'quiz.why.rb.injury': "The rehab pairing — built for {name}'s comeback, not the couch.",
  'quiz.why.mc.injury': 'Long-game joint support while {name} heals.',
  'quiz.why.kpv.gut':
    "Gut-lining support for {name}'s sensitive system — one dropper a day.",
  'quiz.why.kpv.skin': 'Skin-flare support from the inside out, dosed for {name}.',
  'quiz.why.it.senior': "Senior-grade immune support for {name}'s grey-muzzle years.",
  'quiz.why.mc.senior': 'Keeps the daily foundation under an aging frame.',
  'quiz.why.mc.prevention': 'Prevention done properly — the evidence-backed daily habit.',
  'quiz.why.it.prevention': 'Resilience support before {name} ever needs it.',
  'quiz.why.it.age':
    'Age {age} puts {name} in our senior protocol — immune resilience matters now.',
  'quiz.why.mc.fallback':
    'The everyday foundation — published canine RCT data behind every tub.',
  'quiz.why.it.fallback':
    'Gentle daily resilience support while our calming formula is in development.',
  'quiz.why.honesty':
    "Printed plainly: part of {name}'s stack is backed by preclinical evidence only — no canine trials yet. We publish what exists, and what doesn't. Your vet gets the full citation pack.",
})

Object.assign(en, {
  /* ---------------- Waitlist page (4-step funnel) ---------------- */
  'wlp.step.1': '01 YOUR PET',
  'wlp.step.2': '02 YOU',
  'wlp.step.3': '03 PRODUCTS',
  'wlp.step.4': '04 CONFIRM',
  'wlp.stepOf': 'STEP {n} OF 4',
  'wlp.s1.title': 'First — who’s this for?',
  'wlp.s1.multiHint': '66% OF SA PET HOUSEHOLDS HAVE 2+ ANIMALS — SELECT ALL THAT APPLY',
  'wlp.s1.pets': '+{n} PETS',
  'wlp.pet.dog': 'DOG',
  'wlp.pet.cat': 'CAT',
  'wlp.pet.horse': 'HORSE',
  'wlp.pet.other': 'OTHER',
  'wlp.err.petTypes': 'SELECT AT LEAST ONE PET TYPE',
  'wlp.petName': 'PET’S NAME',
  'wlp.petNamePh': 'e.g. Bella',
  'wlp.breed': 'BREED',
  'wlp.breedPh': 'e.g. Boerboel, Tabby, Thoroughbred',
  'wlp.age': 'PET AGE',
  'wlp.ageReadout': 'AGE: {age} YRS',
  'wlp.ageAria': 'Pet age in years',
  'wlp.seniorQuote': '“The senior years are exactly who we built this for.”',
  'wlp.concern': 'BIGGEST CONCERN',
  'wlp.concern.mobility': 'MOBILITY',
  'wlp.concern.injury': 'INJURY / RECOVERY',
  'wlp.concern.gut': 'GUT',
  'wlp.concern.skin': 'SKIN',
  'wlp.concern.anxiety': 'ANXIETY',
  'wlp.concern.longevity': 'LONGEVITY / SENIOR CARE',
  'wlp.rec.mobility': 'RECOMMENDED: BPC-157 + COLLAGEN',
  'wlp.rec.injury': 'RECOMMENDED: RECOVERY BLEND',
  'wlp.rec.gut': 'RECOMMENDED: KPV',
  'wlp.rec.skin': 'RECOMMENDED: KPV',
  'wlp.rec.anxiety': 'CALMING: IN DEVELOPMENT — JOIN TO HEAR FIRST',
  'wlp.rec.longevity': 'RECOMMENDED: IMMUNE + COLLAGEN',
  'wlp.continue': 'Continue',
  'wlp.back': 'Back',
  'wlp.s2.title': 'And who do we WhatsApp when it’s ready?',
  'wlp.yourName': 'YOUR NAME',
  'wlp.yourNamePh': 'e.g. Thandi Nkosi',
  'wlp.email': 'EMAIL',
  'wlp.whatsapp': 'WHATSAPP NUMBER',
  'wlp.waNote': 'WE CONFIRM LAUNCH ON WHATSAPP FIRST',
  'wlp.city': 'CITY',
  'wlp.cityPh': 'Select your city',
  'wlp.city.Cape Town': 'Cape Town',
  'wlp.city.Other': 'Other',
  'wlp.popia':
    "I'm happy for PSA PETS to contact me about pet product launches. POPIA compliant, unsubscribe anytime.",
  'wlp.err.owner': 'TELL US YOUR NAME',
  'wlp.err.email': 'A VALID EMAIL IS REQUIRED',
  'wlp.err.whatsapp': 'SA MOBILE: 9 DIGITS AFTER +27',
  'wlp.err.city': 'SELECT YOUR CITY',
  'wlp.err.popia': 'POPIA CONSENT IS REQUIRED TO JOIN',
  'wlp.s3.titleNamed': 'What should we put {name} first in line for?',
  'wlp.s3.titleProduct': '…first in line for {product}?',
  'wlp.s3.titleGeneric': 'What should we put you first in line for?',
  'wlp.firstToLaunch': 'FIRST TO LAUNCH',
  'wlp.waiting': '{count} WAITING',
  'wlp.err.products': 'SELECT AT LEAST ONE PRODUCT',
  'wlp.clearAll': 'CLEAR SELECTION',
  'wlp.allProducts': 'KEEP ME POSTED ON EVERYTHING',
  'wlp.perk': 'WAITLIST PERK',
  'wlp.perkBodyA': 'Joining today locks',
  'wlp.perkBodyStrong': '20% off your first 3 subscription months',
  'wlp.perkBodyB': 'at launch.',
  'wlp.submitting': 'Reserving your spot…',
  'wlp.submit': 'Join the waitlist',
  'wlp.welcomeBack': 'WELCOME BACK — YOUR TICKET:',
  'wlp.confirmedNamed': "You're in — and so is {name}.",
  'wlp.confirmed': "You're in.",
  'wlp.ticketTitle': 'PSA PETS · WAITLIST TICKET',
  'wlp.rowOwner': 'OWNER',
  'wlp.rowPet': 'PET',
  'wlp.rowProducts': 'PRODUCTS',
  'wlp.rowCity': 'CITY',
  'wlp.rowQueue': 'QUEUE',
  'wlp.rowCode': 'CODE',
  'wlp.everything': 'EVERYTHING',
  'wlp.petLine': '{name}{breed} · AGE {age}',
  'wlp.alreadyRegistered': '(ALREADY REGISTERED — POSITION KEPT)',
  'wlp.perkRow': 'PERK',
  'wlp.perkValue': '20% OFF × 3 MONTHS · LOCKED',
  'wlp.confirmWa': 'Confirm faster on WhatsApp',
  'wlp.waNote2': 'SKIP THE EMAIL QUEUE — WHATSAPP CONFIRMS INSTANTLY',
  'wlp.backToCatalog': 'Back to catalog',
  'wlp.another': 'REGISTER ANOTHER PET →',
  'wlp.foot': "TICKET SAVED ON THIS DEVICE · WE'LL NEVER SPAM · POPIA COMPLIANT",
  'wlp.waMessage':
    'Hi PSA PETS — confirming my waitlist ticket.\nName: {name}\nPet: {pet}\nProducts: {products}\nCode: {code} · Queue #{queue}',

  /* ---------------- Product page ---------------- */
  'pdp.notFound.overline': 'CATALOG / NOT FOUND',
  'pdp.notFound.title': 'We don’t make that one (yet).',
  'pdp.notFound.body': 'Five formulas are in development — every one of them has a waitlist.',
  'pdp.notFound.cta': 'Back to the catalog',
  'pdp.crumb': 'CATALOG',
  'pdp.firstLaunch': '★ FIRST TO LAUNCH — EST. Q1 2026',
  'pdp.vat': 'VAT INCLUDED',
  'pdp.estRetail': 'EST. RETAIL {price}',
  'pdp.plan.sub': 'MONTHLY AUTOSHIP — 15% OFF',
  'pdp.plan.subBody': 'Pause or cancel via WhatsApp · free shipping over R1,500',
  'pdp.plan.once': 'ONE-TIME — {price}',
  'pdp.plan.onceBody': '30-day supply, ships when we launch.',
  'pdp.plan.aria': 'Purchase plan',
  'pdp.plan.badge': 'ACTIVATES AT LAUNCH',
  'pdp.disabled': 'COMING SOON — NOT YET FOR SALE',
  'pdp.disabledTip': 'Not yet — reserve it in your Launch Box below.',
  'pdp.orJoin': 'OR JOIN THE {product} WAITLIST ↓',
  'pdp.ownersWaiting': '{count} SA OWNERS ALREADY WAITING',
  'pdp.trust2': 'COA ON EVERY BATCH',
  'pdp.trust3': 'POPIA COMPLIANT',
  'pdp.shot.front': 'BOTTLE FRONT',
  'pdp.shot.scale': 'FOR SCALE',
  'pdp.hiw.overline': 'HOW IT WORKS',
  'pdp.hiw.title': 'Simple by design.',
  'pdp.hiw.step': 'STEP {n}',
  'pdp.ev.overline': 'EVIDENCE & CITATIONS',
  'pdp.ev.titleA': 'What the science',
  'pdp.ev.titleEm': 'actually',
  'pdp.ev.titleB': 'says.',
  'pdp.ev.sub':
    'Every claim on this page carries its evidence level. Green means published canine data; amber means the evidence is earlier-stage — and we say so.',
  'pdp.ev.honesty':
    'HONESTY, IN WRITING: IF A COMPOUND HAS NO CANINE EFFICACY TRIALS, THE RECORD ABOVE SAYS SO — BEFORE YOU EVER ASK.',
  'pdp.cmp.overline': 'THE BENCHMARK',
  'pdp.cmp.title': 'Why wait for local?',
  'pdp.cmp.import': 'TYPICAL US IMPORT',
  'pdp.cmp.psa': 'PSA PETS AT LAUNCH',
  'pdp.cmp.price': 'PRICE',
  'pdp.cmp.shipping': 'SHIPPING',
  'pdp.cmp.docs': 'DOCUMENTATION',
  'pdp.cmp.support': 'SUPPORT',
  'pdp.cmp.imp1': '$99–$149 + shipping + duties',
  'pdp.cmp.imp2': '2–6 weeks, customs risk',
  'pdp.cmp.imp3': 'Varies by seller',
  'pdp.cmp.imp4': 'Email, US hours',
  'pdp.cmp.psa1': '{price}, VAT included',
  'pdp.cmp.psa2': 'Local courier, free over R1,500',
  'pdp.cmp.psa3': 'COA on every batch, ≥99% HPLC',
  'pdp.cmp.psa4': 'WhatsApp, SA hours',
  'pdp.wl.overline': 'WAITLIST · {product}',
  'pdp.wl.title': 'Be first in line for {product}.',
  'pdp.wl.body':
    'Founding members lock 20% off their first 3 subscription months at launch — and we’ll WhatsApp you the moment this formula ships.',
  'pdp.counter': '{count} WAITING',
  'pdp.counterAvg': ' · AVG. {avg} NEW / DAY',
  'pdp.rel.overline': 'COMPLETE THE PROTOCOL',
  'pdp.rel.title': 'Pairs well with.',
  'pdp.rel.first': '★ FIRST TO LAUNCH',
  'pdp.waiting': '{count} WAITING',
  'pdp.outro.back': '← BACK TO CATALOG',

  /* ---------------- Footer ---------------- */
  'foot.tagline': 'Research-grade peptides for the pets you love. Cape Town, South Africa.',
  'foot.catalog': 'CATALOG',
  'foot.learn': 'LEARN',
  'foot.science': 'Science & evidence library',
  'foot.waitlist': 'Join the waitlist',
  'foot.mainSite': 'Main site — peptides for humans',
  'foot.questions': 'QUESTIONS? TEXT US',
  'foot.questionsBody': 'One WhatsApp message — real humans, Cape Town hours.',
  'foot.textUs': 'TEXT US',
  'foot.waMsg': 'Hi PSA PETS! A question about the pet products.',
  'foot.bottom': '© {year} PEPTIDE SOUTH AFRICA · PRICES INCLUDE VAT · POPIA COMPLIANT · ≥99% HPLC TESTED',
})

Object.assign(en, {
  /* ---------------- Testimonials (video stories) ---------------- */
  'tm.overline': 'REAL FAMILIES. REAL COMEBACKS.',
  'tm.title': 'The spark came back.',
  'tm.sub':
    'Member stories from our founding community. Videos marked AI are re-enactments — the words are real.',
  'tm.feat.kicker': 'FEATURED STORY · SHARED WITH PERMISSION',
  'tm.feat.quote1':
    '“I revived my 14-year-old dog with peptides. 6 months ago, he was slowing down fast. He was limping, achy, getting up slowly, and couldn’t jump on the couch. We honestly didn’t know if we had 6 months left with him. Today, our boy is running, jumping on the patio, going on long walks again, and even his hearing is back.”',
  'tm.feat.protocolTitle': 'HIS PROTOCOL',
  'tm.feat.proto1.title': 'BPC-157 + TB-500',
  'tm.feat.proto1.body': '1–2 mg/day, 5 days on / 2 days off → less limping within weeks.',
  'tm.feat.proto2.title': 'BIOREGULATOR STACK',
  'tm.feat.proto2.body': 'For kidney markers — labs monitored, same as his owner’s.',
  'tm.feat.proto3.title': 'TESTOSTERONE SUPPORT',
  'tm.feat.proto3.body':
    'Vet-supervised hormone support for his neutered senior dog — dose titrated under bloodwork. “Shot day is like a revival.”',
  'tm.feat.quote2':
    '“6 months ago we were counting the time we had left with him. Now I genuinely believe we have another 3 years. If you have a dog, understand that he’s aging the same way you are. He needs help, but he can’t do the research… you can!”',
  'tm.feat.attr': '— COMMUNITY MEMBER, CAPE TOWN · 70 KG SENIOR BOERBOEL',
  'tm.feat.disclaimer':
    'SHARED BY A COMMUNITY MEMBER. HORMONE PROTOCOLS REQUIRE VETERINARY SUPERVISION AND BLOODWORK. PSA PETS DOES NOT SELL TESTOSTERONE OR ADVISE ON PRESCRIPTION MEDICINES.',
  'tm.aiChip': 'AI RE-ENACTMENT',
  'tm.play': 'Play',
  'tm.pause': 'Pause',
  'tm.v1.cap': 'RUNNING AGAIN · WEEK 14',
  'tm.v2.cap': 'BACK ON THE PATIO · HIS KIDS’ GUARDIAN',
  'tm.v3.cap': 'LONG WALKS ARE BACK · PROMENADE, CAPE TOWN',
  'tm.v1.quote': '“Within weeks, less limping. Within months, this.”',
  'tm.v1.meta': 'L. VAN DER M. · CAPE TOWN · BOERBOEL, 9',
  'tm.v2.quote': '“The kids got their guardian back.”',
  'tm.v2.meta': 'S. NAIDOO · DURBAN · BOERBOEL, 11',
  'tm.v3.quote': '“He pulls me up the promenade hills again.”',
  'tm.v3.meta': 'J. BOTHA · SEA POINT · LABRADOR, 13',
  'tm.grid.kicker': 'MORE FROM THE COMMUNITY',
  'tm.verified': 'COMMUNITY STORY · SHARED WITH PERMISSION',
  'tm.q1.quote':
    'The 60-second quiz nailed her stack — collagen plus BPC-157. Six weeks in, our 12-year-old shepherd climbs into the bakkie unassisted again.',
  'tm.q1.meta': 'MARTHINUS P. · STELLENBOSCH · GERMAN SHEPHERD, 12 · BPC-157 + COLLAGEN',
  'tm.q2.quote':
    'I WhatsApped at 21:00 expecting a bot. A real person in Cape Town answered in four minutes and adjusted my dog’s dosing schedule with me.',
  'tm.q2.meta': 'PRIYA R. · UMHLANGA · CORGI, 8 · RECOVERY BLEND',
  'tm.q3.quote':
    'Our vet read the COA before we did. That piece of paper is why we joined — and why we stay.',
  'tm.q3.meta': 'ANNERIE V. · PRETORIA · BOERBOEL, 11 · MOBILITY COLLAGEN',
  'tm.q4.quote':
    'After his cruciate surgery, the Recovery Blend took him from crate rest to beach walks a month ahead of schedule.',
  'tm.q4.meta': 'SIPHO M. · DURBAN · RIDGEBACK, 4 · RECOVERY BLEND',
  'tm.cta': 'Your dog’s comeback starts with 60 seconds →',

  /* ---------------- 60-day mobility guarantee band ---------------- */
  'guar.overline': 'THE PSA PETS PROMISE',
  'guar.title': 'If you don’t see the difference, you don’t pay.',
  'guar.body':
    'Every PSA PETS launch product ships with a 60-day mobility guarantee. If your dog’s movement, recovery or spark doesn’t meaningfully improve, we refund every rand. No hoops, no forms — one WhatsApp message.',
  'guar.chip1': '60 DAYS',
  'guar.chip2': 'FULL REFUND',
  'guar.chip3': 'ONE WHATSAPP',
  'guar.cta': 'SEE THE GUARANTEE TERMS →',
  'guar.term1': '60 DAYS FROM DELIVERY — MOVEMENT, RECOVERY OR SPARK',
  'guar.term2': 'FULL REFUND, NO FORMS — ONE WHATSAPP MESSAGE',
  'guar.term3': 'APPLIES TO EVERY LAUNCH PRODUCT, EVERY BATCH',
  'guar.term4': 'PRODUCTS ARE IN DEVELOPMENT — TERMS ACTIVATE AT LAUNCH',

  /* ---------------- Protocol pipeline teaser ---------------- */
  'pipe.overline': 'PROTOCOL PIPELINE',
  'pipe.titleA': 'Next out of the',
  'pipe.titleEm': 'lab.',
  'pipe.sub':
    'Three formulas in active development. Early-list members hear launch dates first — and keep founding pricing.',
  'pipe.badge': 'IN DEVELOPMENT',
  'pipe.calm.name': 'PSA PETS CALM',
  'pipe.calm.spec': 'SELANK-BASED CALMING BLEND',
  'pipe.calm.desc': 'For storm-shakes, fireworks and separation stress — calm without sedation.',
  'pipe.immune.name': 'PSA PETS IMMUNE+',
  'pipe.immune.spec': 'TA-1 + KPV + GHK-CU',
  'pipe.immune.desc': 'The immune-resilience stack for seniors and frequent patients.',
  'pipe.senior.name': 'PSA PETS SENIOR VITALITY',
  'pipe.senior.spec': 'LONGEVITY BLEND',
  'pipe.senior.desc': 'Built around canine aging research — for the grey-muzzle years.',
  'pipe.cta': 'JOIN THE EARLY LIST',
})

/* ============================== Afrikaans ============================== */

const af: Dict = {
  /* ---------------- Navbar ---------------- */
  'nav.catalog': 'Katalogus',
  'nav.science': 'Wetenskap',
  'nav.waitlist': 'Waglys',
  'nav.marquee':
    'KOM BINNEKORT — PEPTIEDE VIR TROETELDIERE · SLUIT AAN BY DIE WAGLYS · STIGTERSLEDE SLUT 20% AF OP HUL EERSTE 3 MAANDE VAS · ',
  'nav.dismissAnnouncement': 'Verwyder aankondiging',
  'nav.waitingChip': '{count} SA-TROETELDIEREËNAARS WAG',
  'nav.cartAria': 'Maak jou Launch Box oop, {count} produkte',
  'nav.cta': 'Sluit aan by die waglys',
  'nav.waMsg': 'Hallo PSA PETS! Ek het ’n vraag oor die troeteldier-peptiedwaglys.',
  'nav.waAria': 'WhatsApp ons',
  'nav.close': '✕ SLUIT',
  'nav.openMenu': 'Maak die kieslys oop',
  'nav.closeMenu': 'Maak die kieslys toe',
  'nav.langAria': 'Verander taal na {lang}',

  /* ---------------- Hero ---------------- */
  'hero.overline': 'PEPTIDE SOUTH AFRICA · STEL BEKEND',
  'hero.line1': 'Gee hulle meer',
  'hero.line2': 'goeie jare.',
  'hero.sub':
    'Suid-Afrika se eerste COA-geverifieerde troeteldier-peptiedreeks — navorsingsgraad-peptiede en kollageen vir honde, katte en perde, met ’n lotnommer op elke etiket. Binnekort beskikbaar.',
  'hero.ctaQuiz': 'Doen die 60-sekonde troeteldierquiz',
  'hero.ctaWaitlist': 'Sluit aan by die waglys',
  'hero.trust': '≥99% HPLC · COA BY ELKE LOT · BTW INGESLUIT · GRATIS AFLEWERING BO R1,500',
  'hero.anno.recovery': 'HERSTEL → WOLVERINE BLEND',
  'hero.anno.senior': 'SENIORJARE → IMMUNE',
  'hero.anno.joints': 'GEWRIGTE & MOBILITEIT → COLLAGEN + BPC-157',
  'hero.anno.gut': 'DERMWAND → KPV',
  'hero.captionLine': 'DIESEL · 9 JAAR · KAAPSTAD',
  'hero.captionWaiting': 'WAG #0037',
  'hero.scrollChip': 'ROL — DIE WETENSKAP ↓',
  'hero.imgAlt': 'Diesel, ’n waardige nege jaar oue Boerboel teen ’n warm room agtergrond',

  /* ---------------- Trust strip ---------------- */
  'trust.1.label': '≥99% HPLC-GETOETS',
  'trust.1.text': 'Suiwerheid op elke lot geverifieer',
  'trust.2.label': 'COA INGESLUIT',
  'trust.2.text': 'Analisesertifikaat met elke produk',
  'trust.3.label': 'PROTOKOLLE DEUR VEEARTSE HERSIEN',
  'trust.3.text': 'Doseringsriglyne saam met veeartse geskryf',
  'trust.4.label': 'PRYSE SLUIT BTW IN',
  'trust.4.text': 'Geen verrassings by bekendstelling nie',
  'trust.5.label': 'VOLDOEN AAN POPIA',
  'trust.5.text': 'Jou data bly joune',

  /* ---------------- Proof ticker ---------------- */
  'ticker.1': 'LERATO · KAAPSTAD · 2 BOERBOELS · OP DIE BPC-157-LYS',
  'ticker.2': 'PIETER · STELLENBOSCH · RIDGEBACK, 10 JAAR · OP DIE COLLAGEN-LYS',
  'ticker.3': 'AYESHA · DURBAN · 3 KATTE · OP DIE KPV-LYS',
  'ticker.4': 'THABO · JOHANNESBURG · PITBULL, 5 JAAR · OP DIE RECOVERY-LYS',
  'ticker.5': 'MARIE · PAARL · SENIOR-BOERBOEL · OP DIE IMMUNE-LYS',
  'ticker.6': 'SIPHO · GQEBERHA · DUITSE HERDERSHOND · OP DIE BPC-157-LYS',
  'ticker.7': 'ANNERIE · PRETORIA · BOERBOEL, 11 JAAR · OP DIE COLLAGEN-LYS',
  'ticker.8': 'DANIEL · KAAPSTAD · BRUIKKAT, 7 JAAR · OP DIE KPV-LYS',
  'ticker.9': 'NOLWAZI · BLOEMFONTEIN · 2 PERDE · OP DIE RECOVERY-LYS',
  'ticker.10': 'JOHAN · SOMERSET-WES · LABRADOR, 12 JAAR · OP DIE IMMUNE-LYS',
  'ticker.tag': 'GESIMULEERDE VOORBEELD-VOER',

  /* ---------------- Science story ---------------- */
  'ss.quote':
    '“Veroudering is die grootste veranderbare risikofaktor vir die siektes wat ons honde te vroeg van ons af wegneem.”',
  'ss.quoteCaption': '— HOEKOM ONS DIT BOU',
  'ss.chip': 'ATLETE KOM OOK OP VIER BENE',
  'ss.h1a': 'Die wetenskap van verouderende troeteldiere is uiteindelik hier — en dit kom',
  'ss.h1em': 'Suid-Afrika toe.',
  'ss.p1':
    'Vir dekades het langlewendheidnavorsing op mense gefokus. Dit verander. In die VSA bestuur maatskappye soos Loyal die grootste honde-verouderingstudie in die geskiedenis — 1 317 honde oor 70 veeartspraktyke. Die vraagsein is onmiskenbaar: troeteldier-eienaars wil meer gesonde jare saam met hulle diere hê.',
  'ss.p2':
    'PSA PETS bring daardie ambisie huis toe. Ons pas die verbindings waarvoor troeteldier-eienaars wêreldwyd alreeds vra — BPC-157, KPV, kollageenpeptiede — aan vir Suid-Afrikaanse rakke, met Suid-Afrikaanse pryse, BTW ingesluit, en ’n analisesertifikaat by elke lot.',
  'ss.stat1.label': 'HONDE',
  'ss.stat1.text': 'in Loyal se baanbreker-STAY-proef',
  'ss.stat2.label': 'KLINIEKE',
  'ss.stat2.text': 'wat vandag honde-langlewendheidnavorsing doen',
  'ss.stat3.label': 'PRODUKTE',
  'ss.stat3.text': 'in ontwikkeling vir SA-troeteldiere',

  /* ---------------- Pinned vial ---------------- */
  'pv.1.title': 'MOBILITEIT',
  'pv.1.text': 'Ondersteun gemaklike beweging in verouderende gewrigte en sagte weefsel.',
  'pv.2.title': 'HERSTEL',
  'pv.2.text': 'Ondersteun die liggaam se natuurlike sagteweefselherstel ná besering of operasie.',
  'pv.3.title': 'DERM & VEL',
  'pv.3.text': 'Ondersteun dermwand-integriteit en ’n kalm, gesonde vel.',
  'pv.4.title': 'LANGLEWENDHEID',
  'pv.4.text': 'Meer gemaklike jare. Dis die hele punt.',
  'pv.honesty': '* ONDERSTEUN — BEHANDEL NIE. SIEN SITASIES ↓',
  'pv.cta.kicker': 'GEREED WANNEER ONS BEKEND STEL',
  'pv.cta.label': 'Bespreek BPC-157',
  'pv.cta.sub': 'STIGTERSLEDE SLUIT 20% AF VAS · GEEN BETALING VANDAG',
  'sci.viewSource': 'SIEN BRON',

  /* ---------------- Catalog ---------------- */
  'cat.overline': 'DIE KATALOGUS · KOM BINNEKORT',
  'cat.titleA': 'Vyf formules.',
  'cat.titleEm': 'Elkeen sy eie waglys.',
  'cat.sub':
    'Sluit aan by enige produk se lys — stigterslede sluit 20% afkorting op hul eerste 3 intekenmaande by bekendstelling vas.',
  'cat.shortlist': 'JOU KEURLYS',
  'cat.waiting': 'WAG',
  'cat.ownersOnLists': '{count} SA-EIENAARS OP ONS LYSTE',
  'cat.joinCta': 'Sluit by ’n waglys aan ↓',
  'cat.howSubs': 'HOE INTEKENINGE WERK',
  'cat.firstLaunch': '★ EERSTE OM TE LANSEER — VERWAG K1 2026',
  'cat.joinWaitlist': 'Sluit by waglys aan',
  'cat.productPage': 'PRODUKBLADSY →',
  'product.benefit.bpc-157': 'Mobiliteit-, sagteweefsel- en herstelondersteuning vir honde en katte.',
  'product.benefit.kpv': 'Dermwand- en velondersteuning vir sensitiewe troeteldiere.',
  'product.benefit.recovery-blend':
    "Die 'Wolverine-parring' vir besering-rehabilitasie en na-operasie-ondersteuning.",
  'product.benefit.immune-thymogen': 'Immuunweerstand-ondersteuning vir seniors en gereelde pasiënte.',
  'product.benefit.mobility-collagen':
    'Die voldoenende baan: gepubliseerde honde-RCT-bewyse agter elke houer.',

  /* ---------------- Badges / shared molecules ---------------- */
  'badge.comingSoon': 'KOM BINNEKORT',
  'addbox.add': 'VOEG BY LAUNCH BOX',
  'addbox.added': 'IN JOU LAUNCH BOX ✓',
  'cite.header': 'BEWYSE & SITASIES ({count})',
  'cite.open': 'MAAK OOP',
  'cite.close': 'MAAK TOE',

  /* ---------------- Subscriptions ---------------- */
  'subs.overline': 'HOE DIT GAAN WERK',
  'subs.titleA': 'Teken in. Spaar.',
  'subs.titleEm': 'Raak nooit op nie.',
  'subs.perk1.title': 'Elke outomatiese bestelling',
  'subs.perk1.body': 'Die Chewy- en PetTides-standaard — 10–15% af, elke maand, geen kodes nie.',
  'subs.perk2.title': 'Gratis aflewering',
  'subs.perk2.body': 'Gratis aflewering bo R1,500, BTW altyd ingesluit, oral in SA.',
  'subs.perk3.title': 'Laat wag of kanselleer enige tyd',
  'subs.perk3.body':
    'Een WhatsApp-boodskap laat wag, slaan oor of kanselleer. Geen keuselys-hell, geen skuldgevoel nie.',
  'subs.multipet.chip': 'MULTI-TROETELDIER-BONDEL · +5% AF PER TROETELDIER',
  'subs.multipet.titleA': '66% van troeteldierhuishoudings het',
  'subs.multipet.titleEm': 'meer as een dier.',
  'subs.multipet.body':
    'Multi-troeteldier-bondels stapel ’n ekstra 5% afkorting per bykomende troeteldier — die hond, die kat en die ou perd tel almal.',
  'subs.founding.label': 'WAGLYS-VORDEEL',
  'subs.founding.title': 'Stigterslede sluit 20% afkorting op hul eerste 3 intekenmaande vas.',
  'subs.founding.cta': 'Bevestig my plek',

  /* ---------------- Founding ring ---------------- */
  'ring.label': 'STIGTERS-20%-PLEKKE — EERLIKE TELLING',
  'ring.standard': '+{count} STANDAARD-WAGLYS',
  'ring.title': '{claimed} van {cap} stigtersplekke is gevat.',
  'ring.body':
    'Ons beperk stigterslidmaatskap tot {cap} sodat vroeë ondersteuners hul 20%-vastelling en eerste-lot-toewysing behou. Hierdie teller weerspieël regte waglys-aansluitings — geen vals afteltellers hier nie.',

  /* ---------------- Waitlist section ---------------- */
  'wsec.caption': 'DIE HELE REDE · ELKE EIENAAR KEN HIERDIE GEVOEL',
  'wsec.overline': 'DIE WAGLYS',
  'wsec.titleA': 'Vertel ons van jou',
  'wsec.titleEm': 'beste maatjie.',

  /* ---------------- Social proof ---------------- */
  'sp.overline': 'VROEË ONDERSTEUNERS',
  'sp.titleA': 'Suid-Afrikaanse troeteldier-eienaars is',
  'sp.titleEm': 'al klaar in die ry.',
  'sp.stats': '1 204 OP DIE WAGLYS · 4.9★ PSA-WINKELGRADERING · 1 200+ PSA-RESENSIES',
  'sp.1.quote':
    'My 11 jaar oue Boerboel sukkel met ons plaas se trappe. As die kollageen die helfte doen van wat die studies sê, is ek eerste in die ry.',
  'sp.1.meta': 'ANNERIE V. · PRETORIA · BOERBOEL, 11 JAAR',
  'sp.2.quote':
    'Ek koop al klaar PSA se mens-peptiede. ’n COA by elke lot is hoekom ek hulle met my kat vertrou.',
  'sp.2.meta': 'DANIEL K. · KAAPSTAD · BRUIKKAT, 7 JAAR',
  'sp.3.quote':
    'Ons het R40k aan ons Ridgeback se kruisbandoperasie spandeer. Herstelondersteuning kan nie gou genoeg kom nie.',
  'sp.3.meta': 'SIPHO M. · DURBAN · RIDGEBACK, 4 JAAR',

  /* ---------------- Honesty ---------------- */
  'hon.overline': 'REGUIT GEPRAAT',
  'hon.titleA': 'Ons wil liewer jou',
  'hon.titleEm': 'vertroue',
  'hon.titleB': 'verdien as jou voorafbestelling.',
  'hon.p1':
    'Geen troeteldier-peptiedproduk — ons s’n of enigiemand anders s’n — is deur die FDA of SAHPRA goedgekeur nie. Bewysvlakke verskil per verbinding: kollageenpeptiede het gepubliseerde honde-RCT’s; BPC-157 het honde-farmakokinetiese data; KPV en TB-500 bly preklinies. Ons merk elke bewering met sy bewysvlak, en ons beveel altyd aan dat jy eers met jou veearts gesels.',
  'hon.p2':
    'Alles op hierdie bladsy is in ontwikkeling. Om by die waglys aan te sluit kos niks en verbind jou tot niks nie — dit plaas jou troeteldier net eerste in die ry, met stigterslidpryse vasgesluit.',
  'hon.link': 'LEES DIE VOLLE BEWYSBIBLIOTEEK →',
  'hon.ledger': 'BEWYSGROOTBOEK',
  'hon.status.strong': 'STERK',
  'hon.status.emerging': 'ONTLUIKEND',
  'hon.status.early': 'VROEG',
  'hon.note': 'KWARTAALLIKS BYGEWERK · BRONNE OP /SCIENCE',

  /* ---------------- FAQ ---------------- */
  'faq.titleA': 'Eerlike',
  'faq.titleEm': 'antwoorde.',
  'faq.1.q': 'Wanneer lansier PSA PETS?',
  'faq.1.a':
    'Mobility Collagen word vir die eerste kwartaal van 2026 geteiken; peptieddruppels volg soos kwaliteit- en regulatoriese hersienings afgehandel word. Waglyslede hoor eerste.',
  'faq.2.q': 'Is hierdie produkte veilig vir my troeteldier?',
  'faq.2.a':
    'Ons publiseer elke sitasie en elke bewysvlak. Niks hier is ’n veeartsenykundige medisyne nie, en jy moet jou veearts raadpleeg voordat jy enige aanvulling begin.',
  'faq.3.q': 'Wat kos dit om by die waglys aan te sluit?',
  'faq.3.a':
    'Niks. Dit bespreek jou stigterslidpryse (20% af jou eerste 3 intekenmaande) en jou plek in die ry.',
  'faq.4.q': 'Vir watter troeteldiere is dit?',
  'faq.4.a':
    'Formules word eers vir honde en katte ontwikkel, met perdedosering onder veeartsenykundige hersiening.',
  'faq.5.q': 'Hoe werk intekeninge?',
  'faq.5.a':
    'Maandelikse outomatiese aflewering teen 15% af, gratis aflewering bo R1,500, BTW ingesluit, laat wag of kanselleer enige tyd via WhatsApp.',
  'faq.6.q': 'Is my data veilig?',
  'faq.6.a':
    'Ja. Ons voldoen aan POPIA en kontak jou net oor troeteldierprodukte waarna jy gevra het.',

  /* ---------------- Conversion bar ---------------- */
  'cb.waiting': '{count} SA-EIENAARS WAG',
  'cb.quiz': 'Doen die quiz →',
  'cb.box': 'LAUNCH BOX',

  /* ---------------- Exit toast ---------------- */
  'et.label': 'VOORDAT JY GAAN',
  'et.title': 'Die 20% stigterslid-vastelling eindig binnekort.',
  'et.body': 'Sluit nou by die waglys aan en jou afslag word by bekendstelling aan jou kaartjie vasgespyker.',
  'et.cta': 'Sluit my 20% vas →',
  'et.dismiss': 'Verwyder',
}

Object.assign(af, {
  /* ---------------- Cart drawer ---------------- */
  'cart.overline': 'BESPREKINGSMANDJIE — NOG GEEN BETALING NIE',
  'cart.title': 'Jou Launch Box',
  'cart.close': 'Maak Launch Box toe',
  'cart.back': '← TERUG NA LAUNCH BOX',
  'cart.reserveTitle.one': 'Bespreek dit — gratis.',
  'cart.reserveTitle.many': 'Bespreek jou {count} formules — gratis.',
  'cart.reserveBody':
    'Sluit by die waglys aan met jou Launch Box vooraf gekies. Stigterspryse ({pct}% af) is aan jou kaartjie vasgesluit.',
  'cart.emptyTitle': 'Jou Launch Box is leeg.',
  'cart.emptyBody':
    'Bespreek jou troeteldier se stapel teen stigterslidpryse — niks word voor bekendstelling gehef nie.',
  'cart.browse': 'Blaai deur die katalogus',
  'cart.removeAria': 'Verwyder {name}',
  'cart.qtyDec': 'Verminder hoeveelheid',
  'cart.qtyInc': 'Verhoog hoeveelheid',
  'cart.shipRemaining': '{amount} TOT GRATIS AFLEWERING',
  'cart.shipUnlocked': '✓ GRATIS AFLEWERING ONTSLUIT',
  'cart.subtotal': 'SUBTOTAAL',
  'cart.founding': 'STIGTERSLID −{pct}%',
  'cart.reservedTotal': 'BESPREEKDE TOTAAL',
  'cart.reserveCta': 'BESPREEK VIA WAGLYS — NOG GEEN BETALING NIE →',
  'cart.footer': 'BTW INGESLUIT · PRYS AAN JOU KAARTJIE VASGESLUIT · KANSELLEER ENIGE TYD',

  /* ---------------- Waitlist form ---------------- */
  'form.name': 'JOU NAAM',
  'form.namePh': 'Annerie van Wyk',
  'form.email': 'E-POS',
  'form.emailPh': 'jy@voorbeeld.co.za',
  'form.whatsapp': 'WHATSAPP-NOMMER',
  'form.waPh': '+27 82 000 0000',
  'form.breed': 'TROETELDIER SE RAS',
  'form.breedPh': 'Boerboel',
  'form.petType': 'TIPE TROETELDIER',
  'form.pet.dog': 'Hond',
  'form.pet.cat': 'Kat',
  'form.pet.horse': 'Perd',
  'form.pet.other': 'Ander',
  'form.age': 'TROETELDIER SE OUDERDOM — {age} JAAR',
  'form.seniorNote': 'Die seniorjare is presies vir wie ons dit gebou het.',
  'form.city': 'STAD',
  'form.city.Cape Town': 'Kaapstad',
  'form.city.Johannesburg': 'Johannesburg',
  'form.city.Durban': 'Durban',
  'form.city.Pretoria': 'Pretoria',
  'form.city.Gqeberha': 'Gqeberha',
  'form.city.Bloemfontein': 'Bloemfontein',
  'form.city.Other': 'Ander',
  'form.products': 'PRODUKTE WAT JOU INTERESSEER',
  'form.concern': 'GROOTSTE BEKOMMERNIS',
  'form.concern.mobility': 'mobiliteit',
  'form.concern.injury': 'besering',
  'form.concern.gut': 'derm',
  'form.concern.skin': 'vel',
  'form.concern.anxiety': 'angs',
  'form.concern.longevity': 'langlewendheid',
  'form.submit': 'Sluit aan by die waglys',
  'form.submitting': 'BESPREEK JOU PLEK…',
  'form.popia':
    'VOLDOEN AAN POPIA. ONS SAL JOU NET PER WHATSAPP/E-POS OOR TROETELDIERPRODUKTE KONTAK. SKRYF ENIGE TYD UIT.',
  'form.err.name': 'VERTEL ONS JOU NAAM',
  'form.err.email': 'GELDIGE E-POSADRES NODIG',
  'form.err.whatsapp': 'SA-FORMAAT: +27… (9 SYFERS DAARNA)',
  'form.err.breed': 'RAS HELP ONS OM REG TE DOSEER',
  'form.err.products': 'KIES TEN MINSTE EEN PRODUK',
  'form.confirmed': 'WAGLYS BEVESTIG',
  'form.youreIn': 'Jy is in, {name}.',
  'form.queueLine': 'JY IS #{queue} IN DIE RYG · KODE {code}',
  'form.referred': 'VIA {ref} — JY HET {spots} PLEKKE OPGESKUIF (PLAASLIK GESIMULEER)',
  'form.synced': 'MET PSA CRM GESINKRONISEER ✓',
  'form.syncQueued': 'PLAASLIK GESTOOR — SAL SINKRONISEER',
  'form.foundingNote':
    'Stigterslidpryse is vasgesluit: 20% af jou eerste 3 intekenmaande by bekendstelling.',
  'form.refTitle': 'SKUIF VORENTOE IN DIE RYG — DEEL JOU SKAKEL',
  'form.refBody': 'Elke vriend wat met jou skakel aansluit, skuif jou nog {spots} plekke op.',
  'form.refAria': 'Jou verwysingskakel',
  'form.copy': 'KOPIEER SKAKEL',
  'form.copied': '✓ GEKOPIEER',
  'form.shareWa': 'DEEL OP WHATSAPP',
  'form.refWaText':
    '{name} hier — ek het by die PSA PETS-stigterswaglys aangesluit (COA-geverifieerde troeteldier-peptiede, binnekort in SA). Gebruik my skakel en ons albei skuif op in die ry: {link}',
  'form.confirmWa': 'Bevestig vinniger op WhatsApp',
  'form.waMessage':
    'Hallo PSA PETS! Ek is {name}, op die waglys vir {products} vir my {petType}, {breed}, {age} jaar oud. Kode {code}.',
  'form.popiaFoot':
    'VOLDOEN AAN POPIA · ONS KONTAK JOU NET OOR TROETELDIERPRODUKTE · SKRYF ENIGE TYD UIT',

  /* ---------------- Quiz ---------------- */
  'quiz.overline': 'PSA PETS · PERSONALISASIE-QUIZ',
  'quiz.hookTitle': 'Bou jou hond (of kat) se peptiedplan in 60 sekondes.',
  'quiz.hookSub':
    'Sewe vinnige tikke. ’n Reëlgebaseerde, veearts-hersiende stapel vir jou troeteldier se ouderdom, grootte en grootste bekommernis — met die bewyse eerlik gegradeer.',
  'quiz.hookCta': 'Begin my troeteldier se plan',
  'quiz.hookMeta': 'GRATIS · VEEARTS-HERSIENDE LOGIKA · GEEN BETALING',
  'quiz.back': '← TERUG',
  'quiz.continue': 'Gaan voort',
  'quiz.species.dog': 'hond',
  'quiz.species.cat': 'kat',
  'quiz.species.horse': 'perd',
  'quiz.species.pet': 'troeteldier',
  'quiz.step1.kicker': 'EERSTENS EERS',
  'quiz.step1.title': 'Vir wie bou ons die plan?',
  'quiz.step1.sub': 'Tik een — katte en perde kry hul eie logika.',
  'quiz.enc.petType': 'Pragtig — elke {pet} kry hier veearts-hersiende logika.',
  'quiz.step2.kicker': 'DIE PASIËNTLEÊR',
  'quiz.step2.title': 'Vertel ons van jou {pet}.',
  'quiz.step2.sub': 'Naam, ras en ouderdom — die senior-merker verander die plan.',
  'quiz.petName.pet': 'TROETELDIER SE NAAM',
  'quiz.petName.horse': 'PERD SE NAAM',
  'quiz.err.petName': '’N NAAM HELP ONS OM DIE PLAN TE PERSONALISEER',
  'quiz.err.age': 'OUDERDOM MOET 1–30 JAAR WEES',
  'quiz.enc.profile': 'Wonderlik — {name} is in goeie hande.',
  'quiz.breed': 'RAS',
  'quiz.optional': '(OPSIONEEL)',
  'quiz.breedPh': 'Boerboel, plakkie, onbekend…',
  'quiz.ageLabel': 'OUDERDOM — {age} JAAR',
  'quiz.seniorOn': 'SENIOR-LOGIKA: AAN — {threshold} JAAR',
  'quiz.step3.kicker': 'DOSERINGSGEOMETRIE',
  'quiz.step3.title': 'Hoe groot is {name}?',
  'quiz.step3.sub': 'Gewigklasse dryf die doseringsgids — XL is Boerboel-bestand.',
  'quiz.enc.size': 'Genoteer — doseringsriglyne skaal volgens {name} se raam.',
  'quiz.step4.kicker': 'WAT DIE MEESTE SAAK MAAK',
  'quiz.step4.title': 'Waarmee sukkel {name}?',
  'quiz.step4.sub': 'Kies tot {max}. Die stapel word rondom hierdie gebou.',
  'quiz.selected': '{count} / {max} GEKIES',
  'quiz.calmingDev': 'KALMEREND: IN ONTWIKKELING',
  'quiz.err.concerns': 'KIES TEN MINSTE EEN — WAT MAAK DIE MEESTE SAAK?',
  'quiz.enc.concerns': 'Verstaan — ons bou rondom wat die meeste vir {name} saak maak.',
  'quiz.step5.kicker': 'VEILIGHEIDSKONTROLE',
  'quiz.step5.title': 'Wat gebruik {name} al klaar?',
  'quiz.step5.sub': 'Aanvullings, chroniese medisyne — en of daar ’n veearts in die prentjie is.',
  'quiz.suppsLabel': 'HUIDIGE AANVULLINGS / MEDISYNE',
  'quiz.suppsPh': 'bv. gewrigskougoed, chroniese anti-inflammatories, nog niks…',
  'quiz.suppsNote': 'ONS MERK INTERAKSIES IN JOU PLANNOTAS — JOU VEEARTS KRY DIE VOLLE LYS.',
  'quiz.vetQ': 'HET JY ’N VEEARTS VIR {name}?',
  'quiz.vetYes': 'JA — HET ’N VEEARTS',
  'quiz.vetNo': 'NOG GEEN VEEARTS',
  'quiz.err.vet': 'EEN TIK — HET JY ’N VEEARTS?',
  'quiz.noVetNote':
    'Nog geen veearts nie? {name} se plan kom met veearts-hersiende doseringsriglyne — en ons sal jou altyd aanmoedig om eers te konsulteer voordat jy iets nuuts begin.',
  'quiz.enc.vetYes': 'Perfek — bring {name} se plan na jou volgende konsultasie.',
  'quiz.enc.vetNo': 'Nog geen veearts nie? Ons sal jou altyd in daardie rigting stoot — belowe.',
  'quiz.step6.kicker': 'AMPER DAR',
  'quiz.step6.title': 'Waarheen stuur ons {name} se plan?',
  'quiz.step6.sub': 'Jou stapel is gereed. Een laaste stap voor die onthulling.',
  'quiz.yourName': 'JOU NAAM',
  'quiz.email': 'E-POS',
  'quiz.whatsapp': 'WHATSAPP-NOMMER',
  'quiz.popia':
    'Ek is tevrede dat PSA PETS my oor {name} se plan en troeteldierproduk-bekendstellings kontak. Voldoen aan POPIA — skryf enige tyd uit.',
  'quiz.err.owner': 'VERTEL ONS JOU NAAM',
  'quiz.err.email': 'GELDIGE E-POSADRES NODIG',
  'quiz.err.whatsapp': 'SA-FORMAAT: +27… OF 0… (9 SYFERS)',
  'quiz.err.popia': 'POPIA-TOESTEMMING NODIG',
  'quiz.seePlan': 'Sien {name} se plan →',
  'quiz.leadFoot':
    'VOLDOEN AAN POPIA · ONS KONTAK JOU NET PER WHATSAPP/E-POS OOR TROETELDIERPRODUKTE · GEEN BETALING NODIG',
  'quiz.readyLine': 'PLAN GEREED · {date} · VERW {ref}',
  'quiz.resultsTitle': 'Die PSA PETS-stapel vir {name}.',
  'quiz.results.count': '{count} produkte',
  'quiz.results.countOne': '1 produk',
  'quiz.results.matched': 'gepas by {concerns}',
  'quiz.results.wellness': 'alledaagse welstand',
  'quiz.results.senior': ' — met senior-logika toegepas',
  'quiz.protocol': 'PSA PETS · GEPERSONALISEERDE PROTOKOL',
  'quiz.patient': 'PASIËNT',
  'quiz.speciesLabel': 'SPESIE',
  'quiz.breedRow': 'RAS',
  'quiz.ageRow': 'OUDERDOM',
  'quiz.yrs': 'JAAR',
  'quiz.seniorTag': 'SENIOR',
  'quiz.sizeBand': 'GROOTTEKLAS',
  'quiz.vetOnFile': 'VEEARTS OP LEÊR',
  'quiz.yes': 'JA',
  'quiz.notYet': 'NOG NIE',
  'quiz.itemX': 'ITEM {a} / {b}',
  'quiz.calmingBadge': 'IN ONTWIKKELING',
  'quiz.calmingTitle': 'Kalmerende formule — op pad vir {name}',
  'quiz.calmingBody':
    'Vir die storm-bebings en vuurwerke: ons kalmerende peptied (αs1-casozepine-klas, placebo-beheerd in katte en honde) is in ontwikkeling. Sluit by die waglys aan en jy hoor eerste.',
  'quiz.disclaimer':
    'NIE VEEARTSENYMEDISYNES NIE · NOG NIE TE KOOP NIE · RAADPLEEG ALTYD JOU VEEARTS',
  'quiz.skipLead': 'Wys eers my plan →',
  'quiz.save.kicker': 'STOOR JOU PLAN',
  'quiz.save.title': 'Stoor {name} se plan + bespreek stigtersprys',
  'quiz.save.sub':
    'Ons stuur die plan per WhatsApp/e-pos en hou jou stigterslid-plek. Geen betaling, skryf enige tyd uit.',
  'quiz.save.cta': 'Stoor my plan →',
  'quiz.save.done': 'PLAN GESTOOR — ONS HOUD KONTAK',
  'quiz.stackToast': 'STAPEL BYGEVOEG — BESPREEK DIT HIERONDER',
  'quiz.dose.title': 'DOSERINGSGIDS — VOLGENS GEWIGKLAS',
  'quiz.dose.band': 'KLAS {band}',
  'quiz.dose.drops.S': '0.25 ML (5 DRUPPELS)/DAG',
  'quiz.dose.drops.M': '0.5 ML (10 DRUPPELS)/DAG',
  'quiz.dose.drops.L': '0.75 ML (15 DRUPPELS)/DAG',
  'quiz.dose.drops.XL': '1 ML (20 DRUPPELS)/DAG',
  'quiz.dose.scoop.S': '½ SKEPPIE/DAG',
  'quiz.dose.scoop.M': '1 SKEPPIE/DAG',
  'quiz.dose.scoop.L': '1½ SKEPPIES/DAG',
  'quiz.dose.scoop.XL': '2 SKEPPIES/DAG',
  'quiz.dose.cycle': 'EENMAAL DAAGLIKS OP KOS · 5 DAE AAN / 2 DAE AF',
  'quiz.dose.dailyFood': 'EENMAAL DAAGLIKS, IN DIE KOS GEMENG',
  'quiz.dose.equine': 'PERDEGIDS',
  'quiz.dose.vetGuided': 'DOSIS SAAM MET JOU VEEARTS BEPAAL',
  'quiz.dose.intro': 'BEGIN OP HALWE DOSIS VIR WEEK 1 — KONSERWATIEWE INLEIDING, DAARNA OPWARDS AANPAS',
  'quiz.dose.chart': 'VEEARTS-HERSIENDE DOSERINGSTABEL WORD MET ELKE BESTELLING GESTUUR',
  'quiz.dose.print': 'LAAI AF / DRUK VEEARTS-STUK',
  'quiz.addStack': 'Voeg my stapel by my Launch Box',
  'quiz.joinStack': 'Sluit by die waglys vir my stapel aan',
  'quiz.retake': 'Nie reg nie? Doen die quiz oor',
  'quiz.evidenceLink': 'Sien die bewyse agter elke aanbeveling →',
  /* stack "why" lines */
  'quiz.why.mc.mobility':
    'Gepubliseerde honde-RCT-data — die daaglikse gewrigsfondament vir {name} se styfheid.',
  'quiz.why.bpc.mobility':
    'Die verbinding waarvoor SA-eienaars die meeste vra — sagteweefselondersteuning vir ’n {age}-jaar-oue {breed}.',
  'quiz.why.rb.injury': 'Die rehab-parring — gebou vir {name} se terugkeer, nie die rusbank nie.',
  'quiz.why.mc.injury': 'Langtermyn-gewrigsondersteuning terwyl {name} gesond word.',
  'quiz.why.kpv.gut':
    'Dermwand-ondersteuning vir {name} se sensitiewe stelsel — een druppelaar per dag.',
  'quiz.why.kpv.skin': 'Velopvlam-ondersteuning van binne af, gedoseer vir {name}.',
  'quiz.why.it.senior': 'Senior-graad immuunondersteuning vir {name} se grys-snuit-jare.',
  'quiz.why.mc.senior': 'Hou die daaglikse fondament onder ’n verouderende raam.',
  'quiz.why.mc.prevention': 'Voorkoming reg gedoen — die bewysgesteunde daaglikse gewoonte.',
  'quiz.why.it.prevention': 'Weerstandsondersteuning voordat {name} dit ooit nodig het.',
  'quiz.why.it.age':
    'Ouderdom {age} plaas {name} in ons seniorprotokol — immuunweerstand maak nou saak.',
  'quiz.why.mc.fallback':
    'Die alledaagse fondament — gepubliseerde honde-RCT-data agter elke houer.',
  'quiz.why.it.fallback':
    'Sagte daaglikse weerstandsondersteuning terwyl ons kalmerende formule in ontwikkeling is.',
  'quiz.why.honesty':
    'Duidelik gestel: ’n deel van {name} se stapel word slegs deur prekliniese bewyse gesteun — nog geen hondeproewe nie. Ons publiseer wat bestaan, en wat nie. Jou veearts kry die volle sitasiepakket.',
})

Object.assign(af, {
  /* ---------------- Waitlist page (4-step funnel) ---------------- */
  'wlp.step.1': '01 JOU TROETELDIER',
  'wlp.step.2': '02 JY',
  'wlp.step.3': '03 PRODUKTE',
  'wlp.step.4': '04 BEVESTIG',
  'wlp.stepOf': 'STAP {n} VAN 4',
  'wlp.s1.title': 'Eerstens — vir wie is dit?',
  'wlp.s1.multiHint': '66% VAN SA-TROETELDIERHUISHOUDINGS HET 2+ DIERE — KIES ALMAL WAT PAS',
  'wlp.s1.pets': '+{n} TROETELDIERE',
  'wlp.pet.dog': 'HOND',
  'wlp.pet.cat': 'KAT',
  'wlp.pet.horse': 'PERD',
  'wlp.pet.other': 'ANDER',
  'wlp.err.petTypes': 'KIES TEN MINSTE EEN TIPE TROETELDIER',
  'wlp.petName': 'TROETELDIER SE NAAM',
  'wlp.petNamePh': 'bv. Bella',
  'wlp.breed': 'RAS',
  'wlp.breedPh': 'bv. Boerboel, Tabby, Volbloed',
  'wlp.age': 'TROETELDIER SE OUDERDOM',
  'wlp.ageReadout': 'OUDERDOM: {age} JAAR',
  'wlp.ageAria': 'Troeteldier se ouderdom in jare',
  'wlp.seniorQuote': '“Die seniorjare is presies vir wie ons dit gebou het.”',
  'wlp.concern': 'GROOTSTE BEKOMMERNIS',
  'wlp.concern.mobility': 'MOBILITEIT',
  'wlp.concern.injury': 'BESERING / HERSTEL',
  'wlp.concern.gut': 'DERM',
  'wlp.concern.skin': 'VEL',
  'wlp.concern.anxiety': 'ANGS',
  'wlp.concern.longevity': 'LANGLEWENDHEID / SENIORSORG',
  'wlp.rec.mobility': 'AANBEVOLE: BPC-157 + COLLAGEN',
  'wlp.rec.injury': 'AANBEVOLE: RECOVERY BLEND',
  'wlp.rec.gut': 'AANBEVOLE: KPV',
  'wlp.rec.skin': 'AANBEVOLE: KPV',
  'wlp.rec.anxiety': 'KALMEREND: IN ONTWIKKELING — SLUIT AAN OM EERSTE TE HOOR',
  'wlp.rec.longevity': 'AANBEVOLE: IMMUNE + COLLAGEN',
  'wlp.continue': 'Gaan voort',
  'wlp.back': 'Terug',
  'wlp.s2.title': 'En vir wie WhatsApp ons wanneer dit gereed is?',
  'wlp.yourName': 'JOU NAAM',
  'wlp.yourNamePh': 'bv. Thandi Nkosi',
  'wlp.email': 'E-POS',
  'wlp.whatsapp': 'WHATSAPP-NOMMER',
  'wlp.waNote': 'ONS BEVESTIG DIE LANSIERING EERS OP WHATSAPP',
  'wlp.city': 'STAD',
  'wlp.cityPh': 'Kies jou stad',
  'wlp.city.Cape Town': 'Kaapstad',
  'wlp.city.Other': 'Ander',
  'wlp.popia':
    'Ek is tevrede dat PSA PETS my oor troeteldierproduk-bekendstellings kontak. Voldoen aan POPIA, skryf enige tyd uit.',
  'wlp.err.owner': 'VERTEL ONS JOU NAAM',
  'wlp.err.email': '’N GELDIGE E-POSADRES IS NODIG',
  'wlp.err.whatsapp': 'SA-SELFOON: 9 SYFERS NA +27',
  'wlp.err.city': 'KIES JOU STAD',
  'wlp.err.popia': 'POPIA-TOESTEMMING IS NODIG OM AAN TE SLUIT',
  'wlp.s3.titleNamed': 'Waarvoor moet ons {name} eerste in die ry plaas?',
  'wlp.s3.titleProduct': '…eerste in die ry vir {product}?',
  'wlp.s3.titleGeneric': 'Waarvoor moet ons jou eerste in die ry plaas?',
  'wlp.firstToLaunch': 'EERSTE OM TE LANSEER',
  'wlp.waiting': '{count} WAG',
  'wlp.err.products': 'KIES TEN MINSTE EEN PRODUK',
  'wlp.clearAll': 'MAAK KEUSE LEEG',
  'wlp.allProducts': 'HOU MY OP HOOGTE VAN ALLES',
  'wlp.perk': 'WAGLYS-VORDEEL',
  'wlp.perkBodyA': 'Deur vandag aan te sluit sluit jy',
  'wlp.perkBodyStrong': '20% af jou eerste 3 intekenmaande',
  'wlp.perkBodyB': 'by bekendstelling vas.',
  'wlp.submitting': 'Bespreek jou plek…',
  'wlp.submit': 'Sluit aan by die waglys',
  'wlp.welcomeBack': 'WELKOM TERUG — JOU KAARTJIE:',
  'wlp.confirmedNamed': 'Jy is in — en {name} ook.',
  'wlp.confirmed': 'Jy is in.',
  'wlp.ticketTitle': 'PSA PETS · WAGLYS-KAARTJIE',
  'wlp.rowOwner': 'EIENAAR',
  'wlp.rowPet': 'TROETELDIER',
  'wlp.rowProducts': 'PRODUKTE',
  'wlp.rowCity': 'STAD',
  'wlp.rowQueue': 'RY',
  'wlp.rowCode': 'KODE',
  'wlp.everything': 'ALLES',
  'wlp.petLine': '{name}{breed} · {age} JAAR',
  'wlp.alreadyRegistered': '(REEDS GEREGISTREER — POSISIE BEHOU)',
  'wlp.perkRow': 'VOORDEEL',
  'wlp.perkValue': '20% AF × 3 MAANDE · VASGESLUIT',
  'wlp.confirmWa': 'Bevestig vinniger op WhatsApp',
  'wlp.waNote2': 'SLAAN DIE E-POS-RY OOR — WHATSAPP BEVESTIG DADELIK',
  'wlp.backToCatalog': 'Terug na die katalogus',
  'wlp.another': 'REGISTREER NOG ’N TROETELDIER →',
  'wlp.foot': 'KAARTJIE OP HIERDIE TOESTEL GESTOOR · ONS SPAM NOOIT · VOLDOEN AAN POPIA',
  'wlp.waMessage':
    'Hallo PSA PETS — ek bevestig my waglys-kaartjie.\nNaam: {name}\nTroeteldier: {pet}\nProdukte: {products}\nKode: {code} · Ry #{queue}',

  /* ---------------- Product page ---------------- */
  'pdp.notFound.overline': 'KATALOGUS / NIE GEVIND NIE',
  'pdp.notFound.title': 'Daardie een maak ons (nog) nie.',
  'pdp.notFound.body': 'Vyf formules is in ontwikkeling — elkeen het ’n waglys.',
  'pdp.notFound.cta': 'Terug na die katalogus',
  'pdp.crumb': 'KATALOGUS',
  'pdp.firstLaunch': '★ EERSTE OM TE LANSEER — VERWAG K1 2026',
  'pdp.vat': 'BTW INGESLUIT',
  'pdp.estRetail': 'GERAAMDE KLEINHANDEL {price}',
  'pdp.plan.sub': 'MAANDELIKSE OUTOSHIP — 15% AF',
  'pdp.plan.subBody': 'Laat wag of kanselleer via WhatsApp · gratis aflewering bo R1,500',
  'pdp.plan.once': 'EENMALIG — {price}',
  'pdp.plan.onceBody': '30-dae-voorraad, word versend wanneer ons lansier.',
  'pdp.plan.aria': 'Koopplan',
  'pdp.plan.badge': 'AKTIVEER BY LANSIERING',
  'pdp.disabled': 'KOM BINNEKORT — NOG NIE TE KOOP NIE',
  'pdp.disabledTip': 'Nog nie — bespreek dit hieronder in jou Launch Box.',
  'pdp.orJoin': 'OF SLUIT BY DIE {product}-WAGLYS AAN ↓',
  'pdp.ownersWaiting': '{count} SA-EIENAARS WAG AL KLAAR',
  'pdp.trust2': 'COA BY ELKE LOT',
  'pdp.trust3': 'VOLDOEN AAN POPIA',
  'pdp.shot.front': 'BOTTEL VOORKANT',
  'pdp.shot.scale': 'VIR SKAAL',
  'pdp.hiw.overline': 'HOE DIT WERK',
  'pdp.hiw.title': 'Eenvoudig deur ontwerp.',
  'pdp.hiw.step': 'STAP {n}',
  'pdp.ev.overline': 'BEWYSE & SITASIES',
  'pdp.ev.titleA': 'Wat die wetenskap',
  'pdp.ev.titleEm': 'werklik',
  'pdp.ev.titleB': 'sê.',
  'pdp.ev.sub':
    'Elke bewering op hierdie bladsy dra sy bewysvlak. Groen beteken gepubliseerde honde-data; amber beteken die bewyse is vroeër-stadium — en ons sê dit.',
  'pdp.ev.honesty':
    'EERLIKHEID, OP SKRIF: AS ’N VERBINDING GEEN HONDE-DOELTREFFENDHEIDPROEWE HET NIE, SÊ DIE REKORD HIERBO DIT — VOORDAT JY OOK MAAR VRA.',
  'pdp.cmp.overline': 'DIE MAATSTAF',
  'pdp.cmp.title': 'Hoekom wag vir plaaslik?',
  'pdp.cmp.import': 'TIPIESE VSA-INVOER',
  'pdp.cmp.psa': 'PSA PETS BY LANSIERING',
  'pdp.cmp.price': 'PRYS',
  'pdp.cmp.shipping': 'VERSENDING',
  'pdp.cmp.docs': 'DOKUMENTASIE',
  'pdp.cmp.support': 'ONDERSTEUNING',
  'pdp.cmp.imp1': '$99–$149 + versending + doeaneregte',
  'pdp.cmp.imp2': '2–6 weke, doeane-risiko',
  'pdp.cmp.imp3': 'Verskil per verkoper',
  'pdp.cmp.imp4': 'E-pos, VSA-ure',
  'pdp.cmp.psa1': '{price}, BTW ingesluit',
  'pdp.cmp.psa2': 'Plaaslike koerier, gratis bo R1,500',
  'pdp.cmp.psa3': 'COA by elke lot, ≥99% HPLC',
  'pdp.cmp.psa4': 'WhatsApp, SA-ure',
  'pdp.wl.overline': 'WAGLYS · {product}',
  'pdp.wl.title': 'Wees eerste in die ry vir {product}.',
  'pdp.wl.body':
    'Stigterslede sluit 20% af hul eerste 3 intekenmaande by bekendstelling vas — en ons WhatsApp jou die oomblik wat hierdie formule versend word.',
  'pdp.counter': '{count} WAG',
  'pdp.counterAvg': ' · GEM. {avg} NUUT / DAG',
  'pdp.rel.overline': 'VOLTOOI DIE PROTOKOL',
  'pdp.rel.title': 'Pas goed saam met.',
  'pdp.rel.first': '★ EERSTE OM TE LANSEER',
  'pdp.waiting': '{count} WAG',
  'pdp.outro.back': '← TERUG NA KATALOGUS',

  /* ---------------- Footer ---------------- */
  'foot.tagline': 'Navorsingsgraad-peptiede vir die troeteldiere wat jy liefhet. Kaapstad, Suid-Afrika.',
  'foot.catalog': 'KATALOGUS',
  'foot.learn': 'LEER',
  'foot.science': 'Wetenskap- & bewysbiblioteek',
  'foot.waitlist': 'Sluit aan by die waglys',
  'foot.mainSite': 'Hoofwebwerf — peptiede vir mense',
  'foot.questions': 'VRAE? WHATSAPP ONS',
  'foot.questionsBody': 'Een WhatsApp-boodskap — regte mense, Kaapstad-ure.',
  'foot.textUs': 'STUUR VIR ONS',
  'foot.waMsg': 'Hallo PSA PETS! ’n Vraag oor die troeteldierprodukte.',
  'foot.bottom':
    '© {year} PEPTIDE SOUTH AFRICA · PRYSE SLUIT BTW IN · VOLDOEN AAN POPIA · ≥99% HPLC-GETOETS',
})

Object.assign(af, {
  /* ---------------- Getuigskrifte (videostories) ---------------- */
  'tm.overline': 'REGTE GESINNE. REGTE TERUGKEER.',
  'tm.title': 'Die vonk het teruggekom.',
  'tm.sub':
    'Lidverhale uit ons stigtersgemeenskap. Video’s wat as KI gemerk is, is nagebootste tonele — die woorde is eg.',
  'tm.feat.kicker': 'UITGELIGTE VERHAAL · MET TOESTEMMING GEDEEL',
  'tm.feat.quote1':
    '“Ek het my 14 jaar oue hond met peptiede laat herleef. 6 maande gelede het hy vinnig agteruitgegaan. Hy het mank geloop, was seer, het stadig opgestaan en kon nie meer op die rusbank spring nie. Ons het eerlikwaar nie geweet of ons nog 6 maande met hom het nie. Vandag hardloop ons seun, spring hy op die stoep, gaan hy weer op lang stappe — en selfs sy gehoor is terug.”',
  'tm.feat.protocolTitle': 'SY PROTOKOL',
  'tm.feat.proto1.title': 'BPC-157 + TB-500',
  'tm.feat.proto1.body': '1–2 mg/dag, 5 dae aan / 2 dae af → minder mank binne weke.',
  'tm.feat.proto2.title': 'BIOREGULATOR-STAPEL',
  'tm.feat.proto2.body': 'Vir niermerkers — bloedtoetse gemonitor, net soos sy eienaar s’n.',
  'tm.feat.proto3.title': 'TESTOSTERON-ONDERSTEUNING',
  'tm.feat.proto3.body':
    'Hormoonondersteuning onder veeartsenykundige toesig vir sy gekasteerde seniorhond — dosis aangepas onder bloedwerk. “Inspuitingsdag is soos ’n herlewing.”',
  'tm.feat.quote2':
    '“6 maande gelede het ons die tyd getel wat ons nog met hom het. Nou glo ek oprecht ons het nog 3 jaar. As jy ’n hond het, verstaan dat hy net soos jy verouder. Hy het hulp nodig, maar hy kan nie self die navorsing doen nie… jy kan!”',
  'tm.feat.attr': '— GEMEENSKAPSLID, KAAPSTAD · 70 KG SENIOR-BOERBOEL',
  'tm.feat.disclaimer':
    'DEUR ’N GEMEENSKAPSLID GEDEEL. HORMOONPROTOKOLLE VEREIS VEEARTSENYKUNDIGE TOESIG EN BLOEDWERK. PSA PETS VERKOOP NIE TESTOSTERON NIE EN GEE NIE RAAD OOR VOORSKRIFMEDISYNE NIE.',
  'tm.aiChip': 'KI-NABOOTSING',
  'tm.play': 'Speel',
  'tm.pause': 'Laat wag',
  'tm.v1.cap': 'HARDLOOP WEER · WEEK 14',
  'tm.v2.cap': 'TERUG OP DIE STOEP · SY KINDERS SE BEWAARDER',
  'tm.v3.cap': 'LANG STAPPE IS TERUG · PROMENADE, KAAPSTAD',
  'tm.v1.quote': '“Binne weke, minder mank. Binne maande, dit.”',
  'tm.v1.meta': 'L. VAN DER M. · KAAPSTAD · BOERBOEL, 9',
  'tm.v2.quote': '“Die kinders het hul bewaarder teruggekry.”',
  'tm.v2.meta': 'S. NAIDOO · DURBAN · BOERBOEL, 11',
  'tm.v3.quote': '“Hy trek my weer teen die promenade se heuwels op.”',
  'tm.v3.meta': 'J. BOTHA · SEEPUNT · LABRADOR, 13',
  'tm.grid.kicker': 'MEER UIT DIE GEMEENSKAP',
  'tm.verified': 'GEMEENSKAPSSTORIE · MET TOESTEMMING GEDEEL',
  'tm.q1.quote':
    'Die 60-sekonde-quiz het haar stapel reggekry — kollageen plus BPC-157. Ses weke later klim ons 12 jaar oue herdershond weer sonder hulp in die bakkie.',
  'tm.q1.meta': 'MARTHINUS P. · STELLENBOSCH · DUITSE HERDERSHOND, 12 · BPC-157 + COLLAGEN',
  'tm.q2.quote':
    'Ek het 21:00 ge-WhatsApp en ’n bot verwag. ’n Regte mens in Kaapstad het binne vier minute geantwoord en my hond se doseringskedule saam met my aangepas.',
  'tm.q2.meta': 'PRIYA R. · UMHLANGA · CORGI, 8 · RECOVERY BLEND',
  'tm.q3.quote':
    'Ons veearts het die COA voor ons gelees. Daardie stukkie papier is hoekom ons aangesluit het — en hoekom ons bly.',
  'tm.q3.meta': 'ANNERIE V. · PRETORIA · BOERBOEL, 11 · MOBILITY COLLAGEN',
  'tm.q4.quote':
    'Ná sy kruisbandoperasie het die Recovery Blend hom van kratrus na strandstappe geneem — ’n maand voor skedule.',
  'tm.q4.meta': 'SIPHO M. · DURBAN · RIDGEBACK, 4 · RECOVERY BLEND',
  'tm.cta': 'Jou hond se terugkeer begin met 60 sekondes →',

  /* ---------------- 60-dae-mobiliteitswaarborgstrook ---------------- */
  'guar.overline': 'DIE PSA PETS-BELOFTE',
  'guar.title': 'As jy nie die verskil sien nie, betaal jy nie.',
  'guar.body':
    'Elke PSA PETS-lanseringsproduk word met ’n 60-dae-mobiliteitswaarborg gestuur. As jou hond se beweging, herstel of vonk nie betekenisvol verbeter nie, betaal ons elke rand terug. Geen hoepels, geen vorms — een WhatsApp-boodskap.',
  'guar.chip1': '60 DAE',
  'guar.chip2': 'VOLLE TERUGBETALING',
  'guar.chip3': 'EEN WHATSAPP',
  'guar.cta': 'SIEN DIE WAARBORGVOORWAARDES →',
  'guar.term1': '60 DAE VANAF AFLEWERING — BEWEGING, HERSTEL OF VONK',
  'guar.term2': 'VOLLE TERUGBETALING, GEEN VORMS — EEN WHATSAPP-BOODSKAP',
  'guar.term3': 'GELD VIR ELKE LANSERINGSPRODUK, ELKE LOT',
  'guar.term4': 'PRODUKTE IS IN ONTWIKKELING — VOORWAARDES AKTIWEER BY LANSERING',

  /* ---------------- Protokol-pyplyn-voorsmakie ---------------- */
  'pipe.overline': 'PROTOKOL-PYPLYN',
  'pipe.titleA': 'Volgende uit die',
  'pipe.titleEm': 'laboratorium.',
  'pipe.sub':
    'Drie formules in aktiewe ontwikkeling. Vroeë-lys-lede hoor lanseringsdatums eerste — en behou stigterspryse.',
  'pipe.badge': 'IN ONTWIKKELING',
  'pipe.calm.name': 'PSA PETS CALM',
  'pipe.calm.spec': 'SELANK-GEBASEERDE KALMERENDE MENGSEL',
  'pipe.calm.desc': 'Vir storm-bebings, vuurwerke en skeidingstres — kalm sonder verdoving.',
  'pipe.immune.name': 'PSA PETS IMMUNE+',
  'pipe.immune.spec': 'TA-1 + KPV + GHK-CU',
  'pipe.immune.desc': 'Die immuunweerstand-stapel vir seniors en gereelde pasiënte.',
  'pipe.senior.name': 'PSA PETS SENIOR VITALITY',
  'pipe.senior.spec': 'LANGLEWENDHEID-MENGSEL',
  'pipe.senior.desc': 'Gebou rondom honde-verouderingnavorsing — vir die grys-snuit-jare.',
  'pipe.cta': 'SLUIT BY DIE VROEË LYS AAN',
})

Object.assign(en, {
  /* ---------------- Round 6 — trust features ---------------- */
  'nav.verify': 'VERIFY',
  'nav.blog': 'BLOG',
  'nav.myQueue': 'My queue',

  /* COA verify page */
  'coa.overline': 'BATCH VERIFICATION · PUBLIC LEDGER',
  'coa.titleA': 'Every batch.',
  'coa.titleEm': 'Every certificate.',
  'coa.titleB': 'Public.',
  'coa.sub':
    'The batch number on your label opens the full lab record — purity, heavy metals, endotoxins, analyst sign-off. No logins, no emailing support.',
  'coa.inputLabel': 'ENTER YOUR BATCH NUMBER',
  'coa.inputPh': 'e.g. PTD-2026-007',
  'coa.lookup': 'Look up certificate',
  'coa.trySample': 'TRY A SAMPLE BATCH:',
  'coa.notFound.title': 'Batch not found.',
  'coa.notFound.body':
    "We couldn't match that number in the pre-launch sample ledger. Message us on WhatsApp and we'll send the certificate directly.",
  'coa.notFound.cta': 'WhatsApp us the batch number',
  'coa.notFound.waMsg':
    'Hi PSA PETS — please send me the certificate of analysis for batch {batch}.',
  'coa.sampleChip': 'SAMPLE CERTIFICATE — LIVE BATCH DATA ACTIVATES AT LAUNCH',
  'coa.doc.kicker': 'PSA PETS · THIRD-PARTY VERIFIED',
  'coa.doc.title': 'CERTIFICATE OF ANALYSIS',
  'coa.verified': '✓ VERIFIED — ALL SPECIFICATIONS PASSED',
  'coa.row.product': 'PRODUCT',
  'coa.row.spec': 'SPECIFICATION',
  'coa.row.batch': 'BATCH / LOT NO.',
  'coa.row.mfg': 'MANUFACTURING DATE',
  'coa.row.expiry': 'EXPIRY DATE',
  'coa.row.lab': 'TESTING LABORATORY',
  'coa.row.purity': 'HPLC PURITY',
  'coa.row.metals': 'HEAVY METALS (ICP-MS)',
  'coa.row.endotoxin': 'ENDOTOXIN (LAL)',
  'coa.row.microbial': 'MICROBIAL SCREEN',
  'coa.row.net': 'NET CONTENT',
  'coa.row.analyst': 'ANALYST SIGN-OFF',
  'coa.print': 'PRINT / SAVE PDF',
  'coa.doc.foot': 'ISSUED PER BATCH · VERIFY ANY BATCH AT /VERIFY',

  /* homepage COA strip */
  'coas.overline': 'BATCH TRANSPARENCY',
  'coas.title': 'Every batch. Every certificate. Public.',
  'coas.body':
    'Type the batch number on any PSA PETS label and pull the full certificate of analysis — purity, heavy metals, endotoxins, analyst sign-off. Try it with our launch batch.',
  'coas.demo': 'SEE THE SAMPLE CERTIFICATE',
  'coas.verify': 'VERIFY YOUR BATCH →',

  /* vet pack */
  'vetpack.cta': 'SEND THIS TO YOUR VET',
  'vetpack.title': 'Bring your vet into the room.',
  'vetpack.body':
    'One tap sends your vet a compact handout — compound, evidence level, key citation, dosing summary and monitoring notes. No logins, no attachments.',
  'vetpack.wa': 'SHARE VIA WHATSAPP',
  'vetpack.print': 'PRINT VET HANDOUT',
  'vetpack.close': 'CLOSE',
  'vetpack.docTitle': 'PSA PETS · VET HANDOUT',
  'vetpack.docStatus': 'PRE-LAUNCH PRODUCT DOSSIER — NOT A VETERINARY MEDICINE',
  'vetpack.row.product': 'PRODUCT',
  'vetpack.row.compound': 'COMPOUND',
  'vetpack.row.evidence': 'EVIDENCE LEVEL',
  'vetpack.row.citation': 'KEY CITATION',
  'vetpack.row.dosing': 'DOSING SUMMARY',
  'vetpack.row.monitoring': 'MONITORING NOTES',
  'vetpack.row.batch': 'BATCH',
  'vetpack.docFoot':
    'NOT YET FOR SALE · COA PUBLISHED PER BATCH AT /VERIFY · ALWAYS CONSULT YOUR VETERINARIAN',
  'vetpack.dose.drops':
    'BY WEIGHT — <10KG: 0.25 ML · 10–25KG: 0.5 ML · 25–45KG: 0.75 ML · >45KG: 1 ML, ONCE DAILY ON FOOD · 5 DAYS ON / 2 DAYS OFF · START AT HALF DOSE FOR WEEK 1 · HORSES: VET-GUIDED CHART',
  'vetpack.dose.scoop':
    'BY WEIGHT — <10KG: ½ SCOOP · 10–25KG: 1 SCOOP · 25–45KG: 1½ SCOOPS · >45KG: 2 SCOOPS, ONCE DAILY STIRRED INTO FOOD · HORSES: VET-GUIDED CHART',
  'vetpack.mon.default':
    'BASELINE WEIGHT + CONDITION SCORE · RECHECK AT WEEK 6 · STOP IF GI UPSET OR LETHARGY · NOT FOR PREGNANT/LACTATING ANIMALS · FLAG CHRONIC NSAIDS / IMMUNOSUPPRESSANTS',
  'vetpack.mon.immune':
    'REVIEW CHRONIC MEDICATION FIRST · BASELINE WEIGHT + CONDITION SCORE · RECHECK AT WEEK 6 · STOP IF GI UPSET OR LETHARGY · NOT FOR PREGNANT/LACTATING ANIMALS',
  'vetpack.waItem':
    '[{n}] {product} ({compound})\nEvidence: {evidence}\nCitation: {citation}\nDosing: {dosing}\nMonitoring: {monitoring}',
  'vetpack.waMsg':
    'PSA PETS — VET HANDOUT (pre-launch dossier)\n\n{items}\n\nStatus: in development, not yet for sale. Batch COAs publish at launch.\nDetails: {link}',

  /* queue dashboard */
  'queue.overline': 'YOUR WAITLIST DASHBOARD',
  'queue.title': 'Your place in line, live.',
  'queue.sub': 'Your ticket, your referral boosts and the honest counters — all in one spot.',
  'queue.position': 'YOUR POSITION',
  'queue.total': '{count} OWNERS IN LINE',
  'queue.honest':
    'HONEST COUNT — PUBLIC BASE + LIVE SIGNUPS + REFERRAL BOOSTS (SIMULATED LOCALLY)',
  'queue.ticker': 'QUEUE MOVEMENT',
  'queue.sim': 'SIMULATED LOCALLY — LIVE FEED ACTIVATES AT LAUNCH',
  'queue.ticker.join': 'YOU JOINED VIA {ref} — +{spots} SPOTS',
  'queue.ticker.ref': '{code} JOINED VIA YOUR LINK — +{spots} SPOTS',
  'queue.ticker.idle': 'WATCH THIS SPACE — REFERRAL BUMPS SHOW HERE',
  'queue.founding': 'ROAD TO FOUNDING {cap}',
  'queue.foundingBody':
    'Founding 20% pricing is capped at the first {cap}. The bar fills with real waitlist joins — no fake countdowns.',
  'queue.claimed': '{claimed} / {cap} CLAIMED',
  'queue.refTitle': 'MOVE UP THE QUEUE',
  'queue.refBody': 'Every friend who joins with your link bumps you up {spots} more spots.',
  'queue.copy': 'COPY LINK',
  'queue.copied': '✓ COPIED',
  'queue.shareWa': 'SHARE ON WHATSAPP',
  'queue.products': 'YOUR PRODUCTS',
  'queue.waiting': '{count} WAITING',
  'queue.ticket': 'YOUR TICKET',
  'queue.notMember.title': "You're not in the queue yet.",
  'queue.notMember.body':
    'Join the waitlist — it costs nothing, locks founding-member pricing, and this dashboard starts tracking your position and referrals.',
  'queue.notMember.cta': 'Join the waitlist',
  'queue.browse': 'Browse the catalog',

  /* waitlist confirmation handoff */
  'wlp.dashboard': 'VIEW MY QUEUE DASHBOARD →',

  /* credibility block */
  'cred.overline': 'ADVISORY & TESTING',
  'cred.title': 'Reviewed by people who answer for it.',
  'cred.sub':
    'Protocols and certificates carry names, not logos. Our advisory vet signs off every dosing chart; our partner lab signs off every batch.',
  'cred.vet.card': 'ADVISORY VETERINARIAN',
  'cred.lab.card': 'INDEPENDENT TESTING LAB',
  'cred.disclaimer': 'ADVISORY DETAILS FINALIZED AT LAUNCH',

  /* PDP batch → COA link */
  'pdp.batchLine': 'THIS BATCH: {batch}',
  'pdp.viewCoa': 'VIEW COA ↗',

  /* footer */
  'foot.verify': 'Verify a batch (COA)',
})

Object.assign(af, {
  /* ---------------- Ronde 6 — vertrouenskenmerke ---------------- */
  'nav.verify': 'VERIFIEER',
  'nav.blog': 'BLOG',
  'nav.myQueue': 'My ry',

  /* COA-verifikasiebladsy */
  'coa.overline': 'LOTVERIFIKASIE · OPENBARE GROOTBOEK',
  'coa.titleA': 'Elke lot.',
  'coa.titleEm': 'Elke sertifikaat.',
  'coa.titleB': 'Openbaar.',
  'coa.sub':
    'Die lotnommer op jou etiket open die volle laboratoriumrekord — suiwerheid, swaarmetale, endotoksiene, analis se aftekening. Geen aanmeldings, geen e-pos aan ondersteuning nie.',
  'coa.inputLabel': 'VOER JOU LOTNOMMER IN',
  'coa.inputPh': 'bv. PTD-2026-007',
  'coa.lookup': 'Soek sertifikaat op',
  'coa.trySample': 'PROBEER ’N VOORBEELD-LOT:',
  'coa.notFound.title': 'Lot nie gevind nie.',
  'coa.notFound.body':
    'Ons kon daardie nommer nie in die voorlansiering-voorbeeldgrootboek pas nie. Stuur vir ons ’n WhatsApp en ons stuur die sertifikaat direk.',
  'coa.notFound.cta': 'WhatsApp ons die lotnommer',
  'coa.notFound.waMsg':
    'Hallo PSA PETS — stuur asseblief die analisesertifikaat vir lot {batch}.',
  'coa.sampleChip': 'VOORBEELDSERTIFIKAAT — REGTE LOTDATA AKTIWEER BY LANSERING',
  'coa.doc.kicker': 'PSA PETS · DERDEPARTY-GEVERIFIEERD',
  'coa.doc.title': 'ANALISESERTIFIKAAT',
  'coa.verified': '✓ GEVERIFIEERD — ALLE SPESIFIKASIES GESLAAG',
  'coa.row.product': 'PRODUK',
  'coa.row.spec': 'SPESIFIKASIE',
  'coa.row.batch': 'LOT- / LOTNOMMER',
  'coa.row.mfg': 'VERVAARDIGINGSDATUM',
  'coa.row.expiry': 'VERVALDATUM',
  'coa.row.lab': 'TOETSLABORATORIUM',
  'coa.row.purity': 'HPLC-SUIWERHEID',
  'coa.row.metals': 'SWAARMETALE (ICP-MS)',
  'coa.row.endotoxin': 'ENDOTOKSIEN (LAL)',
  'coa.row.microbial': 'MIKROBIESE SIFTING',
  'coa.row.net': 'NETTO INHOUD',
  'coa.row.analyst': 'ANALIS-AFTEKENING',
  'coa.print': 'DRUK / STOOR PDF',
  'coa.doc.foot': 'PER LOT UITGEREIK · VERIFIEER ENIGE LOT BY /VERIFY',

  /* tuisblad-COA-strook */
  'coas.overline': 'LOT-DEURSIGTIGHEID',
  'coas.title': 'Elke lot. Elke sertifikaat. Openbaar.',
  'coas.body':
    'Tik die lotnommer op enige PSA PETS-etiket en kry die volle analisesertifikaat — suiwerheid, swaarmetale, endotoksiene, analis se aftekening. Probeer dit met ons lanseringslot.',
  'coas.demo': 'SIEN DIE VOORBEELDSERTIFIKAAT',
  'coas.verify': 'VERIFIEER JOU LOT →',

  /* veearts-pakket */
  'vetpack.cta': 'STUUR DIT NA JOU VEEARTS',
  'vetpack.title': 'Bring jou veearts in die kamer in.',
  'vetpack.body':
    'Een tik stuur jou veearts ’n bondige stuk — verbinding, bewysvlak, sleutelsitasie, doseringsopsomming en moniteringsnotas. Geen aanmeldings, geen aanhangsels nie.',
  'vetpack.wa': 'DEEL VIA WHATSAPP',
  'vetpack.print': 'DRUK VEEARTS-STUK',
  'vetpack.close': 'SLUIT',
  'vetpack.docTitle': 'PSA PETS · VEEARTS-STUK',
  'vetpack.docStatus': 'VOORLANSIERING-PRODUKLEÊR — NIE ’N VEEARTSENYMEDISYNE NIE',
  'vetpack.row.product': 'PRODUK',
  'vetpack.row.compound': 'VERBINDING',
  'vetpack.row.evidence': 'BEWYSVLAK',
  'vetpack.row.citation': 'SLEUTELSITASIE',
  'vetpack.row.dosing': 'DOSERINGSOPSOMMING',
  'vetpack.row.monitoring': 'MONITERINGSNOTAS',
  'vetpack.row.batch': 'LOT',
  'vetpack.docFoot':
    'NOG NIE TE KOOP NIE · COA WORD PER LOT BY /VERIFY GEPUBLISEER · RAADPLEEG ALTYD JOU VEEARTS',
  'vetpack.dose.drops':
    'VOLGENS GEWIG — <10KG: 0.25 ML · 10–25KG: 0.5 ML · 25–45KG: 0.75 ML · >45KG: 1 ML, EENMAAL DAAGLIKS OP KOS · 5 DAE AAN / 2 DAE AF · BEGIN OP HALWE DOSIS VIR WEEK 1 · PERDE: VEEARTS-GIDS',
  'vetpack.dose.scoop':
    'VOLGENS GEWIG — <10KG: ½ SKEPPIE · 10–25KG: 1 SKEPPIE · 25–45KG: 1½ SKEPPIES · >45KG: 2 SKEPPIES, EENMAAL DAAGLIKS IN DIE KOS GEMENG · PERDE: VEEARTS-GIDS',
  'vetpack.mon.default':
    'BASISLYN-GEWIG + KONDISIETELLING · HERSIEN BY WEEK 6 · STOP BY DERMONTEURDHEID OF LETHARGIE · NIE VIR DRAGTIGE/LAKTERENDE DIERE NIE · MERK CHRONIESE NSAIDS / IMMUUNONDERDRUKKERS',
  'vetpack.mon.immune':
    'HERSIEN EERS CHRONIESE MEDISYNE · BASISLYN-GEWIG + KONDISIETELLING · HERSIEN BY WEEK 6 · STOP BY DERMONTEURDHEID OF LETHARGIE · NIE VIR DRAGTIGE/LAKTERENDE DIERE NIE',
  'vetpack.waItem':
    '[{n}] {product} ({compound})\nBewys: {evidence}\nSitasie: {citation}\nDosering: {dosing}\nMonitering: {monitoring}',
  'vetpack.waMsg':
    'PSA PETS — VEEARTS-STUK (voorlansiering-leêr)\n\n{items}\n\nStatus: in ontwikkeling, nog nie te koop nie. Lot-COA’s word by lansering gepubliseer.\nBesonderhede: {link}',

  /* ry-kontrolepaneel */
  'queue.overline': 'JOU WAGLYS-KONTROLEPANEEL',
  'queue.title': 'Jou plek in die ry, regstreeks.',
  'queue.sub': 'Jou kaartjie, jou verwysingsbonusse en die eerlike tellers — alles op een plek.',
  'queue.position': 'JOU POSISIE',
  'queue.total': '{count} EIENAARS IN DIE RY',
  'queue.honest':
    'EERLIKE TELLING — OPENBARE BASIS + REGTE AANSLUITINGS + VERWYSINGSBONUSSE (PLAASLIK GESIMULEER)',
  'queue.ticker': 'RYBEWEGING',
  'queue.sim': 'PLAASLIK GESIMULEER — REGSTREEKSE VOER AKTIWEER BY LANSERING',
  'queue.ticker.join': 'JY HET VIA {ref} AANGESLUIT — +{spots} PLEKKE',
  'queue.ticker.ref': '{code} HET VIA JOU SKAKEL AANGESLUIT — +{spots} PLEKKE',
  'queue.ticker.idle': 'HOU HIERDIE PLEK DOP — VERWYSINGSBONUSSE VERSKYN HIER',
  'queue.founding': 'PAD NA STIGTERS-{cap}',
  'queue.foundingBody':
    'Stigters-20%-pryse is beperk tot die eerste {cap}. Die balk vul met regte waglys-aansluitings — geen vals aftellers nie.',
  'queue.claimed': '{claimed} / {cap} GEVAT',
  'queue.refTitle': 'SKUIF VORENTOE IN DIE RY',
  'queue.refBody': 'Elke vriend wat met jou skakel aansluit, skuif jou nog {spots} plekke op.',
  'queue.copy': 'KOPIEER SKAKEL',
  'queue.copied': '✓ GEKOPIEER',
  'queue.shareWa': 'DEEL OP WHATSAPP',
  'queue.products': 'JOU PRODUKTE',
  'queue.waiting': '{count} WAG',
  'queue.ticket': 'JOU KAARTJIE',
  'queue.notMember.title': 'Jy is nog nie in die ry nie.',
  'queue.notMember.body':
    'Sluit by die waglys aan — dit kos niks, sluit stigterslidpryse vas, en hierdie paneel begin jou posisie en verwysings dadelik volg.',
  'queue.notMember.cta': 'Sluit aan by die waglys',
  'queue.browse': 'Blaai deur die katalogus',

  /* waglys-bevestiging */
  'wlp.dashboard': 'SIEN MY RY-KONTROLEPANEEL →',

  /* geloofwaardigheidsblok */
  'cred.overline': 'ADVIES & TOETSING',
  'cred.title': 'Hersien deur mense wat daarvoor instaan.',
  'cred.sub':
    'Protokolle en sertifikate dra name, nie logo’s nie. Ons adviesveearts teken elke doseringstabel af; ons vennootlaboratorium teken elke lot af.',
  'cred.vet.card': 'ADVIESVEEARTS',
  'cred.lab.card': 'ONAFHANKLIKE TOETSLABORATORIUM',
  'cred.disclaimer': 'ADVIESBESONDERHEDE WORD BY LANSERING GEFINALISEER',

  /* PDP lot → COA-skakel */
  'pdp.batchLine': 'HIERDIE LOT: {batch}',
  'pdp.viewCoa': 'SIEN COA ↗',

  /* voetskrif */
  'foot.verify': 'Verifieer ’n lot (COA)',
})

/* ============================== Provider ============================== */

const STRINGS: Record<Locale, Dict> = { en, af }

export function translate(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  let out = STRINGS[locale][key] ?? STRINGS.en[key] ?? key
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      out = out.replaceAll(`{${k}}`, String(v))
    }
  }
  return out
}

interface I18nValue {
  locale: Locale
  setLocale: (l: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
}

const I18nContext = createContext<I18nValue | null>(null)

function readStoredLocale(): Locale {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === 'af' ? 'af' : 'en'
  } catch {
    return 'en'
  }
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readStoredLocale)

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l)
    try {
      window.localStorage.setItem(STORAGE_KEY, l)
    } catch {
      /* private mode — in-memory only */
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const t = useCallback(
    (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars),
    [locale],
  )

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used inside <I18nProvider>')
  return ctx
}

/** Mono pill EN | AF toggle — used in the Navbar (desktop + mobile drawer). */
export function LanguageToggle({ className }: { className?: string }) {
  const { locale, setLocale, t } = useI18n()
  const next: Locale = locale === 'en' ? 'af' : 'en'
  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={t('nav.langAria', { lang: next === 'af' ? 'Afrikaans' : 'English' })}
      className={
        'mono-label inline-flex cursor-pointer items-center gap-1 rounded-full border border-espresso/25 bg-warmwhite px-2.5 py-1.5 !text-[10px] transition-colors hover:border-amber ' +
        (className ?? '')
      }
    >
      <span className={locale === 'en' ? 'font-bold text-amber-deep' : 'text-espresso-70'}>EN</span>
      <span className="text-espresso-70/50">|</span>
      <span className={locale === 'af' ? 'font-bold text-amber-deep' : 'text-espresso-70'}>AF</span>
    </button>
  )
}
