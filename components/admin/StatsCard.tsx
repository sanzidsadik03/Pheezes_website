import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  accent?: boolean
  description?: string
}

export function StatsCard({ title, value, icon: Icon, accent = false, description }: StatsCardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border p-6 flex items-center gap-5 transition-all duration-200 hover:shadow-md',
        accent
          ? 'bg-pheezes-black border-pheezes-yellow/30 text-white'
          : 'bg-white border-pheezes-gray-100 text-pheezes-black'
      )}
    >
      <div
        className={cn(
          'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
          accent ? 'bg-pheezes-yellow' : 'bg-pheezes-yellow/10'
        )}
      >
        <Icon className={cn('h-5 w-5', accent ? 'text-pheezes-black' : 'text-pheezes-yellow')} />
      </div>
      <div className="min-w-0">
        <p className={cn('text-sm font-medium truncate', accent ? 'text-white/70' : 'text-pheezes-gray-500')}>
          {title}
        </p>
        <p className={cn('text-2xl font-bold mt-0.5', accent ? 'text-white' : 'text-pheezes-black')}>
          {value}
        </p>
        {description && (
          <p className={cn('text-xs mt-0.5', accent ? 'text-white/50' : 'text-pheezes-gray-400')}>
            {description}
          </p>
        )}
      </div>
    </div>
  )
}
