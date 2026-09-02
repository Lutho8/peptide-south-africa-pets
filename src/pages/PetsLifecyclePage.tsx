import { useEffect, useMemo, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { Activity, BarChart3, CheckCircle2, ShoppingBag, Users } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import Seo from '@/components/Seo'

interface LifecycleEvent {
  id: string
  created_at: string
  event: string
  session_id: string
  user_id: string | null
  order_id: string | null
}

export default function PetsLifecyclePage() {
  const [user, setUser] = useState<User | null | undefined>(undefined)
  const [events, setEvents] = useState<LifecycleEvent[]>([])
  const [orderCount, setOrderCount] = useState(0)
  const [consentCount, setConsentCount] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    void supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => {
    if (!user) return
    const since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    void (async () => {
      const [eventsResult, ordersResult, consentsResult] = await Promise.all([
        supabase.from('psa_pets_lifecycle_events').select('id,created_at,event,session_id,user_id,order_id').gte('created_at', since).order('created_at', { ascending: false }).limit(500),
        supabase.from('orders').select('id', { count: 'exact', head: true }).ilike('order_description', 'Peptides4Pets:%').gte('created_at', since),
        supabase.from('psa_pets_checkout_consents').select('id', { count: 'exact', head: true }).gte('accepted_at', since),
      ])
      const firstError = eventsResult.error ?? ordersResult.error ?? consentsResult.error
      if (firstError) {
        setError('Admin access is required to view Pets lifecycle analytics.')
        return
      }
      setEvents((eventsResult.data ?? []) as LifecycleEvent[])
      setOrderCount(ordersResult.count ?? 0)
      setConsentCount(consentsResult.count ?? 0)
    })()
  }, [user])

  const summary = useMemo(() => {
    const sessions = new Set(events.map((event) => event.session_id)).size
    const navigators = events.filter((event) => event.event === 'pets_research_navigator_completed').length
    const checkoutStarts = events.filter((event) => event.event === 'pets_checkout_started').length
    const portalUsers = new Set(events.filter((event) => event.event === 'pets_portal_viewed').map((event) => event.user_id).filter(Boolean)).size
    const conversion = checkoutStarts > 0 ? Math.round((orderCount / checkoutStarts) * 1000) / 10 : 0
    return { sessions, navigators, checkoutStarts, portalUsers, conversion }
  }, [events, orderCount])

  if (user === undefined) return <div className="min-h-[70dvh] bg-cream p-16 text-center text-espresso-70">Loading…</div>
  if (!user) return <div className="min-h-[70dvh] bg-cream p-16 text-center text-espresso-70">Sign in through the Pets Account before opening lifecycle analytics.</div>

  return (
    <section className="min-h-[75dvh] bg-cream py-14">
      <Seo title="Pets Lifecycle Analytics" description="Private Peptides4Pets lifecycle analytics." path="/admin/lifecycle" noindex />
      <div className="psa-container">
        <p className="mono-label text-clinical">PRIVATE OPERATIONS · 30 DAYS</p>
        <h1 className="mt-3 font-serif text-4xl font-medium text-espresso md:text-5xl">Pets lifecycle analytics.</h1>
        <p className="mt-3 max-w-2xl text-espresso-70">Commerce, consent, portal and research-interest signals remain in the Pets data path while the backend develops toward a future veterinary-care layer.</p>
        {error ? (
          <p className="mt-8 rounded-2xl border border-alert/30 bg-warmwhite p-5 text-alert">{error}</p>
        ) : (
          <>
            <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
              <Metric icon={<Users />} label="Unique sessions" value={summary.sessions} />
              <Metric icon={<BarChart3 />} label="Navigator completions" value={summary.navigators} />
              <Metric icon={<ShoppingBag />} label="Checkout starts" value={summary.checkoutStarts} />
              <Metric icon={<CheckCircle2 />} label="Consent receipts" value={consentCount} />
              <Metric icon={<Activity />} label="Start → order" value={`${summary.conversion}%`} />
            </div>
            <div className="mt-10 overflow-hidden rounded-[20px] border border-sand bg-warmwhite">
              <div className="border-b border-sand p-5"><p className="mono-label text-amber-deep">RECENT PETS SIGNALS</p></div>
              <div className="divide-y divide-sand">
                {events.slice(0, 40).map((event) => (
                  <div key={event.id} className="grid gap-2 p-4 text-sm md:grid-cols-[1fr_0.7fr_1fr]">
                    <span className="mono-data text-espresso">{event.event}</span>
                    <span className="mono-data text-espresso-70">{event.user_id ? 'AUTHENTICATED' : 'ANONYMOUS'}</span>
                    <span className="text-espresso-70 md:text-right">{new Date(event.created_at).toLocaleString('en-ZA')}</span>
                  </div>
                ))}
                {events.length === 0 && <p className="p-8 text-center text-espresso-70">No Pets lifecycle events in this window yet.</p>}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return <div className="rounded-[20px] border border-sand bg-warmwhite p-5"><span className="text-clinical">{icon}</span><p className="mono-data mt-4 text-3xl font-bold text-espresso">{value}</p><p className="mono-label mt-1 !text-[9px] text-espresso-70">{label}</p></div>
}
