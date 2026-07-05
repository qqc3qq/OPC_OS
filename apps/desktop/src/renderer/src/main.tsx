import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import '@ceo-os/ui/src/styles/globals.css'

function log(msg: string) {
  try { window.api?.system?.writeErrorLog(msg) } catch {}
}

window.addEventListener('error', (e) => {
  log('[renderer] ERROR: ' + (e.message || e.error?.message || 'unknown') + '\n' + (e.error?.stack || ''))
})

window.addEventListener('unhandledrejection', (e) => {
  log('[renderer] REJECTION: ' + String(e.reason?.message || e.reason) + '\n' + (e.reason?.stack || ''))
})

try {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} catch (err: any) {
  log('[renderer] STARTUP: ' + (err?.message || '') + '\n' + (err?.stack || ''))
}
