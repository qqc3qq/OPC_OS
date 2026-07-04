import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUIStore } from '../stores/useUIStore'

export function useKeyboardShortcuts() {
  const navigate = useNavigate()
  const setCommandPaletteOpen = useUIStore(s => s.setCommandPaletteOpen)

  useEffect(() => {
    function handle(e: KeyboardEvent) {
      const meta = e.ctrlKey || e.metaKey

      if (meta && e.key === 'k') {
        e.preventDefault()
        setCommandPaletteOpen(true)
        return
      }

      if (meta && e.key >= '1' && e.key <= '7') {
        e.preventDefault()
        const routes = ['/', '/projects', '/tasks', '/calendar', '/notes', '/ai', '/settings']
        navigate(routes[Number(e.key) - 1])
        return
      }

      if (meta && e.key === ',') {
        e.preventDefault()
        navigate('/settings')
        return
      }
    }

    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [navigate, setCommandPaletteOpen])
}
