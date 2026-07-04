export const PRIORITIES = ['urgent', 'high', 'medium', 'low', 'none'] as const

export const PRIORITY_LABELS: Record<string, string> = {
  urgent: 'Urgent',
  high: 'High',
  medium: 'Medium',
  low: 'Low',
  none: 'No Priority'
}

export const PRIORITY_COLORS: Record<string, string> = {
  urgent: 'text-red-400 bg-red-400/10',
  high: 'text-orange-400 bg-orange-400/10',
  medium: 'text-yellow-400 bg-yellow-400/10',
  low: 'text-blue-400 bg-blue-400/10',
  none: 'text-zinc-400 bg-zinc-400/10'
}
