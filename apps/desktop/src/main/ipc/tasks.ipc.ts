import { ipcMain } from 'electron'
import type { TaskRepository } from '@ceo-os/database'

export function registerTaskHandlers(repo: TaskRepository): void {
  ipcMain.handle('tasks:getAll', (_e, filters?) => repo.getAll(filters))
  ipcMain.handle('tasks:getById', (_e, id: string) => repo.getById(id))
  ipcMain.handle('tasks:getToday', () => repo.getTodayTasks())
  ipcMain.handle('tasks:getByProject', (_e, projectId: string) => repo.getByProject(projectId))
  ipcMain.handle('tasks:getForDateRange', (_e, start: string, end: string) => repo.getForDateRange(start, end))
  ipcMain.handle('tasks:getPriorities', () => repo.getPriorities())
  ipcMain.handle('tasks:getOverdue', () => repo.getOverdue())
  ipcMain.handle('tasks:create', (_e, data) => repo.create(data))
  ipcMain.handle('tasks:update', (_e, id: string, data) => repo.update(id, data))
  ipcMain.handle('tasks:delete', (_e, id: string) => repo.delete(id))
  ipcMain.handle('tasks:updateStatus', (_e, id: string, status) => repo.updateStatus(id, status))
  ipcMain.handle('tasks:reorder', (_e, updates) => repo.updateSortOrder(updates))
  ipcMain.handle('tasks:search', (_e, query: string) => repo.search(query))
}
