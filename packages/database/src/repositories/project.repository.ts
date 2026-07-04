import { BaseRepository } from './base.repository'
import type { Project, CreateProjectDTO, UpdateProjectDTO } from '@ceo-os/shared'
import { generateId, nowISO } from '@ceo-os/shared'

export class ProjectRepository extends BaseRepository<Project> {
  getAll(): Project[] {
    return this.queryAll(
      "SELECT * FROM projects WHERE status != 'archived' ORDER BY created_at DESC"
    )
  }

  getById(id: string): Project | undefined {
    return this.queryOne("SELECT * FROM projects WHERE id = ?", [id])
  }

  create(data: CreateProjectDTO): Project {
    const project: Project = {
      id: generateId(),
      ...data,
      createdAt: nowISO(),
      updatedAt: nowISO(),
    }
    this.execute(
      `INSERT INTO projects (id, name, icon, color, description, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [project.id, project.name, project.icon, project.color, project.description, project.status, project.createdAt, project.updatedAt]
    )
    return project
  }

  update(id: string, data: UpdateProjectDTO): Project {
    const existing = this.getById(id)
    if (!existing) throw new Error(`Project ${id} not found`)
    const updated = { ...existing, ...data, updatedAt: nowISO() }
    this.execute(
      `UPDATE projects SET name = ?, icon = ?, color = ?, description = ?, status = ?, updated_at = ? WHERE id = ?`,
      [updated.name, updated.icon, updated.color, updated.description, updated.status, updated.updatedAt, id]
    )
    return updated
  }

  delete(id: string): void {
    this.execute("DELETE FROM projects WHERE id = ?", [id])
  }

  getWithTaskCounts(): (Project & { taskCount: number })[] {
    return this.queryAll(
      `SELECT p.*, COUNT(t.id) as task_count
       FROM projects p
       LEFT JOIN tasks t ON t.project_id = p.id AND t.status != 'done'
       WHERE p.status != 'archived'
       GROUP BY p.id
       ORDER BY p.created_at DESC`
    )
  }
}
