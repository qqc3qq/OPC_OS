import { create } from 'zustand'
import type { Note, CreateNoteDTO, UpdateNoteDTO } from '@ceo-os/shared'

interface NoteState {
  notes: Note[]
  loading: boolean
  error: string | null
  fetchNotes: () => Promise<void>
  createNote: (data: CreateNoteDTO) => Promise<Note>
  updateNote: (id: string, data: UpdateNoteDTO) => Promise<void>
  deleteNote: (id: string) => Promise<void>
}

export const useNoteStore = create<NoteState>((set, get) => ({
  notes: [],
  loading: false,
  error: null,

  fetchNotes: async () => {
    set({ loading: true, error: null })
    try {
      const notes = await window.api.notes.getAll()
      set({ notes, loading: false })
    } catch (err) {
      set({ error: (err as Error).message, loading: false })
    }
  },

  createNote: async (data) => {
    const note = await window.api.notes.create(data)
    set({ notes: [note, ...get().notes] })
    return note
  },

  updateNote: async (id, data) => {
    const updated = await window.api.notes.update(id, data)
    set({ notes: get().notes.map(n => n.id === id ? updated : n) })
  },

  deleteNote: async (id) => {
    await window.api.notes.delete(id)
    set({ notes: get().notes.filter(n => n.id !== id) })
  },
}))
