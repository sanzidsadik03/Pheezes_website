import { cn } from '@/lib/utils'

// ─── Skeleton Component ───────────────────────────────────

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-lg bg-pheezes-gray-100',
        className
      )}
      {...props}
    />
  )
}

// ─── Pre-built Skeleton Patterns ──────────────────────────

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-pheezes-gray-100 overflow-hidden">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-2 mt-4">
          <Skeleton className="h-9 flex-1 rounded-xl" />
          <Skeleton className="h-9 flex-1 rounded-xl" />
        </div>
      </div>
    </div>
  )
}

export function ReviewCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-pheezes-gray-100 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  )
}
