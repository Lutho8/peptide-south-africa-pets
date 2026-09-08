import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { HelmetProvider } from 'react-helmet-async'
import './index.css'
import App from './App.tsx'
import { initMetaPixel } from './lib/analytics'

initMetaPixel()

const basename =
  window.location.pathname === '/pets' || window.location.pathname.startsWith('/pets/')
    ? '/pets'
    : '/'

const root = document.getElementById('root')!
const app = (
  <HelmetProvider>
    <BrowserRouter basename={basename}>
      <App />
    </BrowserRouter>
  </HelmetProvider>
)

const normalizePath = (value: string) => value.replace(/\/+$/, '') || '/'
const prerenderPath = root.dataset.prerenderPath
const canHydrate =
  root.hasChildNodes() &&
  typeof prerenderPath === 'string' &&
  normalizePath(prerenderPath) === normalizePath(window.location.pathname)

if (canHydrate) hydrateRoot(root, app)
else {
  root.replaceChildren()
  createRoot(root).render(app)
}
