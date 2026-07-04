import { useParams } from 'react-router-dom'
import { PageHeader } from '@ceo-os/ui'

export function ProjectDetailPage(): JSX.Element {
  const { id } = useParams()
  return (
    <div>
      <PageHeader title="Project Detail" description={`Project ID: ${id}`} />
      <div className="rounded-xl border border-border bg-card p-6">
        <p className="text-sm text-zinc-400">Project details will appear here.</p>
      </div>
    </div>
  )
}
