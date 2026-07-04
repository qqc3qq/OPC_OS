import { ipcMain } from 'electron'
import { OpenAIProvider, ChatService, buildContext } from '@ceo-os/ai'
import type { ProjectRepository, TaskRepository } from '@ceo-os/database'

export function registerAIHandlers(repos: { projects: ProjectRepository; tasks: TaskRepository }): void {
  ipcMain.handle('ai:chat', async (_e, messages, apiKey: string) => {
    const provider = new OpenAIProvider()
    const chatService = new ChatService(provider, async () => apiKey)
    const context = buildContext(repos.projects, repos.tasks)
    return chatService.sendMessage(messages, context)
  })

  ipcMain.handle('ai:suggestions', async (_e, apiKey: string) => {
    const provider = new OpenAIProvider()
    const chatService = new ChatService(provider, async () => apiKey)
    const context = buildContext(repos.projects, repos.tasks)
    return chatService.getSuggestions(context)
  })
}
