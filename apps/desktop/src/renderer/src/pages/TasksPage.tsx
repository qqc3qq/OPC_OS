import { useEffect, useState, useCallback } from 'react'
import { useTaskStore } from '../stores/useTaskStore'
import { useProjectStore } from '../stores/useProjectStore'
import { PageHeader, Button, Input, LoadingSpinner } from '@ceo-os/ui'
import { Plus, Search } from 'lucide-react'
import type { Task } from '@ceo-os/shared'
import { TASK_STATUSES } from '@ceo-os/shared'
import { TaskBoard } from '../components/tasks/TaskBoard'
import { TaskForm } from '../components/tasks/TaskForm'
import { TaskDetail } from '../components/tasks/TaskDetail'
import { useI18n } from '../i18n'

export function TasksPage(): JSX.Element {
  const { t } = useI18n()
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

  const openCount = tasks.filter(t => t.status !== 'done').length
  const doneCount = tasks.filter(t => t.status === 'done').length

  if (loading) return <div><PageHeader title={t('tasks.title')} /><LoadingSpinner label={t('common.loading')} /></div>

  return (
    <div>
      <PageHeader
        title={t('tasks.title')}
        description={`${openCount} ${t('status.inProgress')}, ${doneCount} ${t('status.done')}`}
        actions={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> {t('tasks.new')}
          </Button>
        }
      />
      <div className="mb-4">
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('tasks.search')}
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
