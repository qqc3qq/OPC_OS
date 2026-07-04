import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import '@ceo-os/ui/src/styles/globals.css'

// Global error display for production debugging
window.addEventListener('error', (e) => {
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML = `<div style="padding:40px;color:#fafafa;background:#09090b;min-height:100vh;font-family:monospace">
      <h1 style="color:#ef4444">Fatal Error</h1>
      <pre style="background:#18181b;padding:16px;border-radius:8px;overflow:auto;font-size:12px">${e.message || e.error?.message || 'Unknown'}\n\n${e.error?.stack || ''}</pre>
    </div>`
  }
})

window.addEventListener('unhandledrejection', (e) => {
  const root = document.getElementById('root')
  if (root) {
    root.innerHTML = `<div style="padding:40px;color:#fafafa;background:#09090b;min-height:100vh;font-family:monospace">
      <h1 style="color:#ef4444">Unhandled Promise Rejection</h1>
      <pre style="background:#18181b;padding:16px;border-radius:8px;overflow:auto;font-size:12px">${String(e.reason?.message || e.reason)}\n\n${e.reason?.stack || ''}</pre>
    </div>`
  }
})

try {
  if (!window.api) {
    document.getElementById('root')!.innerHTML = `<div style="padding:40px;color:#fafafa;background:#09090b;min-height:100vh;font-family:monospace">
      <h1 style="color:#ef4444">Preload Failed</h1>
      <p>window.api is undefined. The preload script did not load correctly.</p>
    </div>`
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} catch (err: any) {
  document.getElementById('root')!.innerHTML = `<div style="padding:40px;color:#fafafa;background:#09090b;min-height:100vh;font-family:monospace">
    <h1 style="color:#ef4444">Startup Error</h1>
    <pre style="background:#18181b;padding:16px;border-radius:8px;overflow:auto;font-size:12px">${err.message}\n\n${err.stack}</pre>
  </div>`
}
finally {}
