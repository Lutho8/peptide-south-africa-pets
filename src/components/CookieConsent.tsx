import { useEffect, useState } from 'react'
import { Link } from 'react-router'

const STORAGE_KEY = 'psa-cookie-consent'
const LEGACY_KEY = 'rtt-cookie-consent'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY)) return
    const timer = window.setTimeout(() => setVisible(true), 800)
    return () => window.clearTimeout(timer)
  }, [])

  const choose = (choice: 'accepted' | 'declined') => {
    localStorage.setItem(STORAGE_KEY, choice)
    setVisible(false)
  }

  if (!visible) return null
  return (
    <aside className="fixed inset-x-4 bottom-4 z-[100] mx-auto max-w-3xl rounded-2xl border border-espresso/20 bg-cream p-4 shadow-2xl md:flex md:items-center md:gap-5" aria-label="Cookie consent">
      <p className="text-sm leading-relaxed text-espresso-80">
        We use essential cookies and, with your permission, analytics cookies. Read our{' '}
        <Link to="/cookies" className="font-semibold underline">Cookie Policy</Link> and{' '}
        <Link to="/privacy" className="font-semibold underline">Privacy Policy</Link>.
      </p>
      <div className="mt-3 flex shrink-0 gap-2 md:mt-0">
        <button type="button" onClick={() => choose('declined')} className="rounded-full border border-espresso/30 px-4 py-2 text-xs font-semibold">Decline</button>
        <button type="button" onClick={() => choose('accepted')} className="rounded-full bg-clinical px-4 py-2 text-xs font-semibold text-cream">Accept</button>
      </div>
    </aside>
  )
}
