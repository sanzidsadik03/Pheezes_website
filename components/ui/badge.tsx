import { cn } from '@/lib/utils'

// ─── Badge Component ──────────────────────────────────────

const badgeVariants = {
  default: 'bg-pheezes-gray-100 text-pheezes-gray-700',
  yellow: 'bg-pheezes-yellow text-pheezes-black',
  black: 'bg-pheezes-black text-pheezes-white',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-orange-100 text-orange-700',
  error: 'bg-red-100 text-red-700',
  outline: 'border border-pheezes-gray-300 text-pheezes-gray-700 bg-transparent',
}

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeVariants
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap',
        badgeVariants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

// ─── Offer Badge (special Pheezes style) ─────────────────

export function OfferBadge({ discount }: { discount?: number }) {
  return (
    <span className="inline-flex items-center gap-1 bg-pheezes-yellow text-pheezes-black px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
      {discount ? `${discount}% OFF` : 'OFFER'}
    </span>
  )
}
