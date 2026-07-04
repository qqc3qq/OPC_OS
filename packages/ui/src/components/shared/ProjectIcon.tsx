import { cn } from '../../lib/utils'
import * as LucideIcons from 'lucide-react'
import React from 'react'

interface ProjectIconProps {
  icon: string
  color: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: 'h-6 w-6 p-1',
  md: 'h-10 w-10 p-2',
  lg: 'h-14 w-14 p-3',
}

const iconSizeMap = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function ProjectIcon({ icon, color, size = 'md', className }: ProjectIconProps) {
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[
    icon.charAt(0).toUpperCase() + icon.slice(1).replace(/-./g, x => x[1].toUpperCase())
  ] || LucideIcons.Folder

  return (
    <div
      className={cn('rounded-lg flex items-center justify-center', sizeMap[size], className)}
      style={{ backgroundColor: `${color}15`, color }}
    >
      <IconComponent className={iconSizeMap[size]} />
    </div>
  )
}
