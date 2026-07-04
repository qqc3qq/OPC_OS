import initSqlJs, { Database as SqlJsDatabase, SqlJsStatic } from 'sql.js'
import fs from 'fs'
import path from 'path'

let SQL: SqlJsStatic | null = null
let db: SqlJsDatabase | null = null
let dbPath = ''

export async function initDatabase(dataPath?: string): Promise<SqlJsDatabase> {
  if (db) return db

  SQL = await initSqlJs()

  dbPath = dataPath || path.join(process.cwd(), 'ceo-os.db')

  if (fs.existsSync(dbPath)) {
    const buffer = fs.readFileSync(dbPath)
    db = new SQL.Database(buffer)
  } else {
    db = new SQL.Database()
  }

  db.run('PRAGMA journal_mode=WAL')
  db.run('PRAGMA foreign_keys=ON')
  db.run('PRAGMA synchronous=NORMAL')
  db.run('PRAGMA busy_timeout=5000')

  return db
}

export function getDatabase(): SqlJsDatabase {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.')
  return db
}

export function saveDatabase(): void {
  if (!db || !dbPath) return
  const data = db.export()
  const buffer = Buffer.from(data)
  const dir = path.dirname(dbPath)
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
  fs.writeFileSync(dbPath, buffer)
}

export function closeDatabase(): void {
  if (db) {
    saveDatabase()
    db.close()
    db = null
  }
}
