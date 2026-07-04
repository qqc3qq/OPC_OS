import { PageHeader } from '@ceo-os/ui'

export function AIPage(): JSX.Element {
  return (
    <div>
      <PageHeader title="AI Assistant" description="Your AI business partner" />
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-zinc-400">AI chat will appear here.</p>
      </div>
    </div>
  )
}
