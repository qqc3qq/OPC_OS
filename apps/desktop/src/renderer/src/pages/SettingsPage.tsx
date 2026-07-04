import { useState, useEffect } from 'react'
import { PageHeader, Card, CardContent, CardHeader, CardTitle, Button, Input, Separator } from '@ceo-os/ui'
import { useUIStore } from '../stores/useUIStore'
import { SeedData } from '../components/settings/SeedData'

export function SettingsPage(): JSX.Element {
  const theme = useUIStore(s => s.theme)
  const toggleTheme = useUIStore(s => s.toggleTheme)
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setApiKey(localStorage.getItem('ceo-os-openai-key') || '')
  }, [])

  function handleSaveKey() {
    localStorage.setItem('ceo-os-openai-key', apiKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Settings" description="Configure your workspace" />

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-base">AI Configuration</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div>
              <label className="text-sm text-zinc-400 block mb-1">OpenAI API Key</label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={apiKey}
                  onChange={e => { setApiKey(e.target.value); setSaved(false) }}
                  placeholder="sk-..."
                />
                <Button size="sm" onClick={handleSaveKey}>
                  {saved ? 'Saved' : 'Save'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Appearance</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-sm">Theme</span>
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? 'Dark' : 'Light'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">Data</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-zinc-400 mb-2">Load sample data to explore the app.</p>
              <SeedData />
            </div>
            <Separator />
            <div>
              <p className="text-sm text-zinc-400 mb-2">Save database to disk.</p>
              <Button variant="outline" size="sm" onClick={() => window.api.system.saveDatabase()}>
                Save Database
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-base">About</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400">CEO OS v0.0.1 - AI-powered operating system for solo entrepreneurs</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
