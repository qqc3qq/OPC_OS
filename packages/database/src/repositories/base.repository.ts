import { Database as SqlJsDatabase } from 'sql.js'
import { mapRow } from '@ceo-os/shared'

export abstract class BaseRepository<T> {
  constructor(protected db: SqlJsDatabase) {}

  protected queryAll(sql: string, params?: unknown[]): T[] {
    const stmt = this.db.prepare(sql)
    if (params) stmt.bind(params)
    const results: T[] = []
    while (stmt.step()) {
      results.push(mapRow<T>(stmt.getAsObject() as Record<string, unknown>))
    }
    stmt.free()
    return results
  }

  protected queryOne(sql: string, params?: unknown[]): T | undefined {
    const stmt = this.db.prepare(sql)
    if (params) stmt.bind(params)
    if (stmt.step()) {
      const result = mapRow<T>(stmt.getAsObject() as Record<string, unknown>)
      stmt.free()
      return result
    }
    stmt.free()
    return undefined
  }

  protected count(sql: string, params?: unknown[]): number {
    const stmt = this.db.prepare(sql)
    if (params) stmt.bind(params)
    let count = 0
    if (stmt.step()) {
      count = stmt.getAsObject().count as number
    }
    stmt.free()
    return count
  }

  protected execute(sql: string, params?: unknown[]): void {
    if (params) {
      this.db.run(sql, params)
    } else {
      this.db.run(sql)
    }
  }

  abstract getAll(filters?: unknown): T[]
  abstract getById(id: string): T | undefined
  abstract create(data: unknown): T
  abstract update(id: string, data: unknown): T
  abstract delete(id: string): void
}
