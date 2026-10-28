# Pets partner release evidence

PSA-20261028-001, verified 28 October 2026. Founder authorised production activation and catalogue correction, then required identical main/Pets commercial rules. Separate applications, approvals, acceptance, attribution and balances remain enforced.

Approved rules: 20%, strict 30-day attribution, 14-day validation, monthly ZAR EFT, R500 minimum/carry-forward, fresh attribution on repeat orders, explicit code over latest valid click, no customer discount or automatic higher tier. Agreement SHA256: `9d1c2c9cd2734bc3c6e10df6680ce26ac48c301ba37f3dbd120855dd167fcb1d`.

## Verification

- Full build including 27 prerendered routes, full lint, API TypeScript check, research boundary and SEO checks pass.
- `node scripts/test-partners.mjs`: method/origin/auth gates, consent validation, host-only cookie, expiry/future-date rejection, programme-code isolation and no-cookie fallback pass.
- Shared engine full application suite: 37 files, 289 tests pass. Main-programme SQL regression and Pets acceptance pass against local Postgres with transaction rollback.
- Pets SQL: R1,000 eligible value yields R0 unpaid, exactly R200 after cleared status, replay remains R200; R200 eligible refund creates R40 deduction; 14-day release, R500 threshold, dual-enrolled business isolation, staff RPC denial, R760 reserved statement reconciliation and replay pass.
- `synthetic-journey.json` and `synthetic-dashboard.png`: actual local GoTrue magic-link authentication, PostgREST, application API, staff approval RPC, agreement acceptance, page refresh, decoded customer QR, consent cookie, authenticated browser checkout and EFT reconciliation. R895 vial plus R89 delivery yields R179 commission; a short deposit earns R0; verified synthetic deposit earns R179 pending; replay remains one entry; owning browser displays that exact record. No production customer or payment fixtures.
- Independent review corrected dropped professional disclosure, incompatible referral-code validation and concurrent attribution race. Actual integration caught and corrected the missing internal EFT trusted-storefront credential.

## Operations and rollback

Apply shared migration `20261028052518_pets_partner_shared_engine.sql`, then `docs/pets-partner-policy-launch.sql` from the main repository. Deploy the shared `eft-create-order` function (retired collagen excluded), Pets `pets-eft-create-order`, and Pets web build. Verify the deployed programme API and routes before enabling Pets application intake and financial activation. The active commercial policy must equal wellness on every commercial field.

Review applications through restricted staff operations; approve only a verified matching auth account, with `PETS-` code and explicit professional clearance where required. Partners accept the matching agreement in their Pets dashboard. Use the existing reconciliation and payout runbook in the main repository; never treat a screenshot as cleared payment.

Recruitment QR: `/partners/pets-recruitment-qr.png` and `.svg` point to `https://pets.peptide-south-africa.com/affiliate`. Customer QR is generated only for an approved, accepted partner and points to their unique `/r/pets/PETS-…?via=qr` URL.

Rollback new liabilities by disabling only `pets_b2b.financial_activation` and application intake. Preserve ledger, policies, orders and historical product definitions. Restore the prior Pets deployment `https://peptide-south-africa-pets-bgxoxzte0-lutho8s-projects.vercel.app` only if necessary; do not drop shared tables. The migration is additive except for strengthened checks and replacement RPC definitions; keep it during a frontend rollback.

Production smoke tests and activation readback are recorded separately in the final release report. Local authentication evidence does not by itself certify production OAuth/email delivery or bank connectivity.
