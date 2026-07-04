import { getDatabase } from './connection'
import { migrations } from './migrations'

export function runMigrations(): void {
  const db = getDatabase()

  db.run(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      executed_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `)

  const result = db.exec("SELECT name FROM _migrations")
  const executed = new Set(
    result.length > 0 ? result[0].values.map((row: unknown[]) => row[0] as string) : []
  )

  for (const migration of migrations) {
    if (!executed.has(migration.name)) {
      db.run(migration.sql)
      db.run("INSERT INTO _migrations (name) VALUES (?)", [migration.name])
      console.log(`Migration ${migration.name} applied.`)
    }
  }
}
