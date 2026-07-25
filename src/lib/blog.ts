/**
 * PSA PETS — Blog engine data layer.
 *
 * Article registry for /blog. All prose is original PSA PETS editorial
 * writing; every factual claim maps to a `citations[]` record with a real,
 * verified external URL (PubMed/PMC/DOI/publisher/trial sponsor).
 *
 * In-text citation markers use the token `{{cite:n}}` where n is the
 * 1-based index into the article's `citations` array. Both the React
 * renderer (BlogArticlePage) and the static HTML generator
 * (scripts/build-blog-static.mjs) understand this token.
 */

export interface BlogCitation {
  /** Authors, e.g. "He L, Feng D, Guo H, et al." */
  authors: string
  title: string
  journal: string
  year: number
  /** Verified external URL (PubMed / PMC / DOI / sponsor page). */
  url: string
}

export interface BlogSection {
  /** Anchor id for the table of contents. */
  id: string
  heading: string
  /** Paragraphs; may contain {{cite:n}} tokens. */
  paragraphs: string[]
}

export interface BlogFaq {
  q: string
  a: string
}

export interface BlogArticle {
  slug: string
  title: string
  metaDescription: string
  keywords: string[]
  /** ISO date strings. */
  publishDate: string
  modifiedDate: string
  readMinutes: number
  heroImage: string
  heroAlt: string
  category: string
  /** 1–2 sentence teaser for cards / OG. */
  excerpt: string
  /** Product slugs from src/lib/data.ts (PET_PRODUCTS). */
  relatedProducts: string[]
  /** "What this means for your dog" callout box. */
  meaningBox: { title: string; body: string }
  sections: BlogSection[]
  faq: BlogFaq[]
  citations: BlogCitation[]
}

/** Compliance line rendered at the foot of every article (EN, fixed). */
export const BLOG_DISCLAIMER =
  'PSA PETS products are in development and are not veterinary medicines, and nothing on this page is veterinary advice. No pet peptide product is approved by the FDA or SAHPRA. Always consult your veterinarian before starting, stopping or changing anything your pet takes.'

export const BLOG_TAGLINE =
  'Evidence-first writing on peptides, supplements and longevity science for dogs and cats — graded honestly, cited properly.'

/* ------------------------------------------------------------------ */
/* 1 · BPC-157                                                         */
/* ------------------------------------------------------------------ */

const BPC157: BlogArticle = {
  slug: 'bpc-157-for-dogs-science',
  title: 'BPC-157 for Dogs: What the Science Actually Says (2026)',
  metaDescription:
    'BPC-157 is the peptide dog owners ask about most. We review the 2022 beagle pharmacokinetic study (45–51% IM bioavailability), the preclinical tendon, wound and gut data — and the honest gaps.',
  keywords: [
    'BPC-157 for dogs',
    'BPC-157 dogs dosage',
    'BPC-157 dog safety',
    'peptides for dogs',
    'BPC-157 beagle study',
    'dog tendon injury supplement',
  ],
  publishDate: '2026-01-12',
  modifiedDate: '2026-01-12',
  readMinutes: 9,
  heroImage: '/dog-portrait-2.png',
  heroAlt: 'A senior dog resting calmly against a warm cream background',
  category: 'Compound Deep-Dives',
  excerpt:
    'One real canine pharmacokinetic study, a large rodent literature, and zero canine efficacy trials. Here is what BPC-157 can — and cannot — claim for dogs.',
  relatedProducts: ['bpc-157', 'recovery-blend', 'mobility-collagen'],
  meaningBox: {
    title: 'What this means for your dog',
    body: 'BPC-157 is biologically plausible and was well tolerated in the only formal dog study published to date — but that study measured how the body handles the molecule, not whether it fixes anything. If you and your vet decide to explore it, treat it as an experiment of one: baseline notes, one change at a time, and a re-check booked before you start.',
  },
  sections: [
    {
      id: 'what-is-bpc-157',
      heading: 'First, what is BPC-157?',
      paragraphs: [
        'BPC-157 is a pentadecapeptide — a short chain of fifteen amino acids — derived from a protective protein found in human gastric juice. "BPC" stands for Body Protective Compound, a name earned in laboratory research rather than in clinical trials. Peptides in this size class sit between a supplement and a drug: large enough to carry biological instructions, small enough to be manufactured precisely and, unusually for a peptide, BPC-157 is relatively stable in gastric conditions, which is why oral formats dominate the market.{{cite:1}}',
        'It has become the single most searched peptide among dog owners, driven by US pet brands, social media testimonials and its reputation in human biohacking circles as a soft-tissue and gut "repair" signal. Popularity, however, is not evidence — so let us separate the three things people routinely blur together: what has been shown in dogs, what has been shown in rodents, and what is still unproven everywhere.',
      ],
    },
    {
      id: 'the-beagle-study',
      heading: 'The one canine study that actually exists',
      paragraphs: [
        'In 2022, He and colleagues published a formal pharmacokinetic (PK) study of BPC-157 in rats and six beagle dogs — the first time the molecule\'s absorption, distribution, metabolism and excretion were mapped in dogs.{{cite:1}} Pharmacokinetics answers a narrow question: does the drug get into the body, at what levels, for how long, and is it tolerated at the doses tested?',
        'The headline numbers were genuinely encouraging. Intramuscular BPC-157 reached roughly 45–51% bioavailability in the beagles — high for a peptide — and the compound was well tolerated across the doses tested, with no adverse findings reported.{{cite:1}} For an unregulated peptide with no prior canine data, that matters: it establishes that dogs can absorb and tolerate the molecule at studied doses.',
        'What it does not establish is efficacy. Six beagles, studied for drug levels rather than outcomes, cannot tell us whether BPC-157 helps a limping Boerboel or a dachshund with a sore back. Every "it worked for my dog" story you have read sits on top of this single PK dataset plus rodent research — nothing more.',
      ],
    },
    {
      id: 'preclinical-record',
      heading: 'What the wider preclinical record suggests',
      paragraphs: [
        'The broader BPC-157 literature is large — hundreds of papers — but almost entirely preclinical, meaning cell cultures and rodent models. In tendon research, Chang and colleagues showed that BPC-157 promoted tendon fibroblast outgrowth, cell survival and migration in rat Achilles tendon models, three of the mechanical ingredients of tendon repair.{{cite:2}} That is a real, peer-reviewed finding — in rats.',
        'In gut research, rodent models of inflammatory bowel injury and surgical anastomosis (re-joining of intestine) have repeatedly reported faster mucosal healing with BPC-157, and the 2022 PK paper\'s own background positions the molecule as a candidate for wound treatment across tissue types.{{cite:1}} Wound and angiogenesis (new blood vessel formation) models tell a similar story.',
        'Preclinical signals like these are how every useful therapy starts. They are also where most candidates stop. Rodent doses do not translate cleanly to a 40 kg dog, and induced injuries in lab animals behave differently from chronic, degenerative conditions in pets. The honest summary: BPC-157 has an unusually consistent preclinical repair signal and essentially no clinical proof in any species.',
      ],
    },
    {
      id: 'the-honest-gaps',
      heading: 'The honest gaps',
      paragraphs: [
        'Here is what does not exist as of early 2026, and what you should ask any seller — including us — to produce: no randomized, placebo-controlled efficacy trial of BPC-157 in dogs. No published long-term canine safety study. No approved canine dose. No regulatory approval from the FDA, EMA or SAHPRA for any species or any indication.{{cite:1}}',
        'There is also a quality problem. Because BPC-157 is unregulated, the grey market contains products with the wrong peptide, the wrong dose, or contamination. This is exactly why PSA PETS exists: research-grade synthesis, ≥99% HPLC purity, and a certificate of analysis on every batch — because if the evidence is thin, the molecule itself must at least be what the label says.',
      ],
    },
    {
      id: 'safety-guardrails',
      heading: 'Safety notes and sensible guardrails',
      paragraphs: [
        'The beagle PK data reported good tolerability,{{cite:1}} but "well tolerated in six dogs" is not a safety guarantee for yours. Sensible guardrails if you and your vet decide to trial BPC-157: start low, change nothing else at the same time, and keep a simple daily log (appetite, stool, energy, mobility on a 1–10 scale). Stop and call your vet for vomiting, diarrhoea, lethargy or anything that worries you.',
        'Be extra careful with dogs on chronic medication, dogs with cancer history (angiogenesis is a double-edged sword in oncology), pregnant or lactating dogs, and puppies. None of these groups have any data at all. And if your dog is in pain, a limp deserves a diagnosis before a supplement: cruciate tears, hip dysplasia and spinal disease all masquerade as "just getting old."',
      ],
    },
    {
      id: 'sa-angle',
      heading: 'What this means for South African pet owners',
      paragraphs: [
        'Until now, SA owners had two options: import US pet peptide sprays at $99–$149 plus shipping, duties and a 2–6 week customs gamble — or buy from local grey-market sellers with no certificate of analysis. Neither is good enough for an animal you love.',
        'PSA PETS is building the third option: BPC-157 oral drops manufactured to research grade, HPLC-verified on every batch, dosed by weight band under veterinary review, priced in rand with VAT included — and sold with the evidence ledger attached, including the gaps you have just read. Our BPC-157 formula is in final development now; the waitlist is how you hear first, with founding pricing locked.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is BPC-157 safe for dogs?',
      a: 'The only formal dog study — a 2022 pharmacokinetic trial in six beagles — reported that BPC-157 was well tolerated at the doses tested, with 45–51% intramuscular bioavailability. That is reassuring but limited: there are no long-term canine safety studies. Discuss it with your vet, start conservatively, and monitor your dog closely.',
    },
    {
      q: 'Has BPC-157 been proven to work in dogs?',
      a: 'No. There are no published randomized, placebo-controlled efficacy trials of BPC-157 in dogs as of early 2026. The evidence is one canine pharmacokinetic study plus a large body of rodent and cell-culture research on tendon, wound and gut repair. Promising does not mean proven.',
    },
    {
      q: 'What is the right BPC-157 dose for a dog?',
      a: 'There is no established veterinary dose — none has been validated in canine efficacy trials. Any dosing guide (including ours at launch) is extrapolated from preclinical work and pharmacokinetic data, which is why every PSA PETS protocol is weight-banded, vet-reviewed and conservative, starting at half dose for week one.',
    },
    {
      q: 'Can BPC-157 replace surgery or NSAIDs for my dog?',
      a: 'No — and you should be suspicious of anyone who says otherwise. BPC-157 is studied for soft-tissue and gut support, not as a replacement for diagnosis, surgery or prescription medicine. If your dog is limping or in pain, see your vet first; supplements are adjuncts, not substitutes.',
    },
    {
      q: 'Is BPC-157 legal to give my dog in South Africa?',
      a: 'BPC-157 is not registered with SAHPRA as a veterinary medicine, and no pet peptide product is. It is sold internationally as a research/nutritional compound. PSA PETS products are in development as supplements with full COA documentation; we always recommend involving your veterinarian.',
    },
  ],
  citations: [
    {
      authors: 'He L, Feng D, Guo H, et al.',
      title:
        'Pharmacokinetics, distribution, metabolism, and excretion of body-protective compound 157, a potential drug for treating various wounds, in rats and dogs',
      journal: 'Frontiers in Pharmacology',
      year: 2022,
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9794587/',
    },
    {
      authors: 'Chang CH, Tsai WC, Lin MS, Hsu YH, Pang JH',
      title:
        'The promoting effect of pentadecapeptide BPC 157 on tendon healing involves tendon outgrowth, cell survival, and cell migration',
      journal: 'Journal of Applied Physiology',
      year: 2011,
      url: 'https://pubmed.ncbi.nlm.nih.gov/21030672/',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* 2 · BPC-157 South Africa                                            */
/* ------------------------------------------------------------------ */

const BPC157_SOUTH_AFRICA: BlogArticle = {
  slug: 'bpc-157-south-africa',
  title: 'BPC-157 South Africa: A Pet Owner\'s Guide to Availability, Regulation and Evidence',
  metaDescription:
    'BPC-157 is one of the most searched peptides in South Africa. We explain the SAHPRA status, the real cost of importing, what to ask local sellers, and what the canine evidence actually shows.',
  keywords: [
    'BPC-157 South Africa',
    'BPC-157 for dogs South Africa',
    'buy BPC-157 South Africa',
    'SAHPRA BPC-157',
    'BPC-157 Cape Town',
    'pet peptides South Africa',
  ],
  publishDate: '2026-07-25',
  modifiedDate: '2026-07-25',
  readMinutes: 8,
  heroImage: '/dog-portrait-2.png',
  heroAlt: 'A South African Boerboel resting against a warm cream background',
  category: 'South Africa Guides',
  excerpt:
    'BPC-157 searches in South Africa usually end at grey-market sellers, import delays or confusing SAHPRA status. Here is what local pet owners actually need to know.',
  relatedProducts: ['bpc-157', 'recovery-blend', 'mobility-collagen'],
  meaningBox: {
    title: 'What this means for your dog',
    body: 'In South Africa, BPC-157 for pets sits in a regulatory grey zone: not registered as a veterinary medicine, but available as a research or nutritional compound. The honest path is local supply with a certificate of analysis, veterinary guidance and clear expectations — not miracle claims.',
  },
  sections: [
    {
      id: 'why-sa-searches-matter',
      heading: 'Why "BPC-157 South Africa" is its own search',
      paragraphs: [
        'South African pet owners do not search for BPC-157 in a vacuum. They are usually dealing with a limping Ridgeback, a Boerboel with a tendon strain, or a geriatric cat whose gut never quite recovered after a course of medication. The molecule has a reputation as a soft-tissue and gut "repair" signal, and local searches for it have grown sharply as US pet peptide brands have entered the algorithm.{{cite:1}}',
        'But the South African market is not the US market. The rand, customs, courier delays and the risk of counterfeit imports change the calculation. A bottle that costs $89 overseas can land here at R2,500–R3,500 after shipping, duties and VAT, with a 2–6 week wait and no local recourse if the vial is wrong. That is why "BPC-157 South Africa" deserves its own answer: the science is the same, but the buying reality is not.',
      ],
    },
    {
      id: 'sahpra-status',
      heading: 'What SAHPRA says about BPC-157 for pets',
      paragraphs: [
        'As of mid-2026, BPC-157 is not registered with the South African Health Products Regulatory Authority (SAHPRA) as a veterinary medicine, and no peptide product for pets holds SAHPRA approval. That matters less than it sounds, and more than some sellers admit. It means BPC-157 cannot be marketed with disease-treatment claims, but it also means the compound is available in the research and nutritional-compound lane — provided the seller is honest about what it is.',
        'In practice, most BPC-157 sold in South Africa is imported as a research compound or formulated into a supplement. The regulatory distinction is real: a supplement cannot claim to cure, treat or prevent disease, and any veterinary use is off-label and at the discretion of your vet. PSA PETS develops its BPC-157 formula as a research-grade supplement with batch-level COA documentation precisely because the alternative — imported sprays with vague labels — leaves both pet and owner exposed.',
      ],
    },
    {
      id: 'import-problem',
      heading: 'The import problem: cost, customs and counterfeits',
      paragraphs: [
        'The most common way South Africans have bought BPC-157 until now is direct import. A 30 ml oral spray or a small vial from a US or European peptide vendor typically lists at $79–$149. By the time it clears customs, the all-in cost is usually R1,800–R3,500, and that assumes it clears at all. Peptide vials and sprays are frequently flagged for inspection, and customs may request a permit, an invoice or a letter from a vet.{{cite:1}}',
        'Then there is the authenticity problem. The global peptide grey market is saturated with mislabelled, underdosed and contaminated products. Without a certificate of analysis (COA) from an independent lab, you have no way to know whether the liquid contains BPC-157 at the stated concentration, a different peptide entirely, or nothing at all. Buying locally does not eliminate risk, but it does give you a South African supplier, a VAT invoice and someone to hold accountable.',
      ],
    },
    {
      id: 'evidence-summary',
      heading: 'What the evidence actually looks like',
      paragraphs: [
        'The science does not change because you live in Cape Town rather than California. The only formal dog study remains the 2022 pharmacokinetic trial by He and colleagues, which reported that BPC-157 was well tolerated in six beagles and reached roughly 45–51% intramuscular bioavailability.{{cite:1}} That is an absorption-and-safety finding, not proof that it heals tendons or guts in dogs.',
        'The rest of the literature is preclinical: rat tendon fibroblast studies, rodent gut-healing models and cell-culture work on angiogenesis.{{cite:2}} It is a consistent but unproven signal. Any South African seller promising cures, guaranteed tendon repair or "works in 48 hours" is selling marketing, not evidence. The honest position — and the one PSA PETS takes — is that BPC-157 is biologically plausible, well tolerated in the one canine PK study, and not yet proven effective in any species.',
      ],
    },
    {
      id: 'buying-sa',
      heading: 'How to buy BPC-157 for your pet in South Africa',
      paragraphs: [
        'If you and your vet decide to trial BPC-157, use the same due diligence you would apply to any unregulated compound. First, demand a certificate of analysis for the batch you are buying, not a generic lab report from three years ago. The COA should show ≥99% HPLC purity, the correct molecular weight and the batch number on your bottle.',
        'Second, choose a local supplier with a physical South African address, VAT registration and a returns policy. Third, avoid human peptide products that contain xylitol, flavourings, sweeteners or alcohol bases dangerous to pets. Fourth, start conservatively: half the labelled dose for the first week, one change at a time, and a daily log of appetite, stool, energy and mobility. Finally, never use BPC-157 to delay a vet visit for a serious injury or chronic condition.',
      ],
    },
    {
      id: 'safety-sa',
      heading: 'Safety notes for SA pet owners',
      paragraphs: [
        'The 2022 beagle study reported good tolerability, but six dogs is not a safety database.{{cite:1}} Be extra cautious with pets on chronic medication, pets with a cancer history (angiogenesis can help wounds and, in theory, tumours), pregnant or lactating animals, and puppies or kittens with immature metabolisms.',
        'Heat is another South African reality. Peptides are less stable than tablets; store them according to the label, usually refrigerated once reconstituted or opened, and avoid leaving deliveries in a hot car or courier depot for hours. If a shipment arrives warm, cloudy or with a broken seal, do not use it. When in doubt, email the supplier with photos and batch numbers — a reputable local supplier will answer.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is BPC-157 legal in South Africa for pets?',
      a: 'BPC-157 is not registered as a veterinary medicine with SAHPRA, but it is sold legally as a research or nutritional compound. It cannot be marketed with disease-treatment claims, and any veterinary use is off-label and should be discussed with your vet.',
    },
    {
      q: 'Can I import BPC-157 for my dog?',
      a: 'You can try, but it is expensive and unreliable. Imports often cost R1,800–R3,500 all-in, take 2–6 weeks, and may be held by customs for inspection. You also lose local consumer protection if the product is wrong or contaminated.',
    },
    {
      q: 'How much does BPC-157 cost in South Africa?',
      a: 'Grey-market imports typically land at R1,800–R3,500 for a small vial or oral spray. Local pricing varies by purity, batch testing and format. PSA PETS is pricing its BPC-157 formula in rand with VAT included and founding waitlist members will lock the lowest rate.',
    },
    {
      q: 'Is BPC-157 approved by SAHPRA?',
      a: 'No. As of mid-2026, no BPC-157 product — human or veterinary — is approved by SAHPRA. Any product sold in South Africa is therefore unregistered and should be treated as a research or supplement compound, not a medicine.',
    },
    {
      q: 'What should I ask a local seller before buying BPC-157?',
      a: 'Ask for the batch-specific COA showing HPLC purity, the supplier\'s South African business registration, storage and handling instructions, a clear ingredient list with no xylitol or pet-toxic additives, and a returns process. If they cannot provide these, shop elsewhere.',
    },
  ],
  citations: [
    {
      authors: 'He L, Feng D, Guo H, et al.',
      title:
        'Pharmacokinetics, distribution, metabolism, and excretion of body-protective compound 157, a potential drug for treating various wounds, in rats and dogs',
      journal: 'Frontiers in Pharmacology',
      year: 2022,
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC9794587/',
    },
    {
      authors: 'Chang CH, Tsai WC, Lin MS, Hsu YH, Pang JH',
      title:
        'The promoting effect of pentadecapeptide BPC 157 on tendon healing involves tendon outgrowth, cell survival, and cell migration',
      journal: 'Journal of Applied Physiology',
      year: 2011,
      url: 'https://pubmed.ncbi.nlm.nih.gov/21030672/',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* 3 · Collagen peptides                                               */
/* ------------------------------------------------------------------ */

const COLLAGEN: BlogArticle = {
  slug: 'collagen-peptides-dog-joints-evidence',
  title: 'Collagen Peptides for Dog Joints: The Strongest Evidence in Pet Nutrition',
  metaDescription:
    'Collagen peptides have the best canine evidence of any joint supplement: a 2024 PLOS One RCT (31 dogs, force-plate), UC-II vs robenacoxib data and eggshell membrane biomarker trials. Doses used in trials, graded honestly.',
  keywords: [
    'collagen peptides for dogs',
    'dog joint supplement evidence',
    'UC-II dogs',
    'bioactive collagen peptides dog osteoarthritis',
    'eggshell membrane dogs',
    'best joint supplement for dogs',
  ],
  publishDate: '2026-01-19',
  modifiedDate: '2026-01-19',
  readMinutes: 10,
  heroImage: '/dog-portrait-1.png',
  heroAlt: 'An alert older dog standing on a warm cream background',
  category: 'Evidence Reviews',
  excerpt:
    'A placebo-controlled force-plate trial, a head-to-head against a registered NSAID, and a cartilage biomarker study. Collagen is the one joint supplement with real canine RCTs — here is what they found.',
  relatedProducts: ['mobility-collagen', 'bpc-157', 'immune-thymogen'],
  meaningBox: {
    title: 'What this means for your dog',
    body: 'If your dog is stiff after rest, slowing on walks or hesitating before the bakkie, collagen peptides are the supplement with the strongest canine trial record — measured on force plates, not just owner vibes. It is support, not surgery: expect a gentler slope of decline and better weight-bearing over weeks, not a limp that vanishes. Pair it with weight management — the single biggest lever for arthritic joints.',
  },
  sections: [
    {
      id: 'why-collagen-leads',
      heading: 'Why collagen leads the evidence table',
      paragraphs: [
        'Pet supplement shelves are crowded with green-lipped mussel, turmeric, glucosamine and chondroitin — most carried by hope and habit rather than canine data. Bioactive collagen peptides (BCP) are different, and the difference is study design: randomized, placebo-controlled trials in dogs with naturally occurring osteoarthritis, using objective gait measurement instead of owner impressions alone.{{cite:1}}',
        'First, definitions. Collagen peptides (also called collagen hydrolysate) are collagen protein broken into short chains of amino acids by hydrolysis — small enough to be absorbed intact, with a high proportion of proline and hydroxyproline, the building blocks cartilage is made from. Undenatured type-II collagen (UC-II) is a different beast: a tiny dose of unhydrolysed cartilage collagen that works not as a building block but as an immune signal (more below). Both have canine trial data. So does eggshell membrane.',
      ],
    },
    {
      id: 'plos-one-rct',
      heading: 'The 2024 PLOS One trial: 31 dogs, force plates, real blinding',
      paragraphs: [
        'The CANIS trial (Canine Arthrosis Nutritional Intervention Study), published in PLOS One in September 2024 by Dobenecker and colleagues at LMU Munich, is the best-designed canine collagen study to date.{{cite:1}} Forty-one client-owned dogs with naturally occurring, vet-diagnosed osteoarthritis were randomized to three groups: specific bioactive collagen peptides (PETAGILE®), an active comparator (omega-3 fatty acids plus vitamin E — the only combination with an EU-approved joint claim), or placebo. Thirty-one dogs completed the 12-week protocol.',
        'Crucially, the dogs were walked on a treadmill with four integrated piezoelectric force plates — the same objective gait-analysis method used to test veterinary drugs. Dosing was by body weight, given once daily mixed into food.{{cite:1}}',
        'The results: only the collagen group showed significant improvement in kinetic gait parameters — peak vertical force and vertical impulse in the affected limb — meaning the dogs were literally putting more weight on the sore leg. The improvement in peak vertical force was highly significant versus placebo (which, as expected in a progressive disease, trended worse). Owner-rated quality of life on the validated Canine Brief Pain Inventory improved significantly more with collagen than with omega-3/vitamin E.{{cite:1}}',
      ],
    },
    {
      id: 'uc-ii-vs-nsaid',
      heading: 'UC-II versus a registered NSAID',
      paragraphs: [
        'Undenatured type-II collagen works by a completely different mechanism called oral tolerance: microgram-to-milligram amounts of intact cartilage collagen interact with immune tissue in the gut (Peyer\'s patches), training the immune system to stop attacking joint collagen. In a 2019 randomized controlled study of 60 dogs with osteoarthritis, Stabile and colleagues compared UC-II (40 mg tablet daily) head-to-head against robenacoxib, a registered veterinary NSAID, over 30 days.{{cite:2}}',
        'Both groups improved significantly on the owner-scored Liverpool Osteoarthritis in Dogs (LOAD) index — by about a third in each arm — and mobility scores improved in parallel. The authors noted that robenacoxib remained stronger in the most severe cases, so UC-II is best positioned as long-term joint support rather than first-line pain relief — which is precisely how a supplement should be positioned.{{cite:2}}',
      ],
    },
    {
      id: 'eggshell-membrane',
      heading: 'Eggshell membrane: a biomarker, not just a questionnaire',
      paragraphs: [
        'Eggshell membrane — the thin film inside an eggshell, naturally rich in collagen, glycosaminoglycans and hyaluronic acid — has its own canine RCT. Ruff and colleagues ran a six-week, multicentre, double-blind, placebo-controlled trial across eight US veterinary clinics in 51 dogs with suboptimal joint function, dosed at roughly 13.5 mg/kg once daily.{{cite:3}}',
        'Joint function and pain scores improved versus placebo as early as one week in — unusually fast for a nutritional supplement. But the most interesting number was not a questionnaire: serum CTX-II, a validated biomarker of cartilage degradation, fell in the supplemented group, suggesting a genuine chondroprotective (cartilage-sparing) effect.{{cite:3}} Biomarkers move the conversation from "owners felt better" to "the joint itself changed."',
      ],
    },
    {
      id: 'dosing-in-trials',
      heading: 'What doses did the trials actually use?',
      paragraphs: [
        'This is where most blogs get vague, so let us be specific. The PLOS One CANIS trial dosed BCP by body weight, once daily, for twelve weeks — the full protocol is open-access if you want the arithmetic for your own dog\'s weight band.{{cite:1}} The UC-II studies used a single 40 mg tablet daily regardless of size, for 30–90 days.{{cite:2}} The eggshell membrane trial used approximately 13.5 mg/kg daily for six weeks.{{cite:3}}',
        'Three practical lessons: dosing is daily and long-term (weeks to months, not days); effects build over the first 4–8 weeks, so a one-week trial tells you nothing; and combination with weight management and sensible exercise is assumed in every protocol — no supplement outruns an overweight frame.',
      ],
    },
    {
      id: 'sa-angle',
      heading: 'What this means for South African pet owners',
      paragraphs: [
        'Large breeds — Boerboels, Ridgebacks, German Shepherds — are South Africa\'s dogs, and they are exactly the dogs osteoarthritis hits hardest. Imported UC-II and collagen products land here at imported prices; most local joint chews are glucosamine blends with thin evidence.',
        'Mobility Collagen is the first PSA PETS launch for a reason: it is the compliant lane. Bioactive collagen peptides are nutritional, the canine RCT record is published and open-access, and every tub ships with the study pack your vet can actually read. Founding waitlist members lock 20% off the first three subscription months.',
      ],
    },
  ],
  faq: [
    {
      q: 'Do collagen peptides really work for dog arthritis?',
      a: 'They have the strongest canine evidence of any joint supplement. In a 2024 placebo-controlled PLOS One trial, 31 dogs with osteoarthritis completed 12 weeks of bioactive collagen peptides and showed significant improvement in objective force-plate gait measures and owner-rated quality of life versus placebo and an omega-3 comparator. That is support, not a cure — osteoarthritis is progressive.',
    },
    {
      q: 'How long does collagen take to work in dogs?',
      a: 'Plan for weeks, not days. The PLOS One trial measured outcomes at 12 weeks; eggshell membrane showed improvements by week one to six; UC-II studies ran 30–90 days. Most vets suggest a fair 8-week trial with notes on mobility before judging.',
    },
    {
      q: 'What is the difference between collagen peptides and UC-II?',
      a: 'Collagen peptides (hydrolysate) are grams of broken-down collagen that supply cartilage building blocks and signal cartilage cells. UC-II is milligrams of intact type-II collagen that works through immune "oral tolerance" to calm the immune attack on joint cartilage. Different mechanisms, both with canine trial data; they can be complementary.',
    },
    {
      q: 'Is collagen safe for dogs?',
      a: 'Collagen peptides are classified as a safe food ingredient by EFSA and were well tolerated in the canine trials, with adverse events no different from placebo. It is a supplement, not a veterinary medicine — dogs with food allergies should match the collagen source (porcine, bovine, chicken) to their sensitivities, and your vet should know everything your dog takes.',
    },
    {
      q: 'Can I give my dog human collagen powder?',
      a: 'Plain, unflavoured collagen peptides are the same molecule class used in the canine trials — but many human products contain xylitol, flavourings or sweeteners that are dangerous to dogs. A pet-specific, weight-banded product with a certificate of analysis is the safer route.',
    },
  ],
  citations: [
    {
      authors: 'Dobenecker B, Böswald LF, Reese S, et al.',
      title:
        'The oral intake of specific Bioactive Collagen Peptides (BCP) improves gait and quality of life in canine osteoarthritis patients — A translational large animal model for a nutritional therapy option',
      journal: 'PLOS One',
      year: 2024,
      url: 'https://doi.org/10.1371/journal.pone.0308378',
    },
    {
      authors: 'Stabile M, Samarelli R, Trerotoli P, et al.',
      title:
        'Evaluation of the Effects of Undenatured Type II Collagen (UC-II) as Compared to Robenacoxib on the Mobility Impairment Induced by Osteoarthritis in Dogs',
      journal: 'Veterinary Sciences',
      year: 2019,
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6789547/',
    },
    {
      authors: 'Ruff KJ, Kopp KJ, Von Behrens P, et al.',
      title:
        'Effectiveness of NEM® brand eggshell membrane in the treatment of suboptimal joint function in dogs: a multicenter, randomized, double-blind, placebo-controlled study',
      journal: 'Veterinary Medicine: Research and Reports',
      year: 2016,
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC6044796/',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* 4 · TB-500                                                          */
/* ------------------------------------------------------------------ */

const TB500: BlogArticle = {
  slug: 'tb-500-thymosin-beta-4-dogs',
  title: 'TB-500 and Dogs: Promise vs Proof',
  metaDescription:
    'TB-500 (a thymosin beta-4 fragment) is everywhere in pet peptide marketing. We review the Tβ4 biology, why racing regulators banned it, the zero canine efficacy trials — and what responsible use actually looks like.',
  keywords: [
    'TB-500 for dogs',
    'thymosin beta-4 dogs',
    'TB-500 dog injury',
    'TB-500 equine doping',
    'pet peptides evidence',
    'Wolverine stack dogs',
  ],
  publishDate: '2026-01-26',
  modifiedDate: '2026-01-26',
  readMinutes: 9,
  heroImage: '/horse-portrait-1.png',
  heroAlt: 'A horse against a warm cream background — the equine context of TB-500',
  category: 'Compound Deep-Dives',
  excerpt:
    'Thymosin beta-4 has a real regenerative biology — and TB-500 borrows its reputation. Racing regulators banned it years ago. Here is what that signal does and does not mean for your dog.',
  relatedProducts: ['recovery-blend', 'bpc-157', 'mobility-collagen'],
  meaningBox: {
    title: 'What this means for your dog',
    body: 'TB-500 is the compound where marketing runs furthest ahead of the data: zero published canine efficacy trials, with most of the "evidence" belonging to a different molecule (full-length Tβ4) in different species. If your dog is recovering from injury, the proven levers are diagnosis, rest, rehab and weight control. Anything else belongs in a conversation with your vet — eyes open, expectations low, one variable at a time.',
  },
  sections: [
    {
      id: 'tb4-biology',
      heading: 'Thymosin beta-4: the biology underneath the brand',
      paragraphs: [
        'Start with the molecule that actually exists in nature. Thymosin beta-4 (Tβ4) is a 43-amino-acid peptide found in almost every mammalian cell, where its day job is binding actin — the protein that gives cells their shape and movement. When tissue is injured, Tβ4 is released by platelets and other cells at the wound site, where it promotes cell migration, new blood vessel formation (angiogenesis), stem and progenitor cell mobilization, and reduced inflammation and scarring.{{cite:1}}',
        'That repair biology is real and well documented. Tβ4 has been studied in dermal wound healing, corneal injury and cardiac repair, with completed Phase II human trials in corneal wounds and chronic skin ulcers — one trial reported healing accelerated by almost a month in patients who healed.{{cite:2}} So when someone says "TB-500 is backed by hundreds of studies," this is the literature they are (usually unknowingly) citing.',
      ],
    },
    {
      id: 'tb500-fragment',
      heading: 'TB-500 is not Tβ4 — and that gap matters',
      paragraphs: [
        'TB-500 is marketed as a synthetic fragment representing the active region of Tβ4 — typically the actin-binding motif around the LKKTET sequence. The logic is plausible: if the fragment carries the repair activity, a smaller molecule is cheaper and easier to dose. The problem is the evidence trail. A 2026 scoping review of 1,772 records found the repair literature overwhelmingly studied full-length Tβ4, with direct evidence on TB-500 itself limited to a single included study.{{cite:3}}',
        'In other words: TB-500\'s reputation is borrowed. The wound-healing, cardiac and corneal data belong to the parent molecule. That does not prove TB-500 is inert — fragments can carry activity — but it means "clinically studied" claims for TB-500 are, at best, citations of a different compound.',
      ],
    },
    {
      id: 'racing-context',
      heading: 'Why horse racing banned it — and why that matters',
      paragraphs: [
        'TB-500\'s most concrete real-world footprint is not in medicine but in anti-doping. Racing regulators classify thymosin beta-4 among prohibited blood-doping and peptide agents: the Pennsylvania racing rules, for example, expressly forbid "Thymosin beta" on racetrack premises alongside EPO and AICAR,{{cite:4}} and the World Anti-Doping Agency prohibits Tβ4 and its fragments at all times under category S2 (peptide hormones, growth factors and mimetics).{{cite:5}} Detection methods for TB-500 in equine plasma exist precisely because misuse in racehorses required routine testing.',
        'Read that signal carefully. A ban is not proof of efficacy — regulators prohibit on plausible mechanism, not on randomized trials, and WADA listings presume benefit rather than demonstrate it.{{cite:5}} But the racing context tells you two true things: the peptide is bioactive enough to worry professional regulators, and its modern use culture was built in a grey-market, performance-first environment — not in veterinary clinics with follow-up bloodwork.',
      ],
    },
    {
      id: 'pet-evidence-gap',
      heading: 'The pet evidence gap, stated plainly',
      paragraphs: [
        'For dogs and cats specifically, here is the entire efficacy record: there are no published, controlled clinical trials of TB-500 — or of systemic Tβ4 — for any canine or feline condition. Not for tendon injuries, not for post-surgical recovery, not for "overall wellness." The closest adjacent evidence is the general Tβ4 repair literature in rodents and human topical trials,{{cite:1}}{{cite:2}} plus equine anecdote that anti-doping labs treat as a problem to detect, not a therapy to study.{{cite:4}}',
        'This is why PSA PETS labels the BPC-157 + TB-500 pairing in our Recovery Blend as community practice, not proven therapy. The BPC-157 half has canine pharmacokinetic data; the TB-500 half has none. We say so on the label, and we are saying it again here.',
      ],
    },
    {
      id: 'responsible-use',
      heading: 'What responsible use looks like',
      paragraphs: [
        'If you and your vet nonetheless decide to explore TB-500, the responsible version looks like this: a diagnosed problem (not a vague hope), a product with a batch-level certificate of analysis (grey-market TB-500 purity is a genuine hazard), a written log of mobility and behaviour, and a scheduled re-check. Never in competition animals — equine sport bodies treat it as doping,{{cite:4}} and canine sport regulation is moving the same way.',
        'And never as a substitute for the unglamorous proven tools: rest, structured rehabilitation, weight control, and — when indicated — registered medicines with actual canine trial data behind them.',
      ],
    },
    {
      id: 'sa-angle',
      heading: 'What this means for South African pet owners',
      paragraphs: [
        'TB-500 circulates in SA through gym suppliers and grey-market peptide sellers, usually with no COA and no dosing discipline. If your working dog, agility dog or post-surgery patient is being considered for a "Wolverine stack," the South African reality check is this: proven rehab (physio, hydrotherapy, controlled rest) is available locally and works; TB-500 remains an unproven add-on anywhere in the world.',
        'Our position at PSA PETS is unchanged: we will sell you the molecule with a certificate of analysis and the evidence ledger attached — and the ledger currently reads "preclinical." Founding members get the honest version first.',
      ],
    },
  ],
  faq: [
    {
      q: 'Is TB-500 the same as thymosin beta-4?',
      a: 'No. Tβ4 is the natural 43-amino-acid repair peptide with the published wound, corneal and cardiac literature. TB-500 is a synthetic fragment marketed as its active region. A 2026 scoping review found the repair evidence base belongs almost entirely to full-length Tβ4 — direct TB-500 studies are essentially absent.',
    },
    {
      q: 'Has TB-500 been tested in dogs?',
      a: 'There are no published controlled trials of TB-500 for any canine condition. Everything claimed for dogs is extrapolated from rodent Tβ4 studies, human topical Tβ4 trials, and equine anecdote. That is why we grade it preclinical and why veterinary supervision is non-negotiable.',
    },
    {
      q: 'Why is TB-500 banned in horse racing?',
      a: 'Racing authorities classify thymosin beta-4 as a prohibited peptide/blood-doping agent because its tissue-repair mechanism is presumed to confer a performance advantage. WADA also prohibits Tβ4 and its fragments under S2. A ban signals bioactivity and enforcement priority — it is not proof of efficacy.',
    },
    {
      q: 'Is the BPC-157 + TB-500 "Wolverine stack" proven for pets?',
      a: 'No. The pairing is community practice popularized by US pet brands. BPC-157 has canine pharmacokinetic data (45–51% IM bioavailability in beagles, well tolerated); TB-500 has no canine data at all. If used, it should be a vet-supervised experiment with honest expectations.',
    },
    {
      q: 'What are safer, proven options for my injured dog?',
      a: 'Diagnosis first, then the proven stack: rest and controlled rehab, weight management, registered pain relief when indicated, and joint-support nutrition with actual canine RCTs (bioactive collagen peptides being the strongest). Supplements with thinner evidence belong behind those, never in front.',
    },
  ],
  citations: [
    {
      authors: 'Goldstein AL, Hannappel E, Sosne G, Kleinman HK',
      title:
        'Thymosin β4: a multi-functional regenerative peptide. Basic properties and clinical applications',
      journal: 'Expert Opinion on Biological Therapy',
      year: 2012,
      url: 'https://pubmed.ncbi.nlm.nih.gov/22074294/',
    },
    {
      authors: 'Xing Y, Ye Y, Zuo H, Li Y',
      title: 'Progress on the Function and Application of Thymosin β4',
      journal: 'Frontiers in Endocrinology',
      year: 2021,
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC8724243/',
    },
    {
      authors: 'McGuire F, Hughes E, Maak T, Cushman DM',
      title:
        'Thymosin Beta-4 and TB-500 in Tissue Healing, Regeneration, and Musculoskeletal Repair: A Scoping Review',
      journal: 'Applied Sciences',
      year: 2026,
      url: 'https://www.mdpi.com/2076-3417/16/12/6202',
    },
    {
      authors: 'Pennsylvania State Horse Racing Commission',
      title: 'Blood doping substances or agents prohibited (49 Pa.B., §403.6)',
      journal: 'Pennsylvania Bulletin',
      year: 2019,
      url: 'https://www.pacodeandbulletin.gov/secure/pabulletin/data/vol49/49-42/49-42.pdf',
    },
    {
      authors: 'World Anti-Doping Agency',
      title: 'The Prohibited List — S2: Peptide Hormones, Growth Factors, Related Substances and Mimetics',
      journal: 'WADA International Standard',
      year: 2026,
      url: 'https://www.wada-ama.org/en/resources/world-anti-doping-code-and-international-standards/prohibited-list',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* 5 · KPV                                                             */
/* ------------------------------------------------------------------ */

const KPV: BlogArticle = {
  slug: 'kpv-gut-inflammation-dogs',
  title: 'KPV for Dog Gut and Skin: Reading the Preclinical Evidence',
  metaDescription:
    'KPV is a three-amino-acid anti-inflammatory peptide with real mouse colitis data and zero canine trials. We explain the alpha-MSH pathway, what the mouse studies found, and how to monitor a sensitive dog responsibly.',
  keywords: [
    'KPV for dogs',
    'KPV gut inflammation',
    'KPV peptide dogs skin',
    'alpha-MSH KPV anti-inflammatory',
    'dog sensitive stomach supplement',
    'KPV colitis mouse study',
  ],
  publishDate: '2026-02-02',
  modifiedDate: '2026-02-02',
  readMinutes: 9,
  heroImage: '/cat-portrait-1.png',
  heroAlt: 'A cat resting on a warm cream background — sensitive systems need gentle science',
  category: 'Compound Deep-Dives',
  excerpt:
    'Three amino acids, one elegant anti-inflammatory pathway, and a stack of mouse studies. KPV is genuinely interesting gut science — here is what would still need to be proven for dogs.',
  relatedProducts: ['kpv', 'bpc-157', 'immune-thymogen'],
  meaningBox: {
    title: 'What this means for your dog',
    body: 'If your dog lives on the sensitive-stomach rollercoaster — soft stools, flare-ups, itchy skin that tracks with gut episodes — KPV is a scientifically coherent candidate with honest limitations: every study so far is in mice or cells. The practical move is boring but powerful: rule out parasites, diet intolerance and real disease with your vet first, then consider gentle gut-support compounds as adjuncts, with a symptom diary to keep yourself honest.',
  },
  sections: [
    {
      id: 'what-is-kpv',
      heading: 'What KPV is — and where it comes from',
      paragraphs: [
        'KPV is a tripeptide: just three amino acids, lysine–proline–valine. Its significance comes from its parent molecule, alpha-melanocyte-stimulating hormone (α-MSH) — a hormone best known for skin pigmentation but with a second, quieter career as one of the body\'s own anti-inflammatory signals. KPV is α-MSH\'s C-terminal tail, and it carries much of the anti-inflammatory activity without the pigmentation effects.{{cite:1}}',
        'That profile — a tiny, well-defined fragment of a natural anti-inflammatory hormone — is why KPV attracts serious gut research. Small peptides are cheap to synthesize precisely, and three amino acids is about as clean a molecule as peptide science offers.',
      ],
    },
    {
      id: 'mouse-colitis-data',
      heading: 'The mouse colitis data, accurately summarized',
      paragraphs: [
        'The foundational KPV study, published in Gastroenterology in 2008 by Dalmasso and colleagues, showed that KPV is taken up into intestinal cells by the peptide transporter PepT1 — the same transporter that moves dietary protein fragments — and once inside, it dampened the master inflammatory switches NF-κB and MAP kinase, reducing inflammatory cytokine production and improving outcomes in mouse models of colitis.{{cite:2}}',
        'The same year, Kannengiesser and colleagues tested KPV in two established mouse models of inflammatory bowel disease (DSS and TNBS colitis) and found anti-inflammatory benefit, confirming KPV as the minimal active fragment responsible for much of α-MSH\'s gut effect.{{cite:3}} Later work went further, delivering KPV in colon-targeted nanoparticles to concentrate it at inflamed tissue — a hint at how future formulations might work.{{cite:4}}',
        'This is good science: a defined molecule, a defined transporter, a defined pathway, reproducible effects across labs. It is also entirely preclinical — mice, rats and cell cultures. No dog has been enrolled in a KPV trial that we can cite, and we will not pretend otherwise.',
      ],
    },
    {
      id: 'gut-skin-axis',
      heading: 'Why gut researchers talk about skin too',
      paragraphs: [
        'α-MSH and its fragments have documented anti-inflammatory effects in skin models as well as gut — the melanocortin system is expressed across immune cells, keratinocytes and intestinal lining alike.{{cite:1}} That is why KPV is marketed for "gut and skin" as a pair: it is the same pathway, in the body\'s two largest barrier organs.',
        'There is also a familiar clinical intuition behind it: vets see the gut–skin connection daily. Food-responsive enteropathy often shows up as ear infections and itchy paws before anyone connects it to the bowl. A compound that calms barrier inflammation in both tissues is, at minimum, a coherent hypothesis. Coherent is not the same as proven — but it is a better starting point than most supplement trends.',
      ],
    },
    {
      id: 'what-needs-proving',
      heading: 'What would need to be proven for dogs',
      paragraphs: [
        'For KPV to move from "interesting" to "indicated" in veterinary medicine, the list is specific: canine pharmacokinetics (is it absorbed orally in dogs, and at what levels?), a dose-finding study, and then a placebo-controlled efficacy trial in client-owned dogs — ideally in the population that needs it most, dogs with chronic enteropathy or food-responsive skin disease. None of these exist yet.{{cite:2}}{{cite:3}}',
        'Until they do, every KPV product for pets — ours included, once launched — sits in the same honest category: a preclinical compound sold with conservative dosing, batch-level purity verification, and a standing recommendation to loop in your vet.',
      ],
    },
    {
      id: 'monitoring',
      heading: 'Monitoring a sensitive dog, with or without KPV',
      paragraphs: [
        'Whether or not you ever use a peptide, the monitoring discipline is the real intervention. Keep a two-week baseline before changing anything: stool quality on a 1–7 scale, itch episodes, ear flares, food and treats. Then change one thing — diet or supplement, never both — and re-score for four weeks.',
        'Red flags that mean "vet now, not supplements": blood in stool, weight loss, vomiting more than occasionally, or a young dog failing to thrive. Chronic gut signs in dogs have real differential diagnoses — parasites, exocrine pancreatic insufficiency, IBD, even lymphoma — and no peptide should delay that workup.',
      ],
    },
    {
      id: 'sa-angle',
      heading: 'What this means for South African pet owners',
      paragraphs: [
        'SA\'s climate is hard on sensitive systems: hot summers amplify skin flares, and loadshedding-era diet improvisation (we have all fed what is in the house) does sensitive guts no favours. Local owners currently import KPV from US peptide shops with no COA and no dosing guidance.',
        'PSA PETS\' KPV Gut & Skin Drops are in development with the same standard as the rest of the line: ≥99% HPLC purity, a certificate of analysis per batch, weight-banded conservative dosing reviewed with veterinarians, and the evidence level printed on the page — preclinical, said plainly. The waitlist hears first.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is KPV and what does it do?',
      a: 'KPV (lysine–proline–valine) is a three-amino-acid fragment of alpha-MSH, a natural anti-inflammatory hormone. In mouse and cell studies it enters gut-lining cells via the PepT1 transporter and dampens inflammatory signalling (NF-κB, MAP kinase), reducing colitis severity. It is studied for gut and skin support — canine trials do not yet exist.',
    },
    {
      q: 'Has KPV been tested in dogs?',
      a: 'No. All published KPV efficacy data is preclinical — mouse colitis models and cell culture. There are no canine pharmacokinetic or efficacy trials as of early 2026, which is why we label the evidence level "preclinical" everywhere it appears.',
    },
    {
      q: 'Can KPV help my dog\'s itchy skin?',
      a: 'Possibly, indirectly — the melanocortin pathway KPV works through is active in skin as well as gut, and vets recognize a gut–skin connection in food-sensitive dogs. But no study has tested KPV for canine skin disease. Rule out the common causes first (fleas, food intolerance, environmental allergy) with your vet.',
    },
    {
      q: 'Is KPV safe for pets?',
      a: 'KPV is a fragment of a natural hormone and was well tolerated in animal models, but "safe in mice" is not "proven safe in your dog." Start low, monitor stool and appetite, and tell your vet everything your pet takes. Avoid use in pregnant or lactating animals — there is simply no data.',
    },
    {
      q: 'How is KPV different from BPC-157 for gut issues?',
      a: 'Different molecules, different pathways. KPV is a melanocortin fragment that calms inflammatory signalling inside gut cells; BPC-157 is a 15-amino-acid gastric-derived peptide studied for mucosal healing and blood-vessel formation. BPC-157 has canine pharmacokinetic data; KPV does not. Both remain unproven for efficacy in dogs.',
    },
  ],
  citations: [
    {
      authors: 'Brzoska T, Luger TA, Maaser C, Abels C, Böhm M',
      title:
        'Alpha-melanocyte-stimulating hormone and related tripeptides: biochemistry, antiinflammatory and protective effects in vitro and in vivo, and future perspectives for the treatment of immune-mediated inflammatory diseases',
      journal: 'Endocrine Reviews',
      year: 2008,
      url: 'https://pubmed.ncbi.nlm.nih.gov/18612139/',
    },
    {
      authors: 'Dalmasso G, Charrier-Hisamuddin L, Nguyen HT, et al.',
      title: 'PepT1-mediated tripeptide KPV uptake reduces intestinal inflammation',
      journal: 'Gastroenterology',
      year: 2008,
      url: 'https://doi.org/10.1053/j.gastro.2007.10.026',
    },
    {
      authors: 'Kannengiesser K, Maaser C, Heidemann J, et al.',
      title:
        'Melanocortin-derived tripeptide KPV has anti-inflammatory potential in murine models of inflammatory bowel disease',
      journal: 'Inflammatory Bowel Diseases',
      year: 2008,
      url: 'https://pubmed.ncbi.nlm.nih.gov/18022899/',
    },
    {
      authors: 'Laroui H, Dalmasso G, Nguyen HT, et al.',
      title: 'Drug-loaded nanoparticles targeted to the colon with polysaccharide hydrogel reduce colitis in a mouse model',
      journal: 'Gastroenterology',
      year: 2010,
      url: 'https://doi.org/10.1053/j.gastro.2009.11.003',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* 6 · Pet longevity science                                           */
/* ------------------------------------------------------------------ */

const LONGEVITY: BlogArticle = {
  slug: 'pet-longevity-science-dog-aging',
  title: "The Science of Pet Longevity: Dog Aging Project, Loyal, and What's Coming",
  metaDescription:
    '45,000+ dogs in the Dog Aging Project, rapamycin in the TRIAD trial, Loyal\'s 1,300-dog STAY study chasing the first FDA longevity approval — and GLP-1 drugs for pets on the horizon. A clear guide for owners.',
  keywords: [
    'dog longevity science',
    'Dog Aging Project',
    'Loyal STAY trial',
    'rapamycin dogs TRIAD',
    'FDA conditional approval animal drugs',
    'GLP-1 for pets',
  ],
  publishDate: '2026-02-09',
  modifiedDate: '2026-02-09',
  readMinutes: 11,
  heroImage: '/hero-owner-dog.png',
  heroAlt: 'An owner with their senior dog — more good years together',
  category: 'Longevity & Research',
  excerpt:
    'For the first time in history, pet aging is being studied like the medical condition it is. The biggest trials ever run in dogs are underway — here is what they are testing and what it means for yours.',
  relatedProducts: ['immune-thymogen', 'mobility-collagen', 'senior-vitality'],
  meaningBox: {
    title: 'What this means for your dog',
    body: 'The longevity pipeline is real but years from your vet\'s shelf. The proven longevity interventions for your dog today are unglamorous and free-ish: lean body condition (the single biggest lifespan lever ever demonstrated in dogs), dental care, twice-yearly senior checkups with bloodwork after age seven, and daily movement. The science below is the future; those four habits are the present.',
  },
  sections: [
    {
      id: 'why-now',
      heading: 'Why pet aging is suddenly a science',
      paragraphs: [
        'Age is the single greatest risk factor for the diseases that take our dogs — cancer, heart disease, kidney failure, cognitive decline. For decades, veterinary medicine treated each disease as it arrived. The new approach asks a more radical question: what if you could slow the aging process itself, and push all of those diseases back at once?',
        'Dogs turn out to be nearly ideal subjects for this science. Unlike lab mice, they share our homes, our environment, our medical system and many of our age-related diseases — which makes canine aging research doubly valuable: it helps dogs directly, and it is one of the best windows into human aging we have.{{cite:1}}',
      ],
    },
    {
      id: 'dog-aging-project',
      heading: 'The Dog Aging Project: 45,000 dogs and counting',
      paragraphs: [
        'The Dog Aging Project, run out of the University of Washington and Texas A&M with NIH funding, is the largest study of canine aging ever attempted: more than 45,000 dogs enrolled by their owners across the United States, contributing veterinary records, DNA, annual health surveys and — for a subset — blood samples tracked over years.{{cite:2}}',
        'Its premise is simple and powerful: watch tens of thousands of real dogs age in real homes, and the patterns emerge — which breeds decline fastest, which diets and environments correlate with healthy years, which blood markers predict disease before symptoms. The project publishes openly, so its dataset is becoming the shared foundation for everyone else in this article.',
      ],
    },
    {
      id: 'rapamycin-triad',
      heading: 'Rapamycin and the TRIAD trial',
      paragraphs: [
        'Rapamycin is the most credible longevity drug candidate in mammals: it reliably extends lifespan in mice and acts on mTOR, a master cellular switch for growth-versus-maintenance. In 2017, a small pilot trial gave 24 healthy middle-aged companion dogs low-dose rapamycin or placebo for ten weeks. The result: no clinical side effects, and echocardiography suggested improved measures of age-related heart function in the treated dogs.{{cite:3}}',
        'That pilot became the rationale for TRIAD — Test of Rapamycin in Aging Dogs — the Dog Aging Project\'s randomized, placebo-controlled trial of rapamycin in hundreds of older dogs, designed to answer the only question that matters: do treated dogs actually get more healthy years?{{cite:2}} Results will take years; dogs, unlike mice, insist on living at dog speed. But for the first time, the experiment is properly designed.',
      ],
    },
    {
      id: 'loyal-stay',
      heading: 'Loyal\'s STAY trial and the FDA conditional-approval path',
      paragraphs: [
        'Biotech company Loyal is attempting something bolder: not just studying aging, but getting a longevity drug approved. Its STAY study enrolled roughly 1,300 senior dogs across more than 70 US veterinary practices — the largest veterinary clinical trial in history — testing its lead candidate LOY-002 against placebo in everyday senior dogs.{{cite:4}}',
        'Here is the regulatory mechanism owners should understand, because it will shape what reaches your vet. The FDA offers animal drugs a conditional approval pathway (XCA) for serious conditions with unmet need. A company must clear three bars: a Reasonable Expectation of Effectiveness (RXE), a safety package, and manufacturing quality. Loyal announced that the FDA accepted LOY-002\'s RXE package in 2025 and its safety package thereafter — with safety data from over 400 treated dogs — leaving manufacturing as the final element before possible conditional approval, which would allow marketing while the full efficacy dataset matures.{{cite:5}}',
        'Translation for owners: conditional approval does not mean "proven to extend life" — it means the FDA agrees the drug is safe and reasonably likely to work, with final proof due within the conditional window. It is a genuinely rigorous pathway, and LOY-002 would be the first drug ever approved anywhere to extend healthy lifespan in any species.',
      ],
    },
    {
      id: 'glp1-pets',
      heading: 'On the horizon: GLP-1 drugs for pets',
      paragraphs: [
        'The drug class that transformed human weight management is coming for the pet bowl. Roughly 60% of US dogs and cats are overweight — the single most treatable driver of shortened pet lifespan — and in December 2025 Okava Pharmaceuticals dosed the first cat in MEOW-1, a clinical trial of OKV-119, an implant that releases a GLP-1 medicine continuously for up to six months. It is the first GLP-1 weight-loss trial ever run in cats or dogs, conducted under an FDA Investigational New Animal Drug application, with a canine version in development.{{cite:6}} A second program at Cornell is testing a weekly GLP-1 injection in overweight cats.',
        'Caveats apply: these are early trials in overweight cats, not longevity drugs, and nobody should ever give a human GLP-1 pen to a pet. But the direction is unmistakable — pet medicine is adopting the most important drug classes in human medicine, a decade behind and catching up fast.',
      ],
    },
    {
      id: 'sa-angle',
      heading: 'What this means for South African pet owners',
      paragraphs: [
        'None of these trials enrols South African dogs, and FDA-conditional products would take years to reach SAHPRA registration. But the science belongs to everyone: the Dog Aging Project\'s open findings on diet, weight and healthy aging apply equally to a Boerboel in Bloemfontein as to a beagle in Boston.',
        'PSA PETS is built on this exact thesis — that the pet longevity wave will reach South Africa, and owners here deserve the compounds with the best evidence, at local prices, with the evidence graded honestly. Our Senior Vitality blend is in development around canine aging research; meanwhile, the single most proven longevity "supplement" remains keeping your dog lean — no waitlist required.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is the Dog Aging Project?',
      a: 'The largest canine aging study ever run: an NIH-funded research program at the University of Washington and Texas A&M with 45,000+ enrolled companion dogs contributing health records, DNA and annual surveys, designed to understand how dogs age and how to extend their healthy years. It also runs the TRIAD rapamycin trial.',
    },
    {
      q: 'Does rapamycin really extend dog lifespan?',
      a: 'Not proven yet. A 2017 pilot in 24 middle-aged dogs found low-dose rapamycin was well tolerated and suggested improved heart function measures. The larger TRIAD randomized controlled trial is now testing whether it actually extends healthy lifespan in older dogs. Never give your dog rapamycin outside a clinical trial — it is a prescription drug with real risks at the wrong dose.',
    },
    {
      q: 'What is Loyal\'s LOY-002 and when will it be available?',
      a: 'LOY-002 is a daily pill in development to extend healthy lifespan in senior dogs, tested against placebo in the 1,300-dog STAY trial. The FDA has accepted its Reasonable Expectation of Effectiveness and safety packages under the conditional approval pathway. Conditional approval would make it the first lifespan drug approved in any species — but it is still not "proven to extend life," and availability outside the US would take longer.',
    },
    {
      q: 'What does FDA conditional approval actually mean?',
      a: 'It is a US pathway (XCA) for animal drugs addressing serious unmet needs: the company must show safety, manufacturing quality and a reasonable expectation of effectiveness, then may market the drug while full efficacy proof is completed. Rigorous — but short of full approval.',
    },
    {
      q: 'Are GLP-1 "pet Ozempic" drugs available?',
      a: 'Not yet. The first trial (Okava\'s MEOW-1, a six-month GLP-1 implant in ~50 overweight cats) dosed its first cat in December 2025; a weekly-injection trial is running at Cornell. Results are expected from mid-2026. Never administer human GLP-1 medicines to pets — dosing and safety in animals are unestablished.',
    },
    {
      q: 'What can I do today to help my dog live longer?',
      a: 'The proven four: keep your dog lean (lean dogs in the landmark Purina study lived meaningfully longer), maintain dental health, book twice-yearly vet checks with bloodwork from age seven, and keep daily movement going into the senior years. Supplements and future drugs are add-ons to that foundation — never substitutes for it.',
    },
  ],
  citations: [
    {
      authors: 'Urfer SR, Kaeberlein TL, Mailheau S, et al.',
      title: 'A randomized controlled trial to establish effects of short-term rapamycin treatment in 24 middle-aged companion dogs',
      journal: 'GeroScience',
      year: 2017,
      url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5411365/',
    },
    {
      authors: 'Dog Aging Project consortium',
      title: 'The Dog Aging Project — longitudinal study of aging in tens of thousands of companion dogs',
      journal: 'dogagingproject.org',
      year: 2026,
      url: 'https://dogagingproject.org',
    },
    {
      authors: 'Urfer SR, Kaeberlein M, Promislow DEL, Creevy KE',
      title: 'Rapamycin in aging dogs (TRIAD) — trial rationale and pilot cardiac outcomes',
      journal: 'GeroScience / PubMed',
      year: 2017,
      url: 'https://pubmed.ncbi.nlm.nih.gov/28374166/',
    },
    {
      authors: 'Loyal (Cellular Longevity, Inc.)',
      title: 'The STAY study — LOY-002 clinical trial in ~1,300 senior dogs across 70+ veterinary practices',
      journal: 'loyal.com',
      year: 2026,
      url: 'https://loyal.com',
    },
    {
      authors: 'Loyal (Cellular Longevity, Inc.)',
      title: "One step closer to a dog longevity drug: LOY-002's FDA safety milestone (XCA pathway, RXE acceptance)",
      journal: 'loyal.com/posts',
      year: 2026,
      url: 'https://loyal.com/posts/loy-002-tas',
    },
    {
      authors: 'Okava Pharmaceuticals',
      title: 'OKAVA Announces First Cat Dosed in MEOW-1 Study of OKV-119, the World\'s First GLP-1 Weight Loss Therapy for Pets',
      journal: 'okava.com (press release)',
      year: 2025,
      url: 'https://okava.com/okava-announces-first-cat-dosed-in-meow-1-study-of-okv-119-the-worlds-first-glp-1-weight-loss-therapy-for-pets/',
    },
  ],
}

/* ------------------------------------------------------------------ */
/* 7 · Calming peptides (αs1-casozepine)                               */
/* ------------------------------------------------------------------ */

const CALMING: BlogArticle = {
  slug: 'calming-peptides-casozepine-anxious-dogs',
  title: 'Calming Peptides: The Milk Protein With Placebo-Controlled Trials',
  metaDescription:
    'αs1-casozepine — a peptide from milk casein — has placebo-controlled calming trials in cats and dogs: vet visits, anxiety disorders, stress markers. How it works, what the trials found, and how it compares to selank-type compounds.',
  keywords: [
    'calming peptides dogs',
    'alpha-s1 casozepine dogs',
    'Zylkene dogs evidence',
    'dog anxiety supplement',
    'fireworks anxiety dog natural',
    'selank for dogs',
  ],
  publishDate: '2026-02-16',
  modifiedDate: '2026-02-16',
  readMinutes: 9,
  heroImage: '/dog-portrait-3.png',
  heroAlt: 'A relaxed dog lying calmly on a warm cream background',
  category: 'Evidence Reviews',
  excerpt:
    'A milk-derived peptide with placebo-controlled trials in both cats and dogs — vet visits, anxiety disorders, stress physiology. The quiet overachiever of pet calming science.',
  relatedProducts: ['calm', 'kpv', 'immune-thymogen'],
  meaningBox: {
    title: 'What this means for your dog',
    body: 'If your dog shakes through fireworks season, dreads the vet or unravels when you leave, αs1-casozepine is one of the few calming supplements with placebo-controlled trials behind it — non-sedating and gentle enough for daily use. It is a support tool, not a behavioural cure: pair it with desensitization training, and for severe anxiety (self-injury, destruction, panic) see a vet behaviourist, because prescription options exist and work.',
  },
  sections: [
    {
      id: 'what-is-casozepine',
      heading: 'What αs1-casozepine is',
      paragraphs: [
        'αs1-casozepine is a decapeptide — ten amino acids — released when the casein protein in cow\'s milk is hydrolysed (broken down). It was discovered through a observation every parent knows: milk has a calming effect on nursing infants. Researchers traced part of that effect to this peptide fragment, which binds to the same brain receptor site that anti-anxiety medicines target — the benzodiazepine site on the GABA-A receptor — but far more gently, and without sedation at studied doses.{{cite:1}}',
        'It is best known by the supplement brand Zylkene, sitting in a useful regulatory niche: a nutraceutical (food-derived) with an actual clinical trial record — a combination almost no other calming supplement can claim.',
      ],
    },
    {
      id: 'dog-trials',
      heading: 'The dog trials: from anxiety disorders to the vet\'s table',
      paragraphs: [
        'The landmark dog study dates to 2007: Beata and colleagues ran a controlled trial in dogs diagnosed with anxiety disorders, comparing αs1-casozepine against selegiline — a licensed veterinary anxiolytic drug. Over 56 days, both groups improved meaningfully on anxiety scores, with the peptide showing comparable benefit and an excellent tolerability profile.{{cite:1}} A supplement matching a registered drug\'s effect size is rare enough to be worth remembering.',
        'More recent work has focused on a stressor every owner recognizes: the vet visit. In a 2024 randomized placebo-controlled trial published in The Veterinary Journal, Schroers and colleagues gave dogs αs1-casozepine before a veterinary examination and measured stress responses; treated dogs showed reduced signs of stress compared with placebo.{{cite:2}}',
      ],
    },
    {
      id: 'cat-trials',
      heading: 'The cat trials: placebo-controlled, stress-hormone measured',
      paragraphs: [
        'Cats actually carry the strongest casozepine record. In a 2020 randomized, placebo-controlled study of 60 cats, Makawey and colleagues tested two dosing schedules around real veterinary checkups, measuring both observed stress signs and faecal cortisol metabolites — an objective, non-invasive readout of stress-hormone activity. Cats on the higher dose (75 mg/kg for three days) showed a significant reduction in stress-linked sweaty paws at the clinic, with a modest downward trend in cortisol metabolites.{{cite:3}}',
        'Earlier, Landsberg and colleagues tested a therapeutic diet supplemented with αs1-casozepine and L-tryptophan in anxious cats, finding improved fear and anxiety scores on standardized behavioural tests versus control.{{cite:4}} Across species and study designs, the pattern is consistent: modest, real, non-sedating calming — strongest for situational stress.',
      ],
    },
    {
      id: 'how-to-use',
      heading: 'Using it sensibly: timing, expectations, limits',
      paragraphs: [
        'The trial protocols teach the practical lesson: αs1-casozepine works best started before the stressor — days ahead for a known event (vet visit, travel, fireworks night), or daily for ongoing generalized anxiety, with effects typically building over the first one to two weeks. It does not sedate, so it will not knock out a panicking dog at 9pm on New Year\'s Eve; it lowers the background volume so training and coping have a chance.',
        'Know the limits: severe noise phobia and separation anxiety are medical-grade behavioural conditions. A supplement can be one leg of the plan — alongside desensitization, management and, when a vet behaviourist advises it, prescription medication. Red flags for professional help: self-injury, property destruction, escape attempts, or anxiety that is getting worse.',
      ],
    },
    {
      id: 'selank-comparison',
      heading: 'How it compares to selank-type peptides in development',
      paragraphs: [
        'Beyond casozepine sit the "designer" calming peptides — selank being the most discussed. Selank is a synthetic heptapeptide (a tuftsin analog) developed in Russia as an anxiolytic, with small human studies abroad suggesting anti-anxiety and nootropic effects. What it does not have is what casozepine has: placebo-controlled trials in dogs and cats. For pets, selank-type compounds remain investigational — no veterinary pharmacokinetics, no efficacy trials, no established dosing.',
        'That gap is exactly why the PSA PETS Calm formula is in development rather than on the shelf: the mechanism is promising, the pet evidence is not there yet, and we would rather launch late with data than early with adjectives. When it arrives, it will carry the same honesty label as everything else we make.',
      ],
    },
    {
      id: 'sa-angle',
      heading: 'What this means for South African pet owners',
      paragraphs: [
        'South African dogs face a uniquely noisy calendar: Guy Fawkes, New Year\'s Eve, summer Highveld thunderstorms, and — for rescue dogs in particular — histories that make every bang a memory. Behavioural euthanasia and shelter surrenders spike around fireworks season; this is not a trivial market.',
        'The practical local advice: start situational calming support at least a few days before known events, build a safe den space, and talk to your vet early — not on the night itself. Our calming formula is in development; αs1-casozepine-class products are the evidence benchmark we hold it to, and the waitlist hears launch news first.',
      ],
    },
  ],
  faq: [
    {
      q: 'What is αs1-casozepine and how does it calm dogs?',
      a: 'It is a ten-amino-acid peptide from hydrolysed milk casein that binds gently to the benzodiazepine site on the GABA-A receptor — the same calming pathway targeted by anti-anxiety medicines, but without sedation at studied doses. It is best known from the supplement Zylkene.',
    },
    {
      q: 'Does αs1-casozepine actually work? What trials exist?',
      a: 'It has placebo-controlled trials in both species: dogs with anxiety disorders improved comparably to the licensed drug selegiline over 56 days (Beata 2007); a 2024 randomized placebo-controlled trial showed reduced stress during veterinary examinations; and in cats, a 60-animal placebo-controlled study found reduced stress signs and a cortisol trend around vet visits (Makawey 2020).',
    },
    {
      q: 'Will it sedate my dog?',
      a: 'No — that is the point. Trials show calming without sedation at studied doses, which makes it suitable before vet visits, travel and fireworks, and for daily use. It lowers baseline arousal rather than knocking the animal out.',
    },
    {
      q: 'How far in advance should I start it before fireworks?',
      a: 'Trial protocols dosed for days before the stressor — start at least 2–3 days ahead of a known event, longer for ongoing anxiety. Combine it with management (safe den, curtains, white noise) and, for severe phobia, a vet behaviour plan.',
    },
    {
      q: 'Is selank proven for anxious dogs?',
      a: 'No. Selank is an investigational synthetic peptide with no placebo-controlled trials in dogs or cats, no veterinary dosing data and no regulatory approval. It should be considered experimental — which is why our own calming formula remains in development with an honesty label attached.',
    },
    {
      q: 'When is anxiety a vet problem rather than a supplement problem?',
      a: 'When there is self-injury, destruction, escape behaviour, house-soiling panic, or worsening fear — or any time anxiety is costing your dog quality of life. Vet behaviourists have effective prescription options; supplements are the gentle first rung, not the whole ladder.',
    },
  ],
  citations: [
    {
      authors: 'Beata C, Beaumont-Graff E, Coll V, et al.',
      title: 'Effects of alpha-casozepine (Zylkene) versus selegiline hydrochloride (Selgian, Anipryl) on anxiety disorders in dogs',
      journal: 'Journal of Veterinary Behavior',
      year: 2007,
      url: 'https://doi.org/10.1016/j.jveb.2007.08.001',
    },
    {
      authors: 'Schroers M, et al.',
      title: 'Effect of casozepine administration on stress in dogs during a veterinary examination — a randomized placebo-controlled trial',
      journal: 'The Veterinary Journal',
      year: 2024,
      url: 'https://pubmed.ncbi.nlm.nih.gov/38838768/',
    },
    {
      authors: 'Makawey A, Iben C, Palme R',
      title: 'Cats at the Vet: The Effect of Alpha-s1 Casozepin',
      journal: 'Animals',
      year: 2020,
      url: 'https://pubmed.ncbi.nlm.nih.gov/33167443/',
    },
    {
      authors: 'Landsberg GM, Milgram B, de Rivera C, et al.',
      title: 'Therapeutic effects of an alpha-casozepine and L-tryptophan supplemented diet on fear and anxiety in the cat',
      journal: 'Journal of Feline Medicine and Surgery',
      year: 2017,
      url: 'https://pubmed.ncbi.nlm.nih.gov/27677831/',
    },
  ],
}


/* ------------------------------------------------------------------ */
/* Registry + helpers                                                  */
/* ------------------------------------------------------------------ */

export const BLOG_ARTICLES: BlogArticle[] = [BPC157, BPC157_SOUTH_AFRICA, COLLAGEN, TB500, KPV, LONGEVITY, CALMING]

export function getArticleBySlug(slug?: string): BlogArticle | undefined {
  if (!slug) return undefined
  return BLOG_ARTICLES.find((a) => a.slug === slug)
}

/** Related articles: same category first, then fill from the registry. */
export function getRelatedArticles(article: BlogArticle, count = 2): BlogArticle[] {
  const others = BLOG_ARTICLES.filter((a) => a.slug !== article.slug)
  const sameCategory = others.filter((a) => a.category === article.category)
  const rest = others.filter((a) => a.category !== article.category)
  return [...sameCategory, ...rest].slice(0, count)
}

export const SITE_URL = 'https://peptide-south-africa.com'

/** Canonical URL helpers shared by Helmet tags, sitemap and static mirrors. */
export function articleCanonical(slug: string): string {
  return `${SITE_URL}/blog/${slug}`
}

export const BLOG_TITLE = 'The PSA PETS Journal'
