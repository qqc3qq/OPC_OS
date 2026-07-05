import { useState } from 'react'
import { Button } from '@ceo-os/ui'
import { useProjectStore } from '../../stores/useProjectStore'
import { useTaskStore } from '../../stores/useTaskStore'
import { todayISO } from '@ceo-os/shared'
import { useI18n } from '../../i18n'
import { toast } from '../../lib/toast'

export function SeedData(): JSX.Element {
  const { t } = useI18n()
  const [seeding, setSeeding] = useState(false)
  const { projects, fetchProjects, createProject } = useProjectStore()
  const { createTask } = useTaskStore()

  async function handleSeed() {
    setSeeding(true)
    try {
      if (projects.length > 0) { toast(t('seed.exists'), 'error'); setSeeding(false); return }
      const today = todayISO()

      const e = await createProject({ name: t('seed.project1'), icon: 'shopping-cart', color: '#F59E0B', description: t('seed.project1desc'), status: 'active' })
      const p = await createProject({ name: t('seed.project2'), icon: 'zap', color: '#3B82F6', description: t('seed.project2desc'), status: 'active' })
      const m = await createProject({ name: t('seed.project3'), icon: 'smartphone', color: '#EC4899', description: t('seed.project3desc'), status: 'active' })
      const d = await createProject({ name: t('seed.project4'), icon: 'bar-chart-3', color: '#8B5CF6', description: t('seed.project4desc'), status: 'active' })
      const w = await createProject({ name: t('seed.project5'), icon: 'globe', color: '#06B6D4', description: t('seed.project5desc'), status: 'planning' })

      await createTask({ title: t('seed.task1'), projectId: e.id, priority: 'high', status: 'in-progress', dueDate: today })
      await createTask({ title: t('seed.task2'), projectId: e.id, priority: 'medium', status: 'todo', dueDate: today })
      await createTask({ title: t('seed.task3'), projectId: e.id, priority: 'urgent', status: 'todo', dueDate: today })
      await createTask({ title: t('seed.task4'), projectId: p.id, priority: 'high', status: 'in-progress', dueDate: today })
      await createTask({ title: t('seed.task5'), projectId: p.id, priority: 'urgent', status: 'blocked', dueDate: today })
      await createTask({ title: t('seed.task6'), projectId: m.id, priority: 'medium', status: 'todo', dueDate: today })
      await createTask({ title: t('seed.task7'), projectId: m.id, priority: 'low', status: 'todo', dueDate: today })
      await createTask({ title: t('seed.task8'), projectId: d.id, priority: 'medium', status: 'todo', dueDate: today })
      await createTask({ title: t('seed.task9'), projectId: w.id, priority: 'low', status: 'todo' })
      await createTask({ title: t('seed.task10'), projectId: e.id, priority: 'high', status: 'todo' })
      await createTask({ title: t('seed.task11'), projectId: p.id, priority: 'medium', status: 'done', dueDate: today })

      await fetchProjects()
      toast(t('seed.success', { projectCount: 5, taskCount: 11 }), 'success')
    } catch { toast(t('seed.error'), 'error') }
    setSeeding(false)
  }

  return (
    <Button size="sm" onClick={handleSeed} disabled={seeding}>
      {seeding ? t('seed.loading') : t('seed.button')}
    </Button>
  )
}
