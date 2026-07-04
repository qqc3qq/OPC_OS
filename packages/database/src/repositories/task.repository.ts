import { BaseRepository } from './base.repository'
import type { Task, CreateTaskDTO, UpdateTaskDTO, TaskFilters, TaskStatus } from '@ceo-os/shared'
import { generateId, nowISO, todayISO } from '@ceo-os/shared'

export class TaskRepository extends BaseRepository<Task> {
  getAll(filters?: TaskFilters): Task[] {
    let sql = "SELECT * FROM tasks WHERE 1=1"
    const params: unknown[] = []

    if (filters?.projectId) {
      sql += " AND project_id = ?"
      params.push(filters.projectId)
    }
    if (filters?.status) {
      if (Array.isArray(filters.status)) {
        sql += ` AND status IN (${filters.status.map(() => '?').join(',')})`
        params.push(...filters.status)
      } else {
        sql += " AND status = ?"
        params.push(filters.status)
      }
    }
    if (filters?.priority) {
      sql += " AND priority = ?"
      params.push(filters.priority)
    }
    if (filters?.search) {
      sql += " AND (title LIKE ? OR description LIKE ?)"
      const search = `%${filters.search}%`
      params.push(search, search)
    }

    sql += " ORDER BY sort_order ASC, created_at DESC"
    return this.queryAll(sql, params)
  }

  getById(id: string): Task | undefined {
    return this.queryOne("SELECT * FROM tasks WHERE id = ?", [id])
  }

  getTodayTasks(): Task[] {
    const today = todayISO()
    return this.queryAll(
      "SELECT * FROM tasks WHERE due_date = ? AND status != 'done' ORDER BY priority, sort_order",
      [today]
    )
  }

  getByProject(projectId: string): Task[] {
    return this.queryAll(
      "SELECT * FROM tasks WHERE project_id = ? ORDER BY sort_order ASC, created_at DESC",
      [projectId]
    )
  }

  getForDateRange(start: string, end: string): Task[] {
    return this.queryAll(
      "SELECT * FROM tasks WHERE due_date >= ? AND due_date <= ? AND status != 'done' ORDER BY due_date, sort_order",
      [start, end]
    )
  }

  getOverdue(): Task[] {
    const today = todayISO()
    return this.queryAll(
      "SELECT * FROM tasks WHERE due_date < ? AND status != 'done' AND due_date IS NOT NULL ORDER BY due_date",
      [today]
    )
  }

  create(data: CreateTaskDTO): Task {
    const maxOrder = this.count("SELECT COALESCE(MAX(sort_order), 0) as count FROM tasks WHERE status = ?", [data.status || 'todo'])
    const task: Task = {
      id: generateId(),
      title: data.title,
      description: data.description || '',
      projectId: data.projectId,
      priority: data.priority || 'none',
      status: data.status || 'todo',
      estimate: data.estimate || null,
      dueDate: data.dueDate || null,
      sortOrder: maxOrder + 1,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    this.execute(
      `INSERT INTO tasks (id, title, description, project_id, priority, status, estimate, due_date, sort_order, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [task.id, task.title, task.description, task.projectId, task.priority, task.status, task.estimate, task.dueDate, task.sortOrder, task.createdAt, task.updatedAt]
    )
    return task
  }

  update(id: string, data: UpdateTaskDTO): Task {
    const existing = this.getById(id)
    if (!existing) throw new Error(`Task ${id} not found`)
    const updated = { ...existing, ...data, updatedAt: nowISO() }
    this.execute(
      `UPDATE tasks SET title = ?, description = ?, project_id = ?, priority = ?, status = ?, estimate = ?, due_date = ?, sort_order = ?, updated_at = ? WHERE id = ?`,
      [updated.title, updated.description, updated.projectId, updated.priority, updated.status, updated.estimate, updated.dueDate, updated.sortOrder, updated.updatedAt, id]
    )
    return updated
  }

  updateStatus(id: string, status: TaskStatus): Task {
    return this.update(id, { status })
  }

  updateSortOrder(updates: { id: string; sortOrder: number }[]): void {
    this.db.run('BEGIN TRANSACTION')
    try {
      const stmt = this.db.prepare("UPDATE tasks SET sort_order = ?, updated_at = ? WHERE id = ?")
      const now = nowISO()
      for (const u of updates) {
        stmt.run([u.sortOrder, now, u.id])
      }
      stmt.free()
      this.db.run('COMMIT')
    } catch (e) {
      this.db.run('ROLLBACK')
      throw e
    }
  }

  delete(id: string): void {
    this.execute("DELETE FROM tasks WHERE id = ?", [id])
  }

  search(query: string): Task[] {
    return this.getAll({ search: query })
  }

  getPriorities(): Task[] {
    return this.queryAll(
      "SELECT * FROM tasks WHERE status != 'done' ORDER BY CASE priority WHEN 'urgent' THEN 1 WHEN 'high' THEN 2 WHEN 'medium' THEN 3 WHEN 'low' THEN 4 ELSE 5 END, sort_order ASC LIMIT 3"
    )
  }
}
