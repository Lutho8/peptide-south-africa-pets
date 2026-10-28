import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { Link } from 'react-router'
import { supabase } from '@/lib/supabase'
import Seo from '@/components/Seo'
import './partners.css'

type Enrolment = { id: string; status: string; referral_code: string; tier_key: string | null }
type Policy = { policy_version: string; commission_rate_bps: number; attribution_window_days: number; validation_days: number; minimum_payout_cents: number; terms_sha256: string }
type Ledger = { id: string; order_id: string; status: string; amount_cents: number; event_type: string; created_at: string; policy_version: string }
type Statement = { id: string; period_start: string; period_end: string; status: string; amount_cents: number; paid_at: string | null }
const zar = (cents: number) => new Intl.NumberFormat('en-ZA', { style: 'currency', currency: 'ZAR' }).format(cents / 100)

export default function PartnerDashboardPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [enrolment, setEnrolment] = useState<Enrolment | null>(null)
  const [policy, setPolicy] = useState<Policy | null>(null)
  const [active, setActive] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [ledger, setLedger] = useState<Ledger[]>([])
  const [statements, setStatements] = useState<Statement[]>([])
  const [qr, setQr] = useState('')
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => { setLoaded(false); setEnrolment(null); setPolicy(null); setLedger([]); setStatements([]); setQr(''); setAccepted(false); setActive(false); setUser(session?.user ?? null) })
    return () => data.subscription.unsubscribe()
  }, [])
  useEffect(() => {
    if (!user) return
    let live = true
    void (async () => {
      try {
        const programme = await supabase.from('partner_programmes').select('id,financial_activation').eq('programme_key', 'pets_b2b').single()
        if (programme.error) throw programme.error
        const [enrolments, policies] = await Promise.all([
          supabase.from('partner_enrolments').select('id,status,referral_code,tier_key').eq('programme_id', programme.data.id),
          supabase.from('partner_policies').select('policy_version,commission_rate_bps,attribution_window_days,validation_days,minimum_payout_cents,terms_sha256').eq('programme_id', programme.data.id).eq('active', true).not('approved_at', 'is', null).maybeSingle(),
        ])
        if (enrolments.error || policies.error) throw enrolments.error || policies.error
        const entry = enrolments.data?.[0] as Enrolment | undefined
        if (!live) return
        setActive(programme.data.financial_activation); setPolicy(policies.data); setEnrolment(entry ?? null)
        if (entry) {
          const [agreements, earnings, payouts] = await Promise.all([
            supabase.from('partner_agreement_acceptances').select('terms_version,terms_sha256').eq('enrolment_id', entry.id),
            supabase.from('partner_commission_ledger').select('id,order_id,status,amount_cents,event_type,created_at,policy_version').eq('programme_id', programme.data.id).eq('enrolment_id', entry.id).order('created_at', { ascending: false }),
            supabase.from('partner_payout_statements').select('id,period_start,period_end,status,amount_cents,paid_at').eq('programme_id', programme.data.id).eq('enrolment_id', entry.id).order('period_start', { ascending: false }),
          ])
          if (agreements.error || earnings.error || payouts.error) throw agreements.error || earnings.error || payouts.error
          if (!live) return
          setAccepted(Boolean(policies.data && agreements.data.some(a => a.terms_version === policies.data?.policy_version && a.terms_sha256 === policies.data?.terms_sha256)))
          setLedger(earnings.data ?? []); setStatements(payouts.data ?? [])
        }
        setLoaded(true)
      } catch { if (live) { setMessage('Your Pets partner records could not be loaded. Retry before relying on the amounts shown.'); setLoaded(false) } }
    })()
    return () => { live = false }
  }, [user, revision])
  const ready = Boolean(loaded && enrolment?.status === 'approved' && policy && accepted && active)
  const referral = ready ? `https://pets.peptide-south-africa.com/r/pets/${encodeURIComponent(enrolment!.referral_code)}` : ''
  useEffect(() => {
    if (!referral) return
    let live = true
    void import('qrcode').then(({ default: QRCode }) => QRCode.toDataURL(`${referral}?via=qr`, { width: 600, margin: 4, errorCorrectionLevel: 'M' })).then(value => { if (live) setQr(value) }).catch(() => { if (live) setMessage('QR generation failed. Your text referral link is still available.') })
    return () => { live = false }
  }, [referral])
  async function signIn(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage('')
    const { error } = await supabase.auth.signInWithOtp({ email: email.trim(), options: { emailRedirectTo: `${location.origin}/affiliate/dashboard` } })
    setMessage(error ? error.message : 'Check your email for the secure sign-in link. It returns to this Pets dashboard.'); setBusy(false)
  }
  async function google() {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${location.origin}/affiliate/dashboard` } })
    if (error) setMessage(error.message)
  }
  async function accept() {
    if (!enrolment || !policy) return
    if (policy.terms_sha256 !== '9d1c2c9cd2734bc3c6e10df6680ce26ac48c301ba37f3dbd120855dd167fcb1d') { setMessage('The agreement has changed. Please contact the team for the matching published terms before accepting.'); return }
    setBusy(true); setMessage('')
    const { error } = await supabase.rpc('accept_partner_agreement', { p_enrolment_id: enrolment.id })
    if (error) setMessage('Agreement acceptance failed. Refresh to check the current policy before retrying.')
    else { setRevision(value => value + 1); setMessage(`Pets policy ${policy.policy_version} accepted.`) }
    setBusy(false)
  }
  async function signOut() { await supabase.auth.signOut(); setLoaded(false); setEnrolment(null); setPolicy(null); setLedger([]); setStatements([]); setQr(''); setAccepted(false); setMessage('') }
  return <div className="pets-partners"><section className="partner-wrap partner-section"><Seo title="Pets partner dashboard | Peptides4Pets" description="Your secure Pets partner agreement, referral and payout records." path="/affiliate/dashboard" noindex /><p className="partner-eyebrow">PETS · SECURE PARTNER DASHBOARD</p><h1>Your Pets partnership.</h1>{user === undefined ? <p>Checking secure session…</p> : !user ? <div className="partner-card partner-form"><h2>Sign in with your application email.</h2><p>Pets sessions and approvals are separate from the main website. If you applied before creating an account, sign in here so the team can match your verified email during review.</p><button onClick={google} className="partner-secondary">Continue with Google</button><form onSubmit={signIn}><label>Email<input type="email" autoComplete="email" required value={email} onChange={e => setEmail(e.target.value)} /></label><button className="partner-button" disabled={busy}>{busy ? 'Sending…' : 'Email secure sign-in link'}</button></form><p><Link to="/affiliate">Apply for your pet business</Link></p></div> : <><div className="partner-actions"><button className="partner-secondary" onClick={() => { setMessage(''); setRevision(v => v + 1) }}>Refresh records</button><button className="partner-secondary" onClick={signOut}>Sign out</button></div>{!loaded ? <p>Loading authorised Pets records…</p> : !enrolment ? <p className="partner-notice">No Pets enrolment is linked to this verified account yet. An application may still be under review. Wellness approval does not confer Pets eligibility. <Link to="/affiliate">Pets application</Link></p> : <><p className="partner-notice">Pets application: <strong>{enrolment.status.replaceAll('_', ' ')}</strong>. {active ? 'Programme financial activation is on.' : 'Programme financial activation is off.'} {enrolment.tier_key && `Tier: ${enrolment.tier_key}.`}</p><section className="partner-section"><h2>Your Pets agreement</h2>{!policy ? <p>Commercial terms await owner approval. There is no live Pets agreement to accept and no promised commission rate.</p> : <><p>Policy: <strong>{policy.policy_version}</strong>. Qualifying commission: {policy.commission_rate_bps / 100}%. Attribution window: {policy.attribution_window_days} days. Validation: {policy.validation_days} days. Minimum payout: {zar(policy.minimum_payout_cents)}.</p><p className="partner-note partner-code">Agreement fingerprint: {policy.terms_sha256}</p><p><Link to="/affiliate/terms">Read the Pets terms before accepting</Link></p>{accepted ? <p>Current Pets agreement accepted.</p> : enrolment.status === 'approved' ? <button disabled={busy} className="partner-button" onClick={accept}>Accept this Pets agreement</button> : <p>Approval is required before agreement acceptance.</p>}</>}</section><section><h2>Your customer referral</h2>{ready ? <><p>Share this customer-facing link or QR. Disclose that qualifying referrals may earn you commission.</p><p className="partner-code"><a href={referral}>{referral}</a></p><p>Pets code: <strong>{enrolment.referral_code}</strong>. Customers can enter this at Pets checkout without optional referral cookies.</p>{qr && <a href={qr} download={`pets-${enrolment.referral_code}-qr.png`}><img src={qr} width="180" height="180" alt="Your uniquely tracked Pets customer referral QR" />Download customer QR</a>}</> : <p>Your referral link and customer QR become available after Pets approval, current agreement acceptance and programme activation.</p>}<p className="partner-note">Recruitment material uses <Link to="/affiliate">the Pets application</Link>, not your customer referral destination.</p></section><section className="partner-section"><h2>Cleared-payment commission</h2><p>Awaiting-payment orders earn R0. These records reflect verified financial events, including signed refund adjustments. They do not represent clinical outcomes or typical earnings.</p><div className="partner-grid">{[['Pending validation', 'pending_validation'], ['Available', 'available'], ['Reserved for payout', 'reserved_for_payout'], ['Paid', 'paid']].map(([label, status]) => <div key={status} className="partner-card"><h3>{label}</h3><p className="partner-stat">{zar(ledger.filter(row => row.status === status).reduce((sum, row) => sum + row.amount_cents, 0))}</p></div>)}</div><div className="partner-table-wrap"><table className="partner-table"><caption className="text-left py-4">Pets commission ledger</caption><thead><tr><th>Date</th><th>Order reference</th><th>Event</th><th>Status</th><th>Amount</th><th>Policy</th></tr></thead><tbody>{ledger.map(row => <tr key={row.id}><td>{new Date(row.created_at).toLocaleDateString('en-ZA')}</td><td title={row.order_id}>{row.order_id.slice(0, 8)}</td><td>{row.event_type}</td><td>{row.status.replaceAll('_', ' ')}</td><td>{zar(row.amount_cents)}</td><td>{row.policy_version}</td></tr>)}</tbody></table>{!ledger.length && <p>No cleared-payment commission records yet.</p>}</div></section><section><h2>Payout statements</h2><div className="partner-table-wrap"><table className="partner-table"><thead><tr><th>Period</th><th>Statement reference</th><th>Status</th><th>Amount</th><th>Paid date</th></tr></thead><tbody>{statements.map(row => <tr key={row.id}><td>{row.period_start} – {row.period_end}</td><td>{row.id.slice(0, 8)}</td><td>{row.status}</td><td>{zar(row.amount_cents)}</td><td>{row.paid_at ? new Date(row.paid_at).toLocaleDateString('en-ZA') : 'Not paid'}</td></tr>)}</tbody></table>{!statements.length && <p>No Pets payout statements yet. Payout eligibility follows your accepted Pets policy.</p>}</div></section></>}</>}{message && <p role="status" className="partner-notice">{message}</p>}</section></div>
}
