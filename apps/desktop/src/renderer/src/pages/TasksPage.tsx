import { PageHeader } from '@ceo-os/ui'

export function TasksPage(): JSX.Element {
  return (
    <div>
      <PageHeader title="Tasks" description="Manage your tasks" />
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-zinc-400">Your task board will appear here.</p>
      </div>
    </div>
  )
}
