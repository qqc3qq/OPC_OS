import { useState } from 'react'
import type { Project, CreateTaskDTO, TaskPriority, TaskStatus } from '@ceo-os/shared'
import { PRIORITIES, TASK_STATUSES, PRIORITY_LABELS, STATUS_LABELS, createTaskSchema } from '@ceo-os/shared'
import { Dialog, DialogContent, DialogHeader, DialogTitle, Button, Input, Textarea, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@ceo-os/ui'
import { useTaskStore } from '../../stores/useTaskStore'

interface TaskFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projects: Project[]
}

export function TaskForm({ open, onOpenChange, projects }: TaskFormProps): JSX.Element {
  const createTask = useTaskStore(s => s.createTask)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<TaskPriority>('none')
  const [status, setStatus] = useState<TaskStatus>('todo')
  const [projectId, setProjectId] = useState<string | null>(null)
  const [dueDate, setDueDate] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})

  async function handleSubmit() {
    const result = createTaskSchema.safeParse({ title, description, projectId, priority, status, dueDate: dueDate || null })
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach(e => { fieldErrors[e.path[0] as string] = e.message })
      setErrors(fieldErrors)
      return
    }
    await createTask(result.data as CreateTaskDTO)
    handleClose()
  }

  function handleClose() {
    setTitle(''); setDescription(''); setPriority('none'); setStatus('todo')
    setProjectId(null); setDueDate(''); setErrors({})
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Input
              placeholder="Task title"
              value={title}
              onChange={e => setTitle(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSubmit()}
            />
            {errors.title && <span className="text-xs text-red-400">{errors.title}</span>}
          </div>
          <Textarea
            placeholder="Description (optional)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={2}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select value={priority} onValueChange={v => setPriority(v as TaskPriority)}>
              <SelectTrigger><SelectValue placeholder="Priority" /></SelectTrigger>
              <SelectContent>
                {PRIORITIES.map(p => (
                  <SelectItem key={p} value={p}>{PRIORITY_LABELS[p]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={status} onValueChange={v => setStatus(v as TaskStatus)}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                {TASK_STATUSES.map(s => (
                  <SelectItem key={s} value={s}>{STATUS_LABELS[s]}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={projectId || 'none'} onValueChange={v => setProjectId(v === 'none' ? null : v)}>
              <SelectTrigger><SelectValue placeholder="Project" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Project</SelectItem>
                {projects.map(p => (
                  <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={handleClose}>Cancel</Button>
            <Button onClick={handleSubmit}>Create Task</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
