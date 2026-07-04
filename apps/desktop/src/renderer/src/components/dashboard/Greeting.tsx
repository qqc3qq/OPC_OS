interface GreetingProps {
  projectCount: number
}

export function Greeting({ projectCount }: GreetingProps): JSX.Element {
  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening'
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayName = days[now.getDay()]
  const dateStr = now.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <div className="mb-6">
      <h2 className="text-lg font-medium text-zinc-400">{greeting}</h2>
      <p className="text-sm text-zinc-500 mt-0.5">{dayName}, {dateStr} - {projectCount} active projects</p>
    </div>
  )
}
