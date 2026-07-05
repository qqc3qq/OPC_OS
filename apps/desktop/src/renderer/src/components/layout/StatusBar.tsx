import { useI18n } from '../../i18n'

export function StatusBar(): JSX.Element {
  const { t } = useI18n()
  return (
    <div className="h-7 border-t border-border bg-card/30 flex items-center justify-between px-4 text-xs text-muted-foreground shrink-0">
      <span>{t('app.tagline')}</span>
      <span>v0.0.5</span>
    </div>
  )
}
