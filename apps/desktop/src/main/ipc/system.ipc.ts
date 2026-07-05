import { ipcMain, app } from 'electron'
import { saveDatabase } from '@ceo-os/database'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'

export function registerSystemHandlers(): void {
  ipcMain.handle('system:getVersion', () => app.getVersion())
  ipcMain.handle('system:getPlatform', () => process.platform)
  ipcMain.handle('system:saveDatabase', () => { saveDatabase() })

  ipcMain.handle('system:writeErrorLog', (_e, text: string) => {
    try {
      const installRoot = dirname(dirname(app.getAppPath()))
      const logDir = join(installRoot, 'logs')
      if (!existsSync(logDir)) mkdirSync(logDir, { recursive: true })
      writeFileSync(join(logDir, 'app.log'), '[RENDERER] ' + text + '\n', { flag: 'a' })
      return join(logDir, 'app.log')
    } catch {
      return null
    }
  })
}
