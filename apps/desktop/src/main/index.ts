import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { initDatabase, runMigrations, saveDatabase, closeDatabase } from '@ceo-os/database'
import { registerAllHandlers } from './ipc'

const logPath = join(app.getPath('temp'), 'ceo-os.log')

function log(msg: string) {
  try {
    writeFileSync(logPath, msg + '\n', { flag: 'a' })
  } catch {}
}

// Log as early as possible
log('=== CEO OS started ===')

process.on('uncaughtException', (err) => {
  log('[main] UNCAUGHT: ' + err.message + '\n' + (err.stack || ''))
})

let mainWindow: BrowserWindow | null = null

async function createWindow(): Promise<void> {
  log('[main] createWindow start')
  mainWindow = new BrowserWindow({
    width: 1400, height: 900,
    minWidth: 1024, minHeight: 680,
    backgroundColor: '#09090B',
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
      contextIsolation: true,
      nodeIntegration: false,
    },
  })
  log('[main] BrowserWindow created')

  try {
    const dbPath = join(app.getPath('userData'), 'ceo-os.db')
    log('[main] DB path: ' + dbPath)
    await initDatabase(dbPath)
    log('[main] DB init OK')
    runMigrations()
    log('[main] Migrations OK')
    registerAllHandlers()
    log('[main] IPC OK')
  } catch (err: any) {
    log('[main] DB FAIL: ' + err.message)
  }

  mainWindow.on('ready-to-show', () => { mainWindow?.show(); log('[main] shown') })
  mainWindow.webContents.on('did-finish-load', () => log('[main] renderer loaded'))
  mainWindow.webContents.on('did-fail-load', (_e, c, d) => log('[main] LOAD FAIL: ' + c + ' ' + d))

  const html = join(__dirname, '../renderer/index.html')
  log('[main] loading: ' + html)
  mainWindow.loadFile(html)
}

app.whenReady().then(() => { log('[main] ready'); createWindow() })
app.on('window-all-closed', () => { closeDatabase(); if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
app.on('before-quit', () => { saveDatabase() })
