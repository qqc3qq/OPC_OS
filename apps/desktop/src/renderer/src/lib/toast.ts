import { useUIStore } from '../stores/useUIStore'

export function toast(title: string, variant: 'default' | 'success' | 'error' = 'default') {
  useUIStore.getState().addToast({ title, variant })
  setTimeout(() => {
    const toasts = useUIStore.getState().toasts
    if (toasts.length > 0) {
      useUIStore.getState().removeToast(toasts[toasts.length - 1].id)
    }
  }, 3000)
}
