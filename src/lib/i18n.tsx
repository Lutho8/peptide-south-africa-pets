/**
 * Peptides4Pets — lightweight EN/AF localization (no external i18n library).
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
  'nav.shopNow': 'Shop now',
  'nav.marquee':
    'MOBILITY COLLAGEN NOW LIVE — SECURE EFT CHECKOUT · EXPERIMENTAL PEPTIDES — RESEARCH INFORMATION ONLY · ',
  'nav.dismissAnnouncement': 'Dismiss announcement',
  'nav.waitingChip': '{count} SA PET OWNERS WAITING',
  'nav.waitlistOpen': 'FOUNDING WAITLIST OPEN',
  'nav.cartAria': 'Open your basket, {count} items',
  'nav.cta': 'Join the waitlist',
  'nav.waMsg': 'Hi Peptides4Pets! I have a question about your pet products.',
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
  'hero.trust': '≥99% HPLC · COA EVERY BATCH · PRICES IN ZAR · FREE SHIPPING OVER R1,500',
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
  'trust.4.label': 'PRICES IN ZAR',
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
    'Peptides4Pets brings that ambition home. We’re adapting the compounds pet owners worldwide already ask for — BPC-157, KPV, collagen peptides — to South African shelves, with South African pricing, price in ZAR, and a certificate of analysis on every batch.',
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
  'badge.comingSoon': 'RESEARCH ONLY',
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
  'subs.perk2.body': 'Free delivery over R1,500, prices in ZAR, anywhere in SA.',
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
  'sp.stats': 'FOUNDING WAITLIST OPEN · NO PAYMENT · NO COMMITMENT',
  'sp.1.quote': 'Tell us what your senior dog struggles with most.',
  'sp.1.meta': '60-SECOND PRODUCT-FIT QUIZ',
  'sp.2.quote': 'Choose which launch products you want updates about.',
  'sp.2.meta': 'PERSONALISED WAITLIST',
  'sp.3.quote': 'Get a server-confirmed queue position after joining.',
  'sp.3.meta': 'CLEAR CONFIRMATION',

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
  'faq.1.q': 'When will Peptides4Pets launch?',
  'faq.1.a':
    'Mobility Collagen is live now — order it today with secure EFT checkout. The peptide drops (BPC-157, KPV, Recovery Blend, Immune) remain in development; waitlist members hear first.',
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
    'Monthly autoship at 15% off, free shipping over R1,500, price in ZAR, pause or cancel anytime via WhatsApp.',
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
  'cart.footer': 'PRICES IN ZAR · PRICE LOCKED TO YOUR TICKET · CANCEL ANYTIME',
  'cart.addOnLabel': 'ONE RELEVANT ADD-ON',
  'cart.addOnCta': 'ADD TO PLAN',
  'cart.addOnBody': 'One complementary option only — skip it if it is not useful for your pet.',

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
    'RESEARCH INFORMATION ONLY · CONTACT PREFERENCES ARE SEPARATE · POPIA-SCOPED PROCESSING',
  'form.err.name': 'TELL US YOUR NAME',
  'form.err.email': 'VALID EMAIL REQUIRED',
  'form.err.whatsapp': 'SA FORMAT: +27… (9 DIGITS AFTER)',
  'form.err.breed': 'BREED HELPS US DOSE RIGHT',
  'form.err.products': 'PICK AT LEAST ONE PRODUCT',
  'form.confirmed': 'WAITLIST CONFIRMED',
  'form.savedLocal': 'SAVED ON THIS DEVICE · SYNC PENDING',
  'form.youreIn': "You're in, {name}.",
  'form.queueLine': 'YOU ARE #{queue} IN LINE · CODE {code}',
  'form.referred': 'JOINED VIA {ref}',
  'form.synced': 'SYNCED TO PSA CRM ✓',
  'form.syncQueued': 'SAVED LOCALLY — WILL SYNC',
  'form.foundingNote':
    'Founding-member pricing is locked: 20% off your first 3 subscription months at launch.',
  'form.refTitle': 'SHARE THE FOUNDING WAITLIST',
  'form.refBody': 'Your link records who referred a new member; queue positions remain server-issued.',
  'form.refAria': 'Your referral link',
  'form.copy': 'COPY LINK',
  'form.copied': '✓ COPIED',
  'form.shareWa': 'SHARE ON WHATSAPP',
  'form.refWaText':
    '{name} here — I’ve joined the Peptides4Pets founding waitlist for the South African launch. You can build your pet’s launch plan here: {link}',
  'form.confirmWa': 'Confirm faster on WhatsApp',
  'form.waMessage':
    "Hi Peptides4Pets! I'm {name}, on the waitlist for {products} for my {petType}, {breed}, age {age}. Code {code}.",
  'form.popiaFoot':
    'POPIA COMPLIANT · WE’LL ONLY CONTACT YOU ABOUT PET PRODUCTS · UNSUBSCRIBE ANYTIME',

  /* ---------------- Quiz ---------------- */
  'quiz.overline': 'Peptides4Pets · RESEARCH CATALOGUE NAVIGATOR',
  'quiz.hookTitle': 'Find the most relevant pet research profiles in 60 seconds.',
  'quiz.hookSub':
    'Seven quick taps organise evidence profiles by species, age and research area. No diagnosis, dose or treatment recommendation.',
  'quiz.hookCta': 'Start the research navigator',
  'quiz.hookMeta': 'FREE · EVIDENCE-GRADED · NO PAYMENT',
  'quiz.back': '← BACK',
  'quiz.continue': 'Continue',
  'quiz.species.dog': 'dog',
  'quiz.species.cat': 'cat',
  'quiz.species.horse': 'horse',
  'quiz.species.pet': 'pet',
  'quiz.step1.kicker': 'FIRST THINGS FIRST',
  'quiz.step1.title': 'Which species are you researching?',
  'quiz.step1.sub': 'Tap one — the evidence map changes by species.',
  'quiz.enc.petType': 'Noted — we’ll keep the evidence specific to {pet} research.',
  'quiz.step2.kicker': 'THE RESEARCH PROFILE',
  'quiz.step2.title': 'Tell us about your {pet}.',
  'quiz.step2.sub': 'Name, breed and age help organise the catalogue; they do not create a treatment plan.',
  'quiz.petName.pet': 'PET’S NAME',
  'quiz.petName.horse': 'HORSE’S NAME',
  'quiz.err.petName': 'A NAME HELPS US ORGANISE THE PROFILE',
  'quiz.err.age': 'AGE MUST BE 1–30 YEARS',
  'quiz.enc.profile': 'Great — {name}’s research profile is taking shape.',
  'quiz.breed': 'BREED',
  'quiz.optional': '(OPTIONAL)',
  'quiz.breedPh': 'Boerboel, rescue special, unknown…',
  'quiz.ageLabel': 'AGE — {age} YRS',
  'quiz.seniorOn': 'SENIOR LOGIC: ON — {threshold} YRS',
  'quiz.step3.kicker': 'PROFILE CONTEXT',
  'quiz.step3.title': 'How big is {name}?',
  'quiz.step3.sub': 'Size helps organise the evidence context. It does not generate a dose.',
  'quiz.enc.size': 'Noted — size is recorded as research context for {name}.',
  'quiz.step4.kicker': 'WHAT MATTERS MOST',
  'quiz.step4.title': 'Which research areas matter for {name}?',
  'quiz.step4.sub': 'Pick up to {max}. We’ll organise the evidence around these.',
  'quiz.selected': '{count} / {max} SELECTED',
  'quiz.calmingDev': 'CALMING: IN DEVELOPMENT',
  'quiz.err.concerns': 'PICK AT LEAST ONE — WHAT MATTERS MOST?',
  'quiz.enc.concerns': 'Got it — we’re organising the evidence around {name}.',
  'quiz.step5.kicker': 'SAFETY CHECK',
  'quiz.step5.title': 'What is {name} already on?',
  'quiz.step5.sub': 'Supplements, chronic meds — and whether a vet is in the picture.',
  'quiz.suppsLabel': 'CURRENT SUPPLEMENTS / MEDS',
  'quiz.suppsPh': 'e.g. joint chews, chronic anti-inflammatories, nothing yet…',
  'quiz.suppsNote': 'THIS CONTEXT IS NOT USED TO GENERATE A DOSE OR TREATMENT RECOMMENDATION.',
  'quiz.vetQ': 'DO YOU HAVE A VET FOR {name}?',
  'quiz.vetYes': 'YES — HAVE A VET',
  'quiz.vetNo': 'NO VET YET',
  'quiz.err.vet': 'ONE TAP — DO YOU HAVE A VET?',
  'quiz.noVetNote':
    'No vet yet? The navigator remains research information only. Seek veterinary care for symptoms, illness, injury or medicine questions.',
  'quiz.enc.vetYes': 'Perfect — you can discuss the published evidence with your vet.',
  'quiz.enc.vetNo': 'No vet yet? We’ll always nudge you toward one — promise.',
  'quiz.step6.kicker': 'ALMOST THERE',
  'quiz.step6.title': 'Where do we save {name}’s research profile?',
  'quiz.step6.sub': 'The evidence map is ready. Research acknowledgement is separate from optional marketing.',
  'quiz.yourName': 'YOUR NAME',
  'quiz.email': 'EMAIL',
  'quiz.whatsapp': 'WHATSAPP NUMBER',
  'quiz.popia':
    'I understand experimental peptide profiles are research information only, not animal-use products or veterinary treatment, and accept POPIA-scoped processing.',
  'quiz.err.owner': 'TELL US YOUR NAME',
  'quiz.err.email': 'VALID EMAIL REQUIRED',
  'quiz.err.whatsapp': 'SA FORMAT: +27… OR 0… (9 DIGITS)',
  'quiz.err.popia': 'POPIA CONSENT REQUIRED',
  'quiz.seePlan': 'See {name}’s research profile →',
  'quiz.leadFoot':
    'POPIA COMPLIANT · WE’LL ONLY WHATSAPP/EMAIL YOU ABOUT PET PRODUCTS · NO PAYMENT REQUIRED',
  'quiz.readyLine': 'RESEARCH PROFILE READY · {date} · REF {ref}',
  'quiz.resultsTitle': 'Research profiles relevant to {name}.',
  'quiz.results.count': '{count} evidence profiles',
  'quiz.results.countOne': '1 evidence profile',
  'quiz.results.matched': 'organised around {concerns}',
  'quiz.results.wellness': 'everyday wellness',
  'quiz.results.senior': ' — with senior logic applied',
  'quiz.protocol': 'Peptides4Pets · RESEARCH CATALOGUE PROFILE',
  'quiz.patient': 'PET PROFILE',
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
  'quiz.researchOnly': 'RESEARCH PROFILE · NOT FOR SALE OR ANIMAL ADMINISTRATION',
  'quiz.boundaryTitle': 'RESEARCH BOUNDARY',
  'quiz.boundaryBody':
    'Experimental peptide results are evidence profiles only. They do not provide a dose, regimen, suitability decision or treatment recommendation. Mobility Collagen remains a separate nutritional product with label-led use.',
  'quiz.printProfile': 'PRINT RESEARCH PROFILE',
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
  'quiz.joinStack': 'Save these research interests',
  'quiz.retake': 'Not right? Retake the quiz',
  'quiz.evidenceLink': 'See the evidence behind every profile →',
  /* stack "why" lines (quiz.ts emits whyKey alongside the English `why`) */
  'quiz.why.mc.mobility':
    'Published canine RCT evidence is the strongest profile relevant to mobility research for {name}.',
  'quiz.why.bpc.mobility':
    'A canine pharmacokinetic study exists, but efficacy for a {age}-year-old {breed} has not been established.',
  'quiz.why.rb.injury': 'A combination research profile with major canine efficacy gaps stated plainly.',
  'quiz.why.mc.injury': 'A separate nutritional-evidence profile relevant to joint research for {name}.',
  'quiz.why.kpv.gut':
    'KPV has preclinical gut research but no canine efficacy trials relevant to {name}.',
  'quiz.why.kpv.skin': 'KPV skin signals are preclinical; no dose or outcome is inferred for {name}.',
  'quiz.why.it.senior': 'A thymic-peptide research profile with preliminary animal evidence and clear gaps.',
  'quiz.why.mc.senior': 'Published nutritional evidence is separated from experimental peptide profiles.',
  'quiz.why.mc.prevention': 'A nutritional-evidence profile relevant to long-term joint-health research.',
  'quiz.why.it.prevention': 'A research-interest profile; prevention efficacy has not been established.',
  'quiz.why.it.age':
    'Age {age} makes senior-animal evidence relevant to {name}; it does not create a protocol.',
  'quiz.why.mc.fallback':
    'The live nutritional product has published canine evidence and label-led use.',
  'quiz.why.it.fallback':
    'A research profile to monitor as the evidence develops.',
  'quiz.why.honesty':
    "Printed plainly: part of {name}'s evidence map is preclinical only. It is not a treatment recommendation, dose or claim of suitability.",
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
    'I understand experimental peptide profiles are research information only, not animal-use products or veterinary treatment, and I accept POPIA-scoped processing of this request.',
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
  'wlp.confirmedJoins': '{count} CONFIRMED JOINS',
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
  'wlp.savedNamed': '{name} is saved on this device.',
  'wlp.saved': 'Your details are saved on this device.',
  'wlp.pendingNote': 'SERVER CONFIRMATION IS STILL PENDING. WE WILL RETRY AUTOMATICALLY ON YOUR NEXT VISIT.',
  'wlp.ticketTitle': 'Peptides4Pets · WAITLIST TICKET',
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
    'Hi Peptides4Pets — confirming my waitlist ticket.\nName: {name}\nPet: {pet}\nProducts: {products}\nCode: {code} · Queue #{queue}',

  /* ---------------- Product page ---------------- */
  'pdp.notFound.overline': 'CATALOG / NOT FOUND',
  'pdp.notFound.title': 'We don’t make that one (yet).',
  'pdp.notFound.body': 'Five formulas are in development — every one of them has a waitlist.',
  'pdp.notFound.cta': 'Back to the catalog',
  'pdp.crumb': 'CATALOG',
  'pdp.firstLaunch': '★ FIRST TO LAUNCH — EST. Q1 2026',
  'pdp.vat': 'PRICED IN SOUTH AFRICAN RAND',
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
  'pdp.cmp.overline': 'SOUTH AFRICAN SHOPPING',
  'pdp.cmp.title': 'Plan your order.',
  'pdp.cmp.import': 'WHAT TO CHECK',
  'pdp.cmp.psa': 'PEPTIDES4PETS',
  'pdp.cmp.price': 'PRICE',
  'pdp.cmp.shipping': 'SHIPPING',
  'pdp.cmp.docs': 'DOCUMENTATION',
  'pdp.cmp.support': 'SUPPORT',
  'pdp.cmp.imp1': 'Confirm the total before ordering',
  'pdp.cmp.imp2': 'Check delivery at checkout',
  'pdp.cmp.imp3': 'Read the scope of available reports',
  'pdp.cmp.imp4': 'Ask a product question',
  'pdp.cmp.psa1': '{price}, price in ZAR',
  'pdp.cmp.psa2': 'Local courier, free over R1,500',
  'pdp.cmp.psa3': 'Available reports at /verify; check their scope',
  'pdp.cmp.psa4': 'WhatsApp, SA hours',
  'pdp.wl.overline': 'WAITLIST · {product}',
  'pdp.wl.title': 'Be first in line for {product}.',
  'pdp.wl.body':
    'Founding members lock 20% off their first 3 subscription months at launch — and we’ll WhatsApp you the moment this formula ships.',
  'pdp.counter': '{count} WAITING',
  'pdp.counterAvg': ' · AVG. {avg} NEW / DAY',
  'pdp.rel.overline': 'EXPLORE THE EVIDENCE',
  'pdp.rel.title': 'Related research profiles.',
  'pdp.rel.first': '★ FIRST TO LAUNCH',
  'pdp.waiting': '{count} WAITING',
  'pdp.outro.back': '← BACK TO CATALOG',

  /* ---------------- Footer ---------------- */
  'foot.tagline': 'Evidence-led pet research, with nutrition and experimental research kept clearly separate. Cape Town, South Africa.',
  'foot.catalog': 'CATALOG',
  'foot.learn': 'LEARN',
  'foot.science': 'Science & evidence library',
  'foot.waitlist': 'Join the waitlist',
  'foot.mainSite': 'Main site — peptides for humans',
  'foot.questions': 'QUESTIONS? TEXT US',
  'foot.questionsBody': 'One WhatsApp message — real humans, Cape Town hours.',
  'foot.textUs': 'TEXT US',
  'foot.waMsg': 'Hi Peptides4Pets! A question about the pet products.',
  'foot.bottom': '© {year} PEPTIDE SOUTH AFRICA · PRICES IN ZAR',
})

Object.assign(en, {
  /* ---------------- Founder story + evidence boundary ---------------- */
  'tm.overline': 'EVIDENCE EXPLAINED',
  'tm.title': 'What a recovery story can tell us.',
  'tm.sub': 'Read the study design and evidence gaps before drawing a treatment conclusion.',
  'tm.feat.kicker': 'EDITORIAL EVIDENCE GUIDE',
  'tm.feat.quote1': 'A recovery video is an observation. It cannot establish what caused the change.',
  'tm.feat.attr': 'PEPTIDES4PETS EDITORIAL',
  'tm.feat.disclaimer': 'No verified patient story is presented. Consult a South African veterinarian.',
  'tm.evidence.kicker': 'EVIDENCE CHECK',
  'tm.evidence.title': 'Promising signals, important gaps.',
  'tm.evidence.rats': 'Rat studies report improved tendon-cell growth, migration and tissue healing signals.',
  'tm.evidence.beagles': 'A small beagle study examined pharmacokinetics and short-term tolerability — not whether BPC-157 works in dogs.',
  'tm.evidence.gap': 'Good canine efficacy trials for BPC-157 and TB-500 are still missing.',
  'tm.evidence.link': 'READ THE SOURCES AND LIMITS',
  'tm.cta': 'Read the evidence guide',

  /* ---------------- 60-day mobility guarantee band ---------------- */
  'guar.overline': 'THE Peptides4Pets PROMISE',
  'guar.title': 'If you don’t see the difference, you don’t pay.',
  'guar.body':
    'Every Peptides4Pets launch product ships with a 60-day mobility guarantee. If your dog’s movement, recovery or spark doesn’t meaningfully improve, we refund every rand. No hoops, no forms — one WhatsApp message.',
  'guar.chip1': '60 DAYS',
  'guar.chip2': 'FULL REFUND',
  'guar.chip3': 'ONE WHATSAPP',
  'guar.cta': 'SEE THE GUARANTEE TERMS →',
  'guar.term1': '60 DAYS FROM DELIVERY — MOVEMENT, RECOVERY OR SPARK',
  'guar.term2': 'FULL REFUND, NO FORMS — ONE WHATSAPP MESSAGE',
  'guar.term3': 'APPLIES TO EVERY LAUNCH PRODUCT, EVERY BATCH',
  'guar.term4': 'MOBILITY COLLAGEN IS LIVE AND COVERED TODAY · PEPTIDE DROPS COVERED FROM LAUNCH',

  /* ---------------- Protocol pipeline teaser ---------------- */
  'pipe.overline': 'PROTOCOL PIPELINE',
  'pipe.titleA': 'Next out of the',
  'pipe.titleEm': 'lab.',
  'pipe.sub':
    'Three formulas in active development. Early-list members hear launch dates first — and keep founding pricing.',
  'pipe.badge': 'IN DEVELOPMENT',
  'pipe.calm.name': 'Peptides4Pets CALM',
  'pipe.calm.spec': 'SELANK-BASED CALMING BLEND',
  'pipe.calm.desc': 'For storm-shakes, fireworks and separation stress — calm without sedation.',
  'pipe.immune.name': 'Peptides4Pets IMMUNE+',
  'pipe.immune.spec': 'TA-1 + KPV + GHK-CU',
  'pipe.immune.desc': 'The immune-resilience stack for seniors and frequent patients.',
  'pipe.senior.name': 'Peptides4Pets SENIOR VITALITY',
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
  'nav.shopNow': 'Koop nou',
  'nav.marquee':
    'MOBILITY COLLAGEN NOU BESKIKBAAR — VEILIGE EFT-BETALING · EKSPERIMENTELE PEPTIEDE — SLEGS NAVORSINGSINLIGTING · ',
  'nav.dismissAnnouncement': 'Verwyder aankondiging',
  'nav.waitingChip': '{count} SA-TROETELDIEREËNAARS WAG',
  'nav.waitlistOpen': 'STIGTERSWAGLYS OOP',
  'nav.cartAria': 'Maak jou mandjie oop, {count} produkte',
  'nav.cta': 'Sluit aan by die waglys',
  'nav.waMsg': 'Hallo Peptides4Pets! Ek het n vraag oor julle troeteldierprodukte.',
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
  'hero.trust': '≥99% HPLC · COA BY ELKE LOT · PRYSE IN RAND · GRATIS AFLEWERING BO R1,500',
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
  'trust.4.label': 'PRYSE IN RAND',
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
    'Peptides4Pets bring daardie ambisie huis toe. Ons pas die verbindings waarvoor troeteldier-eienaars wêreldwyd alreeds vra — BPC-157, KPV, kollageenpeptiede — aan vir Suid-Afrikaanse rakke, met Suid-Afrikaanse pryse, pryse in rand, en ’n analisesertifikaat by elke lot.',
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
  'badge.comingSoon': 'SLEGS NAVORSING',
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
  'subs.perk2.body': 'Gratis aflewering bo R1,500, pryse in rand, oral in SA.',
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
  'sp.stats': 'STIGTERSWAGLYS OOP · GEEN BETALING · GEEN VERPLIGTING',
  'sp.1.quote': 'Vertel ons waarmee jou seniorhond die meeste sukkel.',
  'sp.1.meta': '60-SEKONDE-PRODUKPASSING-VASVRA',
  'sp.2.quote': 'Kies oor watter bekendstellingsprodukte jy nuus wil ontvang.',
  'sp.2.meta': 'PERSOONLIKE WAGLYS',
  'sp.3.quote': 'Kry ’n bedienerbevestigde ryposisie nadat jy aansluit.',
  'sp.3.meta': 'DUIDELIKE BEVESTIGING',

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
  'faq.1.q': 'Wanneer lansier Peptides4Pets?',
  'faq.1.a':
    'Mobility Collagen is nou beskikbaar — bestel dit vandag met veilige EFT-betaling. Die peptieddruppels (BPC-157, KPV, Recovery Blend, Immune) bly in ontwikkeling; waglyslede hoor eerste.',
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
    'Maandelikse outomatiese aflewering teen 15% af, gratis aflewering bo R1,500, pryse in rand, laat wag of kanselleer enige tyd via WhatsApp.',
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
  'cart.footer': 'PRYSE IN RAND · PRYS AAN JOU KAARTJIE VASGESLUIT · KANSELLEER ENIGE TYD',
  'cart.addOnLabel': 'EEN RELEVANTE BYVOEGING',
  'cart.addOnCta': 'VOEG BY PLAN',
  'cart.addOnBody': 'Net een aanvullende opsie — slaan dit oor as dit nie vir jou troeteldier nuttig is nie.',

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
    'SLEGS NAVORSINGSINLIGTING · KONTAKVOORKEURE IS APART · POPIA-BEPERKTE VERWERKING',
  'form.err.name': 'VERTEL ONS JOU NAAM',
  'form.err.email': 'GELDIGE E-POSADRES NODIG',
  'form.err.whatsapp': 'SA-FORMAAT: +27… (9 SYFERS DAARNA)',
  'form.err.breed': 'RAS HELP ONS OM REG TE DOSEER',
  'form.err.products': 'KIES TEN MINSTE EEN PRODUK',
  'form.confirmed': 'WAGLYS BEVESTIG',
  'form.savedLocal': 'OP HIERDIE TOESTEL GESTOOR · SINCHRONISASIE HANGENDE',
  'form.youreIn': 'Jy is in, {name}.',
  'form.queueLine': 'JY IS #{queue} IN DIE RYG · KODE {code}',
  'form.referred': 'VIA {ref} AANGESLUIT',
  'form.synced': 'MET PSA CRM GESINKRONISEER ✓',
  'form.syncQueued': 'PLAASLIK GESTOOR — SAL SINKRONISEER',
  'form.foundingNote':
    'Stigterslidpryse is vasgesluit: 20% af jou eerste 3 intekenmaande by bekendstelling.',
  'form.refTitle': 'DEEL DIE STIGTERSWAGLYS',
  'form.refBody': 'Jou skakel teken aan wie ’n nuwe lid verwys het; ryposisies word deur die bediener uitgereik.',
  'form.refAria': 'Jou verwysingskakel',
  'form.copy': 'KOPIEER SKAKEL',
  'form.copied': '✓ GEKOPIEER',
  'form.shareWa': 'DEEL OP WHATSAPP',
  'form.refWaText':
    '{name} hier — ek het by die Peptides4Pets-stigterswaglys vir die Suid-Afrikaanse bekendstelling aangesluit. Bou jou troeteldier se bekendstellingsplan hier: {link}',
  'form.confirmWa': 'Bevestig vinniger op WhatsApp',
  'form.waMessage':
    'Hallo Peptides4Pets! Ek is {name}, op die waglys vir {products} vir my {petType}, {breed}, {age} jaar oud. Kode {code}.',
  'form.popiaFoot':
    'VOLDOEN AAN POPIA · ONS KONTAK JOU NET OOR TROETELDIERPRODUKTE · SKRYF ENIGE TYD UIT',

  /* ---------------- Quiz ---------------- */
  'quiz.overline': 'Peptides4Pets · NAVORSINGSKATALOGUS-NAVIGATOR',
  'quiz.hookTitle': 'Vind relevante troeteldiernavorsingsprofiele in 60 sekondes.',
  'quiz.hookSub':
    'Sewe vinnige tikke organiseer bewysprofiele volgens spesie, ouderdom en navorsingsgebied. Geen diagnose, dosis of behandelingsaanbeveling nie.',
  'quiz.hookCta': 'Begin die navorsingsnavigator',
  'quiz.hookMeta': 'GRATIS · BEWYSE GEGRADEER · GEEN BETALING',
  'quiz.back': '← TERUG',
  'quiz.continue': 'Gaan voort',
  'quiz.species.dog': 'hond',
  'quiz.species.cat': 'kat',
  'quiz.species.horse': 'perd',
  'quiz.species.pet': 'troeteldier',
  'quiz.step1.kicker': 'EERSTENS EERS',
  'quiz.step1.title': 'Watter spesie ondersoek jy?',
  'quiz.step1.sub': 'Tik een — die bewyskaart verander volgens spesie.',
  'quiz.enc.petType': 'Pragtig — elke {pet} kry hier veearts-hersiende logika.',
  'quiz.step2.kicker': 'DIE NAVORSINGSPROFIEL',
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
  'quiz.step3.kicker': 'PROFIELKONTEKS',
  'quiz.step3.title': 'Hoe groot is {name}?',
  'quiz.step3.sub': 'Grootte help om bewyskonteks te organiseer. Dit skep nie ’n dosis nie.',
  'quiz.enc.size': 'Genoteer — grootte word as navorsingskonteks vir {name} aangeteken.',
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
  'quiz.step6.title': 'Waar stoor ons {name} se navorsingsprofiel?',
  'quiz.step6.sub': 'Die bewyskaart is gereed. Navorsingserkenning is apart van opsionele bemarking.',
  'quiz.yourName': 'JOU NAAM',
  'quiz.email': 'E-POS',
  'quiz.whatsapp': 'WHATSAPP-NOMMER',
  'quiz.popia':
    'Ek verstaan eksperimentele peptiedprofiele is slegs navorsingsinligting, nie produkte vir diergebruik of veeartsenykundige behandeling nie, en aanvaar POPIA-beperkte verwerking.',
  'quiz.err.owner': 'VERTEL ONS JOU NAAM',
  'quiz.err.email': 'GELDIGE E-POSADRES NODIG',
  'quiz.err.whatsapp': 'SA-FORMAAT: +27… OF 0… (9 SYFERS)',
  'quiz.err.popia': 'POPIA-TOESTEMMING NODIG',
  'quiz.seePlan': 'Sien {name} se navorsingsprofiel →',
  'quiz.leadFoot':
    'VOLDOEN AAN POPIA · ONS KONTAK JOU NET PER WHATSAPP/E-POS OOR TROETELDIERPRODUKTE · GEEN BETALING NODIG',
  'quiz.readyLine': 'NAVORSINGSPROFIEL GEREED · {date} · VERW {ref}',
  'quiz.resultsTitle': 'Navorsingsprofiele relevant vir {name}.',
  'quiz.results.count': '{count} bewysprofiele',
  'quiz.results.countOne': '1 bewysprofiel',
  'quiz.results.matched': 'gepas by {concerns}',
  'quiz.results.wellness': 'alledaagse welstand',
  'quiz.results.senior': ' — met senior-logika toegepas',
  'quiz.protocol': 'Peptides4Pets · NAVORSINGSKATALOGUSPROFIEL',
  'quiz.patient': 'TROETELDIERPROFIEL',
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
  'quiz.researchOnly': 'NAVORSINGSPROFIEL · NIE TE KOOP OF VIR DIERGEBRUIK NIE',
  'quiz.boundaryTitle': 'NAVORSINGSGRENS',
  'quiz.boundaryBody':
    'Eksperimentele peptiedresultate is slegs bewysprofiele. Dit verskaf nie ’n dosis, regimen, geskiktheidsbesluit of behandelingsaanbeveling nie. Mobility Collagen bly ’n aparte voedingsproduk met etiketgerigte gebruik.',
  'quiz.printProfile': 'DRUK NAVORSINGSPROFIEL',
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
  'quiz.joinStack': 'Stoor hierdie navorsingsbelangstellings',
  'quiz.retake': 'Nie reg nie? Doen die quiz oor',
  'quiz.evidenceLink': 'Sien die bewyse agter elke aanbeveling →',
  /* stack "why" lines */
  'quiz.why.mc.mobility':
    'Gepubliseerde honde-RCT-bewyse is die sterkste profiel relevant tot mobiliteitsnavorsing vir {name}.',
  'quiz.why.bpc.mobility':
    'Daar is ’n honde-farmakokinetiese studie, maar doeltreffendheid vir ’n {age}-jaar-oue {breed} is nie vasgestel nie.',
  'quiz.why.rb.injury': '’n Kombinasie-navorsingsprofiel met groot gapings in honde-doeltreffendheid.',
  'quiz.why.mc.injury': '’n Aparte voedingsbewysprofiel relevant tot gewrignavorsing vir {name}.',
  'quiz.why.kpv.gut':
    'KPV het prekliniese dermnavorsing, maar geen honde-doeltreffendheidsproewe relevant tot {name} nie.',
  'quiz.why.kpv.skin': 'KPV-velseine is preklinies; geen dosis of uitkoms word vir {name} afgelei nie.',
  'quiz.why.it.senior': '’n Timiese-peptiednavorsingsprofiel met voorlopige dierbewyse en duidelike gapings.',
  'quiz.why.mc.senior': 'Gepubliseerde voedingsbewyse word apart van eksperimentele peptiedprofiele gehou.',
  'quiz.why.mc.prevention': '’n Voedingsbewysprofiel relevant tot langtermyn-gewrigsgesondheidsnavorsing.',
  'quiz.why.it.prevention': '’n Navorsingsbelangstellingsprofiel; voorkomingsdoeltreffendheid is nie vasgestel nie.',
  'quiz.why.it.age':
    'Ouderdom {age} maak senior-dierbewyse relevant tot {name}; dit skep nie ’n protokol nie.',
  'quiz.why.mc.fallback':
    'Die lewendige voedingsproduk het gepubliseerde hondebewyse en etiketgerigte gebruik.',
  'quiz.why.it.fallback':
    '’n Navorsingsprofiel om te volg soos die bewyse ontwikkel.',
  'quiz.why.honesty':
    'Duidelik gestel: ’n deel van {name} se bewyskaart is slegs preklinies. Dit is nie ’n behandelingsaanbeveling, dosis of geskiktheidseis nie.',
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
    'Ek verstaan eksperimentele peptiedprofiele is slegs navorsingsinligting, nie produkte vir diergebruik of veeartsenykundige behandeling nie, en ek aanvaar POPIA-beperkte verwerking van hierdie versoek.',
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
  'wlp.confirmedJoins': '{count} BEVESTIGDE AANSLUITINGS',
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
  'wlp.savedNamed': '{name} is op hierdie toestel gestoor.',
  'wlp.saved': 'Jou besonderhede is op hierdie toestel gestoor.',
  'wlp.pendingNote': 'BEDIENERBEVESTIGING HANG NOGENDE. ONS SAL OUTOMATIES WEER PROBEER TYDENS JOU VOLGENDE BESOEK.',
  'wlp.ticketTitle': 'Peptides4Pets · WAGLYS-KAARTJIE',
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
    'Hallo Peptides4Pets — ek bevestig my waglys-kaartjie.\nNaam: {name}\nTroeteldier: {pet}\nProdukte: {products}\nKode: {code} · Ry #{queue}',

  /* ---------------- Product page ---------------- */
  'pdp.notFound.overline': 'KATALOGUS / NIE GEVIND NIE',
  'pdp.notFound.title': 'Daardie een maak ons (nog) nie.',
  'pdp.notFound.body': 'Vyf formules is in ontwikkeling — elkeen het ’n waglys.',
  'pdp.notFound.cta': 'Terug na die katalogus',
  'pdp.crumb': 'KATALOGUS',
  'pdp.firstLaunch': '★ EERSTE OM TE LANSEER — VERWAG K1 2026',
  'pdp.vat': 'PRYSE IN SUID-AFRIKAANSE RAND',
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
  'pdp.cmp.overline': 'INKOPIES IN SUID-AFRIKA',
  'pdp.cmp.title': 'Beplan jou bestelling.',
  'pdp.cmp.import': 'WAT OM NA TE GAAN',
  'pdp.cmp.psa': 'PEPTIDES4PETS',
  'pdp.cmp.price': 'PRYS',
  'pdp.cmp.shipping': 'VERSENDING',
  'pdp.cmp.docs': 'DOKUMENTASIE',
  'pdp.cmp.support': 'ONDERSTEUNING',
  'pdp.cmp.imp1': 'Bevestig die totaal voor bestelling',
  'pdp.cmp.imp2': 'Gaan aflewering by betaling na',
  'pdp.cmp.imp3': 'Lees die omvang van beskikbare verslae',
  'pdp.cmp.imp4': 'Vra n produkverwante vraag',
  'pdp.cmp.psa1': '{price}, pryse in rand',
  'pdp.cmp.psa2': 'Plaaslike koerier, gratis bo R1,500',
  'pdp.cmp.psa3': 'Beskikbare verslae by /verify; gaan hul omvang na',
  'pdp.cmp.psa4': 'WhatsApp, SA-ure',
  'pdp.wl.overline': 'WAGLYS · {product}',
  'pdp.wl.title': 'Wees eerste in die ry vir {product}.',
  'pdp.wl.body':
    'Stigterslede sluit 20% af hul eerste 3 intekenmaande by bekendstelling vas — en ons WhatsApp jou die oomblik wat hierdie formule versend word.',
  'pdp.counter': '{count} WAG',
  'pdp.counterAvg': ' · GEM. {avg} NUUT / DAG',
  'pdp.rel.overline': 'VERKEN DIE BEWYSE',
  'pdp.rel.title': 'Verwante navorsingsprofiele.',
  'pdp.rel.first': '★ EERSTE OM TE LANSEER',
  'pdp.waiting': '{count} WAG',
  'pdp.outro.back': '← TERUG NA KATALOGUS',

  /* ---------------- Footer ---------------- */
  'foot.tagline': 'Bewysgerigte troeteldiernavorsing, met voeding en eksperimentele navorsing duidelik apart. Kaapstad, Suid-Afrika.',
  'foot.catalog': 'KATALOGUS',
  'foot.learn': 'LEER',
  'foot.science': 'Wetenskap- & bewysbiblioteek',
  'foot.waitlist': 'Sluit aan by die waglys',
  'foot.mainSite': 'Hoofwebwerf — peptiede vir mense',
  'foot.questions': 'VRAE? WHATSAPP ONS',
  'foot.questionsBody': 'Een WhatsApp-boodskap — regte mense, Kaapstad-ure.',
  'foot.textUs': 'STUUR VIR ONS',
  'foot.waMsg': 'Hallo Peptides4Pets! ’n Vraag oor die troeteldierprodukte.',
  'foot.bottom':
    '© {year} PEPTIDE SOUTH AFRICA · PRYSE IN RAND',
})

Object.assign(af, {
  /* ---------------- Stigterverhaal + bewysgrens ---------------- */
  'tm.overline': 'EVIDENCE EXPLAINED',
  'tm.title': 'What a recovery story can tell us.',
  'tm.sub': 'Read the study design and evidence gaps before drawing a treatment conclusion.',
  'tm.feat.kicker': 'EDITORIAL EVIDENCE GUIDE',
  'tm.feat.quote1': 'A recovery video is an observation. It cannot establish what caused the change.',
  'tm.feat.attr': 'PEPTIDES4PETS EDITORIAL',
  'tm.feat.disclaimer': 'No verified patient story is presented. Consult a South African veterinarian.',
  'tm.evidence.kicker': 'BEWYSONDERSOEK',
  'tm.evidence.title': 'Belowende seine, belangrike gapings.',
  'tm.evidence.rats': 'Rotstudies rapporteer seine van verbeterde tendonselgroei, migrasie en weefselgenesing.',
  'tm.evidence.beagles': '’n Klein beagle-studie het farmakokinetika en korttermynverdraagsaamheid ondersoek — nie of BPC-157 by honde werk nie.',
  'tm.evidence.gap': 'Goeie honde-effektiwiteitstudies vir BPC-157 en TB-500 ontbreek steeds.',
  'tm.evidence.link': 'LEES DIE BRONNE EN GRENSE',
  'tm.cta': 'Read the evidence guide',

  /* ---------------- 60-dae-mobiliteitswaarborgstrook ---------------- */
  'guar.overline': 'DIE Peptides4Pets-BELOFTE',
  'guar.title': 'As jy nie die verskil sien nie, betaal jy nie.',
  'guar.body':
    'Elke Peptides4Pets-lanseringsproduk word met ’n 60-dae-mobiliteitswaarborg gestuur. As jou hond se beweging, herstel of vonk nie betekenisvol verbeter nie, betaal ons elke rand terug. Geen hoepels, geen vorms — een WhatsApp-boodskap.',
  'guar.chip1': '60 DAE',
  'guar.chip2': 'VOLLE TERUGBETALING',
  'guar.chip3': 'EEN WHATSAPP',
  'guar.cta': 'SIEN DIE WAARBORGVOORWAARDES →',
  'guar.term1': '60 DAE VANAF AFLEWERING — BEWEGING, HERSTEL OF VONK',
  'guar.term2': 'VOLLE TERUGBETALING, GEEN VORMS — EEN WHATSAPP-BOODSKAP',
  'guar.term3': 'GELD VIR ELKE LANSERINGSPRODUK, ELKE LOT',
  'guar.term4': 'MOBILITY COLLAGEN IS NOU BESKIKBAAR EN REEDS GEDEK · PEPTIEDDRUPPELS WORD VANAF LANSERING GEDEK',

  /* ---------------- Protokol-pyplyn-voorsmakie ---------------- */
  'pipe.overline': 'PROTOKOL-PYPLYN',
  'pipe.titleA': 'Volgende uit die',
  'pipe.titleEm': 'laboratorium.',
  'pipe.sub':
    'Drie formules in aktiewe ontwikkeling. Vroeë-lys-lede hoor lanseringsdatums eerste — en behou stigterspryse.',
  'pipe.badge': 'IN ONTWIKKELING',
  'pipe.calm.name': 'Peptides4Pets CALM',
  'pipe.calm.spec': 'SELANK-GEBASEERDE KALMERENDE MENGSEL',
  'pipe.calm.desc': 'Vir storm-bebings, vuurwerke en skeidingstres — kalm sonder verdoving.',
  'pipe.immune.name': 'Peptides4Pets IMMUNE+',
  'pipe.immune.spec': 'TA-1 + KPV + GHK-CU',
  'pipe.immune.desc': 'Die immuunweerstand-stapel vir seniors en gereelde pasiënte.',
  'pipe.senior.name': 'Peptides4Pets SENIOR VITALITY',
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
    'Hi Peptides4Pets — please send me the certificate of analysis for batch {batch}.',
  'coa.sampleChip': 'SAMPLE CERTIFICATE — LIVE BATCH DATA ACTIVATES AT LAUNCH',
  'coa.doc.kicker': 'Peptides4Pets · THIRD-PARTY VERIFIED',
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
    'Type the batch number on any Peptides4Pets label and pull the full certificate of analysis — purity, heavy metals, endotoxins, analyst sign-off. Try it with our launch batch.',
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
  'vetpack.docTitle': 'Peptides4Pets · VET HANDOUT',
  'vetpack.docStatus': 'PRODUCT INFORMATION — NOT A VETERINARY PRESCRIPTION',
  'vetpack.row.product': 'PRODUCT',
  'vetpack.row.compound': 'COMPOUND',
  'vetpack.row.evidence': 'EVIDENCE LEVEL',
  'vetpack.row.citation': 'KEY CITATION',
  'vetpack.row.dosing': 'DOSING SUMMARY',
  'vetpack.row.monitoring': 'MONITORING NOTES',
  'vetpack.row.batch': 'BATCH',
  'vetpack.docFoot':
    'CHECK PRODUCT STATUS AND REPORT SCOPE · CONSULT YOUR VETERINARIAN',
  'vetpack.dose.drops':
    'No validated pet dosing protocol is provided. Experimental compounds are not offered for animal administration.',
  'vetpack.dose.scoop':
    'Follow the supplied product label. Ask your veterinarian about suitability and serving size.',
  'vetpack.mon.default':
    'BASELINE WEIGHT + CONDITION SCORE · RECHECK AT WEEK 6 · STOP IF GI UPSET OR LETHARGY · NOT FOR PREGNANT/LACTATING ANIMALS · FLAG CHRONIC NSAIDS / IMMUNOSUPPRESSANTS',
  'vetpack.mon.immune':
    'REVIEW CHRONIC MEDICATION FIRST · BASELINE WEIGHT + CONDITION SCORE · RECHECK AT WEEK 6 · STOP IF GI UPSET OR LETHARGY · NOT FOR PREGNANT/LACTATING ANIMALS',
  'vetpack.waItem':
    '[{n}] {product} ({compound})\nEvidence: {evidence}\nCitation: {citation}\nDosing: {dosing}\nMonitoring: {monitoring}',
  'vetpack.waMsg':
    'Peptides4Pets — VET HANDOUT (pre-launch dossier)\n\n{items}\n\nStatus: in development, not yet for sale. Batch COAs publish at launch.\nDetails: {link}',

  /* queue dashboard */
  'queue.overline': 'YOUR WAITLIST DASHBOARD',
  'queue.title': 'Your place in line, live.',
  'queue.sub': 'Your server-issued ticket, product preferences and confirmed live count — all in one spot.',
  'queue.position': 'YOUR POSITION',
  'queue.total': '{count} OWNERS IN LINE',
  'queue.honest': 'SERVER-CONFIRMED QUEUE POSITION AND LIVE SIGNUP COUNT',
  'queue.founding': 'ROAD TO FOUNDING {cap}',
  'queue.foundingBody':
    'Founding 20% pricing is capped at the first {cap}. The bar fills with real waitlist joins — no fake countdowns.',
  'queue.claimed': '{claimed} / {cap} CLAIMED',
  'queue.refTitle': 'SHARE THE FOUNDING WAITLIST',
  'queue.refBody': 'Your link records referral attribution without changing server-issued positions.',
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
    'Hallo Peptides4Pets — stuur asseblief die analisesertifikaat vir lot {batch}.',
  'coa.sampleChip': 'VOORBEELDSERTIFIKAAT — REGTE LOTDATA AKTIWEER BY LANSERING',
  'coa.doc.kicker': 'Peptides4Pets · DERDEPARTY-GEVERIFIEERD',
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
    'Tik die lotnommer op enige Peptides4Pets-etiket en kry die volle analisesertifikaat — suiwerheid, swaarmetale, endotoksiene, analis se aftekening. Probeer dit met ons lanseringslot.',
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
  'vetpack.docTitle': 'Peptides4Pets · VEEARTS-STUK',
  'vetpack.docStatus': 'PRODUKINLIGTING — NIE N VEEARTSVOORSKRIF NIE',
  'vetpack.row.product': 'PRODUK',
  'vetpack.row.compound': 'VERBINDING',
  'vetpack.row.evidence': 'BEWYSVLAK',
  'vetpack.row.citation': 'SLEUTELSITASIE',
  'vetpack.row.dosing': 'DOSERINGSOPSOMMING',
  'vetpack.row.monitoring': 'MONITERINGSNOTAS',
  'vetpack.row.batch': 'LOT',
  'vetpack.docFoot':
    'GAAN PRODUKSTATUS EN VERSLAGOMVANG NA · RAADPLEEG JOU VEEARTS',
  'vetpack.dose.drops':
    'Geen gevalideerde doseringsprotokol vir troeteldiere word verskaf nie. Eksperimentele verbindings word nie vir toediening aan diere aangebied nie.',
  'vetpack.dose.scoop':
    'Volg die verskafte produketiket. Vra jou veearts oor geskiktheid en porsiegrootte.',
  'vetpack.mon.default':
    'BASISLYN-GEWIG + KONDISIETELLING · HERSIEN BY WEEK 6 · STOP BY DERMONTEURDHEID OF LETHARGIE · NIE VIR DRAGTIGE/LAKTERENDE DIERE NIE · MERK CHRONIESE NSAIDS / IMMUUNONDERDRUKKERS',
  'vetpack.mon.immune':
    'HERSIEN EERS CHRONIESE MEDISYNE · BASISLYN-GEWIG + KONDISIETELLING · HERSIEN BY WEEK 6 · STOP BY DERMONTEURDHEID OF LETHARGIE · NIE VIR DRAGTIGE/LAKTERENDE DIERE NIE',
  'vetpack.waItem':
    '[{n}] {product} ({compound})\nBewys: {evidence}\nSitasie: {citation}\nDosering: {dosing}\nMonitering: {monitoring}',
  'vetpack.waMsg':
    'Peptides4Pets — VEEARTS-STUK (voorlansiering-leêr)\n\n{items}\n\nStatus: in ontwikkeling, nog nie te koop nie. Lot-COA’s word by lansering gepubliseer.\nBesonderhede: {link}',

  /* ry-kontrolepaneel */
  'queue.overline': 'JOU WAGLYS-KONTROLEPANEEL',
  'queue.title': 'Jou plek in die ry, regstreeks.',
  'queue.sub': 'Jou bedieneruitgereikte kaartjie, produkvoorkeure en bevestigde regstreekse telling — alles op een plek.',
  'queue.position': 'JOU POSISIE',
  'queue.total': '{count} EIENAARS IN DIE RY',
  'queue.honest': 'BEDIENERBEVESTIGDE RYPOSISIE EN REGSTREEKSE AANSLUITINGSTELLING',
  'queue.founding': 'PAD NA STIGTERS-{cap}',
  'queue.foundingBody':
    'Stigters-20%-pryse is beperk tot die eerste {cap}. Die balk vul met regte waglys-aansluitings — geen vals aftellers nie.',
  'queue.claimed': '{claimed} / {cap} GEVAT',
  'queue.refTitle': 'DEEL DIE STIGTERSWAGLYS',
  'queue.refBody': 'Jou skakel teken die verwysing aan sonder om bedieneruitgereikte posisies te verander.',
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

Object.assign(en, {
  /* ---------------- Live-state + EFT (Mobility Collagen) ---------------- */
  'badge.liveNow': 'LIVE — SHIPS NOW',
  'pdp.liveNowChip': '★ LIVE NOW — SHIPS IN 2–4 WORKING DAYS',
  'pdp.buyNow': 'BUY NOW — SECURE EFT CHECKOUT',
  'cart.checkoutCta': 'CHECKOUT — PAY BY EFT →',
  'cart.checkoutNote':
    'MOBILITY COLLAGEN IS LIVE — IT CHECKS OUT NOW BY SECURE EFT. PEPTIDE DROPS STAY RESERVED VIA THE WAITLIST.',
})

Object.assign(af, {
  /* ---------------- Regstreekse status + EFT (Mobility Collagen) ---------------- */
  'badge.liveNow': 'NOU BESKIKBAAR — WORD VERSEND',
  'pdp.liveNowChip': '★ NOU BESKIKBAAR — VERSEND BINNE 2–4 WERKSDAE',
  'pdp.buyNow': 'KOOP NOU — VEILIGE EFT-BETALING',
  'cart.checkoutCta': 'GAAN KASSIE TOE — BETAAL PER EFT →',
  'cart.checkoutNote':
    'MOBILITY COLLAGEN IS NOU BESKIKBAAR — DIT WORD DADELIK PER VEILIGE EFT BETAAL. PEPTIEDDRUPPELS BLY PER WAGLYS BESPREEK.',
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
