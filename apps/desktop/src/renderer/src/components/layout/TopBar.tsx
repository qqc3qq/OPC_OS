import { useLocation } from 'react-router-dom'
import { Search } from 'lucide-react'
import { Button } from '@ceo-os/ui'
import { useUIStore } from '../../stores/useUIStore'
import { useI18n } from '../../i18n'

const PAGE_KEYS: Record<string, string> = {
  '/': 'menu.dashboard',
  '/projects': 'menu.projects',
  '/tasks': 'menu.tasks',
  '/calendar': 'menu.calendar',
  '/notes': 'menu.notes',
  '/ai': 'menu.ai',
  '/settings': 'menu.settings',
}

export function TopBar(): JSX.Element {
  const location = useLocation()
  const { t } = useI18n()
  const setCommandPaletteOpen = useUIStore(s => s.setCommandPaletteOpen)
  const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

  const basePath = '/' + location.pathname.split('/')[1]
  const title = t(PAGE_KEYS[basePath] || 'app.name')

  return (
    <div className="h-12 border-b border-border bg-card/30 flex items-center justify-between px-4 shrink-0">
      <div className="flex items-center gap-3">
        <span className="font-semibold text-sm">{title}</span>
        <span className="text-xs text-muted-foreground">{today}</span>
      </div>
      <Button variant="outline" size="sm" className="h-7 text-xs text-muted-foreground gap-2" onClick={() => setCommandPaletteOpen(true)}>
        <Search className="h-3 w-3" />
        <span>Ctrl+K</span>
      </Button>
    </div>
  )
}
