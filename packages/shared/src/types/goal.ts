export interface Goal {
  id: string
  title: string
  projectId: string | null
  progress: number
  deadline: string | null
}

export type CreateGoalDTO = Omit<Goal, 'id'>
export type UpdateGoalDTO = Partial<CreateGoalDTO>
