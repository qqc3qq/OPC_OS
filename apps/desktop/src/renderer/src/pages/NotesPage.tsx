import { useEffect, useState } from 'react'
import { useNoteStore } from '../stores/useNoteStore'
import { PageHeader, Button, Input, Textarea, Card, CardContent, MarkdownRenderer, EmptyState, LoadingSpinner, Separator } from '@ceo-os/ui'
import { Plus, Search, StickyNote, Trash2, Eye, Edit3 } from 'lucide-react'
import type { Note } from '@ceo-os/shared'
import { toast } from '../lib/toast'

export function NotesPage(): JSX.Element {
  const { notes, fetchNotes, createNote, updateNote, deleteNote, loading } = useNoteStore()
  const [search, setSearch] = useState('')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [isDirty, setIsDirty] = useState(false)
  const [preview, setPreview] = useState(false)

  useEffect(() => { fetchNotes() }, [])

  useEffect(() => {
    if (selectedId) {
      const note = notes.find(n => n.id === selectedId)
      if (note) { setTitle(note.title); setContent(note.content); setIsDirty(false) }
    }
  }, [selectedId])

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  )

  async function handleCreate() {
    const note = await createNote({ title: 'Untitled', content: '' })
    setSelectedId(note.id)
    toast('Note created')
  }

  async function handleSave() {
    if (!selectedId || !isDirty) return
    await updateNote(selectedId, { title, content })
    await fetchNotes()
    setIsDirty(false)
    toast('Note saved')
  }

  async function handleDelete() {
    if (!selectedId) return
    await deleteNote(selectedId)
    await fetchNotes()
    setSelectedId(null)
    toast('Note deleted')
  }

  useEffect(() => {
    const timer = setInterval(() => { if (isDirty) handleSave() }, 3000)
    return () => {
      clearInterval(timer)
      if (isDirty) handleSave()
    }
  }, [isDirty, title, content, selectedId])

  const selectedNote = notes.find(n => n.id === selectedId)

  if (loading) return <div><PageHeader title="Notes" /><LoadingSpinner /></div>

  return (
    <div>
      <PageHeader
        title="Notes"
        description={`${notes.length} notes`}
        actions={<Button size="sm" onClick={handleCreate}><Plus className="h-4 w-4 mr-1" /> New Note</Button>}
      />
      <div className="flex gap-4 h-[calc(100vh-14rem)]">
        <div className="w-72 shrink-0 border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3 w-3 text-zinc-500" />
              <Input placeholder="Search notes..." value={search} onChange={e => setSearch(e.target.value)} className="pl-7 h-8 text-xs" />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="p-4 text-center text-xs text-zinc-500">No notes found.</div>
            ) : (
              filtered.map(note => (
                <button
                  key={note.id}
                  className={`w-full text-left p-3 border-b border-border/50 hover:bg-card/50 transition-colors ${selectedId === note.id ? 'bg-card' : ''}`}
                  onClick={() => setSelectedId(note.id)}
                >
                  <p className="text-sm font-medium truncate">{note.title || 'Untitled'}</p>
                  <p className="text-xs text-zinc-500 truncate mt-0.5">{note.content || 'No content'}</p>
                  <p className="text-xs text-zinc-600 mt-1">{new Date(note.updatedAt).toLocaleDateString()}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {selectedNote ? (
          <div className="flex-1 border border-border rounded-xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-3 border-b border-border">
              <Input
                className="text-lg font-medium border-0 focus-visible:ring-0 px-0"
                value={title}
                onChange={e => { setTitle(e.target.value); setIsDirty(true) }}
                placeholder="Note title"
              />
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" onClick={() => setPreview(!preview)} title={preview ? 'Edit' : 'Preview'}>
                  {preview ? <Edit3 className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
                <Button variant="ghost" size="icon" onClick={handleDelete} title="Delete">
                  <Trash2 className="h-4 w-4 text-red-400" />
                </Button>
              </div>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {preview ? (
                <MarkdownRenderer content={content} />
              ) : (
                <Textarea
                  className="h-full border-0 focus-visible:ring-0 resize-none px-0"
                  value={content}
                  onChange={e => { setContent(e.target.value); setIsDirty(true) }}
                  placeholder="Write in markdown..."
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex-1 border border-border rounded-xl flex items-center justify-center">
            <EmptyState icon={StickyNote} title="Select a note" description="Create or select a note to start writing" />
          </div>
        )}
      </div>
    </div>
  )
}
