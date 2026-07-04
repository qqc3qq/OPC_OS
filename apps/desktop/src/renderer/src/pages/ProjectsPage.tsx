import { PageHeader } from '@ceo-os/ui'

export function ProjectsPage(): JSX.Element {
  return (
    <div>
      <PageHeader title="Projects" description="Manage your business projects" />
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-zinc-400">Your projects will appear here.</p>
      </div>
    </div>
  )
}
