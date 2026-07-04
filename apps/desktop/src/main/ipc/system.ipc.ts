import { ipcMain, app } from 'electron'
import { saveDatabase } from '@ceo-os/database'
import { writeFileSync } from 'fs'
import { join } from 'path'

export function registerSystemHandlers(): void {
  ipcMain.handle('system:getVersion', () => app.getVersion())
  ipcMain.handle('system:getPlatform', () => process.platform)
  ipcMain.handle('system:saveDatabase', () => { saveDatabase() })
  ipcMain.handle('system:writeErrorLog', (_e, text: string) => {
    try {
      const logPath = join(app.getPath('userData'), 'error.log')
      writeFileSync(logPath, text, 'utf-8')
      return logPath
    } catch {
      return null
    }
  })
}
