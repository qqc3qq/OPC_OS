import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@ceo-os/ui'
import { useUIStore } from '../../stores/useUIStore'
import { useI18n } from '../../i18n'
import { LayoutDashboard, FolderKanban, CheckSquare, Calendar, StickyNote, Bot, Settings, Sun, Moon } from 'lucide-react'

export function CommandPalette(): JSX.Element {
  const navigate = useNavigate()
  const { t } = useI18n()
  const open = useUIStore(s => s.commandPaletteOpen)
  const setOpen = useUIStore(s => s.setCommandPaletteOpen)
  const theme = useUIStore(s => s.theme)
  const toggleTheme = useUIStore(s => s.toggleTheme)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) { e.preventDefault(); setOpen(!open) }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, setOpen])

  const nav = [
    { to: '/', icon: LayoutDashboard, label: 'menu.dashboard' },
    { to: '/projects', icon: FolderKanban, label: 'menu.projects' },
    { to: '/tasks', icon: CheckSquare, label: 'menu.tasks' },
    { to: '/calendar', icon: Calendar, label: 'menu.calendar' },
    { to: '/notes', icon: StickyNote, label: 'menu.notes' },
    { to: '/ai', icon: Bot, label: 'menu.ai' },
    { to: '/settings', icon: Settings, label: 'menu.settings' },
  ]

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={t('command.placeholder')} />
      <CommandList>
        <CommandEmpty>{t('common.none')}</CommandEmpty>
        <CommandGroup heading={t('command.navigation')}>
          {nav.map(item => (
            <CommandItem key={item.to} onSelect={() => { navigate(item.to); setOpen(false) }}>
              <item.icon className="mr-2 h-4 w-4" /> {t(item.label)}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading={t('command.actions')}>
          <CommandItem onSelect={toggleTheme}>
            {theme === 'dark' ? <Moon className="mr-2 h-4 w-4" /> : <Sun className="mr-2 h-4 w-4" />}
            {t('command.toggleTheme')}
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
