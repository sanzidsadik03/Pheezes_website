import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full px-3 py-2.5 rounded-xl border text-sm resize-y min-h-[100px]',
          'bg-white text-pheezes-black placeholder:text-pheezes-gray-400',
          'transition-colors duration-150',
          'focus:outline-none focus:ring-2 focus:ring-pheezes-yellow focus:border-pheezes-yellow',
          error
            ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
            : 'border-pheezes-gray-200 hover:border-pheezes-gray-300',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-pheezes-gray-50',
          className
        )}
        {...props}
      />
    )
  }
)
Textarea.displayName = 'Textarea'
