import { useState } from 'react'
import type { Task } from '@ceo-os/shared'
import { Card, CardHeader, CardTitle, CardContent, Button, PriorityBadge } from '@ceo-os/ui'
import { Check, ChevronRight, Flame } from 'lucide-react'
import { useTaskStore } from '../../stores/useTaskStore'
import { useProjectStore } from '../../stores/useProjectStore'
import { useI18n } from '../../i18n'

interface TopPrioritiesProps {
  tasks: Task[]
}

export function TopPriorities({ tasks }: TopPrioritiesProps): JSX.Element {
  const { t } = useI18n()
  const updateStatus = useTaskStore(s => s.updateStatus)
  const projects = useProjectStore(s => s.projects)
  const [completing, setCompleting] = useState<Set<string>>(new Set())

  const priorityOrder: Record<string, number> = { urgent: 1, high: 2, medium: 3, low: 4, none: 5 }
  const top3 = tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => {
      const pDiff = (priorityOrder[a.priority] || 5) - (priorityOrder[b.priority] || 5)
      if (pDiff !== 0) return pDiff
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate)
      if (a.dueDate) return -1
      if (b.dueDate) return 1
      return 0
    })
    .slice(0, 3)

  async function handleComplete(taskId: string) {
    setCompleting(s => new Set(s).add(taskId))
    await updateStatus(taskId, 'done')
    setCompleting(s => {
      const next = new Set(s)
      next.delete(taskId)
      return next
    })
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Flame className="h-4 w-4 text-orange-400" />
          {t('dashboard.priorities')}
        </CardTitle>
        <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">
          {t('dashboard.priorities.viewAll')} <ChevronRight className="h-3 w-3" />
        </Button>
      </CardHeader>
      <CardContent>
        {top3.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            {t('dashboard.priorities.empty')}
          </p>
        ) : (
          <div className="space-y-2">
            {top3.map(task => {
              const project = task.projectId ? projects.find(p => p.id === task.projectId) : null
              return (
                <div
                  key={task.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-card/50 border border-border/50 hover:border-border transition-colors group"
                >
                  <button
                    onClick={() => handleComplete(task.id)}
                    disabled={completing.has(task.id)}
                    className="h-5 w-5 rounded-full border-2 border-zinc-500 hover:border-success hover:bg-success/10 flex items-center justify-center shrink-0 transition-colors disabled:opacity-50"
                  >
                    {completing.has(task.id) && <Check className="h-3 w-3 text-success" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{task.title}</p>
                    <div className="flex gap-2 mt-1">
                      <PriorityBadge priority={task.priority} />
                      {project && (
                        <span className="text-xs text-zinc-500">{project.name}</span>
                      )}
                    </div>
                  </div>
                  {task.dueDate && (
                    <span className="text-xs text-zinc-500">{task.dueDate}</span>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
