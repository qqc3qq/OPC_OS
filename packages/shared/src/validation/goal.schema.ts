import { z } from 'zod'

export const createGoalSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  projectId: z.string().nullable().default(null),
  progress: z.number().int().min(0).max(100).default(0),
  deadline: z.string().nullable().default(null),
})

export const updateGoalSchema = createGoalSchema.partial()
