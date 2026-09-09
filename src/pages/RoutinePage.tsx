import { useEffect } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useLocation } from 'react-router'
import Seo from '@/components/Seo'
import { asset } from '@/lib/asset'
import { waLink } from '@/lib/data'
import { getUtmFromUrl } from '@/lib/supabase'
import { trackPets } from '@/lib/analytics'
import { HOOK_MEDIA } from '@/pages/routineMedia'
import type { HookId, HookMedia } from '@/pages/routineMedia'

/**
 * META-PETS-001/003 Facebook→WhatsApp bridge page. One page, three hook
 * entry anchors (matches the ad copy matrix in
 * PLANS/META_PETS_001_CAMPAIGN_BRIEF_2026_09_09.md) so each ad variant can
 * deep-link straight to its own section via #hook-mobility / #hook-comfort
 * / #hook-nextstep. Deliberately rendered outside <Layout/> — no navbar,
 * footer or catalog links — so a paid-traffic visitor can't wander into the
 * rest of the site's non-launch product catalogue from here (strict
 * pathway separation).
 *
 * Guardrails (binding, see campaign brief): no restricted product/compound
 * names, no unproven-outcome language, no before/after causation claims.
 * Mobility Collagen may be named only as something to discuss on WhatsApp,
 * never as the cause of the dog's story. Enforced by
 * scripts/check-research-boundary.mjs — that script's word list is the
 * source of truth; don't reintroduce a listed word even in a comment here.
 */

interface Hook {
  id: HookId
  headline: string
  story: string
  /** Short human-readable tag appended to the WhatsApp message so an agent
   * can attribute the reply to a hook without CRM/ctwa_clid access. */
  ref: string
}

const HOOKS: Hook[] = [
  {
    id: 'hook-mobility',
    headline: "A Dog's Mobility Routine, Observed",
    story:
      "Watching a dog slow down on stairs is hard to see. We've been keeping notes on our own dog's daily routine — what we do, and when. If you're curious about your own dog's routine, our team will walk through it with you on WhatsApp — no pressure, just a conversation.",
    ref: 'MOBILITY',
  },
  {
    id: 'hook-comfort',
    headline: 'A Calmer Evening Routine',
    story:
      "Stiff getting up, slower to settle after a walk — every dog owner recognises it. We've been following a routine for our dog's evenings and keeping notes on how it's going. Want to see what's in it? Message us on WhatsApp and we'll share exactly what we do.",
    ref: 'COMFORT',
  },
  {
    id: 'hook-nextstep',
    headline: "Ask Us About Your Dog's Mobility Routine",
    story:
      "Not sure what your dog's mobility routine could look like? Send us a message on WhatsApp — a few quick questions about your dog, then we'll talk through the options together.",
    ref: 'NEXTSTEP',
  },
]

/** Renders the matching cut once Studio delivers it; a labelled placeholder
 * until then — never borrows an unrelated stock image for the dog's story. */
function HookMediaSlot({ media, alt }: { media: HookMedia; alt: string }) {
  if (media.video) {
    return (
      <video
        className="h-full w-full object-cover"
        src={media.video}
        poster={media.poster}
        controls
        playsInline
        preload="metadata"
      />
    )
  }
  if (media.poster) {
    return <img src={media.poster} alt={alt} loading="lazy" className="h-full w-full object-cover" />
  }
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-cream-2 px-4 text-center">
      <span className="mono-label !text-[10px] text-espresso-70">RECOVERY-ROUTINE CLIP</span>
      <span className="mono-data !text-[10px] uppercase tracking-[0.06em] text-espresso-70/70">
        Awaiting final cut from Studio
      </span>
    </div>
  )
}

function HookSection({ hook, index, utm }: { hook: Hook; index: number; utm: Record<string, string> | null }) {
  const message = `Hi! I saw the "${hook.headline}" post about my dog's routine and wanted to chat. (Ref: ${hook.ref})`

  function handleWhatsAppClick() {
    trackPets('pets_whatsapp_click', {
      hook: hook.id,
      ...(utm ?? {}),
    })
  }

  return (
    <section
      id={hook.id}
      className="scroll-mt-6 border-b border-sand bg-cream py-14 last:border-b-0 md:py-20"
    >
      <div className="psa-container grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
        <div className={index % 2 === 1 ? 'md:order-2' : undefined}>
          <div className="aspect-[9/16] max-w-sm overflow-hidden rounded-2xl border border-sand shadow-card md:max-w-none">
            <HookMediaSlot media={HOOK_MEDIA[hook.id]} alt={hook.headline} />
          </div>
        </div>
        <div className={index % 2 === 1 ? 'md:order-1' : undefined}>
          <h2 className="font-serif text-[clamp(1.7rem,3.4vw,2.6rem)] font-medium leading-[1.1] text-espresso">
            {hook.headline}
          </h2>
          <p className="mt-4 max-w-xl leading-relaxed text-espresso-70">{hook.story}</p>
          <p className="mono-label mt-5 !text-[10px] text-espresso-70/80">
            This is not veterinary advice. Every dog's routine and mobility needs vary — always
            check with your own vet.
          </p>
          <p className="mt-2 max-w-xl text-sm text-espresso-70">
            Our team can also walk you through Mobility Collagen if it's relevant to your dog —
            that's something to consider together on WhatsApp, not something this page claims
            fixed anything.
          </p>
          <a
            href={waLink(message)}
            target="_blank"
            rel="noreferrer"
            onClick={handleWhatsAppClick}
            className="mono-label mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-clinical px-6 py-3.5 !text-[12px] text-cream transition-colors hover:bg-clinical/90"
          >
            <img src={asset('/icon-whatsapp.svg')} alt="" className="h-4 w-4 invert" />
            Chat with our team on WhatsApp
          </a>
        </div>
      </div>
    </section>
  )
}

export default function RoutinePage() {
  const location = useLocation()
  const utm = getUtmFromUrl()

  useEffect(() => {
    trackPets('pets_bridge_viewed', {
      entry_hook: location.hash ? location.hash.slice(1) : 'top',
      ...(utm ?? {}),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!location.hash) return
    const el = document.getElementById(location.hash.slice(1))
    el?.scrollIntoView({ behavior: 'instant' as ScrollBehavior, block: 'start' })
  }, [location.hash])

  return (
    <HelmetProvider>
      <Seo
        title="A Dog's Mobility Routine"
        description="One dog owner's mobility and comfort routine — chat with our team on WhatsApp about your dog's own routine."
        path="/routine"
        noindex
      />
      <div className="min-h-[100dvh] bg-cream">
        <header className="border-b border-sand py-6">
          <div className="psa-container flex items-center gap-2.5">
            {/* Icon-only mark — the horizontal lockup spells out the brand
                name as an image and this page must not show that text. */}
            <img src={asset('/psa-icon-square.png')} alt="Brand mark" className="h-8 w-8" />
          </div>
        </header>
        <main>
          {HOOKS.map((hook, i) => (
            <HookSection key={hook.id} hook={hook} index={i} utm={utm} />
          ))}
        </main>
        <footer className="border-t border-sand bg-cream px-4 py-6 text-center">
          <p className="mono-data !text-[10px] uppercase tracking-[0.06em] text-espresso-70/70">
            Cape Town, South Africa · Mobility Collagen is a nutritional supplement, not a
            veterinary medicine.
          </p>
        </footer>
        <Analytics />
        <SpeedInsights />
      </div>
    </HelmetProvider>
  )
}
