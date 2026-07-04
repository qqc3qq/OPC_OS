import { ipcMain } from 'electron'
import type { ProjectRepository } from '@ceo-os/database'

export function registerProjectHandlers(repo: ProjectRepository): void {
  ipcMain.handle('projects:getAll', () => repo.getWithTaskCounts())
  ipcMain.handle('projects:getById', (_e, id: string) => repo.getById(id))
  ipcMain.handle('projects:create', (_e, data) => repo.create(data))
  ipcMain.handle('projects:update', (_e, id: string, data) => repo.update(id, data))
  ipcMain.handle('projects:delete', (_e, id: string) => repo.delete(id))
}
