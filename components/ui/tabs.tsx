'use client'

import * as TabsPrimitive from '@radix-ui/react-tabs'
import { cn } from '@/lib/utils'

export const Tabs = TabsPrimitive.Root

export function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        'inline-flex h-10 items-center gap-1 rounded-xl bg-pheezes-gray-100 p-1',
        className
      )}
      {...props}
    />
  )
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-lg px-4 py-1.5',
        'text-sm font-medium text-pheezes-gray-500 transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pheezes-yellow',
        'disabled:pointer-events-none disabled:opacity-50',
        'data-[state=active]:bg-white data-[state=active]:text-pheezes-black data-[state=active]:shadow-sm data-[state=active]:font-semibold',
        'hover:text-pheezes-black',
        className
      )}
      {...props}
    />
  )
}

export function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      className={cn(
        'mt-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pheezes-yellow rounded-xl',
        className
      )}
      {...props}
    />
  )
}
