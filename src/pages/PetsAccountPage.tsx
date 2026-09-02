import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { User } from '@supabase/supabase-js'
import { Link, useNavigate } from 'react-router'
import { ArrowRight, CheckCircle2, FileCheck2, LogOut, Mail, PackageCheck, PawPrint, RefreshCcw, Truck } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { addToCart } from '@/lib/cart'
import { trackPets } from '@/lib/analytics'
import Seo from '@/components/Seo'

interface PetsOrder {
  id: string
  created_at: string
  total: number
  status: string
  public_ref: string
  order_description: string | null
  payment_provider: string
  shipping_method: string | null
  order_items: Array<{ name?: string; quantity?: number }> | null
}

interface PetDetail {
  order_id: string
  pet_name: string
  pet_species: string
}

interface ConsentReceipt {
  order_id: string
  policy_version: string
  accepted_at: string
  marketing_consent: boolean
}

const stages = ['pending', 'paid', 'packed', 'dispatched', 'delivered']

function stageIndex(status: string): number {
  const normalized = status.toLowerCase()
  if (['completed', 'fulfilled', 'delivered'].includes(normalized)) return 4
  if (['shipped', 'dispatched'].includes(normalized)) return 3
  if (['processing', 'packed'].includes(normalized)) return 2
  if (['paid', 'payment_confirmed'].includes(normalized)) return 1
  return 0
}

export default function PetsAccountPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [orders, setOrders] = useState<PetsOrder[]>([])
  const [details, setDetails] = useState<PetDetail[]>([])
  const [consents, setConsents] = useState<ConsentReceipt[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [magicEmail, setMagicEmail] = useState('')
  const [magicSent, setMagicSent] = useState(false)

  useEffect(() => {
    const apply = (next: User | null) => {
      setUser(next)
      if (next) setLoading(true)
    }
    void supabase.auth.getUser().then(({ data }) => apply(data.user))
    const { data } = supabase.auth.onAuthStateChange((_event, session) => apply(session?.user ?? null))
    return () => data.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!user) return
    void (async () => {
      const [ordersResult, detailsResult, consentsResult] = await Promise.all([
        supabase
          .from('orders')
          .select('id,created_at,total,status,public_ref,order_description,payment_provider,shipping_method,order_items')
          .eq('user_id', user.id)
          .ilike('order_description', 'Peptides4Pets:%')
          .order('created_at', { ascending: false }),
        supabase
          .from('psa_pets_order_details')
          .select('order_id,pet_name,pet_species')
          .eq('user_id', user.id),
        supabase
          .from('psa_pets_checkout_consents')
          .select('order_id,policy_version,accepted_at,marketing_consent')
          .eq('user_id', user.id),
      ])
      const firstError = ordersResult.error ?? detailsResult.error ?? consentsResult.error
      if (firstError) setError('Your Pets account could not be loaded. Please try again.')
      setOrders((ordersResult.data ?? []) as PetsOrder[])
      setDetails((detailsResult.data ?? []) as PetDetail[])
      setConsents((consentsResult.data ?? []) as ConsentReceipt[])
      setLoading(false)
      const loadedOrders = (ordersResult.data ?? []) as PetsOrder[]
      trackPets('pets_portal_viewed', {
        order_count: loadedOrders.length,
        latest_stage: loadedOrders[0]?.status ?? 'none',
      })
      trackPets('pets_portal_orders_viewed', { order_count: loadedOrders.length })
    })()
  }, [user])

  const detailByOrder = useMemo(
    () => new Map(details.map((detail) => [detail.order_id, detail])),
    [details],
  )
  const consentByOrder = useMemo(
    () => new Map(consents.map((receipt) => [receipt.order_id, receipt])),
    [consents],
  )

  async function google() {
    setError('')
    const { error: authError } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/account` },
    })
    if (authError) setError(authError.message)
  }

  async function magicLink(event: FormEvent) {
    event.preventDefault()
    setError('')
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: magicEmail.trim(),
      options: { emailRedirectTo: `${location.origin}/account` },
    })
    if (authError) setError(authError.message)
    else setMagicSent(true)
  }

  function reorder(order: PetsOrder) {
    const quantity = order.order_items?.[0]?.quantity ?? 1
    addToCart('mobility-collagen', quantity)
    trackPets('pets_reorder_started', { order_id: order.id, item_count: quantity })
    navigate('/checkout')
  }

  async function signOut() {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (user === undefined) {
    return <div className="flex min-h-[65dvh] items-center justify-center bg-cream text-espresso-70">Loading secure account…</div>
  }

  if (!user) {
    return (
      <section className="min-h-[75dvh] bg-cream py-16">
        <Seo title="Pets Account — Peptides4Pets" description="Secure Peptides4Pets order, report and consent records." path="/account" noindex />
        <div className="psa-container max-w-2xl">
          <div className="rounded-[24px] border border-sand bg-warmwhite p-8 shadow-card md:p-12">
            <p className="mono-label text-clinical">PEPTIDES4PETS ACCOUNT</p>
            <h1 className="mt-4 font-serif text-4xl font-medium text-espresso md:text-5xl">One secure record for every stage.</h1>
            <p className="mt-4 leading-relaxed text-espresso-70">Sign in to follow Pets orders, fulfilment milestones, report scope and versioned acknowledgement receipts.</p>
            <button onClick={google} className="mt-8 flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-espresso px-6 py-4 font-semibold text-cream hover:bg-clinical">
              Continue with Google <ArrowRight className="h-4 w-4" />
            </button>
            <div className="mono-label my-5 flex items-center gap-3 !text-[10px] text-espresso-70"><span className="h-px flex-1 bg-sand" />OR EMAIL LINK<span className="h-px flex-1 bg-sand" /></div>
            {magicSent ? (
              <p className="flex items-center gap-2 rounded-2xl bg-clinical-tint p-4 text-sm text-clinical"><Mail className="h-4 w-4" />Check your inbox, then return here.</p>
            ) : (
              <form onSubmit={magicLink} className="flex flex-col gap-3 sm:flex-row">
                <input type="email" required value={magicEmail} onChange={(event) => setMagicEmail(event.target.value)} placeholder="you@example.com" className="min-w-0 flex-1 rounded-xl border border-sand bg-cream px-4 py-3 outline-none focus:border-amber" />
                <button className="mono-label cursor-pointer rounded-full border border-espresso/25 px-5 py-3 !text-[10px] text-espresso hover:border-amber">EMAIL SECURE LINK</button>
              </form>
            )}
            {error && <p className="mt-4 text-sm text-alert">{error}</p>}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-[75dvh] bg-cream py-12 md:py-16">
      <Seo title="Pets Account — Peptides4Pets" description="Secure Peptides4Pets order, report and consent records." path="/account" noindex />
      <div className="psa-container">
        <div className="flex flex-col justify-between gap-4 border-b border-sand pb-8 md:flex-row md:items-end">
          <div>
            <p className="mono-label text-clinical">PEPTIDES4PETS ACCOUNT</p>
            <h1 className="mt-3 font-serif text-4xl font-medium text-espresso md:text-5xl">Research and order record.</h1>
            <p className="mt-3 text-sm text-espresso-70">Signed in as {user.email}</p>
          </div>
          <button onClick={signOut} className="mono-label inline-flex cursor-pointer items-center gap-2 self-start rounded-full border border-espresso/20 px-4 py-2 !text-[10px] text-espresso"><LogOut className="h-4 w-4" />SIGN OUT</button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          <PortalLink to="/science" icon={<FileCheck2 className="h-5 w-5" />} title="Evidence library" body="Study type, citation and evidence-gap notes." onClick={() => trackPets('pets_portal_reports_viewed', { placement: 'portal' })} />
          <PortalLink to="/verify" icon={<CheckCircle2 className="h-5 w-5" />} title="Reports & scope" body="See which sample, method and batch a report describes." onClick={() => trackPets('pets_portal_reports_viewed', { placement: 'portal' })} />
          <PortalLink to="/quiz" icon={<PawPrint className="h-5 w-5" />} title="Research navigator" body="Update research interests without receiving a dose or treatment plan." />
        </div>

        <div className="mt-10">
          <p className="mono-label text-amber-deep">PETS ORDERS</p>
          {loading && <p className="mt-5 text-espresso-70">Loading orders…</p>}
          {error && <p className="mt-5 rounded-2xl border border-alert/30 p-4 text-sm text-alert">{error}</p>}
          {!loading && orders.length === 0 && (
            <div className="mt-5 rounded-[20px] border border-sand bg-warmwhite p-8">
              <h2 className="font-serif text-2xl font-semibold text-espresso">No Pets orders yet.</h2>
              <p className="mt-2 text-espresso-70">Mobility Collagen is the only current checkout product. Experimental peptide pages remain research profiles only.</p>
              <Link to="/#launch" className="mono-label mt-5 inline-flex items-center gap-2 !text-[10px] text-amber-deep">VIEW CATALOGUE <ArrowRight className="h-4 w-4" /></Link>
            </div>
          )}
          <div className="mt-5 space-y-5">
            {orders.map((order) => {
              const detail = detailByOrder.get(order.id)
              const receipt = consentByOrder.get(order.id)
              const activeStage = stageIndex(order.status)
              return (
                <article key={order.id} className="rounded-[20px] border border-sand bg-warmwhite p-6 md:p-8">
                  <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                    <div>
                      <p className="mono-data text-[11px] uppercase text-espresso-70">ORDER {order.public_ref}</p>
                      <h2 className="mt-2 font-serif text-2xl font-semibold text-espresso">{order.order_description}</h2>
                      <p className="mt-1 text-sm text-espresso-70">{new Date(order.created_at).toLocaleDateString('en-ZA')} · {detail ? `${detail.pet_name} · ${detail.pet_species}` : 'Pet details recorded'}</p>
                    </div>
                    <p className="mono-data font-bold text-espresso">R{Number(order.total).toLocaleString('en-ZA')}</p>
                  </div>
                  <div className="mt-7 grid grid-cols-5 gap-2">
                    {stages.map((stage, index) => (
                      <div key={stage} className="min-w-0">
                        <div className={`h-1.5 rounded-full ${index <= activeStage ? 'bg-clinical' : 'bg-sand'}`} />
                        <p className={`mono-data mt-2 truncate text-[9px] uppercase ${index <= activeStage ? 'text-clinical' : 'text-espresso-70'}`}>{stage}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-7 grid gap-3 text-sm md:grid-cols-3">
                    <Info icon={<PackageCheck className="h-4 w-4" />} label="Payment" value={order.status === 'pending' ? 'Awaiting verified EFT' : order.status} />
                    <Info icon={<Truck className="h-4 w-4" />} label="Fulfilment" value={order.shipping_method ?? 'Local courier'} />
                    <Info icon={<FileCheck2 className="h-4 w-4" />} label="Consent receipt" value={receipt ? `${receipt.policy_version} · ${new Date(receipt.accepted_at).toLocaleDateString('en-ZA')}` : 'Pending record'} />
                  </div>
                  <button onClick={() => reorder(order)} className="mono-label mt-6 inline-flex cursor-pointer items-center gap-2 rounded-full border border-espresso/25 px-5 py-3 !text-[10px] text-espresso hover:border-amber hover:text-amber-deep"><RefreshCcw className="h-4 w-4" />MANUAL REORDER</button>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

function PortalLink({ to, icon, title, body, onClick }: { to: string; icon: React.ReactNode; title: string; body: string; onClick?: () => void }) {
  return <Link to={to} onClick={onClick} className="rounded-[20px] border border-sand bg-warmwhite p-5 transition-colors hover:border-amber"><span className="text-clinical">{icon}</span><h2 className="mt-3 font-serif text-xl font-semibold text-espresso">{title}</h2><p className="mt-1 text-sm leading-relaxed text-espresso-70">{body}</p></Link>
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-2xl bg-cream p-4"><p className="flex items-center gap-2 text-clinical">{icon}<span className="mono-label !text-[9px]">{label}</span></p><p className="mt-2 break-words text-espresso-70">{value}</p></div>
}
