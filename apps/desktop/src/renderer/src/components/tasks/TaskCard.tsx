import type { Task } from '@ceo-os/shared'
import { PriorityBadge, cn } from '@ceo-os/ui'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Calendar } from 'lucide-react'
import { useProjectStore } from '../../stores/useProjectStore'

interface TaskCardProps {
  task: Task
  isDragging?: boolean
  onClick: () => void
}

export function TaskCard({ task, isDragging, onClick }: TaskCardProps): JSX.Element {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging: isSortDragging } = useSortable({ id: task.id })
  const projects = useProjectStore(s => s.projects)
  const project = task.projectId ? projects.find(p => p.id === task.projectId) : null

  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'rounded-lg border border-border bg-card p-3 cursor-pointer hover:border-zinc-600 transition-colors group',
        (isDragging || isSortDragging) && 'opacity-50 shadow-lg'
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="mt-0.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4 text-zinc-500" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm truncate">{task.title}</p>
          <div className="flex items-center gap-2 mt-2">
            <PriorityBadge priority={task.priority} />
            {task.dueDate && (
              <span className="text-xs text-zinc-500 flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {task.dueDate}
              </span>
            )}
          </div>
          {project && (
            <div className="flex items-center gap-1.5 mt-2">
              <div className="h-2 w-2 rounded-full shrink-0" style={{ backgroundColor: project.color }} />
              <span className="text-xs text-zinc-500 truncate">{project.name}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
