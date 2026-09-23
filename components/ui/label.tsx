import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'

export const Label = forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & { required?: boolean }
>(({ className, required, children, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      'block text-sm font-medium text-pheezes-gray-700 mb-1.5 leading-none',
      'peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      className
    )}
    {...props}
  >
    {children}
    {required && <span className="text-red-500 ml-0.5">*</span>}
  </LabelPrimitive.Root>
))
Label.displayName = 'Label'
