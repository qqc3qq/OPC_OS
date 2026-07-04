import { createRepositories } from '@ceo-os/database'
import { registerProjectHandlers } from './projects.ipc'
import { registerTaskHandlers } from './tasks.ipc'
import { registerNoteHandlers } from './notes.ipc'
import { registerGoalHandlers } from './goals.ipc'
import { registerAIHandlers } from './ai.ipc'
import { registerSystemHandlers } from './system.ipc'

const repos = createRepositories()

export function registerAllHandlers(): void {
  registerProjectHandlers(repos.projects)
  registerTaskHandlers(repos.tasks)
  registerNoteHandlers(repos.notes)
  registerGoalHandlers(repos.goals)
  registerAIHandlers(repos)
  registerSystemHandlers()
}
