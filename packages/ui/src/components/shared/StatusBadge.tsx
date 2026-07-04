import { STATUS_LABELS, type TaskStatus } from '@ceo-os/shared'
import { Badge } from '../ui/badge'

interface StatusBadgeProps {
  status: TaskStatus
}

const statusColors: Record<TaskStatus, string> = {
  'todo': 'text-zinc-400 bg-zinc-400/10',
  'in-progress': 'text-blue-400 bg-blue-400/10',
  'blocked': 'text-red-400 bg-red-400/10',
  'done': 'text-green-400 bg-green-400/10',
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={statusColors[status]}>
      {STATUS_LABELS[status]}
    </Badge>
  )
}
