import { app, BrowserWindow, Menu } from 'electron'
import { join } from 'path'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { initDatabase, runMigrations, saveDatabase, closeDatabase } from '@ceo-os/database'
import { registerAllHandlers } from './ipc'

app.setName('CEO OS')
Menu.setApplicationMenu(null)

// Guaranteed writable: system temp + app-specific subfolder
const LOG_DIR = join(process.env.TEMP || 'C:\\Windows\\Temp', 'ceo-os-logs')
const LOG = join(LOG_DIR, 'app.log')

function log(msg: string) {
  try {
    if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true })
    writeFileSync(LOG, msg + '\n', { flag: 'a' })
  } catch {}
}

log('=== CEO OS v0.0.5 ===')
log('temp: ' + (process.env.TEMP || 'n/a'))
log('resourcesPath: ' + (process.resourcesPath || 'n/a'))
log('platform: ' + process.platform + ' node: ' + process.version)

process.on('uncaughtException', (err) => {
  log('[FATAL] ' + err.message + '\n' + (err.stack || ''))
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
  log('[main] window created')

  try {
    const dbPath = join(app.getPath('userData'), 'ceo-os.db')
    log('[main] db=' + dbPath)
    await initDatabase(dbPath)
    runMigrations()
    registerAllHandlers()
    log('[main] init OK')
  } catch (err: any) {
    log('[main DB FAIL] ' + err.message + '\n' + (err.stack || ''))
  }

  mainWindow.on('ready-to-show', () => { mainWindow?.show(); log('[main] shown') })
  mainWindow.webContents.on('did-finish-load', async () => {
    log('[main] renderer loaded')
    try {
      const { autoUpdater } = await import('electron-updater')
      autoUpdater.logger = { info: (m: string) => log('[update] ' + m), warn: (m: string) => log('[update] ' + m), error: (m: string) => log('[update] ' + m), debug: () => {}, silly: () => {} } as any
      autoUpdater.checkForUpdatesAndNotify().catch(() => {})
    } catch { log('[update] not available') }
  })
  mainWindow.webContents.on('did-fail-load', (_e, c, d) => log('[main] LOAD FAIL: ' + c + ' ' + d))

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(() => { log('[main] ready'); createWindow() })
app.on('window-all-closed', () => { closeDatabase(); if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
app.on('before-quit', () => saveDatabase())
