'use client'

import { cn } from '@/lib/utils'
import { forwardRef } from 'react'
import { Slot } from '@radix-ui/react-slot'

// ─── Button Variants ──────────────────────────────────────

const buttonVariants = {
  primary:
    'bg-pheezes-yellow text-pheezes-black hover:bg-pheezes-yellow-dark active:scale-[0.98] btn-yellow-glow font-semibold',
  secondary:
    'bg-pheezes-black text-pheezes-white hover:bg-pheezes-charcoal active:scale-[0.98] font-semibold',
  outline:
    'border-2 border-pheezes-black text-pheezes-black hover:bg-pheezes-black hover:text-pheezes-white active:scale-[0.98] font-semibold',
  'outline-yellow':
    'border-2 border-pheezes-yellow text-pheezes-yellow hover:bg-pheezes-yellow hover:text-pheezes-black active:scale-[0.98] font-semibold',
  ghost:
    'text-pheezes-black hover:bg-pheezes-gray-100 active:scale-[0.98]',
  'ghost-white':
    'text-pheezes-white hover:bg-white/10 active:scale-[0.98]',
  destructive:
    'bg-red-600 text-white hover:bg-red-700 active:scale-[0.98] font-semibold',
  link: 'text-pheezes-black underline-offset-4 hover:underline p-0 h-auto',
}

const buttonSizes = {
  sm: 'h-8 px-3 text-sm rounded-lg',
  md: 'h-10 px-5 text-sm rounded-xl',
  lg: 'h-12 px-7 text-base rounded-xl',
  xl: 'h-14 px-9 text-base rounded-2xl',
  icon: 'h-10 w-10 rounded-xl',
  'icon-sm': 'h-8 w-8 rounded-lg',
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants
  size?: keyof typeof buttonSizes
  asChild?: boolean
  loading?: boolean
  children: React.ReactNode
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      loading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'

    return (
      <Comp
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          // Base
          'inline-flex items-center justify-center gap-2 whitespace-nowrap',
          'transition-all duration-200 cursor-pointer select-none',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pheezes-yellow focus-visible:ring-offset-2',
          // Variant
          buttonVariants[variant],
          // Size
          buttonSizes[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </Comp>
    )
  }
)

Button.displayName = 'Button'
