export type TaskPriority = 'urgent' | 'high' | 'medium' | 'low' | 'none'
export type TaskStatus = 'todo' | 'in-progress' | 'blocked' | 'done'

export interface Task {
  id: string
  title: string
  description: string
  projectId: string | null
  priority: TaskPriority
  status: TaskStatus
  estimate: number | null
  dueDate: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type CreateTaskDTO = Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'sortOrder'>
export type UpdateTaskDTO = Partial<CreateTaskDTO> & { status?: TaskStatus; sortOrder?: number }

export interface TaskFilters {
  projectId?: string
  status?: TaskStatus | TaskStatus[]
  priority?: TaskPriority
  search?: string
}
