import { PageHeader } from '@ceo-os/ui'

export function SettingsPage(): JSX.Element {
  return (
    <div>
      <PageHeader title="Settings" description="Configure your workspace" />
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-zinc-400">Settings will appear here.</p>
      </div>
    </div>
  )
}
