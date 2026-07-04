import { useState, useEffect } from 'react'
import { Card, CardHeader, CardTitle, CardContent, LoadingSpinner } from '@ceo-os/ui'
import { Sparkles } from 'lucide-react'

export function AISuggestions(): JSX.Element {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const apiKey = localStorage.getItem('ceo-os-openai-key')
      if (!apiKey) {
        setSuggestions([
          'Set your OpenAI API key in Settings to get AI suggestions.',
          'AI can help you prioritize tasks and analyze your business.'
        ])
        setLoading(false)
        return
      }
      try {
        const result = await window.api.ai.getSuggestions(apiKey)
        setSuggestions(result)
      } catch {
        setSuggestions([
          'Focus on high-priority tasks first.',
          'Review overdue items and blocked tasks.',
          'Check project health scores for areas needing attention.'
        ])
      }
      setLoading(false)
    }
    fetch()
  }, [])

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-yellow-400" />
          AI Suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <LoadingSpinner label="Getting suggestions..." />
        ) : (
          <div className="space-y-2">
            {suggestions.map((s, i) => (
              <p key={i} className="text-sm text-zinc-400 leading-relaxed">
                {s}
              </p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
