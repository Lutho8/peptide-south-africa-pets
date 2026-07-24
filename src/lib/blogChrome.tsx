import type { ReactNode } from 'react'
import { useI18n } from '@/lib/i18n'

/* --------------------- bilingual blog chrome --------------------- */
/* Article bodies are EN-only; chrome/labels follow the site locale. */

const CHROME = {
  en: {
    evidenceReview: 'EVIDENCE REVIEW',
    minRead: (n: number) => `${n} MIN READ`,
    toc: 'IN THIS ARTICLE',
    references: 'References',
    faqTitle: 'Honest answers.',
    faqOverline: 'FAQ',
    relatedProducts: 'Related formulas — in development',
    relatedArticles: 'Keep reading',
    comingSoon: 'COMING SOON',
    inDevelopment: 'IN DEVELOPMENT',
    viewProduct: 'View formula',
    joinWaitlist: 'Join the waitlist',
    quizCta: 'Not sure where to start? Take the 60-second pet quiz →',
    backToBlog: '← All articles',
    published: 'PUBLISHED',
    updated: 'UPDATED',
    byline: 'PSA PETS EDITORIAL',
    meaningDefault: 'What this means for your dog',
    saAngle: 'South Africa angle',
    citeNote: 'Superscript numbers link to the reference list below.',
    readReview: 'READ THE REVIEW',
  },
  af: {
    evidenceReview: 'BEWYS-OORSIG',
    minRead: (n: number) => `${n} MIN LEES`,
    toc: 'IN HIERDIE ARTIKEL',
    references: 'Verwysings',
    faqTitle: 'Eerlike antwoorde.',
    faqOverline: 'VRAE',
    relatedProducts: 'Verwante formules — in ontwikkeling',
    relatedArticles: 'Lees verder',
    comingSoon: 'KOM BINNEKORT',
    inDevelopment: 'IN ONTWIKKELING',
    viewProduct: 'Sien formule',
    joinWaitlist: 'Sluit by waglys aan',
    quizCta: 'Onseker waar om te begin? Doen die 60-sekonde quiz →',
    backToBlog: '← Alle artikels',
    published: 'GEPUBLISEER',
    updated: 'BYGEWERK',
    byline: 'PSA PETS-REDAKSIE',
    meaningDefault: 'Wat dit vir jou hond beteken',
    saAngle: 'Suid-Afrika-hoek',
    citeNote: 'Boskrifnommers skakel na die verwysingslys hieronder.',
    readReview: 'LEES DIE OORSIG',
  },
} as const

export function useBlogChrome() {
  const { locale } = useI18n()
  return CHROME[locale === 'af' ? 'af' : 'en']
}

/** Format an ISO date for the mono metadata row. */
export function fmtDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`)
  return d
    .toLocaleDateString('en-ZA', { day: '2-digit', month: 'short', year: 'numeric' })
    .toUpperCase()
}

/**
 * Render paragraph text, converting `{{cite:n}}` tokens into superscript
 * links that jump to the numbered reference list.
 */
export function renderWithCitations(text: string): ReactNode[] {
  return text.split(/(\{\{cite:\d+\}\})/g).map((part, i) => {
    const m = part.match(/^\{\{cite:(\d+)\}\}$/)
    if (!m) return <span key={i}>{part}</span>
    return (
      <sup key={i} className="ml-0.5">
        <a
          href={`#ref-${m[1]}`}
          className="mono-data !text-[10px] font-bold text-amber-deep no-underline hover:text-espresso"
        >
          [{m[1]}]
        </a>
      </sup>
    )
  })
}
