import type { Task } from '@ceo-os/shared'
import { Card, CardHeader, CardTitle, CardContent, PriorityBadge } from '@ceo-os/ui'
import { Clock, ChevronRight } from 'lucide-react'
import { useProjectStore } from '../../stores/useProjectStore'

interface TodayTimelineProps {
  tasks: Task[]
}

export function TodayTimeline({ tasks }: TodayTimelineProps): JSX.Element {
  const projects = useProjectStore(s => s.projects)
  const todayStr = new Date().toISOString().split('T')[0]
  const todayTasks = tasks.filter(t => t.dueDate === todayStr && t.status !== 'done')
  const scheduled = todayTasks.filter(t => t.dueDate).sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''))

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Clock className="h-4 w-4 text-blue-400" />
          Today's Timeline
        </CardTitle>
        <span className="text-xs text-zinc-500">{scheduled.length} scheduled</span>
      </CardHeader>
      <CardContent>
        {scheduled.length === 0 ? (
          <p className="text-sm text-zinc-500 py-4 text-center">No tasks scheduled for today.</p>
        ) : (
          <div className="space-y-1">
            {scheduled.map((task, i) => {
              const project = task.projectId ? projects.find(p => p.id === task.projectId) : null
              return (
                <div key={task.id} className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-card/50 transition-colors">
                  <span className="text-xs text-zinc-500 w-12 shrink-0">T{i + 1}</span>
                  <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: project?.color || '#52525B' }} />
                  <span className="text-sm flex-1 truncate">{task.title}</span>
                  <PriorityBadge priority={task.priority} />
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
