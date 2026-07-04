import { ipcMain } from 'electron'
import type { GoalRepository } from '@ceo-os/database'

export function registerGoalHandlers(repo: GoalRepository): void {
  ipcMain.handle('goals:getAll', () => repo.getAll())
  ipcMain.handle('goals:getByProject', (_e, projectId: string) => repo.getByProject(projectId))
  ipcMain.handle('goals:getActive', () => repo.getActive())
  ipcMain.handle('goals:create', (_e, data) => repo.create(data))
  ipcMain.handle('goals:update', (_e, id: string, data) => repo.update(id, data))
  ipcMain.handle('goals:delete', (_e, id: string) => repo.delete(id))
  ipcMain.handle('goals:updateProgress', (_e, id: string, progress: number) => repo.updateProgress(id, progress))
}
