import { app, BrowserWindow } from 'electron'
import { join } from 'path'
import { writeFileSync, mkdirSync } from 'fs'
import { homedir } from 'os'
import { initDatabase, runMigrations, saveDatabase, closeDatabase } from '@ceo-os/database'
import { registerAllHandlers } from './ipc'

const LOG = join(homedir(), 'Desktop', 'CEO_OS', 'app.log')

function log(msg: string) {
  writeFileSync(LOG, msg + '\n', { flag: 'a' })
}

log('=== CEO OS v0.0.1 ===')
log('Platform: ' + process.platform)
log('Node: ' + process.version)

process.on('uncaughtException', (err) => {
  try { log('[FATAL] ' + err.message + '\n' + (err.stack || '')) } catch {}
})

let mainWindow: BrowserWindow | null = null

async function createWindow(): Promise<void> {
  log('[init] createWindow')
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
  log('[init] window created')

  try {
    const dbPath = join(app.getPath('userData'), 'ceo-os.db')
    log('[db] path=' + dbPath)
    await initDatabase(dbPath)
    log('[db] init OK')
    runMigrations()
    log('[db] migrations OK')
    registerAllHandlers()
    log('[ipc] registered')
  } catch (err: any) {
    log('[db] ERROR: ' + err.message + '\n' + (err.stack || ''))
  }

  mainWindow.on('ready-to-show', () => { mainWindow?.show() })
  mainWindow.webContents.on('did-finish-load', () => log('[renderer] loaded OK'))
  mainWindow.webContents.on('did-fail-load', (_e, c, d) => log('[renderer] FAIL: ' + c + ' ' + d))

  const html = join(__dirname, '../renderer/index.html')
  log('[init] loading ' + html)
  mainWindow.loadFile(html)
}

app.whenReady().then(() => { log('[app] ready'); createWindow() })
app.on('window-all-closed', () => { closeDatabase(); if (process.platform !== 'darwin') app.quit() })
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow() })
app.on('before-quit', () => { saveDatabase() })
