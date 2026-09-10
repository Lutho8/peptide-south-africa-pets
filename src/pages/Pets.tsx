import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import Hero from '@/pages/pets/Hero'
import LaunchCatalog from '@/pages/pets/LaunchCatalog'
import QuizTeaser from '@/pages/pets/QuizTeaser'
import { BLOG_ARTICLES } from '@/lib/blog'
import { ArticleCard } from '@/components/BlogShared'
import { useConversionCopy } from '@/pages/pets/conversionCopy'
import Seo from '@/components/Seo'

/**
 * Slim proof strip — one line of evidence signals plus a door into the full
 * science library. Long-form education/citations live on /science and the
 * blog, deliberately out of the primary conversion path.
 */
function ProofStrip() {
  const copy = useConversionCopy()
  return (
    <section className="bg-cream py-10">
      <div className="psa-container flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <p className="mono-label !text-[11px] text-espresso-70">{copy.proofLine}</p>
        <Link
          to="/science"
          className="mono-label link-underline inline-flex items-center gap-2 !text-[11px] text-amber-deep"
        >
          {copy.proofLink}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </section>
  )
}

/**
 * /pets landing — simplified, product-first conversion path:
 * hero → nutrition/research shelf → catalogue navigator → proof strip → waitlist.
 * Outcome guarantees and anecdotal treatment stories stay off the commercial path.
 * (ScienceStory, PipelineTeaser, Subscriptions detail, FAQ, tickers) remain
 * in the codebase for their routes but no longer clutter the first scroll.
 */
export default function Pets() {
  return (
    <>
      <Seo
        title="Peptides4Pets — Evidence-Led Pet Research & Mobility Collagen"
        description="Mobility Collagen for South African pets, with transparent documentation. Experimental peptide profiles are research information only and not offered for animal administration."
        path=""
      />
      <Hero />
      <LaunchCatalog />
      <QuizTeaser />
      <ProofStrip />
      <section className="psa-container py-16"><h2 className="font-serif text-3xl">The South African pet journal</h2><p className="mt-3 text-espresso-70">Evidence and practical questions to discuss with your veterinarian.</p><div className="mt-8 grid gap-6 md:grid-cols-2">{BLOG_ARTICLES.slice(0, 2).map(article => <ArticleCard key={article.slug} article={article} />)}</div><Link to="/blog" className="mt-6 inline-block underline">Read all articles</Link></section>
    </>
  )
}
