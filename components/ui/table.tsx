import { cn } from '@/lib/utils'

// ─── Table Components ─────────────────────────────────────

export function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto">
      <table
        className={cn('w-full caption-bottom text-sm border-collapse', className)}
        {...props}
      />
    </div>
  )
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('border-b border-pheezes-gray-100', className)} {...props} />
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-pheezes-gray-100', className)} {...props} />
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn('hover:bg-pheezes-gray-50 transition-colors duration-100', className)}
      {...props}
    />
  )
}

export function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'h-11 px-4 text-left align-middle text-xs font-semibold text-pheezes-gray-500 uppercase tracking-wider',
        className
      )}
      {...props}
    />
  )
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn('px-4 py-3 align-middle text-sm text-pheezes-gray-700', className)}
      {...props}
    />
  )
}
