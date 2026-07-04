import { useLocation } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Button } from '@ceo-os/ui'
import { useUIStore } from '../../stores/useUIStore'
import { formatDate } from '@ceo-os/shared'

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/calendar': 'Calendar',
  '/notes': 'Notes',
  '/ai': 'AI Assistant',
  '/settings': 'Settings',
}

export function TopBar(): JSX.Element {
  const location = useLocation()
  const setCommandPaletteOpen = useUIStore(s => s.setCommandPaletteOpen)
  const today = formatDate(new Date())

  const basePath = '/' + location.pathname.split('/')[1]
  const title = PAGE_TITLES[basePath] || 'CEO OS'

  return (
    <div className="h-12 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-sm">{title}</span>
        <span className="text-xs text-zinc-500">{today}</span>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs text-zinc-500 gap-2"
          onClick={() => setCommandPaletteOpen(true)}
        >
          <Search className="h-3 w-3" />
          <span>Ctrl+K</span>
        </Button>
      </div>
    </div>
  )
}
