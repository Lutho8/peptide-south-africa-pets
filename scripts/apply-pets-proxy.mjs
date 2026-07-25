/**
 * Build-time transform for serving the pets app under peptide-south-africa.com/pets.
 * Keeps static assets on the pets Vercel origin and makes the router accept both
 * `/` (pets subdomain) and `/pets` (main-domain proxy).
 */
import { readFileSync, readdirSync, writeFileSync } from 'node:fs';

const read = (rel) => readFileSync(new URL(`../${rel}`, import.meta.url), 'utf8');
const write = (rel, s) => writeFileSync(new URL(`../${rel}`, import.meta.url), s);
const ORIGIN = process.env.VITE_ASSET_ORIGIN || 'https://pets.peptide-south-africa.com';

// 1) asset helper
write('src/lib/asset.ts', `/**
 * Public-asset origin. The pets app can be proxied under
 * peptide-south-africa.com/pets while static assets stay on the pets Vercel
 * origin, avoiding asset 404s on the main domain.
 */
export const ASSET_ORIGIN =
  (import.meta.env.VITE_ASSET_ORIGIN as string | undefined) ??
  '${ORIGIN}'

export function asset(path: string): string {
  return \`\${ASSET_ORIGIN}\${path.startsWith('/') ? path : \`/\${path}\`}\`
}
`);

// 2) dynamic router basename
const mainRel = 'src/main.tsx';
let main = read(mainRel);
if (!main.includes("startsWith('/pets/')")) {
  main = main.replace(
    "import App from './App.tsx'\n",
    "import App from './App.tsx'\n\nconst basename =\n  window.location.pathname === '/pets' || window.location.pathname.startsWith('/pets/')\n    ? '/pets'\n    : '/'\n",
  );
  main = main.replace('<BrowserRouter>', '<BrowserRouter basename={basename}>');
  write(mainRel, main);
}

// 3) absolute built JS/CSS origin
const viteRel = 'vite.config.ts';
let vite = read(viteRel);
if (!vite.includes(`base: '${ORIGIN}/'`)) {
  vite = vite.replace(/base:\s*['"][^'"]*['"],/, `base: '${ORIGIN}/',`);
  write(viteRel, vite);
}

// 4) favicon absolute
const htmlRel = 'index.html';
let html = read(htmlRel);
const absFavicon = `href="${ORIGIN}/favicon-dog.png"`;
if (!html.includes(absFavicon)) {
  html = html.replace(/href="\/favicon-dog\.png"|href="https:\/\/pets\.peptide-south-africa\.com\/favicon-dog\.png"/, absFavicon);
  write(htmlRel, html);
}

// 5) root public asset references -> asset('/...')
const exts = '(?:png|jpe?g|webp|gif|svg|mp4|webm|mp3|wav|txt|xml|ico)';
const attr = new RegExp(`\\b(src|poster)=(["'])(/(?:[^"']*?\\.${exts}))\\2`, 'g');
const prop = new RegExp(`\\b(image|heroImage|src|poster):\\s*(["'])(/(?:[^"']*?\\.${exts}))\\2`, 'g');
const walk = (dir) => readdirSync(new URL(`../${dir}`, import.meta.url), { withFileTypes: true }).flatMap((d) => {
  const rel = `${dir}/${d.name}`;
  return d.isDirectory() ? walk(rel) : [rel];
});
let changed = 0;
for (const rel of walk('src')) {
  if (!/\.tsx?$/.test(rel) || rel === 'src/lib/asset.ts') continue;
  const before = read(rel);
  let s = before;
  s = s.replace(attr, (_m, a, _q, p) => `${a}={asset('${p}')}`);
  s = s.replace(prop, (_m, k, _q, p) => `${k}: asset('${p}')`);
  if (s !== before) {
    if (!s.includes("from '@/lib/asset'")) {
      const lines = s.split('\n');
      let insert = 0;
      for (let i = 0; i < lines.length; i += 1) if (lines[i].startsWith('import ')) insert = i + 1;
      lines.splice(insert, 0, "import { asset } from '@/lib/asset'");
      s = lines.join('\n');
    }
    write(rel, s);
    changed += 1;
  }
}
console.log(`[pets-proxy] origin=${ORIGIN}; asset refs updated in ${changed} file(s)`);
