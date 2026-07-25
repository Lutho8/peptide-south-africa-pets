import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useConversionCopy } from './conversionCopy'
import { SectionHeader } from './shared'

const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]

/**
 * Keeps.com-style short personalization teaser — three steps, one CTA.
 * The full 6-step quiz lives at /quiz; this is the 10-second pitch.
 */
export default function QuizTeaser() {
  const copy = useConversionCopy()
  const steps = [
    { n: '1', title: copy.qtStep1Title, body: copy.qtStep1Body },
    { n: '2', title: copy.qtStep2Title, body: copy.qtStep2Body },
    { n: '3', title: copy.qtStep3Title, body: copy.qtStep3Body },
  ]
  return (
    <section className="border-y border-sand bg-warmwhite py-16 md:py-20">
      <div className="psa-container">
        <SectionHeader
          overline={copy.qtOverline}
          title={copy.qtTitle}
          sub={copy.qtSub}
        />
        <ol className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, i) => (
            <motion.li
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: EASE, delay: i * 0.08 }}
              className="flex items-start gap-4 rounded-2xl border border-sand bg-cream p-5"
            >
              <span className="mono-data flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-espresso font-bold text-cream">
                {step.n}
              </span>
              <div>
                <h3 className="font-serif text-lg font-semibold leading-tight text-espresso">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm leading-snug text-espresso-70">{step.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
        <div className="mt-8">
          <Link
            to="/quiz"
            className="inline-flex items-center gap-2 rounded-full bg-amber px-8 py-4 font-serif text-lg font-semibold text-warmwhite transition-colors hover:bg-amber-deep"
          >
            {copy.qtCta}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
