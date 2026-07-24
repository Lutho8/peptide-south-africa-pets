import { Helmet } from 'react-helmet-async'
import { BLOG_ARTICLES, BLOG_TAGLINE, BLOG_TITLE, SITE_URL } from '@/lib/blog'
import { ArticleCard } from '@/components/BlogShared'
import { useBlogChrome } from '@/lib/blogChrome'
import { useI18n } from '@/lib/i18n'

const INTRO = {
  en: {
    overline: 'THE PSA PETS JOURNAL',
    titleA: 'Evidence-first reading for',
    titleEm: 'people who read labels.',
    quizNote:
      'Every article grades the evidence honestly: published canine data in green, preclinical in amber, and the gaps in plain sight.',
  },
  af: {
    overline: 'DIE PSA PETS-JOERNAAL',
    titleA: 'Bewysgedrewe leeswerk vir',
    titleEm: 'mense wat etikette lees.',
    quizNote:
      'Elke artikel gradeer die bewyse eerlik: gepubliseerde honde-data in groen, preklinies in amber, en die gapings in die oop.',
  },
} as const

export default function BlogIndexPage() {
  const chrome = useBlogChrome()
  const { locale } = useI18n()
  const intro = locale === 'af' ? INTRO.af : INTRO.en

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: BLOG_TITLE,
    description: BLOG_TAGLINE,
    url: `${SITE_URL}/blog`,
    publisher: { '@type': 'Organization', name: 'PSA PETS', url: SITE_URL },
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: BLOG_ARTICLES.map((a, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: `${SITE_URL}/blog/${a.slug}`,
        name: a.title,
      })),
    },
  }

  return (
    <div className="bg-cream">
      <Helmet>
        <title>{`${BLOG_TITLE} — Peptides for Dogs & Cats, Evidence Graded Honestly | PSA PETS`}</title>
        <meta name="description" content={BLOG_TAGLINE} />
        <meta
          name="keywords"
          content="peptides for dogs, pet supplements South Africa, dog joint supplement evidence, pet longevity science, PSA PETS"
        />
        <link rel="canonical" href={`${SITE_URL}/blog`} />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={`${BLOG_TITLE} | PSA PETS`} />
        <meta property="og:description" content={BLOG_TAGLINE} />
        <meta property="og:url" content={`${SITE_URL}/blog`} />
        <meta property="og:image" content={`${SITE_URL}/dog-portrait-1.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${BLOG_TITLE} | PSA PETS`} />
        <meta name="twitter:description" content={BLOG_TAGLINE} />
        <meta name="twitter:image" content={`${SITE_URL}/dog-portrait-1.png`} />
        <script type="application/ld+json">{JSON.stringify(itemListJsonLd)}</script>
      </Helmet>

      {/* Hero */}
      <section className="border-b border-sand bg-cream">
        <div className="psa-container py-14 md:py-20">
          <p className="mono-label !text-[11px] text-amber-deep">{intro.overline}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-4xl font-semibold leading-tight text-espresso md:text-6xl">
            {intro.titleA} <em className="italic text-clinical">{intro.titleEm}</em>
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-espresso-70 md:text-lg">
            {intro.quizNote}
          </p>
          <p className="mono-data mt-6 !text-[11px] text-espresso-70">
            {BLOG_ARTICLES.length} ARTICLES · {chrome.byline} · CITED & GRADED
          </p>
        </div>
      </section>

      {/* Cards */}
      <section className="psa-container py-12 md:py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_ARTICLES.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      </section>
    </div>
  )
}
