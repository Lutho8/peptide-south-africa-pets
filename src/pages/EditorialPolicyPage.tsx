import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router'
import { SITE_URL } from '@/lib/blog'

const sections = [
  ['Who publishes our content', 'Peptides4Pets by Peptide South Africa publishes this journal. Articles are prepared by the Peptides4Pets Editorial team; an organisational byline is not a clinician credential.'],
  ['Evidence and sourcing', 'We prioritise peer-reviewed veterinary research, regulator publications, registered trials and official institutional sources. We label canine or feline clinical evidence separately from laboratory, rodent and other preclinical findings.'],
  ['Veterinary review and scope', 'Our content is general education, not veterinary advice, diagnosis or treatment. We do not describe an article as veterinarian reviewed unless a named, appropriately registered professional has reviewed that specific version.'],
  ['Investigational compounds', 'We distinguish registered veterinary medicines and nutritional ingredients from unregistered or investigational peptides. A certificate of analysis may support identity and purity, but it does not establish clinical safety, effectiveness or regulatory approval.'],
  ['Commercial disclosure', 'Peptides4Pets sells or develops pet products. This commercial interest is disclosed because readers should consider it when evaluating our coverage. Editorial conclusions must remain consistent with the cited evidence.'],
  ['Updates and corrections', 'Articles display publication and update dates. Material corrections update the modified date. Readers can submit source questions or correction requests with the article URL and the statement requiring review.'],
] as const

export default function EditorialPolicyPage() {
  const canonical = `${SITE_URL}/editorial-policy`
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${canonical}#webpage`,
    name: 'Peptides4Pets editorial policy and veterinary content standards',
    url: canonical,
    about: { '@type': 'Organization', name: 'Peptides4Pets by Peptide South Africa' },
    inLanguage: 'en-ZA',
  }

  return (
    <div className="bg-cream">
      <Helmet>
        <title>Editorial Policy & Veterinary Content Standards | Peptides4Pets</title>
        <meta name="description" content="How Peptides4Pets sources, reviews, labels, updates and corrects veterinary and pet-health content." />
        <link rel="canonical" href={canonical} />
        <link rel="alternate" hrefLang="en-ZA" href={canonical} />
        <link rel="alternate" hrefLang="x-default" href={canonical} />
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>
      <main className="psa-container max-w-3xl py-12 md:py-16">
        <Link to="/blog" className="mono-label !text-[10px] text-amber-deep">← THE JOURNAL</Link>
        <p className="mono-label mt-8 !text-[11px] text-clinical">TRANSPARENCY</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-espresso md:text-5xl">Editorial policy &amp; veterinary content standards</h1>
        <p className="mt-5 text-lg leading-relaxed text-espresso-70">These standards explain who is responsible for our content, how evidence is graded, and how education is separated from commercial activity.</p>
        <div className="mt-10 space-y-5">
          {sections.map(([title, body]) => (
            <section key={title} className="rounded-2xl border border-sand bg-warmwhite p-6">
              <h2 className="font-serif text-xl font-semibold text-espresso">{title}</h2>
              <p className="mt-2 leading-relaxed text-espresso-70">{body}</p>
            </section>
          ))}
        </div>
        <section className="mt-8 rounded-2xl border border-clinical/25 bg-clinical-tint p-6">
          <h2 className="font-serif text-xl font-semibold text-espresso">Corrections and source questions</h2>
          <p className="mt-2 text-espresso-70">Contact <a className="font-semibold text-clinical underline" href="mailto:info@peptide-south-africa.com">info@peptide-south-africa.com</a> and include the article URL and specific statement.</p>
        </section>
        <p className="mono-data mt-8 !text-[10px] text-espresso-70">LAST REVIEWED: 02 SEPTEMBER 2026</p>
      </main>
    </div>
  )
}
