import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  description: z.string().default(''),
  projectId: z.string().nullable().default(null),
  priority: z.enum(['urgent', 'high', 'medium', 'low', 'none']).default('none'),
  status: z.enum(['todo', 'in-progress', 'blocked', 'done']).default('todo'),
  estimate: z.number().int().positive().nullable().default(null),
  dueDate: z.string().nullable().default(null),
})

export const updateTaskSchema = createTaskSchema.partial().extend({
  status: z.enum(['todo', 'in-progress', 'blocked', 'done']).optional(),
  sortOrder: z.number().int().optional(),
})
