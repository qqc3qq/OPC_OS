import type { Project } from '@ceo-os/shared'
import { Card, CardContent, ProjectIcon, Badge } from '@ceo-os/ui'
import { useI18n } from '../../i18n'

const STATUS_KEYS: Record<string, string> = {
  active: 'projects.status.active', archived: 'projects.status.archived',
  planning: 'projects.status.planning', 'on-hold': 'projects.status.onHold'
}
const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success', archived: 'bg-muted-foreground/10 text-muted-foreground',
  planning: 'bg-blue-400/10 text-blue-400', 'on-hold': 'bg-yellow-400/10 text-yellow-400'
}

export function ProjectCard({ project, onClick }: { project: Project; onClick: () => void }): JSX.Element {
  const { t } = useI18n()
  return (
    <Card className="cursor-pointer hover:border-zinc-600 transition-all hover:shadow-lg" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <ProjectIcon icon={project.icon} color={project.color} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm truncate">{project.name}</h3>
              <Badge className={statusColors[project.status]}>{t(STATUS_KEYS[project.status] || 'common.unknown')}</Badge>
            </div>
            {project.description && <p className="text-xs text-muted-foreground line-clamp-1">{project.description}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
