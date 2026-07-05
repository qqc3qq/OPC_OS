import { Component, type ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  message: string
  copied: boolean
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false, message: '', copied: false }

  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message + '\n\n' + (error.stack || ''),
      copied: false
    }
  }

  componentDidCatch(error: Error) {
    try { window.api?.system?.writeErrorLog('[Boundary] ' + error.message + '\n' + error.stack) } catch {}
  }

  copyToClipboard = () => {
    const text = this.state.message
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.style.position = 'fixed'
      ta.style.left = '-9999px'
      ta.style.top = '-9999px'
      document.body.appendChild(ta)
      ta.focus()
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
      this.setState({ copied: true })
    } catch {
      // fallback
      try { navigator.clipboard?.writeText(text).then(() => this.setState({ copied: true })) } catch {}
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: '#09090b', color: '#fafafa', fontFamily: 'monospace', padding: 20
        }}>
          <div style={{
            background: '#18181b', border: '1px solid #27272a', borderRadius: 12,
            padding: 32, maxWidth: 650, width: '100%', textAlign: 'center'
          }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>&#9888;</div>
            <h1 style={{ color: '#ef4444', fontSize: 18, marginBottom: 12, fontFamily: 'sans-serif' }}>Application Error</h1>
            <pre style={{
              background: '#09090b', padding: 16, borderRadius: 8, textAlign: 'left',
              fontSize: 11, maxHeight: 350, overflow: 'auto', whiteSpace: 'pre-wrap',
              marginBottom: 16, border: '1px solid #27272a', lineHeight: 1.5
            }}>{this.state.message || 'Unknown error'}</pre>
            <button
              onClick={this.copyToClipboard}
              style={{
                padding: '12px 28px', background: this.state.copied ? '#10b981' : '#3b82f6',
                color: 'white', border: 'none', borderRadius: 8, fontSize: 14,
                cursor: 'pointer', fontWeight: 600, marginRight: 8
              }}
            >
              {this.state.copied ? 'Copied! Paste it to Claude Code' : 'Copy Full Error to Clipboard'}
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
