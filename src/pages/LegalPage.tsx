import { Helmet } from 'react-helmet-async'
import { Link } from 'react-router'

type Policy = 'cookies' | 'privacy' | 'terms' | 'returns'

const content: Record<Policy, { title: string; sections: Array<[string, string]> }> = {
  cookies: {
    title: 'Cookie Policy',
    sections: [
      ['How we use cookies', 'We use essential cookies for the basket, checkout, security and account sessions. With your consent, we may also use analytics cookies to understand site performance and improve the customer journey.'],
      ['Your choices', 'You may accept or decline optional cookies in our consent banner and can clear or block cookies in your browser. Essential cookies are required for checkout and account functions.'],
      ['Third-party services', 'Our hosting, analytics and checkout infrastructure may set limited cookies or similar technologies. Their processing is governed by their own privacy terms and our Privacy Policy.'],
    ],
  },
  privacy: {
    title: 'Privacy Policy',
    sections: [
      ['Information we collect', 'We collect information you provide for an order or enquiry, including your name, email, phone or WhatsApp number, delivery address, order details, EFT reference and consent records. We also collect limited technical and analytics data.'],
      ['How we use and share it', 'We use personal information to provide checkout, payment reconciliation, fulfilment, customer support, security and legally permitted communications. We share only what is necessary with hosting, payment, delivery, communications and professional service providers.'],
      ['Security and retention', 'We apply reasonable technical and organisational safeguards and retain records only as long as needed for service, legal, accounting, fraud-prevention and dispute purposes.'],
      ['Your POPIA rights', 'You may ask to access, correct or delete eligible personal information, object to certain processing, or withdraw marketing consent. Contact orders@peptide-south-africa.com.'],
    ],
  },
  terms: {
    title: 'Terms and Conditions',
    sections: [
      ['Use of this store', 'By using Peptides4Pets or placing an order, you agree to these terms. You must provide accurate information and use the site lawfully. Product availability and prices may change before an order is accepted.'],
      ['Research boundary', 'Products marked RESEARCH PROFILE · NOT FOR SALE OR ANIMAL ADMINISTRATION are supplied only under that stated research profile. Website content is educational and is not veterinary or medical advice. Mobility Collagen is presented separately as a nutritional product.'],
      ['Orders and EFT payment', 'Checkout is EFT-only. An order remains pending until the matching funds are received and reconciled. Incorrect, duplicate, overpaid, underpaid or unidentified transfers may delay fulfilment.'],
      ['Delivery and liability', 'Dispatch and delivery estimates are not guarantees. To the extent permitted by South African law, we are not liable for indirect loss and do not guarantee a particular research, health or performance outcome.'],
      ['Governing law', 'These terms are governed by South African law. Consumer rights that cannot legally be excluded remain unaffected.'],
    ],
  },
  returns: {
    title: 'Returns & Refund Policy',
    sections: [
      ['Opened products', 'For safety, integrity and chain-of-custody reasons, opened or used products cannot be returned. This does not limit rights that cannot be excluded under applicable consumer law.'],
      ['Eligible remedies', 'Contact us promptly if an item arrives damaged, is incorrect, or is materially defective. After verification, we may replace it or approve a refund. Include the order number and clear supporting photos where relevant.'],
      ['Cancellations', 'A pending order may be cancelled before dispatch. Once dispatched, eligibility depends on the condition of the returned unopened product and applicable law.'],
      ['Refund processing', 'Approved refunds are paid by EFT to a verified account belonging to the original payer. Allow 5–10 business days after approval and verification. Contact orders@peptide-south-africa.com.'],
    ],
  },
}

export default function LegalPage({ policy }: { policy: Policy }) {
  const page = content[policy]
  return (
    <article className="psa-container max-w-4xl py-16 md:py-24">
      <Helmet><title>{page.title} | Peptides4Pets</title><meta name="description" content={`${page.title} for Peptides4Pets by Peptide South Africa.`} /></Helmet>
      <Link to="/" className="mono-label text-clinical">← BACK TO STORE</Link>
      <h1 className="mt-6 font-serif text-4xl font-semibold text-espresso md:text-5xl">{page.title}</h1>
      <p className="mt-3 text-sm text-espresso-60">Last updated: September 2026</p>
      <div className="mt-10 space-y-8 text-espresso-80">
        {page.sections.map(([heading, body]) => <section key={heading}><h2 className="font-serif text-2xl font-semibold text-espresso">{heading}</h2><p className="mt-3 leading-7">{body}</p></section>)}
      </div>
    </article>
  )
}
