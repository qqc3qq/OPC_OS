export interface Note {
  id: string
  title: string
  content: string
  projectId: string | null
  createdAt: string
  updatedAt: string
}

export type CreateNoteDTO = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>
export type UpdateNoteDTO = Partial<CreateNoteDTO>
