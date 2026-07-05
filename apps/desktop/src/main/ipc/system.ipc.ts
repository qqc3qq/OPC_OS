import { ipcMain, app, BrowserWindow } from 'electron'
import { autoUpdater } from 'electron-updater'
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

  ipcMain.handle('system:checkUpdate', async () => {
    try {
      const result = await autoUpdater.checkForUpdatesAndNotify()
      return result?.updateInfo?.version || null
    } catch {
      return null
    }
  })

  ipcMain.handle('system:downloadUpdate', async () => {
    autoUpdater.on('update-downloaded', () => {
      const win = BrowserWindow.getAllWindows()[0]
      if (win) win.webContents.send('update:ready')
    })
    await autoUpdater.downloadUpdate()
  })

  ipcMain.handle('system:installUpdate', () => {
    autoUpdater.quitAndInstall()
  })
}
