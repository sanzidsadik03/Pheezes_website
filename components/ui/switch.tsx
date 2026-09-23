'use client'

import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export const Switch = forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitive.Root
    ref={ref}
    className={cn(
      'peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent',
      'transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pheezes-yellow focus-visible:ring-offset-2',
      'disabled:cursor-not-allowed disabled:opacity-50',
      'data-[state=checked]:bg-pheezes-yellow data-[state=unchecked]:bg-pheezes-gray-200',
      className
    )}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={cn(
        'pointer-events-none block h-5 w-5 rounded-full bg-white shadow-md ring-0 transition-transform',
        'data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitive.Root>
))
Switch.displayName = 'Switch'
