import type { Project } from '@ceo-os/shared'
import { Card, CardContent, ProjectIcon, Badge } from '@ceo-os/ui'

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

const statusLabels: Record<string, string> = {
  active: 'Active', archived: 'Archived', planning: 'Planning', 'on-hold': 'On Hold'
}

const statusColors: Record<string, string> = {
  active: 'bg-success/10 text-success', archived: 'bg-zinc-400/10 text-zinc-400',
  planning: 'bg-blue-400/10 text-blue-400', 'on-hold': 'bg-yellow-400/10 text-yellow-400'
}

export function ProjectCard({ project, onClick }: ProjectCardProps): JSX.Element {
  return (
    <Card
      className="cursor-pointer hover:border-zinc-600 transition-all hover:shadow-lg"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <ProjectIcon icon={project.icon} color={project.color} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-sm truncate">{project.name}</h3>
              <Badge className={statusColors[project.status]}>{statusLabels[project.status]}</Badge>
            </div>
            {project.description && (
              <p className="text-xs text-zinc-400 line-clamp-1">{project.description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
