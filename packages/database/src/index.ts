export { initDatabase, getDatabase, saveDatabase, closeDatabase } from './connection'
export { runMigrations } from './migrate'
export { BaseRepository } from './repositories/base.repository'
export { ProjectRepository } from './repositories/project.repository'
export { TaskRepository } from './repositories/task.repository'
export { NoteRepository } from './repositories/note.repository'
export { GoalRepository } from './repositories/goal.repository'

import { getDatabase } from './connection'
import { ProjectRepository } from './repositories/project.repository'
import { TaskRepository } from './repositories/task.repository'
import { NoteRepository } from './repositories/note.repository'
import { GoalRepository } from './repositories/goal.repository'

export function createRepositories() {
  const db = getDatabase()
  return {
    projects: new ProjectRepository(db),
    tasks: new TaskRepository(db),
    notes: new NoteRepository(db),
    goals: new GoalRepository(db),
  }
}
