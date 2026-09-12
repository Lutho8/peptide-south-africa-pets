import { build } from 'vite'
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { pathToFileURL } from 'node:url'

const DIST = resolve('dist')
const TMP = resolve('.ssr-tmp')
const staticRoutes = ['/', '/blog', '/science', '/quiz', '/verify', '/editorial-policy', '/cookies', '/privacy', '/terms', '/returns']
const productRoutes = ['bpc-157', 'kpv', 'recovery-blend', 'immune-thymogen', 'mobility-collagen'].map(
  (slug) => `/product/${slug}`,
)

const { BLOG_ARTICLES } = await import(
  `${pathToFileURL(resolve('src/lib/blog.ts')).href}?v=${Date.now()}`
)
const blogRoutes = BLOG_ARTICLES.map((article) => `/blog/${article.slug}`)
const routes = [...staticRoutes, ...productRoutes, ...blogRoutes]

await build({
  logLevel: 'error',
  publicDir: false,
  build: {
    ssr: resolve('src/entry-server.tsx'),
    outDir: TMP,
    emptyOutDir: true,
    ssrEmitAssets: false,
    rollupOptions: { output: { entryFileNames: 'entry-server.mjs' } },
  },
})

const { render } = await import(pathToFileURL(resolve(TMP, 'entry-server.mjs')).href)
const template = readFileSync(resolve(DIST, 'index.html'), 'utf8')
const failures = []
let ok = 0

for (const route of routes) {
  try {
    const { html, head } = await render(route)
    let page = template.replace(
      '<div id="root"></div>',
      `<div id="root" data-prerender-path="${route}">${html}</div>`,
    )
    const headTags = [head.title, head.meta, head.link, head.script].filter(Boolean).join('\n    ')
    if (headTags) {
      page = page.replace(/<title>.*?<\/title>/s, '')
      page = page.replace(/\n?\s*<link rel="canonical"[^>]*>/gi, '')
      page = page.replace(/\n?\s*<link rel="alternate" hreflang="[^"]+"[^>]*>/gi, '')
      page = page.replace(/\n?\s*<meta property="og:(?:title|description|url|type|site_name|locale|image)"[^>]*>/gi, '')
      page = page.replace(/\n?\s*<meta name="twitter:(?:card|title|description|image)"[^>]*>/gi, '')
      page = page.replace(/\n?\s*<meta name="description"[^>]*>/gi, '')
      page = page.replace('</head>', `    ${headTags}\n  </head>`)
    }
    const outPath = route === '/'
      ? resolve(DIST, 'index.html')
      : resolve(DIST, route.replace(/^\//, ''), 'index.html')
    mkdirSync(dirname(outPath), { recursive: true })
    writeFileSync(outPath, page)
    ok += 1
  } catch (error) {
    failures.push({ route, error: error?.message ?? String(error) })
  }
}

rmSync(TMP, { recursive: true, force: true })
console.log(`Prerendered ${ok}/${routes.length} Pets SEO routes.`)
if (failures.length) {
  for (const failure of failures) console.error(`${failure.route}: ${failure.error}`)
  process.exitCode = 1
}
