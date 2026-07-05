import { useEffect, useState } from 'react'
import { useProjectStore } from '../stores/useProjectStore'
import { useTaskStore } from '../stores/useTaskStore'
import { PageHeader, LoadingSpinner } from '@ceo-os/ui'
import { useI18n } from '../i18n'
import { Greeting } from '../components/dashboard/Greeting'
import { TopPriorities } from '../components/dashboard/TopPriorities'
import { TodayTimeline } from '../components/dashboard/TodayTimeline'
import { BusinessHealth } from '../components/dashboard/BusinessHealth'
import { PendingItems } from '../components/dashboard/PendingItems'
import { AISuggestions } from '../components/dashboard/AISuggestions'
import { QuickNote } from '../components/dashboard/QuickNote'

export function DashboardPage(): JSX.Element {
  const { t } = useI18n()
  const { projects, fetchProjects, loading: projectsLoading } = useProjectStore()
  const { tasks, fetchTasks, loading: tasksLoading } = useTaskStore()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function load() {
      await Promise.all([fetchProjects(), fetchTasks()])
      setReady(true)
    }
    load()
  }, [])

  if (projectsLoading || tasksLoading || !ready) {
    return (
      <div>
        <PageHeader title={t('dashboard.title')} description={t('dashboard.desc')} />
        <LoadingSpinner label={t('common.loadingWorkspace')} />
      </div>
    )
  }

  return (
    <div>
      <Greeting projectCount={projects.length} />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <TopPriorities tasks={tasks} />
          <TodayTimeline tasks={tasks} />
          <PendingItems tasks={tasks} />
        </div>
        <div className="space-y-6">
          <BusinessHealth projects={projects} tasks={tasks} />
          <AISuggestions />
          <QuickNote />
        </div>
      </div>
    </div>
  )
}
