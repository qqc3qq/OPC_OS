import { BaseRepository } from './base.repository'
import type { Goal, CreateGoalDTO, UpdateGoalDTO } from '@ceo-os/shared'
import { generateId } from '@ceo-os/shared'

export class GoalRepository extends BaseRepository<Goal> {
  getAll(): Goal[] {
    return this.queryAll("SELECT * FROM goals ORDER BY deadline ASC")
  }

  getById(id: string): Goal | undefined {
    return this.queryOne("SELECT * FROM goals WHERE id = ?", [id])
  }

  getByProject(projectId: string): Goal[] {
    return this.queryAll(
      "SELECT * FROM goals WHERE project_id = ? ORDER BY deadline ASC",
      [projectId]
    )
  }

  getActive(): Goal[] {
    return this.queryAll("SELECT * FROM goals WHERE progress < 100 ORDER BY deadline ASC")
  }

  create(data: CreateGoalDTO): Goal {
    const goal: Goal = {
      id: generateId(),
      ...data,
    }
    this.execute(
      `INSERT INTO goals (id, title, project_id, progress, deadline)
       VALUES (?, ?, ?, ?, ?)`,
      [goal.id, goal.title, goal.projectId, goal.progress, goal.deadline]
    )
    return goal
  }

  update(id: string, data: UpdateGoalDTO): Goal {
    const existing = this.getById(id)
    if (!existing) throw new Error(`Goal ${id} not found`)
    const updated = { ...existing, ...data }
    this.execute(
      `UPDATE goals SET title = ?, project_id = ?, progress = ?, deadline = ? WHERE id = ?`,
      [updated.title, updated.projectId, updated.progress, updated.deadline, id]
    )
    return updated
  }

  updateProgress(id: string, progress: number): Goal {
    return this.update(id, { progress })
  }

  delete(id: string): void {
    this.execute("DELETE FROM goals WHERE id = ?", [id])
  }
}
