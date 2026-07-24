import { Suspense, lazy } from 'react'
import { Routes, Route } from 'react-router'
import Layout from '@/components/Layout'
import Pets from '@/pages/Pets'

// Route-level code splitting — the landing page stays eager (LCP), the
// funnel/evidence routes load on demand.
const ProductPage = lazy(() => import('@/pages/ProductPage'))
const SciencePage = lazy(() => import('@/pages/SciencePage'))
const WaitlistPage = lazy(() => import('@/pages/WaitlistPage'))
const QuizPage = lazy(() => import('@/pages/QuizPage'))

function RouteFallback() {
  return (
    <div className="flex min-h-[60dvh] items-center justify-center bg-cream">
      <span className="mono-label animate-pulse !text-[11px] text-espresso-70">LOADING…</span>
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Pets />} />
        <Route path="pets" element={<Pets />} />
        <Route
          path="product/:slug"
          element={
            <Suspense fallback={<RouteFallback />}>
              <ProductPage />
            </Suspense>
          }
        />
        <Route
          path="science"
          element={
            <Suspense fallback={<RouteFallback />}>
              <SciencePage />
            </Suspense>
          }
        />
        <Route
          path="waitlist"
          element={
            <Suspense fallback={<RouteFallback />}>
              <WaitlistPage />
            </Suspense>
          }
        />
        <Route
          path="quiz"
          element={
            <Suspense fallback={<RouteFallback />}>
              <QuizPage />
            </Suspense>
          }
        />
        <Route path="*" element={<Pets />} />
      </Route>
    </Routes>
  )
}
