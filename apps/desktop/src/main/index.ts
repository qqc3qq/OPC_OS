import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { initDatabase, runMigrations, saveDatabase, closeDatabase } from '@ceo-os/database'
import { registerAllHandlers } from './ipc'

function logToFile(msg: string) {
  try {
    const dir = app.getPath('userData')
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
    writeFileSync(join(dir, 'ceo-os.log'), msg + '\n', { flag: 'a' })
  } catch {}
}

let mainWindow: BrowserWindow | null = null

async function createWindow(): Promise<void> {
  try {
    logToFile('[main] Starting window creation...')
    mainWindow = new BrowserWindow({
      width: 1400,
      height: 900,
      minWidth: 1024,
      minHeight: 680,
      backgroundColor: '#09090B',
      show: false,
      webPreferences: {
        preload: join(__dirname, '../preload/index.mjs'),
        sandbox: false,
        contextIsolation: true,
        nodeIntegration: false,
      },
    })

    try {
      const dbPath = join(app.getPath('userData'), 'ceo-os.db')
      logToFile('[main] Init database at: ' + dbPath)
      await initDatabase(dbPath)
      logToFile('[main] Database initialized OK')
      runMigrations()
      logToFile('[main] Migrations OK')
      registerAllHandlers()
      logToFile('[main] IPC handlers registered OK')
    } catch (err) {
      logToFile('[main] DB ERROR: ' + String(err))
      console.error('Failed to initialize app:', err)
    }

    mainWindow.on('ready-to-show', () => {
      logToFile('[main] Window ready, showing')
      mainWindow?.show()
    })

    const rendererPath = join(__dirname, '../renderer/index.html')
    logToFile('[main] Loading renderer: ' + rendererPath)
    mainWindow.loadFile(rendererPath)
    mainWindow.webContents.on('did-finish-load', () => logToFile('[main] Renderer loaded OK'))
    mainWindow.webContents.on('did-fail-load', (_e, code, desc) => logToFile('[main] RENDERER LOAD FAILED: ' + code + ' ' + desc))
  } catch (err) {
    logToFile('[main] CREATE WINDOW ERROR: ' + String(err))
  }
}

app.whenReady().then(() => {
  logToFile('[main] App ready')
  createWindow()
})

app.on('window-all-closed', () => {
  closeDatabase()
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('before-quit', () => {
  saveDatabase()
})
