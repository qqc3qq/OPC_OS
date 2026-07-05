import { ipcMain, app, BrowserWindow } from 'electron'
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
    } catch { return null }
  })

  ipcMain.handle('system:checkUpdate', async () => {
    try {
      const { autoUpdater } = await import('electron-updater')
      const r = await autoUpdater.checkForUpdates()
      return r?.updateInfo?.version || null
    } catch { return null }
  })

  ipcMain.handle('system:downloadUpdate', async () => {
    const { autoUpdater } = await import('electron-updater')
    autoUpdater.once('update-downloaded', () => {
      BrowserWindow.getAllWindows()[0]?.webContents.send('update:ready')
    })
    await autoUpdater.downloadUpdate()
  })

  ipcMain.handle('system:installUpdate', () => {
    const { autoUpdater } = require('electron-updater')
    autoUpdater.quitAndInstall()
  })
}
