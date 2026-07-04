import { BaseRepository } from './base.repository'
import type { Note, CreateNoteDTO, UpdateNoteDTO } from '@ceo-os/shared'
import { generateId, nowISO } from '@ceo-os/shared'

export class NoteRepository extends BaseRepository<Note> {
  getAll(): Note[] {
    return this.queryAll("SELECT * FROM notes ORDER BY updated_at DESC")
  }

  getById(id: string): Note | undefined {
    return this.queryOne("SELECT * FROM notes WHERE id = ?", [id])
  }

  getByProject(projectId: string): Note[] {
    return this.queryAll(
      "SELECT * FROM notes WHERE project_id = ? ORDER BY updated_at DESC",
      [projectId]
    )
  }

  create(data: CreateNoteDTO): Note {
    const note: Note = {
      id: generateId(),
      title: data.title,
      content: data.content || '',
      projectId: data.projectId,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    this.execute(
      `INSERT INTO notes (id, title, content, project_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [note.id, note.title, note.content, note.projectId, note.createdAt, note.updatedAt]
    )
    return note
  }

  update(id: string, data: UpdateNoteDTO): Note {
    const existing = this.getById(id)
    if (!existing) throw new Error(`Note ${id} not found`)
    const updated = { ...existing, ...data, updatedAt: nowISO() }
    this.execute(
      `UPDATE notes SET title = ?, content = ?, project_id = ?, updated_at = ? WHERE id = ?`,
      [updated.title, updated.content, updated.projectId, updated.updatedAt, id]
    )
    return updated
  }

  delete(id: string): void {
    this.execute("DELETE FROM notes WHERE id = ?", [id])
  }

  search(query: string): Note[] {
    return this.queryAll(
      "SELECT * FROM notes WHERE title LIKE ? OR content LIKE ? ORDER BY updated_at DESC",
      [`%${query}%`, `%${query}%`]
    )
  }
}
