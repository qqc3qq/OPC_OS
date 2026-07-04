import { create } from 'zustand'

interface UIState {
  sidebarCollapsed: boolean
  commandPaletteOpen: boolean
  theme: 'dark' | 'light'
  toasts: Toast[]
  toggleSidebar: () => void
  setCommandPaletteOpen: (open: boolean) => void
  toggleTheme: () => void
  addToast: (toast: Omit<Toast, 'id'>) => void
  removeToast: (id: string) => void
}

export interface Toast {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error'
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  commandPaletteOpen: false,
  theme: 'dark',
  toasts: [],
  toggleSidebar: () => set(s => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),
  toggleTheme: () => set(s => {
    const next = s.theme === 'dark' ? 'light' : 'dark'
    document.documentElement.classList.toggle('dark', next === 'dark')
    localStorage.setItem('ceo-os-theme', next)
    return { theme: next }
  }),
  addToast: (toast) => set(s => ({
    toasts: [...s.toasts, { ...toast, id: crypto.randomUUID() }]
  })),
  removeToast: (id) => set(s => ({
    toasts: s.toasts.filter(t => t.id !== id)
  }))
}))
