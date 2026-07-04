import { create } from 'zustand'
import type { Project, CreateProjectDTO, UpdateProjectDTO } from '@ceo-os/shared'

interface ProjectState {
  projects: Project[]
  loading: boolean
  error: string | null
  fetchProjects: () => Promise<void>
  createProject: (data: CreateProjectDTO) => Promise<Project>
  updateProject: (id: string, data: UpdateProjectDTO) => Promise<void>
  deleteProject: (id: string) => Promise<void>
}

export const useProjectStore = create<ProjectState>((set, get) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null })
    try {
      const projects = await window.api.projects.getAll()
      set({ projects, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  createProject: async (data) => {
    const project = await window.api.projects.create(data)
    set({ projects: [project, ...get().projects] })
    return project
  },

  updateProject: async (id, data) => {
    const updated = await window.api.projects.update(id, data)
    set({ projects: get().projects.map(p => p.id === id ? updated : p) })
  },

  deleteProject: async (id) => {
    await window.api.projects.delete(id)
    set({ projects: get().projects.filter(p => p.id !== id) })
  },
}))
