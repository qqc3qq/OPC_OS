import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CommandDialog, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem,
} from '@ceo-os/ui'
import { useUIStore } from '../../stores/useUIStore'
import {
  LayoutDashboard, FolderKanban, CheckSquare, Calendar,
  StickyNote, Bot, Settings, Plus, Sun, Moon
} from 'lucide-react'

export function CommandPalette(): JSX.Element {
  const navigate = useNavigate()
  const open = useUIStore(s => s.commandPaletteOpen)
  const setOpen = useUIStore(s => s.setCommandPaletteOpen)
  const theme = useUIStore(s => s.theme)
  const toggleTheme = useUIStore(s => s.toggleTheme)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault()
        setOpen(!open)
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [open, setOpen])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => { navigate('/'); setOpen(false) }}>
            <LayoutDashboard className="mr-2 h-4 w-4" /> Dashboard
          </CommandItem>
          <CommandItem onSelect={() => { navigate('/projects'); setOpen(false) }}>
            <FolderKanban className="mr-2 h-4 w-4" /> Projects
          </CommandItem>
          <CommandItem onSelect={() => { navigate('/tasks'); setOpen(false) }}>
            <CheckSquare className="mr-2 h-4 w-4" /> Tasks
          </CommandItem>
          <CommandItem onSelect={() => { navigate('/calendar'); setOpen(false) }}>
            <Calendar className="mr-2 h-4 w-4" /> Calendar
          </CommandItem>
          <CommandItem onSelect={() => { navigate('/notes'); setOpen(false) }}>
            <StickyNote className="mr-2 h-4 w-4" /> Notes
          </CommandItem>
          <CommandItem onSelect={() => { navigate('/ai'); setOpen(false) }}>
            <Bot className="mr-2 h-4 w-4" /> AI Assistant
          </CommandItem>
          <CommandItem onSelect={() => { navigate('/settings'); setOpen(false) }}>
            <Settings className="mr-2 h-4 w-4" /> Settings
          </CommandItem>
        </CommandGroup>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={toggleTheme}>
            {theme === 'dark' ? <Sun className="mr-2 h-4 w-4" /> : <Moon className="mr-2 h-4 w-4" />}
            Toggle Theme
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
}
