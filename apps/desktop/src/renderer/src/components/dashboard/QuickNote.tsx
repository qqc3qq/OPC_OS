import { useState, useRef, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@ceo-os/ui'
import { Pencil } from 'lucide-react'
import { useI18n } from '../../i18n'

export function QuickNote(): JSX.Element {
  const { t } = useI18n()
  const [content, setContent] = useState('')
  const [saving, setSaving] = useState(false)
  const noteIdRef = useRef<string | null>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => {
    async function load() {
      const notes = await window.api.notes.getAll()
      const quick = notes.find(n => n.title === 'Quick Note')
      if (quick) { noteIdRef.current = quick.id; setContent(quick.content) }
    }
    load()
  }, [])

  async function handleChange(value: string) {
    setContent(value); setSaving(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(async () => {
      try {
        if (noteIdRef.current) await window.api.notes.update(noteIdRef.current, { content: value })
        else { const note = await window.api.notes.create({ title: 'Quick Note', content: value }); noteIdRef.current = note.id }
      } catch {}
      setSaving(false)
    }, 500)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Pencil className="h-4 w-4 text-muted-foreground" />
          {t('dashboard.quickNote')}
          {saving && <span className="text-xs text-muted-foreground ml-auto">{t('dashboard.quickNote.saving')}</span>}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <textarea
          value={content} onChange={e => handleChange(e.target.value)}
          placeholder={t('dashboard.quickNote.placeholder')}
          className="w-full h-24 bg-transparent border-0 resize-none text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none"
        />
      </CardContent>
    </Card>
  )
}
