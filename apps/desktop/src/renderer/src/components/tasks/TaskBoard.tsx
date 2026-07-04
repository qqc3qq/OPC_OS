import { useState } from 'react'
import type { Task, TaskStatus } from '@ceo-os/shared'
import { TASK_STATUSES, STATUS_LABELS } from '@ceo-os/shared'
import { TaskCard } from './TaskCard'
import { useTaskStore } from '../../stores/useTaskStore'
import {
  DndContext, closestCorners, PointerSensor, useSensor, useSensors, type DragEndEvent
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'

interface TaskBoardProps {
  tasks: Task[]
  onTaskClick: (task: Task) => void
}

export function TaskBoard({ tasks, onTaskClick }: TaskBoardProps): JSX.Element {
  const updateStatus = useTaskStore(s => s.updateStatus)
  const reorder = useTaskStore(s => s.reorder)
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  function getColumnTasks(status: TaskStatus): Task[] {
    return tasks.filter(t => t.status === status).sort((a, b) => a.sortOrder - b.sortOrder)
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveId(null)
    if (!over) return

    const taskId = active.id as string
    const overId = over.id as string
    const task = tasks.find(t => t.id === taskId)
    if (!task) return

    const newStatus = over.data.current?.status as TaskStatus | undefined
    if (newStatus && newStatus !== task.status) {
      await updateStatus(taskId, newStatus)
    }

    const overTask = tasks.find(t => t.id === overId)
    if (overTask) {
      const colTasks = getColumnTasks(newStatus || task.status)
      const activeIdx = colTasks.findIndex(t => t.id === taskId)
      const overIdx = colTasks.findIndex(t => t.id === overId)
      if (activeIdx !== -1 && overIdx !== -1) {
        const reordered = [...colTasks]
        const [moved] = reordered.splice(activeIdx, 1)
        reordered.splice(overIdx, 0, moved)
        await reorder(reordered.map((t, i) => ({ id: t.id, sortOrder: i })))
      }
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={e => setActiveId(e.active.id as string)}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4 h-[calc(100vh-16rem)]">
        {TASK_STATUSES.map(status => {
          const colTasks = getColumnTasks(status)
          return (
            <div key={status} className="flex-1 min-w-[280px] max-w-[350px]">
              <div className="flex items-center justify-between mb-3 px-2">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-zinc-300">{STATUS_LABELS[status]}</span>
                  <span className="text-xs text-zinc-500 bg-card px-1.5 py-0.5 rounded">{colTasks.length}</span>
                </div>
              </div>
              <SortableContext items={colTasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-2 min-h-[200px] rounded-lg p-2 bg-card/30 border border-border/50">
                  {colTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      isDragging={activeId === task.id}
                      onClick={() => onTaskClick(task)}
                    />
                  ))}
                  {colTasks.length === 0 && (
                    <div className="flex items-center justify-center h-24 text-xs text-zinc-500 border border-dashed border-border rounded-lg">
                      Drop tasks here
                    </div>
                  )}
                </div>
              </SortableContext>
            </div>
          )
        })}
      </div>
    </DndContext>
  )
}
