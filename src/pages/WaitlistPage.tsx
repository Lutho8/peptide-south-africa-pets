import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Link, useSearchParams } from 'react-router';
import { AnimatePresence, animate, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Loader2, PawPrint } from 'lucide-react';
import {
  CITIES,
  COMPLIANCE_LINE,
  CONCERNS,
  PET_PRODUCTS,
  PET_TYPES,
  WAITLIST_BASE_COUNT,
  WHATSAPP_NUMBER,
  buildWhatsAppLink,
  findExistingTicket,
  formatZAR,
  generateTicketCode,
  readWaitlist,
  writeWaitlist,
} from '@/lib/data';
import type { WaitlistTicket } from '@/lib/data';
import { getRefFromUrl } from '@/lib/waitlist';
import {
  getUtmFromUrl,
  submitPetsWaitlist,
  upsertPetsLead,
  useLiveWaitlistCount,
} from '@/lib/supabase';
import { useI18n } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

/* ----------------------------- design tokens ---------------------------- */

const SERIF = "font-['Fraunces',Georgia,serif]";
const SANS = "font-['Inter',system-ui,sans-serif]";
const MONO = "font-['Space_Mono',ui-monospace,monospace]";

const DRAFT_KEY = 'psa_pets_draft';

interface FormState {
  petTypes: string[];
  breed: string;
  petAge: number;
  petName: string;
  concern: string;
  ownerName: string;
  email: string;
  whatsapp: string;
  city: string;
  popia: boolean;
  products: string[];
}

const EMPTY_FORM: FormState = {
  petTypes: [],
  breed: '',
  petAge: 5,
  petName: '',
  concern: '',
  ownerName: '',
  email: '',
  whatsapp: '',
  city: '',
  popia: false,
  products: [],
};

/* ------------------------------- TypeLine -------------------------------- */

function TypeLine({
  text,
  speed = 10,
  delay = 0,
  className = '',
  active = true,
}: {
  text: string;
  speed?: number;
  delay?: number;
  className?: string;
  active?: boolean;
}) {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) return;
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
  }, [active, reduced, text, speed, delay]);

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden>{text.slice(0, count)}</span>
    </span>
  );
}

/* ------------------------------ CheckDraw -------------------------------- */

function CheckDraw({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 12 12" className={className} aria-hidden>
      <motion.path
        d="M2 6.5 4.8 9.3 10 2.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
      />
    </svg>
  );
}

/* ------------------------------ ShakeField ------------------------------- */

function ShakeField({
  tick,
  error,
  children,
}: {
  tick: number;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <motion.div
        key={error ? tick : 0}
        animate={error ? { x: [0, -4, 4, -2, 2, 0] } : { x: 0 }}
        transition={{ duration: 0.35 }}
      >
        {children}
      </motion.div>
      {error && (
        <p className={`${MONO} mt-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#A33B2E]`}>
          {error}
        </p>
      )}
    </div>
  );
}

/* ---------------------------- ProgressHeader ----------------------------- */

function ProgressHeader({ step }: { step: number }) {
  const { t } = useI18n();
  const stepLabels = [t('wlp.step.1'), t('wlp.step.2'), t('wlp.step.3'), t('wlp.step.4')];
  return (
    <div className="border-b border-[#E3D5BC] bg-[#F7F1E5]">
      <div className="mx-auto max-w-[760px] px-6 pb-5 pt-6">
        <div className="flex items-start justify-between">
          {stepLabels.map((label, i) => {
            const done = i < step;
            const current = i === step;
            return (
              <div key={label} className="flex flex-col items-center gap-2">
                <span
                  className={
                    done
                      ? 'flex h-7 w-7 items-center justify-center rounded-full border border-[#1E4D3B] bg-[#DCE8E0] text-[#1E4D3B]'
                      : current
                        ? 'flex h-7 w-7 items-center justify-center rounded-full border border-[#D97E3F] bg-[#D97E3F] text-[#FFFDF9]'
                        : 'flex h-7 w-7 items-center justify-center rounded-full border border-[#E3D5BC] text-[#5C5044]'
                  }
                >
                  {done ? (
                    <CheckDraw className="h-3 w-3" />
                  ) : (
                    <span className={`${MONO} text-[10px] font-bold`}>{i + 1}</span>
                  )}
                </span>
                <span
                  className={`${MONO} hidden text-[9px] font-bold uppercase tracking-[0.08em] sm:block ${
                    current ? 'text-[#B25E26]' : done ? 'text-[#1E4D3B]' : 'text-[#5C5044]/60'
                  }`}
                >
                  {label}
                </span>
                {current && (
                  <motion.span
                    className="h-1 w-1 rounded-full bg-[#D97E3F]"
                    animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="mt-4 h-px w-full bg-[#E3D5BC]">
          <motion.div
            className="h-[3px] -translate-y-[1px] rounded-full bg-[#D97E3F]"
            initial={false}
            animate={{ width: `${(step / (stepLabels.length - 1)) * 100}%` }}
            transition={{ duration: 0.5, ease: [0.65, 0, 0.35, 1] }}
          />
        </div>
      </div>
    </div>
  );
}

/* --------------------------------- page ---------------------------------- */

const STEP_TRANSITION = {
  initial: { x: 60, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -60, opacity: 0 },
  transition: { type: 'spring' as const, stiffness: 260, damping: 30 },
};

/**
 * Dual-write a new funnel ticket to Supabase (psa_pets_waitlist) and the PSA
 * CRM (psa_leads). Fire-and-forget — failures queue locally and retry on the
 * next page load; the confirmation step never depends on the network.
 */
function syncFunnelTicket(t: WaitlistTicket, locale: Locale): void {
  const phone = t.whatsapp ? `+27${t.whatsapp}` : null;
  void submitPetsWaitlist({
    ticket_code: t.code,
    owner_name: t.ownerName,
    email: t.email,
    whatsapp: phone,
    pet_type: t.petTypes.join(',') || null,
    pet_breed: t.breed || null,
    pet_age: t.petAge,
    city: t.city || null,
    products: t.products,
    primary_concern: t.concern || null,
    referral_code: t.code,
    referred_by: getRefFromUrl(),
    source: 'waitlist-funnel',
    locale,
    consent_popia: true,
    utm: getUtmFromUrl(),
  });
  void upsertPetsLead({
    email: t.email,
    first_name: t.ownerName.split(' ')[0] || null,
    phone,
    city: t.city || null,
    stage: 'lead',
    source_site: 'pets.peptide-south-africa.com',
    consent_email: true,
    consent_whatsapp: Boolean(t.whatsapp),
    notes: `PSA PETS waitlist: ${t.products.join(', ')}`,
  });
}

export default function WaitlistPage() {
  const reduced = useReducedMotion();
  const { t, locale } = useI18n();
  const [searchParams] = useSearchParams();
  const productParam = searchParams.get('product');
  const paramProducts = (productParam ?? '')
    .split(',')
    .map((slug) => PET_PRODUCTS.find((p) => p.slug === slug.trim()))
    .filter((p): p is (typeof PET_PRODUCTS)[number] => Boolean(p));

  const [step, setStep] = useState(0);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorTick, setErrorTick] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [ticket, setTicket] = useState<WaitlistTicket | null>(null);
  const [welcomeBack, setWelcomeBack] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  // Real Supabase waitlist rows (RPC, 5-min sessionStorage cache) — queue
  // positions continue from the marketing base + actual rows.
  const liveCount = useLiveWaitlistCount();

  const patch = (p: Partial<FormState>) => setForm((f) => ({ ...f, ...p }));

  /* ----- mount: restore draft, apply ?product=, detect returning user ---- */
  const mounted = useRef(false);
  useEffect(() => {
    if (mounted.current) return;
    mounted.current = true;

    let restored: Partial<FormState> = {};
    try {
      const raw = window.localStorage.getItem(DRAFT_KEY);
      if (raw) restored = JSON.parse(raw) as Partial<FormState>;
    } catch {
      /* ignore */
    }
    setForm((f) => {
      const merged = { ...f, ...restored };
      if (paramProducts.length > 0) {
        merged.products = Array.from(
          new Set([...(merged.products ?? []), ...paramProducts.map((p) => p.slug)]),
        );
      }
      return merged;
    });

    const entries = readWaitlist();
    const targetStep = entries.length > 0 ? 3 : 0;
    if (entries.length > 0) {
      setTicket(entries[entries.length - 1]);
      setWelcomeBack(true);
      setStep(3);
    }
    try {
      window.history.replaceState({ wlStep: targetStep }, '');
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ------------------------- draft persistence --------------------------- */
  useEffect(() => {
    if (ticket) return;
    try {
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
    } catch {
      /* ignore */
    }
  }, [form, ticket]);

  /* ------------------- browser back/forward via step --------------------- */
  useEffect(() => {
    const onPop = (e: PopStateEvent) => {
      const s = (e.state as { wlStep?: number } | null)?.wlStep;
      if (typeof s === 'number' && s >= 0 && s <= 3) setStep(s);
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const goTo = (n: number) => {
    setErrors({});
    setStep(n);
    try {
      window.history.pushState({ wlStep: n }, '');
    } catch {
      /* ignore */
    }
  };

  /* ----------------------- live queue counters --------------------------- */
  const [liveWaiting, setLiveWaiting] = useState<Record<string, number>>(() =>
    Object.fromEntries(PET_PRODUCTS.map((p) => [p.slug, p.waiting])),
  );
  const [flashSlug, setFlashSlug] = useState<string | null>(null);
  useEffect(() => {
    if (step !== 2 || reduced) return;
    let timeout = 0;
    let flashTimeout = 0;
    const schedule = () => {
      timeout = window.setTimeout(
        () => {
          const pick = PET_PRODUCTS[Math.floor(Math.random() * PET_PRODUCTS.length)].slug;
          setLiveWaiting((w) => ({ ...w, [pick]: (w[pick] ?? 0) + 1 }));
          setFlashSlug(pick);
          flashTimeout = window.setTimeout(() => setFlashSlug(null), 1800);
          schedule();
        },
        30000 + Math.random() * 40000,
      );
    };
    schedule();
    return () => {
      window.clearTimeout(timeout);
      window.clearTimeout(flashTimeout);
    };
  }, [step, reduced]);

  /* ------------------------------ validation ------------------------------ */
  const fail = (e: Record<string, string>) => {
    setErrors(e);
    setErrorTick((t) => t + 1);
    return false;
  };

  const validateStep1 = () =>
    form.petTypes.length > 0 ? true : fail({ petTypes: t('wlp.err.petTypes') });

  const validateStep2 = () => {
    const e: Record<string, string> = {};
    if (!form.ownerName.trim()) e.ownerName = t('wlp.err.owner');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim()))
      e.email = t('wlp.err.email');
    if (!/^[6-8]\d{8}$/.test(form.whatsapp.replace(/\s/g, '')))
      e.whatsapp = t('wlp.err.whatsapp');
    if (!form.city) e.city = t('wlp.err.city');
    if (!form.popia) e.popia = t('wlp.err.popia');
    return Object.keys(e).length === 0 ? true : fail(e);
  };

  /* -------------------------------- submit -------------------------------- */
  const handleSubmit = () => {
    if (form.products.length === 0) {
      fail({ products: t('wlp.err.products') });
      return;
    }
    setSubmitting(true);
    window.setTimeout(() => {
      const entries = readWaitlist();
      const existing = findExistingTicket(entries, form.email, form.whatsapp);
      let tk: WaitlistTicket;
      let isNew = false;
      if (existing) {
        tk = {
          ...existing,
          products: Array.from(new Set([...existing.products, ...form.products])),
        };
        const idx = entries.findIndex((x) => x.code === existing.code);
        if (idx >= 0) entries[idx] = tk;
        setAlreadyRegistered(true);
      } else {
        isNew = true;
        tk = {
          code: generateTicketCode(),
          queue: WAITLIST_BASE_COUNT + liveCount + entries.length + 1,
          ownerName: form.ownerName.trim(),
          email: form.email.trim(),
          whatsapp: form.whatsapp.replace(/\s/g, ''),
          city: form.city,
          petTypes: form.petTypes,
          petName: form.petName.trim(),
          breed: form.breed.trim(),
          petAge: form.petAge,
          concern: form.concern,
          products: form.products,
          createdAt: new Date().toISOString(),
        };
        entries.push(tk);
      }
      writeWaitlist(entries);
      if (isNew) syncFunnelTicket(tk, locale);
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
      setTicket(tk);
      setSubmitting(false);
      setStep(3);
      try {
        window.history.pushState({ wlStep: 3 }, '');
      } catch {
        /* ignore */
      }
    }, 800);
  };

  const resetForAnother = () => {
    setForm(EMPTY_FORM);
    setTicket(null);
    setWelcomeBack(false);
    setAlreadyRegistered(false);
    setErrors({});
    try {
      window.localStorage.removeItem(DRAFT_KEY);
    } catch {
      /* ignore */
    }
    goTo(0);
  };

  const whatsappValid = /^[6-8]\d{8}$/.test(form.whatsapp.replace(/\s/g, ''));
  const concernOption = CONCERNS.find((c) => c.id === form.concern) ?? null;

  const inputClass =
    'w-full rounded-xl border border-[#E3D5BC] bg-[#FFFDF9] px-4 py-3 text-[0.95rem] text-[#2B2118] placeholder-[#5C5044]/50 outline-none transition-colors focus:border-[#D97E3F]';

  return (
    <main className={`${SANS} min-h-[100dvh] bg-[#F7F1E5] text-[#2B2118] antialiased`}>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap"
      />

      {/* ------------------------- mini navbar ------------------------- */}
      <header className="border-b border-[#E3D5BC] bg-[#F7F1E5]">
        <div className="mx-auto flex h-[64px] max-w-[1320px] items-center justify-between px-6">
          <Link to="/" className={`${SERIF} text-xl font-semibold tracking-[-0.01em]`}>
            PSA<span className="text-[#D97E3F]">·PETS</span>
          </Link>
          <span className={`${MONO} text-[11px] font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
            STEP {step + 1} OF 4
          </span>
        </div>
      </header>

      <ProgressHeader step={step} />

      {/* ---------------------------- steps ----------------------------- */}
      <div className="mx-auto max-w-[640px] px-6 py-12 md:py-16">
        <AnimatePresence mode="wait">
          {/* ============================ STEP 1 ============================ */}
          {step === 0 && (
            <motion.section key="step-1" {...STEP_TRANSITION}>
              <h1 className={`${SERIF} text-[2.5rem] font-medium leading-[1.05] tracking-[-0.02em]`}>
                {t('wlp.s1.title')}
              </h1>

              {/* pet type selector */}
              <div className="mt-10">
                <ShakeField tick={errorTick} error={errors.petTypes}>
                  <div className="grid grid-cols-2 gap-4">
                    {PET_TYPES.map((pt) => {
                      const selected = form.petTypes.includes(pt.id);
                      return (
                        <motion.button
                          key={pt.id}
                          type="button"
                          whileTap={{ scale: 1.06 }}
                          transition={{ type: 'spring', stiffness: 260, damping: 30 }}
                          onClick={() =>
                            patch({
                              petTypes: selected
                                ? form.petTypes.filter((t) => t !== pt.id)
                                : [...form.petTypes, pt.id],
                            })
                          }
                          className={`flex flex-col items-center gap-3 rounded-[20px] border px-4 py-6 transition-colors duration-300 ${
                            selected
                              ? 'border-[#D97E3F] bg-[#D97E3F] text-[#FFFDF9]'
                              : 'border-[#E3D5BC] bg-[#FFFDF9] text-[#2B2118] hover:border-[#D97E3F]/60'
                          }`}
                          aria-pressed={selected}
                        >
                          {pt.icon ? (
                            <img
                              src={pt.icon}
                              alt=""
                              aria-hidden
                              className={`h-10 w-10 ${selected ? 'invert' : ''}`}
                            />
                          ) : (
                            <PawPrint className="h-10 w-10" strokeWidth={1.5} aria-hidden />
                          )}
                          <span className={`${MONO} text-xs font-bold uppercase tracking-[0.08em]`}>
                            {t(`wlp.pet.${pt.id}`)}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </ShakeField>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <p className={`${MONO} text-[10px] uppercase tracking-[0.08em] text-[#5C5044]`}>
                    {t('wlp.s1.multiHint')}
                  </p>
                  {form.petTypes.length > 1 && (
                    <span
                      className={`${MONO} rounded-full border border-[#D97E3F] px-2.5 py-0.5 text-[10px] font-bold text-[#B25E26]`}
                    >
                      {t('wlp.s1.pets', { n: form.petTypes.length })}
                    </span>
                  )}
                </div>
              </div>

              {/* pet name + breed */}
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <label className="block">
                  <span className={`${MONO} mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
                    {t('wlp.petName')}
                  </span>
                  <input
                    type="text"
                    value={form.petName}
                    onChange={(e) => patch({ petName: e.target.value })}
                    placeholder={t('wlp.petNamePh')}
                    className={inputClass}
                  />
                </label>
                <label className="block">
                  <span className={`${MONO} mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
                    {t('wlp.breed')}
                  </span>
                  <input
                    type="text"
                    value={form.breed}
                    onChange={(e) => patch({ breed: e.target.value })}
                    placeholder={t('wlp.breedPh')}
                    className={inputClass}
                  />
                </label>
              </div>

              {/* age slider */}
              <div className="mt-8">
                <div className="flex items-baseline justify-between">
                  <span className={`${MONO} text-[11px] font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
                    {t('wlp.age')}
                  </span>
                  <span className={`${MONO} text-sm font-bold text-[#B25E26]`}>
                    {t('wlp.ageReadout', { age: String(form.petAge).padStart(2, '0') })}
                  </span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={20}
                  value={form.petAge}
                  onChange={(e) => patch({ petAge: Number(e.target.value) })}
                  className="mt-3 w-full accent-[#D97E3F]"
                  aria-label={t('wlp.ageAria')}
                />
                <AnimatePresence>
                  {form.petAge >= 10 && (
                    <motion.p
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.4 }}
                      className={`${SERIF} mt-3 text-lg italic text-[#5C5044]`}
                    >
                      {t('wlp.seniorQuote')}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* concern */}
              <div className="mt-8">
                <span className={`${MONO} mb-3 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
                  {t('wlp.concern')}
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {CONCERNS.map((c) => {
                    const selected = form.concern === c.id;
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          patch({
                            concern: c.id,
                            products:
                              c.products.length > 0
                                ? Array.from(new Set([...form.products, ...c.products]))
                                : form.products,
                          });
                        }}
                        className={`${MONO} rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[0.08em] transition-colors duration-300 ${
                          selected
                            ? 'border-[#D97E3F] bg-[#D97E3F] text-[#FFFDF9]'
                            : 'border-[#E3D5BC] bg-[#FFFDF9] text-[#5C5044] hover:border-[#D97E3F]/60 hover:text-[#2B2118]'
                        }`}
                        aria-pressed={selected}
                      >
                        {t(`wlp.concern.${c.id}`)}
                      </button>
                    );
                  })}
                </div>
                <AnimatePresence>
                  {concernOption && (
                    <motion.p
                      key={concernOption.id}
                      initial={reduced ? false : { opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className={`${MONO} mt-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#1E4D3B]`}
                    >
                      {t(`wlp.rec.${concernOption.id}`)}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              <button
                type="button"
                disabled={form.petTypes.length === 0}
                onClick={() => validateStep1() && goTo(1)}
                className={`${SERIF} mt-10 inline-flex w-full items-center justify-center gap-2 rounded-full px-8 py-4 text-lg font-semibold transition-colors duration-300 ${
                  form.petTypes.length === 0
                    ? 'cursor-not-allowed bg-[#E3D5BC] text-[#5C5044]'
                    : 'bg-[#D97E3F] text-[#FFFDF9] hover:bg-[#B25E26]'
                }`}
              >
                {t('wlp.continue')} <ArrowRight className="h-5 w-5" aria-hidden />
              </button>
            </motion.section>
          )}

          {/* ============================ STEP 2 ============================ */}
          {step === 1 && (
            <motion.section key="step-2" {...STEP_TRANSITION}>
              <h1 className={`${SERIF} text-[2.5rem] font-medium leading-[1.05] tracking-[-0.02em]`}>
                {t('wlp.s2.title')}
              </h1>

              <motion.div
                className="mt-10 flex flex-col gap-5"
                initial={reduced ? false : 'hidden'}
                animate="show"
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06 } },
                }}
              >
                <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                  <ShakeField tick={errorTick} error={errors.ownerName}>
                    <label className="block">
                      <span className={`${MONO} mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
                        {t('wlp.yourName')}
                      </span>
                      <input
                        type="text"
                        value={form.ownerName}
                        onChange={(e) => patch({ ownerName: e.target.value })}
                        placeholder={t('wlp.yourNamePh')}
                        className={inputClass}
                        autoComplete="name"
                      />
                    </label>
                  </ShakeField>
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                  <ShakeField tick={errorTick} error={errors.email}>
                    <label className="block">
                      <span className={`${MONO} mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
                        {t('wlp.email')}
                      </span>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => patch({ email: e.target.value })}
                        placeholder={t('form.emailPh')}
                        className={inputClass}
                        autoComplete="email"
                      />
                    </label>
                  </ShakeField>
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                  <ShakeField tick={errorTick} error={errors.whatsapp}>
                    <label className="block">
                      <span className={`${MONO} mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
                        {t('wlp.whatsapp')}
                      </span>
                      <div className="flex items-stretch gap-2">
                        <motion.span
                          key={whatsappValid ? 'valid' : 'invalid'}
                          animate={whatsappValid ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                          transition={{ duration: 0.5 }}
                          className={`${MONO} flex items-center rounded-xl border px-4 text-sm font-bold transition-colors duration-300 ${
                            whatsappValid
                              ? 'border-[#1E4D3B] bg-[#DCE8E0] text-[#1E4D3B]'
                              : 'border-[#E3D5BC] bg-[#EFE6D4] text-[#5C5044]'
                          }`}
                        >
                          +27
                        </motion.span>
                        <input
                          type="tel"
                          inputMode="numeric"
                          value={form.whatsapp}
                          onChange={(e) =>
                            patch({ whatsapp: e.target.value.replace(/[^\d\s]/g, '') })
                          }
                          placeholder="82 123 4567"
                          className={inputClass}
                          autoComplete="tel-national"
                        />
                      </div>
                    </label>
                  </ShakeField>
                  <p className={`${MONO} mt-1.5 text-[10px] uppercase tracking-[0.08em] text-[#5C5044]`}>
                    {t('wlp.waNote')}
                  </p>
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                  <ShakeField tick={errorTick} error={errors.city}>
                    <label className="block">
                      <span className={`${MONO} mb-2 block text-[11px] font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
                        {t('wlp.city')}
                      </span>
                      <select
                        value={form.city}
                        onChange={(e) => patch({ city: e.target.value })}
                        className={`${inputClass} ${form.city ? '' : 'text-[#5C5044]/50'}`}
                      >
                        <option value="" disabled>
                          {t('wlp.cityPh')}
                        </option>
                        {CITIES.map((city) => (
                          <option key={city} value={city}>
                            {t(`form.city.${city}`)}
                          </option>
                        ))}
                      </select>
                    </label>
                  </ShakeField>
                </motion.div>

                <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
                  <ShakeField tick={errorTick} error={errors.popia}>
                    <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-[#E3D5BC] bg-[#FFFDF9] p-4">
                      <input
                        type="checkbox"
                        checked={form.popia}
                        onChange={(e) => patch({ popia: e.target.checked })}
                        className="mt-0.5 h-4 w-4 shrink-0 accent-[#1E4D3B]"
                      />
                      <span className="text-sm leading-[1.6] text-[#5C5044]">
                        {t('wlp.popia')}
                      </span>
                    </label>
                  </ShakeField>
                </motion.div>
              </motion.div>

              <div className="mt-10 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className={`${SERIF} inline-flex items-center gap-2 rounded-full border border-[#E3D5BC] px-6 py-4 text-base font-semibold text-[#5C5044] transition-colors duration-300 hover:border-[#2B2118] hover:text-[#2B2118]`}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden /> {t('wlp.back')}
                </button>
                <button
                  type="button"
                  onClick={() => validateStep2() && goTo(2)}
                  className={`${SERIF} inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#D97E3F] px-8 py-4 text-lg font-semibold text-[#FFFDF9] transition-colors duration-300 hover:bg-[#B25E26]`}
                >
                  {t('wlp.continue')} <ArrowRight className="h-5 w-5" aria-hidden />
                </button>
              </div>
            </motion.section>
          )}

          {/* ============================ STEP 3 ============================ */}
          {step === 2 && (
            <motion.section key="step-3" {...STEP_TRANSITION}>
              <h1 className={`${SERIF} text-[2.5rem] font-medium leading-[1.05] tracking-[-0.02em]`}>
                {form.petName.trim()
                  ? t('wlp.s3.titleNamed', { name: form.petName.trim() })
                  : paramProducts.length > 0
                    ? t('wlp.s3.titleProduct', {
                        product: paramProducts[0].name.replace(/ Oral Drops| Gut & Skin Drops/, ''),
                      })
                    : t('wlp.s3.titleGeneric')}
              </h1>

              <div className="mt-10 flex flex-col gap-4">
                {PET_PRODUCTS.map((p, i) => {
                  const checked = form.products.includes(p.slug);
                  const waiting = liveWaiting[p.slug] ?? p.waiting;
                  return (
                    <motion.button
                      key={p.slug}
                      type="button"
                      initial={reduced ? false : { opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      onClick={() =>
                        patch({
                          products: checked
                            ? form.products.filter((s) => s !== p.slug)
                            : [...form.products, p.slug],
                        })
                      }
                      className={`relative flex items-center gap-4 rounded-[20px] border p-5 text-left transition-colors duration-300 ${
                        checked
                          ? 'border-[#D97E3F] bg-[#EFE6D4]'
                          : 'border-[#E3D5BC] bg-[#FFFDF9] hover:border-[#D97E3F]/50'
                      }`}
                      aria-pressed={checked}
                    >
                      <span
                        className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md border transition-colors duration-300 ${
                          checked ? 'border-[#1E4D3B] bg-[#1E4D3B] text-[#FFFDF9]' : 'border-[#E3D5BC] bg-[#FFFDF9] text-transparent'
                        }`}
                      >
                        {checked && <CheckDraw className="h-3.5 w-3.5" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className={`${MONO} block text-[10px] uppercase tracking-[0.08em] text-[#5C5044]`}>
                          {p.spec}
                        </span>
                        <span className={`${SERIF} mt-1 block text-xl font-semibold leading-tight`}>
                          {p.name}
                          {p.firstToLaunch && (
                            <span className={`${MONO} ml-2 inline-block rounded-full bg-[#1E4D3B] px-2 py-0.5 align-middle text-[9px] font-bold uppercase tracking-[0.08em] text-[#FFFDF9]`}>
                              {t('wlp.firstToLaunch')}
                            </span>
                          )}
                        </span>
                        <span className={`${MONO} mt-1 block text-[11px] tracking-[0.04em] text-[#5C5044]`}>
                          {formatZAR(p.price)}
                          {p.priceUnit} ·{' '}
                          <motion.span
                            animate={flashSlug === p.slug ? { color: '#D97E3F' } : { color: '#5C5044' }}
                            className="font-bold"
                          >
                            {t('wlp.waiting', { count: waiting.toLocaleString('en-ZA') })}
                          </motion.span>
                        </span>
                      </span>
                    </motion.button>
                  );
                })}
              </div>

              {errors.products && (
                <p className={`${MONO} mt-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#A33B2E]`}>
                  {errors.products}
                </p>
              )}

              <button
                type="button"
                onClick={() =>
                  patch({
                    products:
                      form.products.length === PET_PRODUCTS.length
                        ? []
                        : PET_PRODUCTS.map((p) => p.slug),
                  })
                }
                className={`${MONO} mt-5 text-[11px] font-bold uppercase tracking-[0.08em] text-[#B25E26] underline decoration-[#D97E3F]/40 underline-offset-4 transition-colors hover:decoration-[#D97E3F]`}
              >
                {form.products.length === PET_PRODUCTS.length
                  ? t('wlp.clearAll')
                  : t('wlp.allProducts')}
              </button>

              {/* founding member perk */}
              <div className="mt-6 rounded-[20px] border border-[#1E4D3B]/20 bg-[#DCE8E0] p-5">
                <p className={`${MONO} text-[10px] font-bold uppercase tracking-[0.08em] text-[#1E4D3B]`}>
                  {t('wlp.perk')}
                </p>
                <p className="mt-2 text-[0.95rem] leading-[1.6] text-[#2B2118]">
                  {t('wlp.perkBodyA')} <strong>{t('wlp.perkBodyStrong')}</strong>{' '}
                  {t('wlp.perkBodyB')}
                </p>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => window.history.back()}
                  className={`${SERIF} inline-flex items-center gap-2 rounded-full border border-[#E3D5BC] px-6 py-4 text-base font-semibold text-[#5C5044] transition-colors duration-300 hover:border-[#2B2118] hover:text-[#2B2118]`}
                >
                  <ArrowLeft className="h-4 w-4" aria-hidden /> {t('wlp.back')}
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={submitting}
                  className={`${SERIF} inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#D97E3F] px-8 py-4 text-lg font-semibold text-[#FFFDF9] transition-colors duration-300 hover:bg-[#B25E26] disabled:opacity-80`}
                >
                  {submitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> {t('wlp.submitting')}
                    </>
                  ) : (
                    <>
                      {t('wlp.submit')} <ArrowRight className="h-5 w-5" aria-hidden />
                    </>
                  )}
                </button>
              </div>
            </motion.section>
          )}

          {/* ============================ STEP 4 ============================ */}
          {step === 3 && ticket && (
            <ConfirmationStep
              key="step-4"
              ticket={ticket}

              welcomeBack={welcomeBack}
              alreadyRegistered={alreadyRegistered}
              reduced={reduced ?? false}
              onReset={resetForAnother}
            />
          )}
        </AnimatePresence>
      </div>

      {/* ------------------------- compliance strip ------------------------ */}
      <section className="border-y border-[#A33B2E] bg-[#F7F1E5] px-6 py-3">
        <p
          className={`${MONO} mx-auto max-w-[1320px] text-center text-[11px] uppercase leading-[1.7] tracking-[0.08em] text-[#A33B2E]`}
        >
          {COMPLIANCE_LINE}
        </p>
      </section>
    </main>
  );
}

/* --------------------------- ConfirmationStep ---------------------------- */

const PLUS_SCATTER: { x: number; y: number; delay: number }[] = [
  { x: -90, y: -70, delay: 1.5 },
  { x: 100, y: -60, delay: 1.6 },
  { x: -120, y: 10, delay: 1.7 },
  { x: 130, y: 20, delay: 1.55 },
  { x: -60, y: 90, delay: 1.75 },
  { x: 70, y: 100, delay: 1.65 },
];

function ConfirmationStep({
  ticket,
  welcomeBack,
  alreadyRegistered,
  reduced,
  onReset,
}: {
  ticket: WaitlistTicket;
  welcomeBack: boolean;
  alreadyRegistered: boolean;
  reduced: boolean;
  onReset: () => void;
}) {
  const [queueDisplay, setQueueDisplay] = useState(reduced ? ticket.queue : 0);
  const [printed, setPrinted] = useState(reduced);
  const { t, locale } = useI18n();

  useEffect(() => {
    if (reduced) return;
    const printTimeout = window.setTimeout(() => setPrinted(true), 600);
    const controls = animate(0, ticket.queue, {
      duration: 1.2,
      delay: 0.9,
      ease: 'easeOut',
      onUpdate: (v) => setQueueDisplay(Math.round(v)),
    });
    return () => {
      window.clearTimeout(printTimeout);
      controls.stop();
    };
  }, [ticket.queue, reduced]);

  const productNames = ticket.products
    .map((slug) => PET_PRODUCTS.find((p) => p.slug === slug)?.name ?? slug)
    .join(' · ');

  const petLine = t('wlp.petLine', {
    name: ticket.petName || '—',
    breed: ticket.breed ? ` · ${ticket.breed.toUpperCase()}` : '',
    age: ticket.petAge,
  });

  const rows: { label: string; value: string }[] = [
    { label: t('wlp.rowOwner'), value: ticket.ownerName.toUpperCase() || '—' },
    { label: t('wlp.rowPet'), value: petLine.toUpperCase() },
    {
      label: t('wlp.rowProducts'),
      value: productNames.toUpperCase() || t('wlp.everything'),
    },
    { label: t('wlp.rowCity'), value: ticket.city.toUpperCase() || '—' },
  ];

  const petName = ticket.petName.trim();

  const waHref =
    locale === 'af'
      ? `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
          t('wlp.waMessage', {
            name: ticket.ownerName,
            pet: petLine,
            products: productNames,
            code: ticket.code,
            queue: ticket.queue,
          }),
        )}`
      : buildWhatsAppLink(ticket);

  return (
    <motion.section
      key="step-4"
      initial={reduced ? false : { opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 30 }}
      className="relative text-center"
    >
      {welcomeBack && (
        <p className={`${MONO} mb-4 text-[11px] font-bold uppercase tracking-[0.08em] text-[#1E4D3B]`}>
          {t('wlp.welcomeBack')}
        </p>
      )}
      <h1 className={`${SERIF} text-[2.5rem] font-medium leading-[1.05] tracking-[-0.02em]`}>
        {petName ? t('wlp.confirmedNamed', { name: petName }) : t('wlp.confirmed')}
      </h1>

      {/* ticket + scatter */}
      <div className="relative mx-auto mt-10 max-w-[440px]">
        {!reduced &&
          PLUS_SCATTER.map((p, i) => (
            <motion.span
              key={i}
              aria-hidden
              className={`${MONO} pointer-events-none absolute left-1/2 top-1/2 text-xl font-bold text-[#D97E3F]`}
              initial={{ opacity: 0, x: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: [0, 1, 0], x: p.x, y: p.y, scale: 1 }}
              transition={{ duration: 1.2, delay: p.delay, ease: 'easeOut' }}
            >
              +
            </motion.span>
          ))}

        <motion.div
          initial={reduced ? false : { y: -6 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 18, delay: 1.4 }}
          className="-rotate-1"
        >
          <motion.div
            initial={reduced ? false : { clipPath: 'inset(0% 0% 100% 0%)' }}
            animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="relative overflow-hidden rounded-[16px] border border-[#E3D5BC] bg-[#FFFDF9] p-6 text-left shadow-[0_20px_50px_-20px_rgba(43,33,24,0.18)]"
          >
            <img
              src="/coa-stamp.svg"
              alt=""
              aria-hidden
              className="pointer-events-none absolute -bottom-10 -right-10 w-56 opacity-[0.08]"
            />

            <p className={`${MONO} text-xs font-bold uppercase tracking-[0.08em] text-[#2B2118]`}>
              <TypeLine text={t('wlp.ticketTitle')} speed={10} delay={700} active={printed} />
            </p>
            <div className="my-4 border-t border-dashed border-[#E3D5BC]" />

            <dl className="flex flex-col gap-3">
              {rows.map((row, i) => (
                <div key={row.label} className="flex items-baseline justify-between gap-4">
                  <dt className={`${MONO} shrink-0 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
                    {row.label}
                  </dt>
                  <dd className={`${MONO} text-right text-xs font-bold uppercase tracking-[0.04em] text-[#2B2118]`}>
                    <TypeLine text={row.value} speed={10} delay={950 + i * 200} active={printed} />
                  </dd>
                </div>
              ))}

              <div className="flex items-baseline justify-between gap-4">
                <dt className={`${MONO} shrink-0 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
                  {t('wlp.rowQueue')}
                </dt>
                <dd className={`${MONO} text-right text-2xl font-bold tracking-[0.04em] text-[#B25E26]`}>
                  #{String(queueDisplay).padStart(4, '0')}
                </dd>
              </div>
              {alreadyRegistered && (
                <p className={`${MONO} text-right text-[9px] font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
                  {t('wlp.alreadyRegistered')}
                </p>
              )}

              <div className="flex items-baseline justify-between gap-4">
                <dt className={`${MONO} shrink-0 text-[10px] font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
                  {t('wlp.rowCode')}
                </dt>
                <dd className={`${MONO} text-right text-sm font-bold tracking-[0.08em] text-[#2B2118]`}>
                  <TypeLine text={ticket.code} speed={10} delay={1750} active={printed} />
                </dd>
              </div>
            </dl>

            <div className="my-4 border-t border-dashed border-[#E3D5BC]" />
            <div className="flex items-baseline justify-between gap-4">
              <span className={`${MONO} text-[10px] font-bold uppercase tracking-[0.08em] text-[#5C5044]`}>
                {t('wlp.perkRow')}
              </span>
              <span className={`${MONO} text-right text-[11px] font-bold uppercase tracking-[0.06em] text-[#1E4D3B]`}>
                <TypeLine text={t('wlp.perkValue')} speed={10} delay={1950} active={printed} />
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* WhatsApp handoff */}
      <motion.a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        initial={reduced ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0, scale: [1, 1.03, 1] }}
        transition={{
          opacity: { duration: 0.5, delay: 2.0 },
          y: { duration: 0.5, delay: 2.0 },
          scale: { duration: 0.6, delay: 2.4 },
        }}
        className={`${SERIF} group mt-10 inline-flex items-center gap-2 rounded-full bg-[#1E4D3B] px-8 py-4 text-lg font-semibold text-[#FFFDF9] transition-colors duration-300 hover:bg-[#163a2c]`}
      >
        {t('wlp.confirmWa')}
        <ArrowRight className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
      </motion.a>
      <p className={`${MONO} mt-3 text-[10px] uppercase tracking-[0.08em] text-[#5C5044]`}>
        {t('wlp.waNote2')}
      </p>

      {/* queue dashboard handoff (round 6) */}
      <motion.div
        initial={reduced ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 2.3 }}
        className="mt-6"
      >
        <Link
          to="/queue"
          className={`${MONO} inline-flex items-center gap-2 rounded-full border-2 border-[#1E4D3B] px-6 py-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#1E4D3B] transition-colors hover:bg-[#1E4D3B] hover:text-[#FFFDF9]`}
        >
          {t('wlp.dashboard')}
        </Link>
      </motion.div>

      <div className="mt-8 flex flex-col items-center gap-3">
        <Link
          to="/"
          className={`${SERIF} text-base font-semibold text-[#5C5044] underline decoration-[#E3D5BC] underline-offset-4 transition-colors hover:text-[#2B2118]`}
        >
          {t('wlp.backToCatalog')}
        </Link>
        <button
          type="button"
          onClick={onReset}
          className={`${MONO} text-[10px] font-bold uppercase tracking-[0.08em] text-[#B25E26] underline decoration-[#D97E3F]/40 underline-offset-4 hover:decoration-[#D97E3F]`}
        >
          {t('wlp.another')}
        </button>
      </div>

      <p className={`${MONO} mt-10 text-[10px] uppercase leading-[1.8] tracking-[0.08em] text-[#5C5044]/70`}>
        {t('wlp.foot')}
      </p>
    </motion.section>
  );
}
