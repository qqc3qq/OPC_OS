import { app, BrowserWindow } from 'electron'
import { join, dirname } from 'path'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { initDatabase, runMigrations, saveDatabase, closeDatabase } from '@ceo-os/database'
import { registerAllHandlers } from './ipc'

app.setName('CEO OS')

// Log to install dir (resourcesPath is available before app is ready)
const LOG_DIR = join(
  dirname(process.resourcesPath || app.getPath('userData')),
  'logs'
)
try { if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true }) } catch {}

function log(msg: string) {
  try {
    writeFileSync(join(LOG_DIR, 'app.log'), msg + '\n', { flag: 'a' })
  } catch {
    // Last resort: userData
    try {
      const d = join(app.getPath('userData'), 'logs')
      if (!existsSync(d)) mkdirSync(d, { recursive: true })
      writeFileSync(join(d, 'app.log'), msg + '\n', { flag: 'a' })
    } catch {}
  }
}

log('=== CEO OS v0.0.4 ===')
log('Install: ' + dirname(dirname(app.getAppPath())))
log('userData: ' + app.getPath('userData'))
log('Platform: ' + process.platform + ' Node: ' + process.version)

process.on('uncaughtException', (err) => {
  log('[MAIN FATAL] ' + err.message + '\n' + (err.stack || ''))
})

let mainWindow: BrowserWindow | null = null

async function createWindow(): Promise<void> {
  log('[main] creating window')
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
  log('[main] window created')

  try {
    const dbPath = join(app.getPath('userData'), 'ceo-os.db')
    log('[main] db=' + dbPath)
    await initDatabase(dbPath)
    runMigrations()
    registerAllHandlers()
    log('[main] db ok, ipc registered')
  } catch (err: any) {
    log('[main DB ERROR] ' + err.message + '\n' + (err.stack || ''))
  }

  mainWindow.on('ready-to-show', () => { mainWindow?.show(); log('[main] shown') })
  mainWindow.webContents.on('did-finish-load', () => log('[main] renderer loaded'))
  mainWindow.webContents.on('did-fail-load', (_e, c, d) => log('[main] LOAD FAIL: ' + c + ' ' + d))

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => { log('[main] app ready'); createWindow() })
app.on('window-all-closed', () => { closeDatabase(); if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
app.on('before-quit', () => saveDatabase())
