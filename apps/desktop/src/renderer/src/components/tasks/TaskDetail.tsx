import { useState, useEffect } from 'react'
import type { Task, Project, TaskPriority, TaskStatus } from '@ceo-os/shared'
import { PRIORITIES, TASK_STATUSES, PRIORITY_LABELS, STATUS_LABELS } from '@ceo-os/shared'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, Button, Input, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem, Badge } from '@ceo-os/ui'
import { Trash2 } from 'lucide-react'
import { useTaskStore } from '../../stores/useTaskStore'
import { toast } from '../../lib/toast'

interface TaskDetailProps {
  task: Task | null
  onClose: () => void
  projects: Project[]
}

export function TaskDetail({ task, onClose, projects }: TaskDetailProps): JSX.Element {
  const updateTask = useTaskStore(s => s.updateTask)
  const deleteTask = useTaskStore(s => s.deleteTask)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('none')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [projectId, setProjectId] = useState<string | null>(null)
  const [dueDate, setDueDate] = useState('')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description)
      setPriority(task.priority)
      setStatus(task.status)
      setProjectId(task.projectId)
      setDueDate(task.dueDate || '')
    }
  }, [task])

  if (!task) return <></>

  async function handleSave() {
    await updateTask(task!.id, { title, description, priority, status, projectId, dueDate: dueDate || null })
    toast('Task updated')
  }

  async function handleDelete() {
    await deleteTask(task!.id)
    onClose()
    toast('Task deleted')
  }

  const project = projectId ? projects.find(p => p.id === projectId) : null

  return (
    <Sheet open={!!task} onOpenChange={onClose}>
      <SheetContent className="w-[480px] sm:max-w-[480px]">
        <SheetHeader>
          <SheetTitle>Task Detail</SheetTitle>
          <SheetDescription>Created {new Date(task.createdAt).toLocaleDateString()}</SheetDescription>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          <Input value={title} onChange={e => setTitle(e.target.value)} onBlur={handleSave} className="text-lg font-medium" />
          <Textarea value={description} onChange={e => setDescription(e.target.value)} onBlur={handleSave} placeholder="Add a description..." rows={4} />
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs text-zinc-500">Status</label>
              <Select value={status} onValueChange={v => { setStatus(v as TaskStatus); handleSave() }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {TASK_STATUSES.map(s => <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-500">Priority</label>
              <Select value={priority} onValueChange={v => { setPriority(v as TaskPriority); handleSave() }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map(p => <SelectItem key={p} value={p}>{PRIORITY_LABELS[p]}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-500">Project</label>
              <Select value={projectId || 'none'} onValueChange={v => { setProjectId(v === 'none' ? null : v); handleSave() }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {projects.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-500">Due Date</label>
              <Input type="date" value={dueDate} onChange={e => { setDueDate(e.target.value); handleSave() }} />
            </div>
          </div>
          {project && (
            <div className="flex items-center gap-2 pt-2">
              <span className="text-xs text-zinc-500">Project:</span>
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: project.color }} />
              <span className="text-sm">{project.name}</span>
            </div>
          )}
          <div className="pt-4 border-t border-border">
            <Button variant="destructive" size="sm" onClick={handleDelete} className="gap-1">
              <Trash2 className="h-4 w-4" /> Delete Task
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
