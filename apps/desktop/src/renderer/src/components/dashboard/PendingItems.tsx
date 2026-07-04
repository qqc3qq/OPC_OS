import type { Task } from '@ceo-os/shared'
import { Card, CardHeader, CardTitle, CardContent } from '@ceo-os/ui'
import { AlertTriangle } from 'lucide-react'
import { useProjectStore } from '../../stores/useProjectStore'

interface PendingItemsProps {
  tasks: Task[]
}

export function PendingItems({ tasks }: PendingItemsProps): JSX.Element {
  const projects = useProjectStore(s => s.projects)
  const overdue = tasks.filter(t => {
    if (!t.dueDate || t.status === 'done') return false
    return new Date(t.dueDate) < new Date(new Date().toISOString().split('T')[0])
  })
  const blocked = tasks.filter(t => t.status === 'blocked')

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          Pending Items
        </CardTitle>
      </CardHeader>
      <CardContent>
        {overdue.length === 0 && blocked.length === 0 ? (
          <p className="text-sm text-zinc-500 py-4 text-center">Nothing pending. Great job!</p>
        ) : (
          <div className="space-y-3">
            {overdue.length > 0 && (
              <div>
                <span className="text-xs font-medium text-red-400">Overdue ({overdue.length})</span>
                <div className="mt-1 space-y-1">
                  {overdue.slice(0, 3).map(task => {
                    const project = task.projectId ? projects.find(p => p.id === task.projectId) : null
                    return (
                      <div key={task.id} className="flex items-center gap-2 text-sm py-1">
                        <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                        <span className="truncate">{task.title}</span>
                        {project && <span className="text-xs text-zinc-500 shrink-0">{project.name}</span>}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            {blocked.length > 0 && (
              <div>
                <span className="text-xs font-medium text-orange-400">Blocked ({blocked.length})</span>
                <div className="mt-1 space-y-1">
                  {blocked.slice(0, 3).map(task => (
                    <div key={task.id} className="flex items-center gap-2 text-sm py-1">
                      <div className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0" />
                      <span className="truncate">{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
