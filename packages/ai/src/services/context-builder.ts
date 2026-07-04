import type { AIContext } from '@ceo-os/shared'
import type { ProjectRepository, TaskRepository } from '@ceo-os/database'

export function buildContext(
  projectRepo: ProjectRepository,
  taskRepo: TaskRepository
): AIContext {
  const projects = projectRepo.getWithTaskCounts()
  const todayTasks = taskRepo.getTodayTasks()

  return {
    projects: projects.map(p => ({ id: p.id, name: p.name, taskCount: (p as any).taskCount })),
    todayTasks: todayTasks.map(t => ({ id: t.id, title: t.title, status: t.status })),
    dateContext: new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
    })
  }
}
