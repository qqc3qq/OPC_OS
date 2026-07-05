import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, LoadingSpinner } from '@ceo-os/ui'
import { Sparkles } from 'lucide-react'
import { useI18n } from '../../i18n'

export function AISuggestions(): JSX.Element {
  const { t } = useI18n()
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const apiKey = localStorage.getItem('ceo-os-openai-key')
      if (!apiKey) { setSuggestions([t('dashboard.ai.empty')]); setLoading(false); return }
      try {
        const result = await window.api.ai.getSuggestions(apiKey)
        setSuggestions(result.length > 0 ? result : [t('dashboard.ai.empty')])
      } catch { setSuggestions([t('dashboard.ai.empty')]) }
      setLoading(false)
    }
    fetch()
  }, [t])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-yellow-400" />
          {t('dashboard.ai')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? <LoadingSpinner /> : (
          <div className="space-y-2">
            {suggestions.map((s, i) => <p key={i} className="text-sm text-muted-foreground leading-relaxed">{s}</p>)}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
