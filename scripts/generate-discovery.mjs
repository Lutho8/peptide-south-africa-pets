#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const PUBLIC = join(ROOT, 'public')

const { BLOG_ARTICLES, BLOG_TAGLINE, BLOG_TITLE, SITE_URL } = await import(
  `${pathToFileURL(join(ROOT, 'src', 'lib', 'blog.ts')).href}?v=${Date.now()}`
)

const esc = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const staticRoutes = [
  ['', 'weekly', '1.0'],
  ['/blog', 'weekly', '0.9'],
  ['/science', 'monthly', '0.8'],
  ['/quiz', 'monthly', '0.8'],
  ['/waitlist', 'monthly', '0.7'],
  ['/verify', 'monthly', '0.6'],
  ['/editorial-policy', 'monthly', '0.6'],
]
const productSlugs = ['bpc-157', 'kpv', 'recovery-blend', 'immune-thymogen', 'mobility-collagen']

const urlRows = [
  ...staticRoutes.map(([path, changefreq, priority]) => ({ path, changefreq, priority })),
  ...BLOG_ARTICLES.map((article) => ({
    path: `/blog/${article.slug}`,
    lastmod: article.modifiedDate,
    changefreq: 'monthly',
    priority: '0.8',
    image: `${SITE_URL}${article.heroImage}`,
    imageTitle: article.title,
  })),
  ...productSlugs.map((slug) => ({ path: `/product/${slug}`, changefreq: 'weekly', priority: '0.8' })),
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlRows.map((row) => `  <url>
    <loc>${esc(`${SITE_URL}${row.path}`)}</loc>${row.lastmod ? `\n    <lastmod>${row.lastmod}</lastmod>` : ''}
    <changefreq>${row.changefreq}</changefreq>
    <priority>${row.priority}</priority>
    <xhtml:link rel="alternate" hreflang="en-ZA" href="${esc(`${SITE_URL}${row.path}`)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${esc(`${SITE_URL}${row.path}`)}" />${row.image ? `\n    <image:image><image:loc>${esc(row.image)}</image:loc><image:title>${esc(row.imageTitle)}</image:title></image:image>` : ''}
  </url>`).join('\n')}
</urlset>
`
writeFileSync(join(PUBLIC, 'sitemap.xml'), sitemap)

const now = Date.now()
const fresh = BLOG_ARTICLES.filter((article) => {
  const published = new Date(`${article.publishDate}T08:00:00+02:00`).getTime()
  return published <= now && now - published <= 48 * 60 * 60 * 1000
})
const news = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${fresh.map((article) => `  <url><loc>${esc(`${SITE_URL}/blog/${article.slug}`)}</loc><news:news><news:publication><news:name>Peptides4Pets Journal</news:name><news:language>en</news:language></news:publication><news:publication_date>${article.publishDate}T08:00:00+02:00</news:publication_date><news:title>${esc(article.title)}</news:title></news:news></url>`).join('\n')}
</urlset>
`
writeFileSync(join(PUBLIC, 'news-sitemap.xml'), news)

const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>
  <title>${esc(BLOG_TITLE)}</title><link>${SITE_URL}/blog</link><description>${esc(BLOG_TAGLINE)}</description><language>en-ZA</language>
  <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
${BLOG_ARTICLES.slice().sort((a, b) => b.publishDate.localeCompare(a.publishDate)).map((article) => `  <item><title>${esc(article.title)}</title><link>${SITE_URL}/blog/${article.slug}</link><guid isPermaLink="true">${SITE_URL}/blog/${article.slug}</guid><pubDate>${new Date(`${article.publishDate}T08:00:00+02:00`).toUTCString()}</pubDate><description>${esc(article.excerpt)}</description></item>`).join('\n')}
</channel></rss>
`
writeFileSync(join(PUBLIC, 'feed.xml'), rss)
console.log(`Discovery files written: ${urlRows.length} canonical URLs, ${BLOG_ARTICLES.length} feed items, ${fresh.length} news URLs.`)
