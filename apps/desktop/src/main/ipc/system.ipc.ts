import { ipcMain, app } from 'electron'
import { saveDatabase } from '@ceo-os/database'

export function registerSystemHandlers(): void {
  ipcMain.handle('system:getVersion', () => app.getVersion())
  ipcMain.handle('system:getPlatform', () => process.platform)
  ipcMain.handle('system:saveDatabase', () => { saveDatabase() })
}
