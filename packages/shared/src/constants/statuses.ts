export const TASK_STATUSES = ['todo', 'in-progress', 'blocked', 'done'] as const

export const STATUS_LABELS: Record<string, string> = {
  'todo': 'Todo',
  'in-progress': 'In Progress',
  'blocked': 'Blocked',
  'done': 'Done'
}
