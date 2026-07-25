/**
 * Public-asset origin. The pets app can be proxied under
 * peptide-south-africa.com/pets while static assets stay on the pets Vercel
 * origin, avoiding asset 404s on the main domain.
 */
export const ASSET_ORIGIN =
  (import.meta.env.VITE_ASSET_ORIGIN as string | undefined) ??
  'https://pets.peptide-south-africa.com'

export function asset(path: string): string {
  return `${ASSET_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`
}
