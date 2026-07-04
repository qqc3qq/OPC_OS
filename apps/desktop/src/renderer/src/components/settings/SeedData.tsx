import { useState } from 'react'
import { Button } from '@ceo-os/ui'
import { useProjectStore } from '../../stores/useProjectStore'
import { useTaskStore } from '../../stores/useTaskStore'
import { todayISO } from '@ceo-os/shared'
import { toast } from '../../lib/toast'

export function SeedData(): JSX.Element {
  const [seeding, setSeeding] = useState(false)
  const { projects, fetchProjects, createProject } = useProjectStore()
  const { createTask } = useTaskStore()

  async function handleSeed() {
    setSeeding(true)
    try {
      const existing = projects.length
      if (existing > 0) {
        toast('Data already exists. Clear it first.', 'error')
        setSeeding(false)
        return
      }

      const today = todayISO()

      const ecommerce = await createProject({
        name: 'E-Commerce Store', icon: 'shopping-cart', color: '#F59E0B',
        description: 'Taobao shop operations', status: 'active'
      })
      const platform = await createProject({
        name: 'Energy Platform', icon: 'zap', color: '#3B82F6',
        description: 'Energy management SaaS', status: 'active'
      })
      const media = await createProject({
        name: 'Social Media', icon: 'smartphone', color: '#EC4899',
        description: 'Content creation and marketing', status: 'active'
      })
      const data = await createProject({
        name: 'Data Platform', icon: 'bar-chart-3', color: '#8B5CF6',
        description: 'Data analytics dashboard', status: 'active'
      })
      const web3 = await createProject({
        name: 'Web3', icon: 'globe', color: '#06B6D4',
        description: 'Blockchain and DeFi research', status: 'planning'
      })

      await createTask({ title: 'Update product listings', projectId: ecommerce.id, priority: 'high', status: 'in-progress', dueDate: today })
      await createTask({ title: 'Check ad performance metrics', projectId: ecommerce.id, priority: 'medium', status: 'todo', dueDate: today })
      await createTask({ title: 'Reply to customer messages', projectId: ecommerce.id, priority: 'urgent', status: 'todo', dueDate: today })
      await createTask({ title: 'Deploy API v2', projectId: platform.id, priority: 'high', status: 'in-progress', dueDate: today })
      await createTask({ title: 'Fix login authentication bug', projectId: platform.id, priority: 'urgent', status: 'blocked', dueDate: today })
      await createTask({ title: 'Draft weekly content calendar', projectId: media.id, priority: 'medium', status: 'todo', dueDate: today })
      await createTask({ title: 'Write product review video script', projectId: media.id, priority: 'low', status: 'todo', dueDate: today })
      await createTask({ title: 'Review analytics dashboard', projectId: data.id, priority: 'medium', status: 'todo', dueDate: today })
      await createTask({ title: 'Research DeFi lending protocols', projectId: web3.id, priority: 'low', status: 'todo' })
      await createTask({ title: 'Update supplier contracts', projectId: ecommerce.id, priority: 'high', status: 'todo' })
      await createTask({ title: 'Review platform uptime report', projectId: platform.id, priority: 'medium', status: 'done', dueDate: today })

      await fetchProjects()
      toast('5 projects and 11 tasks created!', 'success')
    } catch (err) {
      toast('Failed to create seed data', 'error')
    }
    setSeeding(false)
  }

  return (
    <Button size="sm" onClick={handleSeed} disabled={seeding}>
      {seeding ? 'Seeding...' : 'Load Sample Data'}
    </Button>
  )
}
