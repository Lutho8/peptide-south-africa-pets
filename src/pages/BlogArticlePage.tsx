import { Link, useParams } from 'react-router'
import { Helmet } from 'react-helmet-async'
import { ArrowLeft, ArrowRight, FileText } from 'lucide-react'
import {
  BLOG_DISCLAIMER,
  articleCanonical,
  getArticleBySlug,
  getRelatedArticles,
  SITE_URL,
} from '@/lib/blog'
import { ArticleCard, RelatedProductCard } from '@/components/BlogShared'
import { fmtDate, renderWithCitations, useBlogChrome } from '@/lib/blogChrome'

/** Smooth-scroll handler for the sticky TOC (Lenis owns the scroll loop). */
function scrollToId(id: string) {
  const el = document.getElementById(id)
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>()
  const article = getArticleBySlug(slug)
  const chrome = useBlogChrome()

  if (!article) {
    return (
      <div className="psa-container flex min-h-[60dvh] flex-col items-start justify-center py-20">
        <p className="mono-label !text-[11px] text-amber-deep">JOURNAL / NOT FOUND</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-espresso">
          We haven’t written that one (yet).
        </h1>
        <Link
          to="/blog"
          className="mono-label mt-6 inline-flex items-center gap-2 rounded-full bg-amber px-6 py-3 !text-[11px] text-warmwhite"
        >
          <ArrowLeft className="h-4 w-4" /> {chrome.backToBlog}
        </Link>
      </div>
    )
  }

  const canonical = articleCanonical(article.slug)
  const related = getRelatedArticles(article, 2)

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    image: `${SITE_URL}${article.heroImage}`,
    datePublished: article.publishDate,
    dateModified: article.modifiedDate,
    author: { '@type': 'Organization', name: 'PSA PETS Editorial', url: `${SITE_URL}/blog` },
    publisher: {
      '@type': 'Organization',
      name: 'PSA PETS',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/coa-stamp.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonical },
    keywords: article.keywords.join(', '),
    articleSection: article.category,
    inLanguage: 'en',
  }

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: article.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <div className="bg-cream">
      <Helmet>
        <title>{`${article.title} | PSA PETS Journal`}</title>
        <meta name="description" content={article.metaDescription} />
        <meta name="keywords" content={article.keywords.join(', ')} />
        <link rel="canonical" href={canonical} />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.metaDescription} />
        <meta property="og:url" content={canonical} />
        <meta property="og:image" content={`${SITE_URL}${article.heroImage}`} />
        <meta property="article:published_time" content={article.publishDate} />
        <meta property="article:modified_time" content={article.modifiedDate} />
        <meta property="article:section" content={article.category} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={article.title} />
        <meta name="twitter:description" content={article.metaDescription} />
        <meta name="twitter:image" content={`${SITE_URL}${article.heroImage}`} />
        <script type="application/ld+json">{JSON.stringify(articleJsonLd)}</script>
        <script type="application/ld+json">{JSON.stringify(faqJsonLd)}</script>
      </Helmet>

      {/* Article header */}
      <header className="border-b border-sand">
        <div className="psa-container py-10 md:py-14">
          <Link
            to="/blog"
            className="mono-label inline-flex items-center gap-2 !text-[11px] text-espresso-70 hover:text-amber-deep"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> {chrome.backToBlog}
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="mono-label rounded-full bg-clinical px-3 py-1 !text-[10px] text-cream">
              {article.category.toUpperCase()}
            </span>
            <span className="mono-data !text-[11px] text-espresso-70">
              {fmtDate(article.publishDate)} · {chrome.minRead(article.readMinutes)} ·{' '}
              {chrome.evidenceReview}
            </span>
          </div>
          <h1 className="mt-4 max-w-4xl font-serif text-3xl font-semibold leading-tight text-espresso md:text-5xl">
            {article.title}
          </h1>
          <p className="mono-data mt-4 !text-[11px] text-espresso-70">
            {chrome.byline} · {chrome.published} {fmtDate(article.publishDate)} · {chrome.updated}{' '}
            {fmtDate(article.modifiedDate)}
          </p>
        </div>
        <div className="psa-container pb-10">
          <img
            src={article.heroImage}
            alt={article.heroAlt}
            className="aspect-[21/9] w-full rounded-3xl border border-sand object-cover"
          />
        </div>
      </header>

      {/* Body + sticky TOC */}
      <div className="psa-container grid gap-10 py-10 md:py-14 lg:grid-cols-[260px_1fr]">
        {/* Sticky TOC */}
        <aside className="hidden lg:block">
          <nav className="sticky top-28 rounded-2xl border border-sand bg-warmwhite p-5">
            <p className="mono-label !text-[10px] text-espresso-70">{chrome.toc}</p>
            <ul className="mt-3 space-y-2.5">
              {article.sections.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => scrollToId(s.id)}
                    className="link-underline cursor-pointer text-left text-sm leading-snug text-espresso-70 hover:text-espresso"
                  >
                    {s.heading}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => scrollToId('faq')}
                  className="link-underline cursor-pointer text-left text-sm text-espresso-70 hover:text-espresso"
                >
                  FAQ
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToId('references')}
                  className="link-underline cursor-pointer text-left text-sm text-espresso-70 hover:text-espresso"
                >
                  {chrome.references}
                </button>
              </li>
            </ul>
            <p className="mono-data mt-4 border-t border-sand pt-3 !text-[10px] text-espresso-70">
              {chrome.citeNote}
            </p>
          </nav>
        </aside>

        {/* Article body */}
        <article className="max-w-3xl">
          {article.sections.map((section, sIdx) => (
            <section key={section.id} id={section.id} className="scroll-mt-28">
              <h2 className="mt-10 font-serif text-2xl font-semibold text-espresso first:mt-0 md:text-3xl">
                {section.heading}
              </h2>
              {section.paragraphs.map((p, i) => (
                <p key={i} className="mt-4 text-base leading-[1.85] text-espresso-70 md:text-lg">
                  {renderWithCitations(p)}
                </p>
              ))}
              {/* "What this means for your dog" box after the second section */}
              {sIdx === 1 && (
                <div className="mt-8 rounded-2xl border border-clinical/30 bg-clinical-tint p-6">
                  <p className="mono-label !text-[11px] text-clinical">
                    {article.meaningBox.title.toUpperCase()}
                  </p>
                  <p className="mt-2 font-serif text-lg leading-relaxed text-espresso">
                    {article.meaningBox.body}
                  </p>
                </div>
              )}
            </section>
          ))}

          {/* Compliance disclaimer */}
          <div className="mt-10 rounded-2xl border border-alert/40 bg-warmwhite p-5">
            <p className="mono-label !text-[10px] leading-relaxed text-alert">
              {BLOG_DISCLAIMER.toUpperCase()}
            </p>
          </div>

          {/* FAQ */}
          <section id="faq" className="mt-14 scroll-mt-28">
            <p className="mono-label !text-[11px] text-amber-deep">{chrome.faqOverline}</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-espresso">
              {chrome.faqTitle}
            </h2>
            <div className="mt-6 divide-y divide-sand rounded-2xl border border-sand bg-warmwhite">
              {article.faq.map((f, i) => (
                <details key={i} className="group p-5" open={i === 0}>
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-4 font-serif text-lg font-semibold text-espresso">
                    {f.q}
                    <span className="mono-data mt-1 shrink-0 !text-[12px] text-amber-deep transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-3 text-base leading-relaxed text-espresso-70">{f.a}</p>
                </details>
              ))}
            </div>
          </section>

          {/* References */}
          <section id="references" className="mt-14 scroll-mt-28">
            <h2 className="flex items-center gap-2 font-serif text-2xl font-semibold text-espresso">
              <FileText className="h-5 w-5 text-clinical" /> {chrome.references}
            </h2>
            <ol className="mt-5 space-y-4">
              {article.citations.map((c, i) => (
                <li
                  key={i}
                  id={`ref-${i + 1}`}
                  className="scroll-mt-28 rounded-xl border border-sand bg-warmwhite p-4"
                >
                  <p className="mono-data !text-[11px] text-amber-deep">[{i + 1}]</p>
                  <p className="mt-1 text-sm leading-relaxed text-espresso">
                    {c.authors}. <em className="italic">“{c.title}.”</em> {c.journal}, {c.year}.
                  </p>
                  <a
                    href={c.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mono-data mt-1.5 inline-block break-all !text-[11px] text-clinical underline hover:text-espresso"
                  >
                    {c.url}
                  </a>
                </li>
              ))}
            </ol>
          </section>

          {/* Related products */}
          <section className="mt-14">
            <h2 className="font-serif text-2xl font-semibold text-espresso">
              {chrome.relatedProducts}
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {article.relatedProducts.map((slug) => (
                <RelatedProductCard key={slug} slug={slug} />
              ))}
            </div>
            <Link
              to="/quiz"
              className="mono-label mt-6 inline-flex items-center gap-2 rounded-full bg-espresso px-6 py-3 !text-[11px] text-cream transition-colors hover:bg-amber-deep"
            >
              {chrome.quizCta} <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </section>

          {/* Related articles */}
          <section className="mt-14">
            <h2 className="font-serif text-2xl font-semibold text-espresso">
              {chrome.relatedArticles}
            </h2>
            <div className="mt-5 grid gap-6 sm:grid-cols-2">
              {related.map((a) => (
                <ArticleCard key={a.slug} article={a} />
              ))}
            </div>
          </section>
        </article>
      </div>
    </div>
  )
}
