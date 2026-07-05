import { Component, type ReactNode } from 'react'
import { Card, CardContent, Button } from '@ceo-os/ui'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<{ children: ReactNode }, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    try {
      window.api?.system?.writeErrorLog('[ErrorBoundary] ' + error.message + '\n' + error.stack + '\n' + info.componentStack)
    } catch {}
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen flex items-center justify-center bg-background">
          <Card className="w-[500px] max-h-[80vh] overflow-auto">
            <CardContent className="p-8">
              <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
              <p className="text-sm text-zinc-400 mb-2">{this.state.error?.message || 'An unexpected error occurred.'}</p>
              {this.state.error?.stack && (
                <pre className="text-xs text-zinc-500 bg-card p-3 rounded-lg mb-4 overflow-auto max-h-60 whitespace-pre-wrap">{this.state.error.stack}</pre>
              )}
              <Button onClick={() => window.location.reload()}>
                <RefreshCw className="h-4 w-4 mr-2" /> Reload
              </Button>
            </CardContent>
          </Card>
        </div>
      )
    }
    return this.props.children
  }
}
