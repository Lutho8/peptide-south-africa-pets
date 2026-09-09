/**
 * Recovery-routine clips for the /routine bridge page (see RoutinePage.tsx).
 * PSA Studio: drop each hook's cut + poster into `public/routine/` and set
 * the matching path below — no other code change needed. Empty entries
 * render a labelled placeholder instead of borrowing an unrelated stock
 * image, so the page never implies stock photography is the founder's dog.
 */
export type HookId = 'hook-mobility' | 'hook-comfort' | 'hook-nextstep'

export interface HookMedia {
  /** Path under /public, e.g. '/routine/hook-mobility.mp4'. */
  video?: string
  /** Poster/still shown before play or as the day-1 fallback. */
  poster?: string
}

export const HOOK_MEDIA: Record<HookId, HookMedia> = {
  'hook-mobility': {},
  'hook-comfort': {},
  'hook-nextstep': {},
}
