import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProjectStore } from '../stores/useProjectStore'
import { PageHeader, Button, Input, Dialog, DialogContent, DialogHeader, DialogTitle, EmptyState, LoadingSpinner } from '@ceo-os/ui'
import { Plus, Search, FolderKanban } from 'lucide-react'
import type { CreateProjectDTO } from '@ceo-os/shared'
import { PROJECT_COLORS } from '@ceo-os/shared'
import { ProjectCard } from '../components/projects/ProjectCard'

export function ProjectsPage(): JSX.Element {
  const navigate = useNavigate()
  const { projects, fetchProjects, createProject, loading } = useProjectStore()
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [color, setColor] = useState(PROJECT_COLORS[0])

  useEffect(() => { fetchProjects() }, [])

  const filtered = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description?.toLowerCase().includes(search.toLowerCase())
  )

  async function handleCreate() {
    if (!name.trim()) return
    await createProject({ name, description, color, icon: 'folder', status: 'active' })
    setName(''); setDescription(''); setColor(PROJECT_COLORS[0]); setShowForm(false)
  }

  if (loading) return <div><PageHeader title="Projects" /><LoadingSpinner label="Loading projects..." /></div>

  return (
    <div>
      <PageHeader
        title="Projects"
        description={`${projects.length} projects`}
        actions={
          <Button size="sm" onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4 mr-1" /> New Project
          </Button>
        }
      />
      <div className="relative w-64 mb-6">
        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input placeholder="Search projects..." value={search} onChange={e => setSearch(e.target.value)} className="pl-8" />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects yet"
          description="Create your first project to get started"
          action={{ label: 'Create Project', onClick: () => setShowForm(true) }}
        />
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map(project => (
            <ProjectCard key={project.id} project={project} onClick={() => navigate(`/projects/${project.id}`)} />
          ))}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Project name" value={name} onChange={e => setName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCreate()} />
            <Input placeholder="Description (optional)" value={description} onChange={e => setDescription(e.target.value)} />
            <div className="flex gap-2">
              {PROJECT_COLORS.map(c => (
                <button
                  key={c}
                  className={`h-8 w-8 rounded-lg border-2 transition-all ${color === c ? 'border-white scale-110' : 'border-transparent'}`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              <Button onClick={handleCreate}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
