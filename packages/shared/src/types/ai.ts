export interface AIMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface AIContext {
  projects: { id: string; name: string; taskCount: number }[]
  todayTasks: { id: string; title: string; status: string }[]
  dateContext: string
}
