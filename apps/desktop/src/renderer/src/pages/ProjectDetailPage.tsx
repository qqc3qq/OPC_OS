import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProjectStore } from '../stores/useProjectStore'
import { useTaskStore } from '../stores/useTaskStore'
import { useGoalStore } from '../stores/useGoalStore'
import { useNoteStore } from '../stores/useNoteStore'
import { Button, Tabs, TabsList, TabsTrigger, TabsContent, Card, CardContent, CardHeader, CardTitle, ProjectIcon, LoadingSpinner, Badge } from '@ceo-os/ui'
import { ArrowLeft, Plus } from 'lucide-react'
import { TaskForm } from '../components/tasks/TaskForm'
import { TaskCard } from '../components/tasks/TaskCard'
import { TaskDetail } from '../components/tasks/TaskDetail'

export function ProjectDetailPage(): JSX.Element {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { projects, fetchProjects } = useProjectStore()
  const { tasks, fetchTasks, updateStatus } = useTaskStore()
  const { goals, fetchGoals, createGoal, updateGoal } = useGoalStore()
  const { notes, fetchNotes, createNote } = useNoteStore()
  const [loaded, setLoaded] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [goalTitle, setGoalTitle] = useState('')
  const [goalDeadline, setGoalDeadline] = useState('')
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')

  useEffect(() => {
    async function load() {
      await Promise.all([fetchProjects(), fetchTasks({ projectId: id }), fetchGoals(), fetchNotes()])
      setLoaded(true)
    }
    load()
  }, [id])

  const project = projects.find(p => p.id === id)
  const projectTasks = tasks.filter(t => t.projectId === id)
  const projectGoals = goals.filter(g => g.projectId === id)
  const projectNotes = notes.filter(n => n.projectId === id)
  const doneCount = projectTasks.filter(t => t.status === 'done').length
  const progress = projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0

  if (!loaded) return <div><LoadingSpinner label="Loading project..." /></div>
  if (!project) return <div><p className="text-zinc-400">Project not found.</p></div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/projects')}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <ProjectIcon icon={project.icon} color={project.color} size="md" />
        <div>
          <h1 className="text-xl font-bold">{project.name}</h1>
          <p className="text-sm text-zinc-400">{project.description}</p>
        </div>
        <Badge className="ml-auto">{progress}% done</Badge>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2">
          <Tabs defaultValue="tasks">
            <TabsList>
              <TabsTrigger value="tasks">Tasks ({projectTasks.length})</TabsTrigger>
              <TabsTrigger value="notes">Notes ({projectNotes.length})</TabsTrigger>
              <TabsTrigger value="goals">Goals ({projectGoals.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="tasks">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm text-zinc-500">{doneCount} of {projectTasks.length} done</span>
                <Button size="sm" onClick={() => setShowTaskForm(true)}><Plus className="h-4 w-4 mr-1" /> Add Task</Button>
              </div>
              <div className="space-y-2">
                {projectTasks.map(task => (
                  <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="notes">
              <div className="space-y-6">
                <Card>
                  <CardContent className="p-4">
                    <input
                      className="w-full bg-transparent text-sm font-medium mb-2 outline-none placeholder:text-zinc-500"
                      placeholder="Note title"
                      value={noteTitle}
                      onChange={e => setNoteTitle(e.target.value)}
                    />
                    <textarea
                      className="w-full bg-transparent text-sm outline-none resize-none placeholder:text-zinc-500 min-h-[80px]"
                      placeholder="Write in markdown..."
                      value={noteContent}
                      onChange={e => setNoteContent(e.target.value)}
                    />
                    <Button size="sm" onClick={async () => {
                      if (noteTitle.trim()) {
                        await createNote({ title: noteTitle, content: noteContent, projectId: id })
                        await fetchNotes()
                        setNoteTitle(''); setNoteContent('')
                      }
                    }}>Save Note</Button>
                  </CardContent>
                </Card>
                {projectNotes.map(note => (
                  <Card key={note.id}>
                    <CardHeader><CardTitle className="text-sm">{note.title}</CardTitle></CardHeader>
                    <CardContent><p className="text-sm text-zinc-400 line-clamp-3">{note.content}</p></CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="goals">
              <div className="space-y-3">
                <div className="flex gap-2">
                  <input className="flex-1 bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" placeholder="Goal title" value={goalTitle} onChange={e => setGoalTitle(e.target.value)} />
                  <input type="date" className="bg-card border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-primary" value={goalDeadline} onChange={e => setGoalDeadline(e.target.value)} />
                  <Button size="sm" onClick={async () => {
                    if (goalTitle.trim()) {
                      await createGoal({ title: goalTitle, projectId: id, deadline: goalDeadline || null })
                      await fetchGoals()
                      setGoalTitle(''); setGoalDeadline('')
                    }
                  }}>Add</Button>
                </div>
                {projectGoals.map(goal => (
                  <Card key={goal.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium">{goal.title}</p>
                          {goal.deadline && <p className="text-xs text-zinc-500">Due: {goal.deadline}</p>}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-card border border-border rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${goal.progress}%` }} />
                          </div>
                          <input
                            type="number" min={0} max={100}
                            className="w-12 bg-transparent text-xs text-center outline-none"
                            value={goal.progress}
                            onChange={async e => {
                              await updateGoal(goal.id, { progress: Number(e.target.value) })
                              await fetchGoals()
                            }}
                          />%
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Project Info</CardTitle></CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-zinc-400">Tasks</span><span>{projectTasks.length}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Done</span><span>{doneCount}</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Progress</span><span>{progress}%</span></div>
                <div className="flex justify-between"><span className="text-zinc-400">Status</span><span className="capitalize">{project.status}</span></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TaskForm open={showTaskForm} onOpenChange={setShowTaskForm} projects={projects} />
      <TaskDetail task={selectedTask} onClose={() => setSelectedTask(null)} projects={projects} />
    </div>
  )
}
