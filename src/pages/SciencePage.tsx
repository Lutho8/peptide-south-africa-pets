import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router';
import {
  motion,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import type { EvidenceTone } from '@/lib/data';
import { CITATION_RECORDS, COMPLIANCE_LINE } from '@/lib/data';
import { useI18n } from '@/lib/i18n';

/* ----------------------------- design tokens ---------------------------- */

const SERIF = "font-['Fraunces',Georgia,serif]";
const SANS = "font-['Inter',system-ui,sans-serif]";
const MONO = "font-['Space_Mono',ui-monospace,monospace]";

const TONE_DOT: Record<EvidenceTone, string> = {
  clinical: 'bg-[#1E4D3B]',
  amber: 'bg-[#D97E3F]',
  alert: 'bg-[#A33B2E]',
};
const TONE_BADGE: Record<EvidenceTone, string> = {
  clinical: 'bg-[#DCE8E0] text-[#1E4D3B] border-[#1E4D3B]/30',
  amber: 'bg-[#F7F1E5] text-[#B25E26] border-[#D97E3F]/40',
  alert: 'bg-[#F7F1E5] text-[#A33B2E] border-[#A33B2E]/40',
};

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/* -------------------------------- type-on ------------------------------- */

function TypeOn({
  text,
  speed = 14,
  delay = 0,
  className = '',
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px -8% 0px' });
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    if (reduced) {
      setCount(text.length);
      return;
    }
    let i = 0;
    let interval = 0;
    const timeout = window.setTimeout(() => {
      interval = window.setInterval(() => {
        i += 1;
        setCount(i);
        if (i >= text.length) window.clearInterval(interval);
      }, speed);
    }, delay);
    return () => {
      window.clearTimeout(timeout);
      if (interval) window.clearInterval(interval);
    };
  }, [inView, reduced, text, speed, delay]);

  return (
    <span ref={ref} className={className} aria-label={text}>
      <span aria-hidden>{text.slice(0, count)}</span>
      {!reduced && count < text.length && inView && (
        <span aria-hidden className="animate-pulse">
          ▍
        </span>
      )}
    </span>
  );
}

/* ---------------------------- word-split rise ---------------------------- */

function SplitHeadline({ text, className = '' }: { text: string; className?: string }) {
  const reduced = useReducedMotion();
  const words = text.split(' ');
  if (reduced) return <span className={className}>{text}</span>;
  return (
    <span className={className} aria-label={text}>
      {words.map((word, i) => (
        <span
          key={`${word}-${i}`}
          aria-hidden
          className="inline-block overflow-hidden align-bottom pb-[0.08em] -mb-[0.08em]"
        >
          <motion.span
            className="inline-block will-change-transform"
            initial={{ y: '110%', rotate: 4 }}
            animate={{ y: '0%', rotate: 0 }}
            transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.05 }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  );
}

/* --------------------------- pet breadth strip --------------------------- */

const STRIP_PETS = [
  { src: '/dog-portrait-1.png', caption: 'CANINE — FIRST', alt: 'Senior dog resting in warm light' },
  { src: '/cat-portrait-1.png', caption: 'FELINE — FIRST', alt: 'Ginger cat on a sunlit windowsill' },
  { src: '/horse-portrait-1.png', caption: 'EQUINE — UNDER VET REVIEW', alt: 'Horse at a stable door in morning light' },
];

function StripImage({ src, caption, alt, index }: { src: string; caption: string; alt: string; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-5%', '5%']);

  return (
    <motion.div
      ref={ref}
      className="relative aspect-[4/3] overflow-hidden md:aspect-[16/10]"
      initial={reduced ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
      whileInView={{ clipPath: 'inset(0% 0% 0% 0%)' }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ duration: 0.9, ease: EASE, delay: index * 0.15 }}
    >
      <motion.img
        src={src}
        alt={alt}
        loading="lazy"
        className="absolute inset-0 h-full w-full scale-110 object-cover"
        style={reduced ? undefined : { y }}
      />
      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#2B2118]/70 to-transparent" />
      <div className={`absolute bottom-4 left-4 ${MONO} text-[11px] uppercase tracking-[0.08em] text-[#F7F1E5]`}>
        <TypeOn text={caption} speed={30} />
      </div>
    </motion.div>
  );
}

/* --------------------------------- page --------------------------------- */

export default function SciencePage() {
  const reduced = useReducedMotion();
  const { t } = useI18n();

  return (
    <main className={`${SANS} bg-[#F7F1E5] text-[#2B2118] antialiased`}>
      {/* Google Fonts (React 19 hoists these to <head>) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap"
      />

      {/* ------------------------- Section 1 — hero ------------------------ */}
      <section className="relative overflow-hidden bg-[#EFE6D4]">
        <img
          src="/texture-paper.png"
          alt=""
          aria-hidden
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-5"
        />
        <div className="relative mx-auto max-w-[860px] px-6 pb-20 pt-24 text-center md:pb-28 md:pt-32">
          <p className={`${MONO} text-xs font-bold uppercase tracking-[0.08em] text-[#B25E26]`}>
            <TypeOn text="PSA PETS · EVIDENCE LIBRARY" speed={30} />
          </p>
          <h1
            className={`${SERIF} mt-6 text-[clamp(2.4rem,6vw,4.5rem)] font-medium leading-[1.02] tracking-[-0.02em]`}
          >
            <SplitHeadline text="We publish what exists — and what doesn't." />
          </h1>
          <motion.p
            className="mx-auto mt-6 max-w-[620px] text-[1.0625rem] leading-[1.65] text-[#5C5044]"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE, delay: 0.5 }}
          >
            Every claim on our product pages carries an evidence level. This library is the full
            record: the studies, the market benchmarks, and the honest gaps. Bring it to your vet —
            we encourage that.
          </motion.p>
        </div>
      </section>

      {/* ------------------- Section 2 — evidence levels ------------------- */}
      <section className="bg-[#FFFDF9]">
        <div className="mx-auto max-w-[1320px] px-6 py-[clamp(5rem,10vw,9rem)]">
          <motion.h2
            className={`${SERIF} text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[1.05] tracking-[-0.02em]`}
            initial={reduced ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            How we grade evidence.
          </motion.h2>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              {
                tone: 'clinical' as EvidenceTone,
                badge: 'CANINE DATA',
                body: 'Published studies in dogs: randomized controlled trials or pharmacokinetic studies. The strongest signal available in veterinary science.',
              },
              {
                tone: 'amber' as EvidenceTone,
                badge: 'PRECLINICAL / COMMUNITY',
                body: 'Rodent or in-vitro studies, or widespread veterinary-community practice without controlled canine trials. Promising, unproven in dogs.',
              },
              {
                tone: 'alert' as EvidenceTone,
                badge: 'HONESTY NOTE',
                body: 'Where evidence is missing or regulatory status is unresolved, we say so explicitly — on every product, every time.',
              },
            ].map((level, i) => (
              <motion.div
                key={level.badge}
                className="rounded-[20px] border border-[#E3D5BC] bg-[#FFFDF9] p-7 transition-shadow duration-500 hover:shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)]"
                initial={reduced ? false : { opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-20% 0px' }}
                transition={{ duration: 0.6, ease: EASE, delay: i * 0.1 }}
              >
                <motion.span
                  className={`inline-block h-3 w-3 rounded-full ${TONE_DOT[level.tone]}`}
                  initial={reduced ? false : { scale: 1 }}
                  whileInView={{ scale: [1, 1.4, 1] }}
                  viewport={{ once: true, margin: '-20% 0px' }}
                  transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                />
                <p className={`${MONO} mt-4 text-xs font-bold uppercase tracking-[0.08em]`}>
                  {level.badge}
                </p>
                <p className="mt-3 text-[0.95rem] leading-[1.65] text-[#5C5044]">{level.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------- Section 3 — the records --------------------- */}
      <section className="bg-[#F7F1E5]">
        <div className="mx-auto max-w-[900px] px-6 py-[clamp(5rem,10vw,9rem)]">
          <motion.div
            initial={reduced ? false : { opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <p className={`${MONO} text-xs font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
              THE FULL RECORD
            </p>
            <h2
              className={`${SERIF} mt-4 text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[1.05] tracking-[-0.02em]`}
            >
              Citation records.
            </h2>
          </motion.div>

          <div className="mt-14 flex flex-col gap-8">
            {CITATION_RECORDS.map((rec, i) => (
              <motion.article
                key={rec.id}
                className="relative grid gap-5 rounded-[20px] border border-[#E3D5BC] bg-[#FFFDF9] p-6 md:grid-cols-[64px_1fr] md:p-8"
                initial={reduced ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-15% 0px' }}
                transition={{ duration: 0.6, ease: EASE, delay: (i % 3) * 0.08 }}
              >
                {/* sticky record index */}
                <div className="hidden md:block">
                  <span
                    className={`${MONO} sticky top-24 inline-block text-[0.8125rem] font-bold text-[#B25E26]`}
                  >
                    {rec.id}
                  </span>
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={`${MONO} text-[0.8125rem] font-bold text-[#B25E26] md:hidden`}>
                      {rec.id}
                    </span>
                    <span
                      className={`${MONO} rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${TONE_BADGE[rec.tone]}`}
                    >
                      <span
                        className={`mr-1.5 inline-block h-1.5 w-1.5 rounded-full align-middle ${TONE_DOT[rec.tone]}`}
                      />
                      {rec.badge}
                    </span>
                    {rec.chip &&
                      (rec.chipSlug ? (
                        <Link
                          to={`/product/${rec.chipSlug}`}
                          className={`${MONO} rounded-full border border-[#E3D5BC] px-3 py-1 text-[10px] uppercase tracking-[0.08em] text-[#5C5044] transition-all duration-300 hover:-translate-y-0.5 hover:border-[#D97E3F] hover:text-[#B25E26]`}
                        >
                          {rec.chip} →
                        </Link>
                      ) : (
                        <span
                          className={`${MONO} rounded-full border border-[#E3D5BC] px-3 py-1 text-[10px] uppercase tracking-[0.08em] text-[#5C5044]`}
                        >
                          {rec.chip}
                        </span>
                      ))}
                  </div>

                  <p className="mt-4 text-[1.0625rem] leading-[1.65] text-[#2B2118]">
                    {rec.summary}
                  </p>

                  <p className={`${MONO} mt-5 border-t border-[#E3D5BC] pt-4 text-[0.75rem] tracking-[0.04em] text-[#5C5044]`}>
                    <TypeOn text={`SOURCE: ${rec.source}`} speed={12} />
                  </p>
                  {rec.sourceUrl && (
                    <a
                      href={rec.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`${MONO} mt-3 inline-block rounded-full border border-[#1E4D3B]/30 bg-[#DCE8E0] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#1E4D3B] transition-colors duration-300 hover:border-[#1E4D3B] hover:bg-[#1E4D3B] hover:text-[#FFFDF9]`}
                    >
                      {t('sci.viewSource')} ↗
                    </a>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------- Section 4 — pet breadth --------------------- */}
      <section className="bg-[#F7F1E5]">
        <div className="mx-auto max-w-[1320px] px-0 md:px-6">
          <div className="grid gap-1 md:grid-cols-3">
            {STRIP_PETS.map((pet, i) => (
              <StripImage key={pet.src} src={pet.src} caption={pet.caption} alt={pet.alt} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ------------------- Section 5 — honest statement ------------------ */}
      <section className="bg-[#2B2118] text-[#F7F1E5]">
        <motion.div
          className="mx-auto max-w-[760px] px-6 py-[clamp(5rem,10vw,9rem)] text-center"
          initial={reduced ? false : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-20% 0px' }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <p className={`${MONO} text-xs font-bold uppercase tracking-[0.08em] text-[#D97E3F]`}>
            THE FULL PICTURE
          </p>
          <h2
            className={`${SERIF} mt-6 text-[clamp(2.2rem,4.5vw,4rem)] font-medium leading-[1.05] tracking-[-0.02em]`}
          >
            What we can't claim — and won't.
          </h2>
          <p className="mx-auto mt-8 max-w-[640px] text-[1.0625rem] leading-[1.75] text-[#F7F1E5]/80">
            No pet peptide product — from PSA or any competitor — is approved by the FDA or SAHPRA.
            Our products are in development and are not veterinary medicines. They are not intended
            to diagnose, treat, cure or prevent any disease. Evidence levels vary by compound, and
            we label them honestly. Always consult your veterinarian before starting your pet on
            any supplement.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/waitlist"
              className={`${SERIF} inline-flex items-center gap-2 rounded-full bg-[#D97E3F] px-8 py-4 text-lg font-semibold text-[#FFFDF9] transition-colors duration-300 hover:bg-[#B25E26]`}
            >
              Join the waitlist <span aria-hidden>→</span>
            </Link>
            <Link
              to="/"
              className={`${SERIF} inline-flex items-center gap-2 rounded-full border border-[#F7F1E5]/40 px-8 py-4 text-lg font-semibold text-[#F7F1E5] transition-colors duration-300 hover:border-[#F7F1E5] hover:bg-[#F7F1E5]/5`}
            >
              Browse the catalog
            </Link>
          </div>
        </motion.div>
      </section>

      {/* -------------------- compliance strip + crumb --------------------- */}
      <section className="border-y border-[#A33B2E] bg-[#F7F1E5] px-6 py-3">
        <p
          className={`${MONO} mx-auto max-w-[1320px] text-center text-[11px] uppercase leading-[1.7] tracking-[0.08em] text-[#A33B2E]`}
        >
          {COMPLIANCE_LINE}
        </p>
      </section>

      <div className="bg-[#F7F1E5] px-6 py-8">
        <div className="mx-auto max-w-[1320px]">
          <a
            href="https://peptide-south-africa.com"
            className={`${MONO} text-[11px] uppercase tracking-[0.08em] text-[#5C5044] transition-colors hover:text-[#B25E26]`}
          >
            ← PEPTIDE-SOUTH-AFRICA.COM
          </a>
        </div>
      </div>
    </main>
  );
}
