import { useEffect } from 'react'
import { useUIStore } from '../../stores/useUIStore'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export function Toast(): JSX.Element {
  const toasts = useUIStore(s => s.toasts)
  const removeToast = useUIStore(s => s.removeToast)

  if (toasts.length === 0) return <></>

  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg animate-in slide-in-from-right ${
            toast.variant === 'error' ? 'bg-red-950 border-red-800 text-red-200' :
            toast.variant === 'success' ? 'bg-green-950 border-green-800 text-green-200' :
            'bg-card border-border text-foreground'
          }`}
        >
          {toast.variant === 'error' && <AlertCircle className="h-4 w-4" />}
          {toast.variant === 'success' && <CheckCircle className="h-4 w-4" />}
          {!toast.variant && <Info className="h-4 w-4" />}
          <span className="text-sm">{toast.title}</span>
          <button onClick={() => removeToast(toast.id)} className="ml-2 opacity-70 hover:opacity-100">
            <X className="h-3 w-3" />
          </button>
        </div>
      ))}
    </div>
  )
}
