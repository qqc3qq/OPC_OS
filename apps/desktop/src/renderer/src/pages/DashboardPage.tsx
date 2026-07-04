import { PageHeader } from '@ceo-os/ui'

export function DashboardPage(): JSX.Element {
  return (
    <div>
      <PageHeader title="Dashboard" description="Today at a glance" />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Today's Priorities</h3>
            <p className="text-sm text-zinc-400">Your top tasks will appear here.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Timeline</h3>
            <p className="text-sm text-zinc-400">Your daily schedule will appear here.</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-medium mb-4">Business Health</h3>
            <p className="text-sm text-zinc-400">Project progress will appear here.</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <h3 className="font-medium mb-4">AI Suggestions</h3>
            <p className="text-sm text-zinc-400">AI recommendations will appear here.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
