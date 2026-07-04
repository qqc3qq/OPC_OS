import { z } from 'zod'

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  icon: z.string().default('folder'),
  color: z.string().default('#3B82F6'),
  description: z.string().default(''),
  status: z.enum(['active', 'archived', 'planning', 'on-hold']).default('active'),
})

export const updateProjectSchema = createProjectSchema.partial()
