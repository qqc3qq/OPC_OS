import { create } from 'zustand'
import type { Task, CreateTaskDTO, UpdateTaskDTO, TaskFilters, TaskStatus } from '@ceo-os/shared'

interface TaskState {
  tasks: Task[]
  loading: boolean
  error: string | null
  fetchTasks: (filters?: TaskFilters) => Promise<void>
  createTask: (data: CreateTaskDTO) => Promise<Task>
  updateTask: (id: string, data: UpdateTaskDTO) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  updateStatus: (id: string, status: TaskStatus) => Promise<void>
  reorder: (updates: { id: string; sortOrder: number }[]) => Promise<void>
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  loading: false,
  error: null,

  fetchTasks: async (filters) => {
    set({ loading: true, error: null })
    try {
      const tasks = await window.api.tasks.getAll(filters)
      set({ tasks, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  createTask: async (data) => {
    const task = await window.api.tasks.create(data)
    set({ tasks: [task, ...get().tasks] })
    return task
  },

  updateTask: async (id, data) => {
    const updated = await window.api.tasks.update(id, data)
    set({ tasks: get().tasks.map(t => t.id === id ? updated : t) })
  },

  deleteTask: async (id) => {
    await window.api.tasks.delete(id)
    set({ tasks: get().tasks.filter(t => t.id !== id) })
  },

  updateStatus: async (id, status) => {
    const updated = await window.api.tasks.updateStatus(id, status)
    set({ tasks: get().tasks.map(t => t.id === id ? updated : t) })
  },

  reorder: async (updates) => {
    await window.api.tasks.reorder(updates)
    for (const u of updates) {
      set(s => ({
        tasks: s.tasks.map(t => t.id === u.id ? { ...t, sortOrder: u.sortOrder } : t)
      }))
    }
  },
}))
