import { PageHeader } from '@ceo-os/ui'

export function NotesPage(): JSX.Element {
  return (
    <div>
      <PageHeader title="Notes" description="Markdown notes" />
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-zinc-400">Your notes will appear here.</p>
      </div>
    </div>
  )
}
