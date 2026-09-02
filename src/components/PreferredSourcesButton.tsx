import { useEffect, type MouseEvent } from 'react'
import { ExternalLink, Sparkles } from 'lucide-react'

const PREFERRED_SOURCE_URL =
  'https://www.google.com/preferences/source?q=pets.peptide-south-africa.com'
const PREFERRED_SOURCE_SCRIPT = 'https://news.google.com/swg/js/v1/publisher.js'

type PreferredSourceClient = {
  init: (options: { theme: 'light' | 'dark'; lang: string }) => void
  addPreferredSource: () => void
}

declare global {
  interface Window {
    PREFERRED_SOURCE?: Array<(client: PreferredSourceClient) => void>
  }
}

let preferredSourceClient: PreferredSourceClient | null = null
let loaderStarted = false

function loadPreferredSourceClient() {
  if (typeof window === 'undefined' || loaderStarted) return
  loaderStarted = true
  window.PREFERRED_SOURCE = window.PREFERRED_SOURCE || []
  window.PREFERRED_SOURCE.push((client) => {
    client.init({ theme: 'light', lang: 'en' })
    preferredSourceClient = client
  })

  const script = document.createElement('script')
  script.async = true
  script.src = PREFERRED_SOURCE_SCRIPT
  script.setAttribute('preferred-sources-control', 'manual')
  document.head.appendChild(script)
}

export default function PreferredSourcesButton({ className = '' }: { className?: string }) {
  useEffect(loadPreferredSourceClient, [])

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (!preferredSourceClient) return
    event.preventDefault()
    preferredSourceClient.addPreferredSource()
  }

  return (
    <aside
      aria-label="Follow Peptides4Pets in Google"
      className={`rounded-2xl border border-clinical/25 bg-clinical-tint p-5 ${className}`}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-clinical text-cream">
            <Sparkles className="h-4 w-4" aria-hidden />
          </span>
          <div>
            <p className="font-serif text-lg font-semibold text-espresso">
              Make Peptides4Pets a preferred source on Google
            </p>
            <p className="mt-1 max-w-xl text-sm leading-relaxed text-espresso-70">
              See more of our cited South African pet-health reporting in Google Search and Top Stories when relevant.
            </p>
          </div>
        </div>
        <a
          href={PREFERRED_SOURCE_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          className="mono-label inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-full bg-clinical px-4 py-2 !text-[10px] text-cream hover:bg-espresso"
          aria-label="Add Peptides4Pets as a preferred source on Google"
        >
          Add as preferred source <ExternalLink className="h-3.5 w-3.5" aria-hidden />
        </a>
      </div>
    </aside>
  )
}
