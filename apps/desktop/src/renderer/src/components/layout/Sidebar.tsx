import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FolderKanban, CheckSquare, Calendar,
  StickyNote, Bot, Settings, Zap
} from 'lucide-react'
import { cn } from '@ceo-os/ui'
import { useI18n } from '../../i18n'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'menu.dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'menu.projects' },
  { to: '/tasks', icon: CheckSquare, label: 'menu.tasks' },
  { to: '/calendar', icon: Calendar, label: 'menu.calendar' },
  { to: '/notes', icon: StickyNote, label: 'menu.notes' },
  { to: '/ai', icon: Bot, label: 'menu.ai' },
]

const BOTTOM_ITEMS = [
  { to: '/settings', icon: Settings, label: 'menu.settings' },
]

export function Sidebar(): JSX.Element {
  const { t } = useI18n()

  return (
    <div className="w-56 border-r border-border bg-card/30 flex flex-col shrink-0">
      <div className="h-12 border-b border-border flex items-center px-4 gap-2">
        <div className="h-7 w-7 rounded-md bg-primary flex items-center justify-center">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-sm">{t('app.name')}</span>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
              isActive
                ? 'bg-secondary/50 text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
            )}
          >
            <item.icon className="h-4 w-4" />
            {t(item.label)}
          </NavLink>
        ))}
      </nav>

      <div className="py-3 px-2 space-y-0.5 border-t border-border">
        {BOTTOM_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-1.5 rounded-md text-sm transition-colors',
              isActive
                ? 'bg-secondary/50 text-foreground font-medium'
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary/30'
            )}
          >
            <item.icon className="h-4 w-4" />
            {t(item.label)}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
