import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@ceo-os/ui'
import { Pencil } from 'lucide-react'

const QUICK_NOTE_ID = 'quick-note-dashboard'

export function QuickNote(): JSX.Element {
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const noteIdRef = useRef<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    async function load() {
      const notes = await window.api.notes.getAll()
      const quick = notes.find(n => n.title === 'Quick Note')
      if (quick) {
        noteIdRef.current = quick.id
        setContent(quick.content)
      }
    }
    load()
  }, [])

  async function handleChange(value: string) {
    setContent(value)
    setSaving(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      try {
        if (noteIdRef.current) {
          await window.api.notes.update(noteIdRef.current, { content: value })
        } else {
          const note = await window.api.notes.create({ title: 'Quick Note', content: value })
          noteIdRef.current = note.id
        }
      } catch { /* ignore save errors */ }
      setSaving(false)
    }, 500)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Pencil className="h-4 w-4 text-zinc-400" />
          Quick Note
          {saving && <span className="text-xs text-zinc-500 ml-auto">Saving...</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <textarea
          value={content}
          onChange={e => handleChange(e.target.value)}
          placeholder="Write something down..."
          className="w-full h-24 bg-transparent border-0 resize-none text-sm text-zinc-300 placeholder:text-zinc-600 focus:outline-none"
        />
      </CardContent>
    </Card>
  )
}
