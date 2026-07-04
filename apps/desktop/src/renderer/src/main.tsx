import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import '@ceo-os/ui/src/styles/globals.css'

// Log unhandled errors to file
window.addEventListener('error', (e) => {
  const text = `RENDERER ERROR: ${e.message || e.error?.message}\n${e.error?.stack || ''}`
  try { window.api?.system?.writeErrorLog(text) } catch {}
})

window.addEventListener('unhandledrejection', (e) => {
  const text = `PROMISE REJECTION: ${String(e.reason?.message || e.reason)}\n${e.reason?.stack || ''}`
  try { window.api?.system?.writeErrorLog(text) } catch {}
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
