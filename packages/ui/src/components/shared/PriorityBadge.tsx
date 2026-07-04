import { PRIORITY_LABELS, PRIORITY_COLORS, type TaskPriority } from '@ceo-os/shared'
import { Badge } from '../ui/badge'

interface PriorityBadgeProps {
  priority: TaskPriority
}

export function PriorityBadge({ priority }: PriorityBadgeProps) {
  return (
    <Badge className={PRIORITY_COLORS[priority]}>
      {PRIORITY_LABELS[priority]}
    </Badge>
  )
}
