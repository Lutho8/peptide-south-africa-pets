import { readFileSync } from 'node:fs'
import assert from 'node:assert/strict'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const sitemap = read('public/sitemap.xml')
const news = read('public/news-sitemap.xml')
const feed = read('public/feed.xml')
const articlePage = read('src/pages/BlogArticlePage.tsx')
const blog = read('src/lib/blog.ts')
const app = read('src/App.tsx')

assert.match(app, /editorial-policy/)
assert.match(articlePage, /BlogPosting/)
assert.match(articlePage, /citation: article\.citations/)
assert.match(articlePage, /max-image-preview:large/)
assert.match(articlePage, /PreferredSourcesButton/)
assert.match(sitemap, /\/editorial-policy/)
assert.doesNotMatch(sitemap, /\.html<\/loc>/)
assert.match(feed, /<rss version="2\.0"/)
assert.match(news, /google\.com\/schemas\/sitemap-news/)
assert.doesNotMatch(blog, /half the labelled dose|sold legally as a research|how to experiment responsibly/i)
assert.match(blog, /sahpra\.org\.za\/peptide-products-public-information/)

console.log('SEO authority checks passed.')
