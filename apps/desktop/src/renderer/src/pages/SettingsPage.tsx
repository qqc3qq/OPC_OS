import { useState, useEffect, useCallback } from 'react'
import { PageHeader, Card, CardContent, CardHeader, CardTitle, Button, Input, Separator } from '@ceo-os/ui'
import { useUIStore } from '../stores/useUIStore'
import { useI18n } from '../i18n'
import { SeedData } from '../components/settings/SeedData'
import { Globe, Moon, Sun, Download } from 'lucide-react'

export function SettingsPage(): JSX.Element {
  const { t, lang, setLang } = useI18n()
  const theme = useUIStore(s => s.theme)
  const toggleTheme = useUIStore(s => s.toggleTheme)
  const [apiKey, setApiKey] = useState('')
  const [saved, setSaved] = useState(false)
  const [updateMsg, setUpdateMsg] = useState('')
  const [updating, setUpdating] = useState(false)

  useEffect(() => {
    setApiKey(localStorage.getItem('ceo-os-openai-key') || '')
    const unsub = window.api.system?.onUpdateReady?.(() => setUpdateMsg('ready'))
    return unsub
  }, [])

  function handleSaveKey() {
    localStorage.setItem('ceo-os-openai-key', apiKey)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const checkUpdate = useCallback(async () => {
    setUpdating(true); setUpdateMsg('checking')
    try { const v = await window.api.system?.checkUpdate?.(); setUpdateMsg(v ? 'found: ' + v : 'latest') } catch { setUpdateMsg('error') }
    setUpdating(false)
  }, [])

  const installUpdate = useCallback(async () => {
    setUpdating(true); setUpdateMsg('downloading')
    try { await window.api.system?.downloadUpdate?.() } catch { setUpdateMsg('error') }
    setUpdating(false)
  }, [])

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
            <Separator />
            <div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm">Updates</p>
                  {updateMsg === 'checking' && <p className="text-xs text-muted-foreground">Checking...</p>}
                  {updateMsg === 'latest' && <p className="text-xs text-green-400">You are up to date</p>}
                  {updateMsg === 'downloading' && <p className="text-xs text-blue-400">Downloading update...</p>}
                  {updateMsg === 'ready' && <p className="text-xs text-green-400">Update ready! Restart to apply.</p>}
                  {updateMsg.startsWith('found:') && <p className="text-xs text-yellow-400">New version: {updateMsg.replace('found: ', '')}</p>}
                  {updateMsg === 'error' && <p className="text-xs text-red-400">Check failed</p>}
                  {!updateMsg && <p className="text-xs text-muted-foreground">Check for new versions</p>}
                </div>
                {updateMsg === 'ready' ? (
                  <Button size="sm" onClick={() => window.api.system.installUpdate()}><Download className="h-3 w-3 mr-1" /> Restart to Update</Button>
                ) : updateMsg.startsWith('found:') ? (
                  <Button size="sm" onClick={installUpdate} disabled={updating}><Download className="h-3 w-3 mr-1" /> Download</Button>
                ) : (
                  <Button variant="secondary" size="sm" onClick={checkUpdate} disabled={updating}>Check for Updates</Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
