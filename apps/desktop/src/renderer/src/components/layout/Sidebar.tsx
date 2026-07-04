import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, FolderKanban, CheckSquare, Calendar,
  StickyNote, Bot, Settings, Zap
} from 'lucide-react'
import { cn } from '@ceo-os/ui'

const NAV_ITEMS = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/projects', icon: FolderKanban, label: 'Projects' },
  { to: '/tasks', icon: CheckSquare, label: 'Tasks' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/notes', icon: StickyNote, label: 'Notes' },
  { to: '/ai', icon: Bot, label: 'AI Assistant' },
]

const BOTTOM_ITEMS = [
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export function Sidebar(): JSX.Element {
  return (
    <div className="w-56 border-r border-border bg-card/50 backdrop-blur-sm flex flex-col shrink-0">
      <div className="h-12 border-b border-border flex items-center px-4 gap-2">
        <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
          <Zap className="h-4 w-4 text-white" />
        </div>
        <span className="font-semibold text-sm">CEO OS</span>
      </div>

      <nav className="flex-1 py-3 px-2 space-y-1">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-zinc-400 hover:text-foreground hover:bg-card'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="py-3 px-2 space-y-1 border-t border-border">
        {BOTTOM_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
              isActive
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-zinc-400 hover:text-foreground hover:bg-card'
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
