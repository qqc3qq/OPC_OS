import { cn } from '../../lib/utils'

interface LoadingSpinnerProps {
  label?: string
  className?: string
}

export function LoadingSpinner({ label, className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 gap-3', className)}>
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-border border-t-primary" />
      {label && <p className="text-sm text-zinc-400">{label}</p>}
    </div>
  )
}
