import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import { syncPendingSubmissions } from '@/lib/supabase'
import { I18nProvider } from '@/lib/i18n'

const SITE_URL = 'https://peptide-south-africa.com'

/** Sitewide default meta; individual pages (blog, PDPs) override via Helmet. */
function DefaultMeta({ pathname }: { pathname: string }) {
  const isHome = pathname === '/' || pathname === '/pets'
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'PSA PETS',
        alternateName: 'Peptide South Africa — Pets',
        url: SITE_URL,
        logo: `${SITE_URL}/coa-stamp.svg`,
        description:
          "South Africa's first COA-verified pet peptide line — research-grade peptides and collagen for dogs, cats and horses.",
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', areaServed: 'ZA' },
      },
      {
        '@type': 'WebSite',
        name: 'PSA PETS',
        url: SITE_URL,
        publisher: { '@type': 'Organization', name: 'PSA PETS' },
      },
    ],
  }
  return (
    <Helmet>
      <title>PSA PETS — COA-Verified Peptides & Collagen for Dogs, Cats & Horses | South Africa</title>
      <meta
        name="description"
        content="South Africa's first COA-verified pet peptide line: BPC-157, KPV, collagen and more — HPLC-tested, vet-reviewed, VAT included. Join the waitlist."
      />
      <link rel="canonical" href={`${SITE_URL}${pathname === '/' ? '' : pathname}`} />
      <meta property="og:site_name" content="PSA PETS" />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${SITE_URL}${pathname === '/' ? '' : pathname}`} />
      <meta name="twitter:card" content="summary_large_image" />
      {isHome && <script type="application/ld+json">{JSON.stringify(orgJsonLd)}</script>}
    </Helmet>
  )
}

gsap.registerPlugin(ScrollTrigger)

/** Nested-route layout (pattern B): renders <Outlet/>. Owns Lenis smooth scroll sitewide. */
export default function Layout() {
  const { pathname } = useLocation()

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1.0 })
    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)
    return () => {
      gsap.ticker.remove(raf)
      lenis.destroy()
    }
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    ScrollTrigger.refresh()
  }, [pathname])

  // Silently retry any Supabase writes queued offline (psa_pets_pending_sync).
  useEffect(() => {
    syncPendingSubmissions()
  }, [])

  return (
    <HelmetProvider>
      <I18nProvider>
        <div className="min-h-[100dvh] bg-cream">
          <DefaultMeta pathname={pathname} />
          <Navbar />
          <main>
            <Outlet />
          </main>
          <Footer />
          <CartDrawer />
        </div>
      </I18nProvider>
    </HelmetProvider>
  )
}
