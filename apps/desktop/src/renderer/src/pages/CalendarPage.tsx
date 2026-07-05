import { useEffect, useState } from 'react'
import { useTaskStore } from '../stores/useTaskStore'
import { useProjectStore } from '../stores/useProjectStore'
import { PageHeader, Button, Card, CardContent, LoadingSpinner } from '@ceo-os/ui'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { startOfWeek, endOfWeek, formatDate } from '@ceo-os/shared'
import type { Task } from '@ceo-os/shared'
import { addDays, format } from 'date-fns'
import { useI18n } from '../i18n'

export function CalendarPage(): JSX.Element {
  const { t } = useI18n()
  const { tasks, fetchTasks, loading } = useTaskStore()
  const projects = useProjectStore(s => s.projects)
  const [weekStart, setWeekStart] = useState(() => startOfWeek())
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    fetchTasks({ status: ['todo', 'in-progress', 'blocked'] })
  }, [])

  const weekEnd = endOfWeek(weekStart)
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    days.push(addDays(weekStart, i))
  }
  const dayNames = [t('calendar.mon'), t('calendar.tue'), t('calendar.wed'), t('calendar.thu'), t('calendar.fri'), t('calendar.sat'), t('calendar.sun')]

  const tasksByDay: Record<string, Task[]> = {}
  days.forEach(d => { tasksByDay[formatDate(d)] = [] })
  tasks.forEach(task => {
    if (task.dueDate && tasksByDay[task.dueDate]) {
      tasksByDay[task.dueDate].push(task)
    }
  })

  const today = formatDate(new Date())

  function prevWeek() { setWeekStart(s => addDays(s, -7)) }
  function nextWeek() { setWeekStart(s => addDays(s, 7)) }
  function goToday() { setWeekStart(startOfWeek()) }

  if (loading) return <div><PageHeader title={t('calendar.title')} /><LoadingSpinner /></div>

  return (
    <div>
      <PageHeader title={t('calendar.title')} description={t('calendar.week')}>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToday}>{t('calendar.today')}</Button>
          <Button variant="outline" size="icon" onClick={prevWeek}><ChevronLeft className="h-4 w-4" /></Button>
          <Button variant="outline" size="icon" onClick={nextWeek}><ChevronRight className="h-4 w-4" /></Button>
        </div>
      </PageHeader>
      <p className="text-sm text-zinc-400 mb-4">{format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}</p>
      <div className="grid grid-cols-7 gap-2 h-[calc(100vh-16rem)]">
        {days.map((day, idx) => {
          const dateStr = formatDate(day)
          const dayTasks = tasksByDay[dateStr] || []
          return (
            <div key={dateStr} className="border border-border rounded-xl flex flex-col overflow-hidden">
              <div className={`p-2 text-center border-b border-border ${dateStr === today ? 'bg-primary/10' : ''}`}>
                <p className="text-xs text-zinc-500">{dayNames[idx]}</p>
                <p className={`text-lg font-semibold ${dateStr === today ? 'text-primary' : ''}`}>{day.getDate()}</p>
              </div>
              <div className="flex-1 p-1 space-y-1 overflow-y-auto">
                {dayTasks.map(task => {
                  const project = task.projectId ? projects.find(p => p.id === task.projectId) : null
                  return (
                    <div
                      key={task.id}
                      className="text-xs p-1.5 rounded-md cursor-pointer hover:bg-card/50 border-l-2"
                      style={{ borderLeftColor: project?.color || '#52525B' }}
                      onClick={() => setSelectedTask(task)}
                    >
                      <p className="truncate font-medium">{task.title}</p>
                      {project && <p className="text-zinc-500">{project.name}</p>}
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {selectedTask && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center" onClick={() => setSelectedTask(null)}>
          <Card className="w-96" onClick={e => e.stopPropagation()}>
            <CardContent className="p-4">
              <h3 className="font-medium">{selectedTask.title}</h3>
              <p className="text-sm text-zinc-400 mt-1">{selectedTask.description}</p>
              <div className="mt-3 flex gap-2 text-xs">
                <span className="text-zinc-500">Status:</span>
                <span className="capitalize">{selectedTask.status}</span>
              </div>
              {selectedTask.dueDate && <p className="text-xs text-zinc-500">Due: {selectedTask.dueDate}</p>}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
