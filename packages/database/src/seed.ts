import { getDatabase } from './connection'
import { ProjectRepository } from './repositories/project.repository'
import { TaskRepository } from './repositories/task.repository'
import { todayISO } from '@ceo-os/shared'

export function seed(): void {
  const db = getDatabase()
  const projects = new ProjectRepository(db)
  const tasks = new TaskRepository(db)

  const existing = projects.getAll()
  if (existing.length > 0) return

  const today = todayISO()

  const ecommerce = projects.create({
    name: 'E-Commerce Store',
    icon: 'shopping-cart',
    color: '#F59E0B',
    description: 'Taobao shop',
    status: 'active',
  })

  const platform = projects.create({
    name: 'Energy Platform',
    icon: 'zap',
    color: '#3B82F6',
    description: '',
    status: 'active',
  })

  const media = projects.create({
    name: 'Social Media',
    icon: 'smartphone',
    color: '#EC4899',
    description: '',
    status: 'active',
  })

  const data = projects.create({
    name: 'Data Platform',
    icon: 'bar-chart-3',
    color: '#8B5CF6',
    description: '',
    status: 'active',
  })

  const web3 = projects.create({
    name: 'Web3',
    icon: 'globe',
    color: '#06B6D4',
    description: '',
    status: 'planning',
  })

  tasks.create({ title: 'Update product listings', projectId: ecommerce.id, priority: 'high', status: 'in-progress', dueDate: today })
  tasks.create({ title: 'Check ad performance', projectId: ecommerce.id, priority: 'medium', status: 'todo', dueDate: today })
  tasks.create({ title: 'Reply to customer messages', projectId: ecommerce.id, priority: 'urgent', status: 'todo', dueDate: today })
  tasks.create({ title: 'Deploy API v2', projectId: platform.id, priority: 'high', status: 'in-progress', dueDate: today })
  tasks.create({ title: 'Fix login bug', projectId: platform.id, priority: 'urgent', status: 'blocked', dueDate: today })
  tasks.create({ title: 'Draft content calendar', projectId: media.id, priority: 'medium', status: 'todo', dueDate: today })
  tasks.create({ title: 'Write video script', projectId: media.id, priority: 'low', status: 'todo', dueDate: today })
  tasks.create({ title: 'Review analytics dashboard', projectId: data.id, priority: 'medium', status: 'todo', dueDate: today })
  tasks.create({ title: 'Research DeFi protocols', projectId: web3.id, priority: 'low', status: 'todo' })

  console.log('Seed data created: 5 projects, 9 tasks')
}
