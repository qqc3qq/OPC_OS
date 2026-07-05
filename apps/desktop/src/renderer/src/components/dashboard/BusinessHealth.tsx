import type { Project, Task } from '@ceo-os/shared'
import { Card, CardHeader, CardTitle, CardContent } from '@ceo-os/ui'
import { BarChart3 } from 'lucide-react'
import { useI18n } from '../../i18n'

interface BusinessHealthProps { projects: Project[]; tasks: Task[] }

export function BusinessHealth({ projects, tasks }: BusinessHealthProps): JSX.Element {
  const { t } = useI18n()
  const projectScores = projects.map(project => {
    const projectTasks = tasks.filter(t => t.projectId === project.id)
    const total = projectTasks.length || 1
    const done = projectTasks.filter(t => t.status === 'done').length
    return { ...project, score: Math.round((done / total) * 100) }
  })

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <BarChart3 className="h-4 w-4 text-green-400" />
          {t('dashboard.health')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {projectScores.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">{t('dashboard.health.empty')}</p>
        ) : (
          <div className="space-y-3">
            {projectScores.map(project => (
              <div key={project.id} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">{project.name}</span>
                  <span className="text-muted-foreground/70">{project.score}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-card border border-border overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{
                    width: `${project.score}%`,
                    backgroundColor: project.score >= 70 ? '#10B981' : project.score >= 40 ? '#F59E0B' : '#EF4444'
                  }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
