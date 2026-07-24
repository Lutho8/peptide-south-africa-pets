import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const FROM = 'https://peptide-south-africa.com';
const TO = process.env.VITE_SITE_URL || 'https://pets.peptide-south-africa.com';

const rootUrl = new URL('../', import.meta.url);
const targets = [
  'src/components/Layout.tsx',
  'src/lib/blog.ts',
  'public/robots.txt',
  'public/sitemap.xml',
];

let changed = 0;
const rewrite = (url) => {
  if (!existsSync(url)) return;
  const before = readFileSync(url, 'utf8');
  const after = before.replaceAll(FROM, TO);
  if (after !== before) {
    writeFileSync(url, after);
    changed += 1;
    console.log(`[site-url] ${url.pathname.replace(rootUrl.pathname, '')} -> ${TO}`);
  }
};

for (const rel of targets) rewrite(new URL(`../${rel}`, import.meta.url));

const blogDir = new URL('../public/blog/', import.meta.url);
if (existsSync(blogDir)) {
  for (const name of readdirSync(blogDir)) {
    if (name.endsWith('.html')) rewrite(new URL(`../public/blog/${name}`, import.meta.url));
  }
}

console.log(`[site-url] done; ${changed} file(s) updated for build output`);
