import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import type { BlogArticle } from '@/lib/blog'
import { PRODUCTS, getPetProduct } from '@/lib/data'
import { fmtDate, useBlogChrome } from '@/lib/blogChrome'

/* --------------------------- product CTA ---------------------------- */

export function RelatedProductCard({ slug }: { slug: string }) {
  const chrome = useBlogChrome()
  const product = getPetProduct(slug)
  const hasPdp = PRODUCTS.some((p) => p.slug === slug)
  if (!product) return null
  const to = hasPdp ? `/product/${slug}` : '/waitlist'
  return (
    <Link
      to={to}
      className="group flex items-center gap-4 rounded-2xl border border-sand bg-warmwhite p-4 transition-colors hover:border-amber"
    >
      <img
        src={product.image}
        alt={product.name}
        className="h-16 w-16 shrink-0 rounded-xl border border-sand object-cover"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <p className="mono-label !text-[10px] text-amber-deep">
          {product.comingSoon ? chrome.inDevelopment : chrome.comingSoon}
        </p>
        <p className="mt-1 truncate font-serif text-lg font-semibold text-espresso group-hover:text-amber-deep">
          {product.name}
        </p>
        <p className="mono-data !text-[10px] text-espresso-70">{product.spec}</p>
      </div>
      <span className="mono-label flex shrink-0 items-center gap-1 !text-[10px] text-espresso-70 group-hover:text-amber-deep">
        {hasPdp ? chrome.viewProduct : chrome.joinWaitlist}
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  )
}

/* --------------------------- article card --------------------------- */

export function ArticleCard({ article }: { article: BlogArticle }) {
  const chrome = useBlogChrome()
  return (
    <Link
      to={`/blog/${article.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-sand bg-warmwhite transition-all hover:-translate-y-1 hover:border-amber hover:shadow-[0_12px_40px_-12px_rgba(43,33,24,0.25)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden bg-cream-2">
        <img
          src={article.heroImage}
          alt={article.heroAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          loading="lazy"
        />
        <span className="mono-label absolute left-3 top-3 rounded-full bg-espresso/85 px-3 py-1 !text-[10px] text-cream">
          {article.category.toUpperCase()}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="mono-data !text-[10px] text-espresso-70">
          {fmtDate(article.publishDate)} · {chrome.minRead(article.readMinutes)} ·{' '}
          {chrome.evidenceReview}
        </p>
        <h3 className="mt-2 font-serif text-xl font-semibold leading-snug text-espresso group-hover:text-amber-deep">
          {article.title}
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-espresso-70">{article.excerpt}</p>
        <span className="mono-label mt-4 inline-flex items-center gap-1.5 !text-[11px] text-amber-deep">
          {chrome.readReview} <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}
