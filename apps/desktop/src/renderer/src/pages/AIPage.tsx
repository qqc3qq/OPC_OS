import { useState, useRef, useEffect } from 'react'
import { PageHeader, Button, Textarea, Card, CardContent, MarkdownRenderer } from '@ceo-os/ui'
import { Send } from 'lucide-react'
import type { AIMessage } from '@ceo-os/shared'
import { useI18n } from '../i18n'

const SUGGESTION_KEYS = ['ai.suggestion1', 'ai.suggestion2', 'ai.suggestion3', 'ai.suggestion4', 'ai.suggestion5']

export function AIPage(): JSX.Element {
  const { t } = useI18n()
  const [messages, setMessages] = useState<AIMessage[]>([
    { role: 'assistant', content: t('ai.greeting') }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const sendingRef = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  async function handleSend(text?: string) {
    const messageText = text || input
    if (!messageText.trim() || sendingRef.current) return

    const userMsg: AIMessage = { role: 'user', content: messageText }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages); setInput(''); setSending(true); sendingRef.current = true

    try {
      const apiKey = localStorage.getItem('ceo-os-openai-key') || ''
      if (!apiKey) {
        setMessages([...newMessages, { role: 'assistant', content: t('ai.noKeyHint') }])
      } else {
        const response = await window.api.ai.chat(newMessages, apiKey)
        setMessages([...newMessages, { role: 'assistant', content: response }])
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: t('ai.errorRetry') }])
    }
    setSending(false); sendingRef.current = false
  }

  return (
    <div>
      <PageHeader title={t('ai.title')} description={t('ai.desc')} />
      <div className="flex flex-col h-[calc(100vh-14rem)] max-w-3xl mx-auto">
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <Card className={`max-w-[80%] ${msg.role === 'user' ? 'bg-primary/10 border-primary/20' : 'bg-card'}`}>
                <CardContent className="p-3">
                  {msg.role === 'assistant' ? <MarkdownRenderer content={msg.content} /> : <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}
                </CardContent>
              </Card>
            </div>
          ))}
          {sending && (
            <div className="flex justify-start">
              <Card><CardContent className="p-3 text-sm text-muted-foreground">{t('ai.thinking')}</CardContent></Card>
            </div>
          )}
        </div>
        <div className="space-y-3">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {SUGGESTION_KEYS.map(key => (
              <button key={key} className="text-xs px-3 py-1.5 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:border-zinc-500 whitespace-nowrap transition-colors shrink-0" onClick={() => handleSend(t(key))}>
                {t(key)}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <Textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }} placeholder={t('ai.placeholder')} className="min-h-[60px] flex-1" rows={2} />
            <Button onClick={() => handleSend()} disabled={sending} className="shrink-0"><Send className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  )
}
