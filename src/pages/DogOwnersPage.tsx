import { Link } from 'react-router'
import { ArrowRight, CheckCircle2, Eye, HeartPulse, Moon, Move, ShieldCheck } from 'lucide-react'
import Seo, { SITE_URL } from '@/components/Seo'
import { asset } from '@/lib/asset'

const signs = [
  {
    title: 'Movement changes',
    body: 'Stiffness, slower walks, difficulty with stairs or less interest in play can signal pain or another health change.',
    icon: Move,
  },
  {
    title: 'Sleep and behaviour',
    body: 'Night waking, new anxiety, confusion, house-soiling or changed social habits deserve a veterinary conversation.',
    icon: Moon,
  },
  {
    title: 'Sight and awareness',
    body: 'Bumping into objects, hesitation in dim light or seeming disoriented can be more than “just getting old”.',
    icon: Eye,
  },
  {
    title: 'Appetite and body condition',
    body: 'Changes in thirst, appetite, weight or muscle condition can be early clues that need proper assessment.',
    icon: HeartPulse,
  },
]

const faq = [
  {
    question: 'When is a dog considered senior?',
    answer: 'There is no single age for every dog. Breed, size and expected lifespan matter. AAHA suggests thinking about the senior life stage as roughly the final quarter of a dog’s predicted lifespan.',
  },
  {
    question: 'Are changes in movement or behaviour normal aging?',
    answer: 'They are common, but should not automatically be dismissed as normal. Pain, dental disease, cognitive change and other conditions can look like aging. A veterinarian can assess the cause.',
  },
  {
    question: 'Can Peptides4Pets promise a longer life?',
    answer: 'No. Our experimental peptide products are research materials, not approved veterinary medicines, and we do not claim that they extend lifespan or treat disease. Mobility Collagen is a nutritional supplement with its own product-specific evidence and directions.',
  },
]

const pageJsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: 'Senior Dog Aging Guide for South African Dog Owners',
    description: 'A practical guide to signs of aging in dogs, questions for your veterinarian and Peptides4Pets safety and evidence standards.',
    url: `${SITE_URL}/dog-owners`,
    inLanguage: 'en-ZA',
    about: ['senior dogs', 'dog aging', 'canine mobility', 'South Africa'],
    isPartOf: { '@type': 'WebSite', name: 'Peptides4Pets', url: SITE_URL },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  },
]

export default function DogOwnersPage() {
  return (
    <>
      <Seo
        title="Senior Dog Aging Guide for South African Dog Owners"
        description="Recognise common signs of aging in dogs, prepare for a veterinary conversation and understand Peptides4Pets' product-specific evidence and safety boundaries."
        path="/dog-owners"
        image={`${SITE_URL}/dog-owners-senior-walk-v1.webp`}
        jsonLd={pageJsonLd}
      />

      <main>
        <section className="relative isolate min-h-[660px] overflow-hidden bg-espresso text-warmwhite">
          <img
            src={asset('/dog-owners-senior-walk-v1.webp')}
            alt="A senior dog enjoying a morning walk with its owner in a South African garden"
            className="absolute inset-0 h-full w-full object-cover object-[66%_center]"
            width="1600"
            height="1066"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-espresso via-espresso/75 to-transparent" />
          <div className="psa-container relative flex min-h-[660px] items-center py-20">
            <div className="max-w-2xl">
              <p className="mono-label text-amber">FOR DOG OWNERS · SOUTH AFRICA</p>
              <h1 className="mt-5 max-w-xl font-serif text-5xl leading-[0.98] sm:text-6xl lg:text-7xl">
                More walks. More play. More good days together.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-cream/85">
                Aging changes every dog differently. Learn what to watch for, what to ask your veterinarian and how we separate nutritional support from experimental peptide research.
              </p>
              <a href="#signs-of-aging" className="mt-9 inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3.5 font-semibold text-warmwhite hover:bg-amber-deep">
                Explore signs of aging <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>

        <section id="signs-of-aging" className="section-pad bg-cream">
          <div className="psa-container">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-end">
              <div>
                <p className="mono-label text-clinical">HOW AGING AFFECTS DOGS</p>
                <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Notice the small changes early.</h2>
              </div>
              <p className="max-w-2xl text-lg leading-relaxed text-espresso-70">
                A greying muzzle is easy to see. Changes in comfort, cognition, appetite and daily habits can be quieter. Old age itself is not a disease, so a change should be observed, recorded and discussed rather than written off.
              </p>
            </div>
            <div className="mt-12 grid gap-5 sm:grid-cols-2">
              {signs.map(({ title, body, icon: Icon }) => (
                <article key={title} className="rounded-3xl border border-sand bg-warmwhite p-7">
                  <Icon className="h-7 w-7 text-amber-deep" aria-hidden="true" />
                  <h3 className="mt-5 font-serif text-2xl">{title}</h3>
                  <p className="mt-3 leading-relaxed text-espresso-70">{body}</p>
                </article>
              ))}
            </div>
            <p className="mt-7 text-sm leading-relaxed text-espresso-70">
              Source: <a className="underline" href="https://www.aaha.org/resources/2023-aaha-senior-care-guidelines-for-dogs-and-cats/" target="_blank" rel="noreferrer">2023 AAHA Senior Care Guidelines</a>. This guide is educational and cannot diagnose your dog.
            </p>
          </div>
        </section>

        <section className="section-pad bg-clinical text-warmwhite">
          <div className="psa-container grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mono-label text-cream/70">THE QUESTION BEHIND THE RESEARCH</p>
              <h2 className="mt-4 font-serif text-5xl leading-tight">Could peptide research help create more healthy years?</h2>
              <p className="mt-6 text-lg leading-relaxed text-cream/80">
                That is a research question, not a promise we can make today. Evidence differs by molecule and product. Our catalogue shows the study type, species and limits so dog owners and veterinary professionals can see exactly what is known.
              </p>
              <Link to="/science" className="mt-8 inline-flex items-center gap-2 rounded-full border border-cream/50 px-6 py-3.5 font-semibold hover:bg-cream hover:text-clinical">
                Review the evidence library <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-4 lg:grid-cols-2">
              {['more walks', 'more play', 'more fetch', 'more good days'].map((line) => (
                <div key={line} className="flex aspect-square items-center justify-center rounded-full border border-cream/20 bg-cream/5 p-5 font-serif text-2xl sm:text-3xl">
                  {line}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad bg-warmwhite">
          <div className="psa-container grid gap-12 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <ShieldCheck className="h-10 w-10 text-clinical" aria-hidden="true" />
              <p className="mono-label mt-5 text-clinical">COMMITTED TO YOUR DOG'S SAFETY</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight">Clarity before claims.</h2>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {[
                ['Product categories stay separate', 'Mobility Collagen is a nutritional supplement. Experimental peptides are sealed research vials and are not presented as veterinary medicines.'],
                ['Evidence stays product-specific', 'A result for one compound, species or formulation is never treated as proof for another. Each page states study design and limits.'],
                ['Batch documents stay traceable', 'Use the batch verification page to view the certificate made available for a listed lot. We do not substitute generic purity claims for lot-linked evidence.'],
                ['Clinical decisions stay with vets', 'We do not provide diagnoses, prescriptions or dosing. Changes in your dog’s health or treatment belong in a veterinary consultation.'],
              ].map(([title, body]) => (
                <article key={title} className="rounded-3xl bg-cream p-6">
                  <CheckCircle2 className="h-5 w-5 text-amber-deep" aria-hidden="true" />
                  <h3 className="mt-4 font-serif text-xl">{title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-espresso-70">{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad bg-cream">
          <div className="psa-container text-center">
            <p className="mono-label text-amber-deep">BUILT AROUND THE DOG-HUMAN BOND</p>
            <h2 className="mx-auto mt-5 max-w-4xl font-serif text-4xl leading-tight sm:text-6xl">We’re building a community of veterinary professionals, scientists and dog lovers.</h2>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-espresso-70">
              Better questions start with dog owners who pay attention, researchers who show their limits and veterinary professionals who make the clinical decisions.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link to="/blog" className="rounded-full bg-espresso px-6 py-3.5 font-semibold text-warmwhite">Read the dog-owner journal</Link>
              <Link to="/product/mobility-collagen" className="rounded-full border border-espresso/30 px-6 py-3.5 font-semibold">Explore Mobility Collagen</Link>
            </div>
          </div>
        </section>

        <section className="section-pad bg-warmwhite">
          <div className="psa-container max-w-4xl">
            <p className="mono-label text-clinical">DOG OWNER Q&amp;A</p>
            <h2 className="mt-4 font-serif text-4xl">Common questions, direct answers.</h2>
            <div className="mt-8 divide-y divide-sand border-y border-sand">
              {faq.map((item) => (
                <details key={item.question} className="group py-6">
                  <summary className="cursor-pointer list-none font-serif text-2xl">{item.question}</summary>
                  <p className="mt-4 max-w-3xl leading-relaxed text-espresso-70">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
