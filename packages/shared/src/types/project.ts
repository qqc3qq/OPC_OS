export interface Project {
  id: string
  name: string
  icon: string
  color: string
  description: string
  status: 'active' | 'archived' | 'planning' | 'on-hold'
  createdAt: string
  updatedAt: string
}

export type CreateProjectDTO = Omit<Project, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateProjectDTO = Partial<CreateProjectDTO>
