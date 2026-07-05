import { useI18n } from '../../i18n'

interface GreetingProps { projectCount: number }

export function Greeting({ projectCount }: GreetingProps): JSX.Element {
  const { t } = useI18n()
  const now = new Date()
  const hour = now.getHours()
  const key = hour < 12 ? 'dashboard.greeting.morning' : hour < 18 ? 'dashboard.greeting.afternoon' : 'dashboard.greeting.evening'
  const dateStr = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium text-muted-foreground">{t(key)}</h2>
      <p className="text-sm text-muted-foreground/70 mt-0.5">{dateStr} - {t('dashboard.projects', { count: projectCount })}</p>
    </div>
  )
}
