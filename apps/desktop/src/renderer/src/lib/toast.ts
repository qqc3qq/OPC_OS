import { useUIStore } from '../stores/useUIStore'

export function toast(title: string, variant: 'default' | 'success' | 'error' = 'default') {
  const id = crypto.randomUUID()
  useUIStore.getState().addToast({ id, title, variant })
  setTimeout(() => {
    useUIStore.getState().removeToast(id)
  }, 3000)
}
