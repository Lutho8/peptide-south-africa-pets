import { Link } from 'react-router'
import { PRODUCTS, waLink } from '@/lib/data'
import { useI18n } from '@/lib/i18n'
import { asset } from '@/lib/asset'

/** Section 13 — compliance strip + breadcrumb + footer (design.md §7.3, §7.7, §7.8). */
export default function Footer() {
  const { t } = useI18n()
  return (
    <>
      {/* §7.7 Compliance Disclaimer Strip */}
      <div className="border-y border-alert bg-cream px-4 py-3 text-center">
        <p className="mono-label !text-[11px] leading-relaxed text-alert">
          ALL PSA PETS PRODUCTS ARE IN DEVELOPMENT AND NOT YET AVAILABLE FOR SALE · THESE ARE
          NOT VETERINARY MEDICINES · NO PET PEPTIDE PRODUCT IS FDA OR SAHPRA APPROVED · ALWAYS
          CONSULT YOUR VETERINARIAN
        </p>
      </div>

      {/* §7.3 Back to main site breadcrumb */}
      <div className="bg-cream pb-2 pt-6 text-center">
        <a
          href="https://peptide-south-africa.com"
          className="mono-data link-underline text-espresso-70"
        >
          ← PEPTIDE-SOUTH-AFRICA.COM
        </a>
      </div>

      {/* §7.8 Footer */}
      <footer className="bg-espresso text-cream">
        <div className="psa-container grid gap-10 py-14 md:grid-cols-4">
          <div>
            <p className="flex items-center gap-2.5">
              <img
                src={asset('/psa-icon-square.png')}
                alt=""
                className="h-9 w-9 rounded-full bg-cream p-0.5"
              />
              <span className="font-serif text-2xl font-semibold">
                PSA<span className="text-amber">·PETS</span>
              </span>
            </p>
            <p className="mt-3 text-sm leading-relaxed text-cream/70">{t('foot.tagline')}</p>
            <img src={asset('/coa-stamp.svg')} alt="COA verified stamp" className="mt-5 h-20 w-20 opacity-80" />
          </div>

          <div>
            <p className="mono-label !text-[11px] text-cream/50">{t('foot.catalog')}</p>
            <ul className="mt-4 space-y-2 text-sm">
              {PRODUCTS.map((p) => (
                <li key={p.slug}>
                  <Link to={`/product/${p.slug}`} className="text-cream/80 hover:text-amber">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mono-label !text-[11px] text-cream/50">{t('foot.learn')}</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link to="/science" className="text-cream/80 hover:text-amber">
                  {t('foot.science')}
                </Link>
              </li>
              <li>
                <Link to="/verify" className="text-cream/80 hover:text-amber">
                  {t('foot.verify')}
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-cream/80 hover:text-amber">
                  Blog — The PSA PETS Journal
                </Link>
              </li>
              <li>
                <Link to="/pets#faq" className="text-cream/80 hover:text-amber">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/waitlist" className="text-cream/80 hover:text-amber">
                  {t('foot.waitlist')}
                </Link>
              </li>
              <li>
                <a
                  href="https://peptide-south-africa.com"
                  className="text-cream/80 hover:text-amber"
                >
                  {t('foot.mainSite')}
                </a>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-cream/15 bg-cream/5 p-5">
            <p className="mono-label !text-[11px] text-cream/60">{t('foot.questions')}</p>
            <p className="mt-2 text-sm text-cream/80">{t('foot.questionsBody')}</p>
            <a
              href={waLink(t('foot.waMsg'))}
              target="_blank"
              rel="noreferrer"
              className="mono-label mt-4 inline-flex items-center gap-2 rounded-full bg-clinical px-4 py-2.5 !text-[11px] text-cream transition-colors hover:bg-cream hover:text-clinical"
            >
              <img src={asset('/icon-whatsapp.svg')} alt="" className="h-4 w-4 invert" />
              {t('foot.textUs')}
            </a>
          </div>
        </div>

        <div className="border-t border-cream/10">
          <p className="psa-container mono-data py-5 text-center !text-[11px] text-cream/50">
            {t('foot.bottom', { year: new Date().getFullYear() })}
          </p>
        </div>
      </footer>
    </>
  )
}
