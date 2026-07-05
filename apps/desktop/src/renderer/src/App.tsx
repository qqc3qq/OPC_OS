import { HashRouter, Routes, Route } from 'react-router-dom'
import { TooltipProvider } from '@ceo-os/ui'
import { ErrorBoundary } from './components/shared/ErrorBoundary'
import { AppLayout } from './components/layout/AppLayout'
import { DashboardPage } from './pages/DashboardPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { ProjectDetailPage } from './pages/ProjectDetailPage'
import { TasksPage } from './pages/TasksPage'
import { CalendarPage } from './pages/CalendarPage'
import { NotesPage } from './pages/NotesPage'
import { AIPage } from './pages/AIPage'
import { SettingsPage } from './pages/SettingsPage'
import { CommandPalette } from './components/command-palette/CommandPalette'
import { Toast } from './components/shared/Toast'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts'

function AppInner(): JSX.Element {
  useKeyboardShortcuts()

  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/ai" element={<AIPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Routes>
    </AppLayout>
  )
}

export function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <HashRouter>
        <TooltipProvider>
          <AppInner />
          <CommandPalette />
          <Toast />
        </TooltipProvider>
      </HashRouter>
    </ErrorBoundary>
  )
}
