import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { initDatabase, runMigrations, saveDatabase, closeDatabase } from '@ceo-os/database'
import { registerAllHandlers } from './ipc'

app.setName('CEO OS')

const LOG_DIR = app.getPath('userData')
const LOG = join(LOG_DIR, 'app.log')

function log(msg: string) {
  try {
    if (!existsSync(LOG_DIR)) mkdirSync(LOG_DIR, { recursive: true })
    writeFileSync(LOG, msg + '\n', { flag: 'a' })
  } catch {}
}

log('=== CEO OS v0.0.2 ===')
process.on('uncaughtException', (err) => log('[FATAL] ' + err.message + '\n' + (err.stack || '')))

let mainWindow: BrowserWindow | null = null

async function createWindow(): Promise<void> {
  log('[init] start')
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

  try {
    log('[db] path=' + join(app.getPath('userData'), 'ceo-os.db'))
    await initDatabase(join(app.getPath('userData'), 'ceo-os.db'))
    runMigrations()
    registerAllHandlers()
    log('[db] OK')
  } catch (err: any) {
    log('[db] FAIL: ' + err.message)
  }

  mainWindow.on('ready-to-show', () => mainWindow?.show())

  if (process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

app.whenReady().then(createWindow)
app.on('window-all-closed', () => { closeDatabase(); if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
app.on('before-quit', () => saveDatabase())
