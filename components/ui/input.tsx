import { cn } from '@/lib/utils'
import { forwardRef } from 'react'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          'w-full h-10 px-3 rounded-xl border text-sm',
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
Input.displayName = 'Input'
