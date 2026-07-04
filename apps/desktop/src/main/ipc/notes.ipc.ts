import { ipcMain } from 'electron'
import type { NoteRepository } from '@ceo-os/database'

export function registerNoteHandlers(repo: NoteRepository): void {
  ipcMain.handle('notes:getAll', () => repo.getAll())
  ipcMain.handle('notes:getById', (_e, id: string) => repo.getById(id))
  ipcMain.handle('notes:getByProject', (_e, projectId: string) => repo.getByProject(projectId))
  ipcMain.handle('notes:create', (_e, data) => repo.create(data))
  ipcMain.handle('notes:update', (_e, id: string, data) => repo.update(id, data))
  ipcMain.handle('notes:delete', (_e, id: string) => repo.delete(id))
  ipcMain.handle('notes:search', (_e, query: string) => repo.search(query))
}
