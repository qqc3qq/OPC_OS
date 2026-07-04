import { PageHeader } from '@ceo-os/ui'

export function CalendarPage(): JSX.Element {
  return (
    <div>
      <PageHeader title="Calendar" description="Weekly view" />
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-zinc-400">Your calendar will appear here.</p>
      </div>
    </div>
  )
}
