import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { Check, ChevronDown, Plus } from 'lucide-react'
import { PET_PRODUCTS, PRODUCT_DETAILS, formatZAR } from '@/lib/data'
import type { Citation, PetProduct } from '@/lib/data'
import { addToCart } from '@/lib/cart'
import { useI18n } from '@/lib/i18n'
import { useConversionCopy } from './conversionCopy'
import { SectionHeader } from './shared'
import { cn } from '@/lib/utils'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/** Launch-batch products only — pipeline (`comingSoon`) teasers stay off the shelf. */
const LAUNCH_PRODUCTS = PET_PRODUCTS.filter((p) => !p.comingSoon)

/** The 1–2 strongest citations for the card accordion (honesty notes stay on the PDP). */
function keyCitations(slug: string): Citation[] {
  const all = PRODUCT_DETAILS[slug]?.fullCitations ?? []
  const graded = all.filter((c) => !c.honesty)
  return (graded.length > 0 ? graded : all).slice(0, 2)
}

/** Clean CSS vial rendered when a product has no image asset. */
function VialPlaceholder({ name }: { name: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-cream-2" aria-hidden="true">
      <div className="flex flex-col items-center">
        <div className="h-2 w-10 rounded-t-sm bg-espresso/70" />
        <div className="flex h-28 w-16 flex-col justify-end rounded-b-xl border border-espresso/25 bg-warmwhite p-1.5 shadow-inner">
          <div className="h-3/5 rounded-b-lg bg-amber/25" />
        </div>
        <span className="mono-label mt-3 !text-[9px] text-espresso-70">{name}</span>
      </div>
    </div>
  )
}

/** Bold rounded-xl primary Add — reservation cart, never opens the drawer. */
function AddButton({ slug }: { slug: string }) {
  const copy = useConversionCopy()
  const [added, setAdded] = useState(false)

  function handleAdd() {
    addToCart(slug)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={cn(
        'inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl px-5 py-3.5 font-serif text-base font-bold transition-all',
        added
          ? 'bg-clinical text-cream'
          : 'bg-amber text-warmwhite hover:bg-amber-deep active:scale-[0.98]',
      )}
    >
      {added ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
      {added ? copy.launchAdded : copy.launchAdd}
    </button>
  )
}

function LaunchCard({ product, index }: { product: PetProduct; index: number }) {
  const { t } = useI18n()
  const copy = useConversionCopy()
  const cites = keyCitations(product.slug)

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: EASE, delay: index * 0.06 }}
      className="flex w-[260px] shrink-0 snap-start flex-col rounded-2xl border border-sand bg-background shadow-card transition-all duration-300 hover:-translate-y-1.5 hover:shadow-card-hover md:w-auto"
    >
      {/* square vial area */}
      <div className="relative aspect-square overflow-hidden rounded-t-2xl">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        ) : (
          <VialPlaceholder name={product.name} />
        )}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          <span className="mono-label coming-soon-pulse rounded-full bg-espresso px-2.5 py-1 !text-[9px] text-cream">
            {t('badge.comingSoon')}
          </span>
          <span className="mono-label rounded-full border border-espresso/15 bg-warmwhite/90 px-2.5 py-1 !text-[9px] text-clinical backdrop-blur-sm">
            {copy.launchHplc}
          </span>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div>
          <h3 className="font-serif text-lg font-semibold leading-tight text-espresso">
            {product.name}
          </h3>
          <p className="mt-1 text-sm leading-snug text-espresso-70">{product.benefit}</p>
        </div>
        <p className="mono-data font-bold text-espresso">
          {formatZAR(product.price)}
          <span className="font-normal text-espresso-70">{product.priceUnit}</span>
        </p>

        <div className="mt-auto pt-2">
          <AddButton slug={product.slug} />
          <Link
            to={`/product/${product.slug}`}
            className="mono-label link-underline mt-3 inline-block !text-[10px] text-espresso-70 hover:text-amber-deep"
          >
            {copy.launchDetails}
          </Link>

          {cites.length > 0 && (
            <details className="group mt-3 border-t border-sand pt-2.5">
              <summary className="mono-label flex cursor-pointer list-none items-center justify-between !text-[9px] text-espresso-70 [&::-webkit-details-marker]:hidden">
                {copy.launchCitations.replace('{count}', String(cites.length))}
                <ChevronDown className="h-3 w-3 transition-transform duration-300 group-open:rotate-180" />
              </summary>
              <ul className="mt-2 space-y-2">
                {cites.map((c) => (
                  <li key={c.badge} className="text-[11px] leading-snug text-espresso-70">
                    <span className="mono-label mr-1.5 !text-[8px] text-amber-deep">{c.badge}</span>
                    {c.summary}
                    {c.source && (
                      <span className="mono-data mt-0.5 block !text-[9px] uppercase text-espresso-70/70">
                        {c.source}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </details>
          )}
        </div>
      </div>
    </motion.article>
  )
}

/**
 * The launch batch — a main-site-style conversion shelf. Mobile: horizontal
 * snap rail (~260px cards); desktop: grid. Add buttons reserve into the cart
 * without opening the drawer.
 */
export default function LaunchCatalog() {
  const copy = useConversionCopy()
  return (
    <section id="launch" className="section-pad bg-cream">
      <div className="psa-container">
        <SectionHeader
          overline={copy.launchOverline}
          title={copy.launchTitle}
          sub={copy.launchSub}
        />
        <div className="-mx-4 mt-12 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 md:mx-0 md:grid md:snap-none md:grid-cols-3 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-5">
          {LAUNCH_PRODUCTS.map((p, i) => (
            <LaunchCard key={p.slug} product={p} index={i} />
          ))}
        </div>
        <p className="mono-data mt-6 !text-[11px] uppercase tracking-[0.06em] text-espresso-70">
          {copy.launchNote}
        </p>
      </div>
    </section>
  )
}
