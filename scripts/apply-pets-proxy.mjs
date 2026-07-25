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
  return ```\u0060``
}
`);
