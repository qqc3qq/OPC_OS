import { Component, type ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  message: string
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '' }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message + '\n\n' + (error.stack || '')
    }
  }

  componentDidCatch(error: Error) {
    try { window.api?.system?.writeErrorLog('[Boundary] ' + error.message + '\n' + error.stack) } catch {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#09090b', color: '#fafafa', fontFamily: 'monospace'
        }}>
          <div style={{
            background: '#18181b', border: '1px solid #27272a', borderRadius: 12,
            padding: 32, maxWidth: 600, width: '100%', textAlign: 'center'
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>&#9888;</div>
            <h1 style={{ color: '#ef4444', fontSize: 18, marginBottom: 8, fontFamily: 'sans-serif' }}>Application Error</h1>
            <pre style={{
              background: '#09090b', padding: 16, borderRadius: 8, textAlign: 'left',
              fontSize: 12, maxHeight: 300, overflow: 'auto', whiteSpace: 'pre-wrap',
              marginBottom: 16, border: '1px solid #27272a'
            }}>{this.state.message || 'Unknown error'}</pre>
            <button
              onClick={() => {
                const t = this.state.message
                navigator.clipboard?.writeText(t)
                const el = document.getElementById('cb-msg')
                if (el) { el.style.display = 'inline'; el.textContent = 'Copied! Paste in Claude Code.' }
              }}
              style={{
                padding: '10px 24px', background: '#3b82f6', color: 'white', border: 'none',
                borderRadius: 8, fontSize: 14, cursor: 'pointer', fontWeight: 600
              }}
            >Copy Error to Clipboard</button>
            <span id="cb-msg" style={{ display: 'none', marginLeft: 12, color: '#10b981', fontSize: 13 }}></span>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
