import { useEffect, useState, useCallback } from 'react'
import { useTaskStore } from '../stores/useTaskStore'
import { useProjectStore } from '../stores/useProjectStore'
import { PageHeader, Button, Input, LoadingSpinner } from '@ceo-os/ui'
import { Plus, Search } from 'lucide-react'
import type { TaskStatus, Task } from '@ceo-os/shared'
import { TASK_STATUSES, STATUS_LABELS } from '@ceo-os/shared'
import { TaskBoard } from '../components/tasks/TaskBoard'
import { TaskForm } from '../components/tasks/TaskForm'
import { TaskDetail } from '../components/tasks/TaskDetail'

export function TasksPage(): JSX.Element {
  const { tasks, fetchTasks, loading } = useTaskStore()
  const { projects, fetchProjects } = useProjectStore()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  useEffect(() => {
    fetchTasks()
    fetchProjects()
  }, [])

  const handleSearch = useCallback((value: string) => {
    setSearch(value)
    fetchTasks({ search: value || undefined })
  }, [fetchTasks])

  const handleOpenDetail = useCallback((task: Task) => {
    setSelectedTask(task)
  }, [])

  if (loading) return <div><PageHeader title="Tasks" /><LoadingSpinner label="Loading tasks..." /></div>

  return (
    <div>
      <PageHeader
        title="Tasks"
        description={`${tasks.filter(t => t.status !== 'done').length} open, ${tasks.filter(t => t.status === 'done').length} done`}
        actions={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> New Task
          </Button>
        }
      />
      <div className="mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={e => handleSearch(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>
      <TaskBoard tasks={tasks} onTaskClick={handleOpenDetail} />
      <TaskForm open={showForm} onOpenChange={setShowForm} projects={projects} />
      <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} projects={projects} />
    </div>
  )
}
