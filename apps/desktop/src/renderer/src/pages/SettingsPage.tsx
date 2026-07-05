import { useState, useEffect } from 'react'
import { PageHeader, Card, CardContent, CardHeader, CardTitle, Button, Input, Separator } from '@ceo-os/ui'
import { useUIStore } from '../stores/useUIStore'
import { useI18n } from '../i18n'
import { SeedData } from '../components/settings/SeedData'
import { Globe, Moon, Sun } from 'lucide-react'

export function SettingsPage(): JSX.Element {
  const { t, lang, setLang } = useI18n()
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
      <PageHeader title={t('settings.title')} description={t('settings.about.text')} />

      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t('settings.ai')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <label className="text-xs text-muted-foreground">{t('settings.apiKey')}</label>
            <div className="flex gap-2">
              <Input type="password" value={apiKey} onChange={e => { setApiKey(e.target.value); setSaved(false) }} placeholder={t('settings.apiKey.placeholder')} />
              <Button size="sm" onClick={handleSaveKey}>{saved ? t('settings.saved') : t('settings.save')}</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t('settings.appearance')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === 'dark' ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
                <span className="text-sm">{t('settings.theme')}</span>
              </div>
              <Button variant="secondary" size="sm" onClick={toggleTheme}>
                {theme === 'dark' ? t('settings.theme.dark') : t('settings.theme.light')}
              </Button>
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{t('settings.language')}</span>
              </div>
              <div className="flex gap-1">
                <Button variant={lang === 'zh' ? 'default' : 'secondary'} size="sm" onClick={() => setLang('zh')}>
                  {t('settings.language.zh')}
                </Button>
                <Button variant={lang === 'en' ? 'default' : 'secondary'} size="sm" onClick={() => setLang('en')}>
                  {t('settings.language.en')}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">{t('settings.data')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-2">{t('settings.about.text')}</p>
              <SeedData />
            </div>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground mb-2">{t('settings.db.save')}</p>
              <Button variant="secondary" size="sm" onClick={() => window.api.system.saveDatabase()}>
                {t('settings.db.save')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
