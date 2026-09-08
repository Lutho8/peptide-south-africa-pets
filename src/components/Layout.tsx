import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router'
import { Helmet } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import { syncPendingSubmissions } from '@/lib/supabase'
import { I18nProvider } from '@/lib/i18n'

const SITE_URL = 'https://pets.peptide-south-africa.com'

/** Sitewide default meta; individual pages (blog, PDPs) override via Helmet. */
function DefaultMeta({ pathname }: { pathname: string }) {
  const isHome = pathname === '/' || pathname === '/pets'
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Peptides4Pets',
        alternateName: 'Peptides4Pets by Peptide South Africa',
        url: SITE_URL,
        logo: `${SITE_URL}/coa-stamp.svg`,
        description:
          "An evidence-led South African pet research platform with Mobility Collagen as a clearly separated nutritional product.",
        contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', areaServed: 'ZA' },
      },
      {
        '@type': 'WebSite',
        name: 'Peptides4Pets',
        url: SITE_URL,
        publisher: { '@type': 'Organization', name: 'Peptides4Pets' },
      },
    ],
  }
  return (
    <Helmet>
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
    <I18nProvider>
      <div className="min-h-[100dvh] bg-cream">
        <DefaultMeta pathname={pathname} />
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
        <CartDrawer />
        <Analytics />
        <SpeedInsights />
      </div>
    </I18nProvider>
  )
}
