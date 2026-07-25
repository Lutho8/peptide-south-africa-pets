import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import Hero from '@/pages/pets/Hero'
import LaunchCatalog from '@/pages/pets/LaunchCatalog'
import QuizTeaser from '@/pages/pets/QuizTeaser'
import GuaranteeBand from '@/pages/pets/GuaranteeBand'
import Testimonials from '@/pages/pets/Testimonials'
import WaitlistSection from '@/pages/pets/WaitlistSection'
import { useConversionCopy } from '@/pages/pets/conversionCopy'

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
 * hero → launch batch shelf → 3-step quiz teaser → proof strip →
 * guarantee → testimonials → waitlist. Education-heavy sections
 * (ScienceStory, PipelineTeaser, Subscriptions detail, FAQ, tickers) remain
 * in the codebase for their routes but no longer clutter the first scroll.
 */
export default function Pets() {
  return (
    <>
      <Hero />
      <LaunchCatalog />
      <QuizTeaser />
      <ProofStrip />
      <GuaranteeBand />
      <Testimonials />
      <WaitlistSection />
    </>
  )
}
