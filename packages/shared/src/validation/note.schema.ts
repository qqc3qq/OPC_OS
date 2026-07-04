import { z } from 'zod'

export const createNoteSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  content: z.string().default(''),
  projectId: z.string().nullable().default(null),
})

export const updateNoteSchema = createNoteSchema.partial()
