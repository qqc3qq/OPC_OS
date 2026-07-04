import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import '@ceo-os/ui/src/styles/globals.css'

function showError(title: string, message: string, stack?: string) {
  const text = `${title}\n${message}\n${stack || ''}`
  document.getElementById('root')!.innerHTML = `
    <div style="padding:40px;color:#fafafa;background:#09090b;min-height:100vh;font-family:monospace">
      <h1 style="color:#ef4444;margin-bottom:12px">${title}</h1>
      <pre id="err-text" style="background:#18181b;padding:16px;border-radius:8px;overflow:auto;font-size:12px;max-height:45vh;white-space:pre-wrap">${message}\n\n${stack || ''}</pre>
      <button id="err-copy" style="margin-top:16px;padding:10px 24px;background:#3b82f6;color:white;border:none;border-radius:8px;font-size:14px;cursor:pointer">Click to Copy Error</button>
      <span id="err-copied" style="display:none;margin-left:12px;color:#10b981;font-size:13px">Copied! Now paste to Claude Code.</span>
      <p id="err-file" style="margin-top:12px;color:#71717a;font-size:12px"></p>
    </div>
  `
  document.getElementById('err-copy')!.onclick = () => {
    navigator.clipboard.writeText(text).then(() => {
      document.getElementById('err-copied')!.style.display = 'inline'
    })
  }
  try {
    if (window.api?.system?.writeErrorLog) {
      window.api.system.writeErrorLog(text).then((logPath) => {
        if (logPath) document.getElementById('err-file')!.textContent = 'Also saved to: ' + logPath
      })
    }
  } catch {}
}

window.addEventListener('error', (e) => {
  showError('Fatal Error', e.message || e.error?.message || 'Unknown', e.error?.stack)
})

window.addEventListener('unhandledrejection', (e) => {
  showError('Unhandled Promise Rejection', String(e.reason?.message || e.reason), e.reason?.stack)
})

try {
  if (!window.api) {
    showError('Preload Failed', 'window.api is undefined - the preload script did not load.')
  }

  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} catch (err: any) {
  showError('Startup Error', err.message, err.stack)
}
finally {}
