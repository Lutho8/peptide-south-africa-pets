import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

const basename =
  window.location.pathname === '/pets' || window.location.pathname.startsWith('/pets/')
    ? '/pets'
    : '/'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter basename={basename}>
    <App />
  </BrowserRouter>,
)
