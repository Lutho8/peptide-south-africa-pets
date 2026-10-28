import { useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'
import Seo from '@/components/Seo'
import './partners.css'
export default function PartnerReferralPage() {
  const { code = '' } = useParams()
  const [search] = useSearchParams()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  async function choose(consent: boolean) {
    setBusy(true); setError('')
    try {
      const response = await fetch('/api/partner-attribution', { method: consent ? 'POST' : 'DELETE', headers: { 'Content-Type': 'application/json' }, ...(consent ? { body: JSON.stringify({ code, consent: true, campaign: search.get('campaign'), method: search.get('via') === 'qr' ? 'qr' : 'referral_click' }) } : {}) })
      if (!response.ok) { const result = await response.json(); throw new Error(result.error || 'Referral tracking could not be updated.') }
      navigate('/science', { replace: true })
    } catch (e) { setError(e instanceof Error ? e.message : 'Please try again.') } finally { setBusy(false) }
  }
  return <div className="pets-partners"><section className="partner-wrap partner-section"><Seo title="Pets partner referral | Peptides4Pets" description="Choose whether to allow optional Pets partner referral tracking." path="/affiliate" noindex /><p className="partner-eyebrow">PETS · PARTNER REFERRAL</p><h1>Research first. Your choice.</h1><p>A pet-care business shared this information with you. An approved partner may earn commission on qualifying purchases. This is not veterinary advice or an endorsement of treatment.</p><p>Allow an optional referral cookie to remember this Pets partner for the approved attribution period, up to 30 days. You can browse without it or enter the partner code at checkout. Analytics consent is a separate choice.</p><p>Partner code: <strong className="partner-code">{code}</strong></p><div className="partner-actions"><button disabled={busy} onClick={() => choose(true)} className="partner-button">Allow Pets referral tracking</button><button disabled={busy} onClick={() => choose(false)} className="partner-secondary">Continue without referral cookies</button></div>{error && <p role="alert" className="partner-notice">{error} <Link to="/science">Browse research without tracking</Link></p>}<p><Link to="/privacy">Privacy</Link> · <Link to="/affiliate/terms">Pets partner terms</Link></p></section></div>
}
