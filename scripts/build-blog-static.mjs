#!/usr/bin/env node
/**
 * build-blog-static.mjs — GEO/crawler insurance.
 *
 * Generates standalone, no-JS static HTML mirrors of every blog article in
 * src/lib/blog.ts into public/blog/<slug>.html. Vercel serves these
 * statically, so non-JS crawlers (AI/GEO bots, link unfurlers) receive the
 * full article text, FAQ and JSON-LD even though the canonical route
 * (/blog/<slug>) is a client-rendered SPA.
 *
 * Run: npm run build:blog   (re-run after any edit to src/lib/blog.ts)
 */
import { execFileSync } from 'node:child_process'
import { mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const TMP = join(ROOT, '.tmp-blog-data.mjs')
const OUT_DIR = join(ROOT, 'public', 'blog')

/* 1 · Bundle src/lib/blog.ts to a plain ESM file node can import. */
execFileSync(
  join(ROOT, 'node_modules', '.bin', 'esbuild'),
  [
    join(ROOT, 'src', 'lib', 'blog.ts'),
    '--bundle',
    '--platform=node',
    '--format=esm',
    `--outfile=${TMP}`,
    '--log-level=warning',
  ],
  { stdio: 'inherit' },
)

const { BLOG_ARTICLES, BLOG_DISCLAIMER, SITE_URL } = await import(
  `${pathToFileURL(TMP).href}?v=${Date.now()}`
)

/* 2 · Rendering helpers. */
const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

/** Convert {{cite:n}} tokens into superscript links to the reference list. */
const withCites = (text) =>
  esc(text).replace(/\{\{cite:(\d+)\}\}/g, (_m, n) => `<sup><a href="#ref-${n}">[${n}]</a></sup>`)

const fmtDate = (iso) =>
  new Date(`${iso}T00:00:00`)
    .toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()

const CSS = `
  :root { --cream:#F7F1E5; --cream2:#EFE6D4; --sand:#E3D5BC; --espresso:#2B2118; --espresso70:#5C5044; --amber:#D97E3F; --amberdeep:#B25E26; --clinical:#1E4D3B; --clinicaltint:#DCE8E0; --alert:#A33B2E; --warmwhite:#FFFDF9; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--cream); color: var(--espresso); font-family: Inter, system-ui, sans-serif; line-height: 1.7; }
  .container { max-width: 1080px; margin: 0 auto; padding: 0 20px; }
  a { color: var(--clinical); }
  .mono { font-family: 'Space Mono', ui-monospace, monospace; font-size: 11px; letter-spacing: .08em; text-transform: uppercase; }
  header.site { border-bottom: 1px solid var(--sand); background: var(--cream); }
  header.site .container { display: flex; justify-content: space-between; align-items: center; padding-top: 14px; padding-bottom: 14px; }
  .brand { font-family: Fraunces, Georgia, serif; font-size: 24px; font-weight: 600; color: var(--espresso); text-decoration: none; }
  .brand span { color: var(--amber); }
  nav.top a { margin-left: 18px; color: var(--espresso70); text-decoration: none; }
  nav.top a:hover { color: var(--amberdeep); }
  .crumb { display: inline-block; margin: 28px 0 0; color: var(--espresso70); text-decoration: none; }
  .chip { display: inline-block; background: var(--clinical); color: var(--cream); border-radius: 999px; padding: 4px 12px; }
  .meta { color: var(--espresso70); }
  h1 { font-family: Fraunces, Georgia, serif; font-size: clamp(28px, 4.5vw, 46px); line-height: 1.15; margin: 16px 0 8px; }
  h2 { font-family: Fraunces, Georgia, serif; font-size: clamp(22px, 3vw, 30px); margin: 40px 0 4px; }
  .hero { width: 100%; border-radius: 20px; border: 1px solid var(--sand); margin: 12px 0 0; }
  .grid { display: grid; grid-template-columns: 240px 1fr; gap: 40px; padding: 32px 0 56px; }
  @media (max-width: 900px) { .grid { grid-template-columns: 1fr; } aside.toc { display: none; } }
  aside.toc nav { position: sticky; top: 24px; background: var(--warmwhite); border: 1px solid var(--sand); border-radius: 16px; padding: 18px; }
  aside.toc a { display: block; color: var(--espresso70); text-decoration: none; font-size: 14px; margin: 8px 0; }
  aside.toc a:hover { color: var(--amberdeep); }
  article p { color: var(--espresso70); font-size: 17px; }
  sup a { color: var(--amberdeep); text-decoration: none; font-family: 'Space Mono', monospace; font-size: 10px; font-weight: 700; }
  .meaning { background: var(--clinicaltint); border: 1px solid rgba(30,77,59,.3); border-radius: 16px; padding: 22px; margin: 28px 0; }
  .meaning p:last-child { font-family: Fraunces, Georgia, serif; font-size: 18px; color: var(--espresso); margin-bottom: 0; }
  .disclaimer { border: 1px solid rgba(163,59,46,.4); background: var(--warmwhite); border-radius: 16px; padding: 18px; margin-top: 36px; color: var(--alert); }
  details { background: var(--warmwhite); border: 1px solid var(--sand); border-radius: 14px; padding: 16px 18px; margin: 10px 0; }
  summary { font-family: Fraunces, Georgia, serif; font-weight: 600; font-size: 17px; cursor: pointer; }
  details p { color: var(--espresso70); }
  ol.refs { padding-left: 0; list-style: none; }
  ol.refs li { background: var(--warmwhite); border: 1px solid var(--sand); border-radius: 12px; padding: 14px 16px; margin: 10px 0; font-size: 14px; }
  ol.refs .url { word-break: break-all; font-family: 'Space Mono', monospace; font-size: 11px; }
  .cta-row a.btn { display: inline-block; background: var(--amber); color: var(--warmwhite); border-radius: 999px; padding: 12px 22px; text-decoration: none; font-family: Fraunces, Georgia, serif; font-weight: 600; margin: 6px 10px 6px 0; }
  .cta-row a.ghost { background: transparent; border: 1px solid var(--espresso); color: var(--espresso); }
  .related { background: var(--warmwhite); border: 1px solid var(--sand); border-radius: 14px; padding: 16px 18px; margin: 10px 0; }
  .related a { font-family: Fraunces, Georgia, serif; font-size: 18px; font-weight: 600; color: var(--espresso); text-decoration: none; }
  .related a:hover { color: var(--amberdeep); }
  footer.site { background: var(--espresso); color: var(--cream); margin-top: 48px; }
  footer.site .container { padding-top: 28px; padding-bottom: 28px; display: flex; flex-wrap: wrap; gap: 18px; justify-content: space-between; }
  footer.site a { color: var(--cream); opacity: .8; text-decoration: none; margin-right: 16px; }
  footer.site a:hover { opacity: 1; color: var(--amber); }
`

function articleJsonLd(a) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: a.title,
    description: a.metaDescription,
    image: `${SITE_URL}${a.heroImage}`,
    datePublished: a.publishDate,
    dateModified: a.modifiedDate,
    author: { '@type': 'Organization', name: 'PSA PETS Editorial', url: `${SITE_URL}/blog` },
    publisher: {
      '@type': 'Organization',
      name: 'PSA PETS',
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/coa-stamp.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}/blog/${a.slug}` },
    keywords: a.keywords.join(', '),
    articleSection: a.category,
    inLanguage: 'en',
  }
}

function faqJsonLd(a) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: a.faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

function render(a, related) {
  const canonical = `${SITE_URL}/blog/${a.slug}`
  const toc = a.sections
    .map((s) => `<a href="#${s.id}">${esc(s.heading)}</a>`)
    .join('\n          ')
  const sections = a.sections
    .map((s, idx) => {
      const paras = s.paragraphs.map((p) => `<p>${withCites(p)}</p>`).join('\n        ')
      const meaning =
        idx === 1
          ? `\n        <div class="meaning">
          <p class="mono" style="color:var(--clinical)">${esc(a.meaningBox.title)}</p>
          <p>${esc(a.meaningBox.body)}</p>
        </div>`
          : ''
      return `<section id="${s.id}">
        <h2>${esc(s.heading)}</h2>
        ${paras}${meaning}
      </section>`
    })
    .join('\n      ')
  const faq = a.faq
    .map(
      (f) => `<details>
        <summary>${esc(f.q)}</summary>
        <p>${esc(f.a)}</p>
      </details>`,
    )
    .join('\n      ')
  const refs = a.citations
    .map(
      (c, i) => `<li id="ref-${i + 1}">
          <span class="mono" style="color:var(--amberdeep)">[${i + 1}]</span>
          ${esc(c.authors)}. <em>&ldquo;${esc(c.title)}.&rdquo;</em> ${esc(c.journal)}, ${c.year}.<br/>
          <a class="url" href="${esc(c.url)}" rel="noreferrer">${esc(c.url)}</a>
        </li>`,
    )
    .join('\n        ')
  const relatedHtml = related
    .map(
      (r) => `<div class="related">
        <p class="mono" style="color:var(--amberdeep)">${esc(r.category)}</p>
        <a href="/blog/${r.slug}.html">${esc(r.title)}</a>
        <p style="color:var(--espresso70);font-size:14px">${esc(r.excerpt)}</p>
      </div>`,
    )
    .join('\n      ')

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(a.title)} | PSA PETS Journal</title>
  <meta name="description" content="${esc(a.metaDescription)}" />
  <meta name="keywords" content="${esc(a.keywords.join(', '))}" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${esc(a.title)}" />
  <meta property="og:description" content="${esc(a.metaDescription)}" />
  <meta property="og:url" content="${canonical}" />
  <meta property="og:image" content="${SITE_URL}${a.heroImage}" />
  <meta property="article:published_time" content="${a.publishDate}" />
  <meta property="article:modified_time" content="${a.modifiedDate}" />
  <meta name="twitter:card" content="summary_large_image" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
  <style>${CSS}</style>
  <script type="application/ld+json">${JSON.stringify(articleJsonLd(a))}</script>
  <script type="application/ld+json">${JSON.stringify(faqJsonLd(a))}</script>
</head>
<body>
  <header class="site">
    <div class="container">
      <a class="brand" href="/pets">PSA<span>&middot;PETS</span></a>
      <nav class="top mono">
        <a href="/pets">Catalog</a>
        <a href="/science">Science</a>
        <a href="/blog">Blog</a>
        <a href="/quiz">Quiz</a>
        <a href="/waitlist">Waitlist</a>
      </nav>
    </div>
  </header>

  <div class="container">
    <a class="crumb mono" href="/blog">&larr; All articles</a>
    <div style="margin-top:16px">
      <span class="chip mono">${esc(a.category)}</span>
      <p class="meta mono">${fmtDate(a.publishDate)} &middot; ${a.readMinutes} min read &middot; Evidence review &middot; PSA PETS Editorial</p>
    </div>
    <h1>${esc(a.title)}</h1>
    <img class="hero" src="${a.heroImage}" alt="${esc(a.heroAlt)}" />
  </div>

  <div class="container grid">
    <aside class="toc">
      <nav>
        <p class="mono" style="color:var(--espresso70)">In this article</p>
        ${toc}
        <a href="#faq">FAQ</a>
        <a href="#references">References</a>
        <p class="mono" style="color:var(--espresso70);margin-top:12px">Superscript numbers link to the reference list.</p>
      </nav>
    </aside>

    <article>
      ${sections}

      <div class="disclaimer mono">${esc(BLOG_DISCLAIMER)}</div>

      <section id="faq">
        <h2>Honest answers.</h2>
        ${faq}
      </section>

      <section id="references">
        <h2>References</h2>
        <ol class="refs">
        ${refs}
        </ol>
      </section>

      <div class="cta-row" style="margin-top:32px">
        <a class="btn" href="/quiz">Take the 60-second pet quiz</a>
        <a class="btn ghost" href="/waitlist">Join the waitlist</a>
      </div>

      <h2>Keep reading</h2>
      ${relatedHtml}
    </article>
  </div>

  <footer class="site">
    <div class="container mono">
      <span>PSA PETS &middot; Cape Town, South Africa</span>
      <span>
        <a href="/pets">Catalog</a>
        <a href="/science">Science</a>
        <a href="/blog">Journal</a>
        <a href="/verify">Verify a batch</a>
        <a href="/waitlist">Waitlist</a>
      </span>
    </div>
  </footer>
</body>
</html>
`
}

/* 3 · Write one mirror per article. */
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true })
let written = 0
for (const a of BLOG_ARTICLES) {
  const sameCat = BLOG_ARTICLES.filter((r) => r.slug !== a.slug && r.category === a.category)
  const rest = BLOG_ARTICLES.filter((r) => r.slug !== a.slug && r.category !== a.category)
  const related = [...sameCat, ...rest].slice(0, 2)
  writeFileSync(join(OUT_DIR, `${a.slug}.html`), render(a, related), 'utf8')
  written += 1
  console.log(`  + public/blog/${a.slug}.html`)
}

rmSync(TMP, { force: true })
console.log(`\nbuild-blog-static: ${written} static article mirrors written to public/blog/`)
