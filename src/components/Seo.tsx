import { Helmet } from 'react-helmet-async'

export const SITE_URL = 'https://pets.peptide-south-africa.com'

const SITE_NAME = 'Peptides4Pets'
const DEFAULT_IMAGE = `${SITE_URL}/dog-portrait-1.png`

export interface SeoProps {
  title: string
  description: string
  /** Path portion of the canonical URL, e.g. "/science" (home is ""). */
  path?: string
  image?: string
  type?: 'website' | 'article' | 'product'
  jsonLd?: object | object[]
  noindex?: boolean
}

/** Per-page meta + canonical + OG/Twitter + optional JSON-LD. */
export default function Seo({
  title,
  description,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
  noindex = false,
}: SeoProps) {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`
  const canonical = `${SITE_URL}${path}`
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />
      <meta name="robots" content={noindex ? 'noindex,follow' : 'index,follow'} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:image" content={image} />
      <meta property="og:locale" content="en_ZA" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  )
}
