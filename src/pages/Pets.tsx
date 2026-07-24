import Hero from '@/pages/pets/Hero'
import TrustStrip from '@/pages/pets/TrustStrip'
import CoaStrip from '@/pages/pets/CoaStrip'
import ProofTicker from '@/pages/pets/ProofTicker'
import ScienceStory from '@/pages/pets/ScienceStory'
import PinnedVial from '@/pages/pets/PinnedVial'
import Catalog from '@/pages/pets/Catalog'
import PipelineTeaser from '@/pages/pets/PipelineTeaser'
import Subscriptions from '@/pages/pets/Subscriptions'
import GuaranteeBand from '@/pages/pets/GuaranteeBand'
import FoundingRing from '@/pages/pets/FoundingRing'
import WaitlistSection from '@/pages/pets/WaitlistSection'
import Testimonials from '@/pages/pets/Testimonials'
import Credibility from '@/pages/pets/Credibility'
import Honesty from '@/pages/pets/Honesty'
import Faq from '@/pages/pets/Faq'
import ConversionBar from '@/pages/pets/ConversionBar'
import ExitToast from '@/pages/pets/ExitToast'

/**
 * /pets landing — all 13 sections (pets.md) plus conversion upgrades:
 * social-proof ticker after the hero, founding-capacity ring before the
 * waitlist, sticky bottom conversion bar, and exit-intent-lite toast.
 * Sections 1–2 (announcement bar, navbar) and 13 (compliance strip, breadcrumb,
 * footer) are global chrome living in Navbar/Footer via Layout.
 */
export default function Pets() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CoaStrip />
      <ProofTicker />
      <ScienceStory />
      <PinnedVial />
      <Catalog />
      <PipelineTeaser />
      <Subscriptions />
      <GuaranteeBand />
      <FoundingRing />
      <WaitlistSection />
      <Testimonials />
      <Credibility />
      <Honesty />
      <Faq />
      <ConversionBar />
      <ExitToast />
    </>
  )
}
