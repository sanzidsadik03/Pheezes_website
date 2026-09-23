import { MessageCircle } from 'lucide-react'
import { buildMessengerUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface MessengerButtonProps {
  messengerUrl: string
  productName?: string
  defaultMessage?: string
  variant?: 'primary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  className?: string
}

export function MessengerButton({
  messengerUrl,
  productName,
  defaultMessage,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className,
}: MessengerButtonProps) {
  const href = buildMessengerUrl(messengerUrl, productName, defaultMessage)

  const sizeClasses = {
    sm: 'px-4 py-2 text-sm gap-1.5',
    md: 'px-6 py-3 text-base gap-2',
    lg: 'px-8 py-4 text-base gap-2.5',
  }

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-5 w-5',
  }

  const variantClasses = {
    primary: 'bg-pheezes-yellow text-pheezes-black hover:bg-pheezes-yellow-dark btn-yellow-glow font-bold',
    outline:
      'border-2 border-pheezes-yellow text-pheezes-yellow hover:bg-pheezes-yellow hover:text-pheezes-black font-semibold',
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center justify-center rounded-xl transition-all duration-200 active:scale-[0.98] whitespace-nowrap',
        sizeClasses[size],
        variantClasses[variant],
        fullWidth && 'w-full',
        className
      )}
    >
      <MessageCircle className={iconSizes[size]} />
      {productName ? 'Order via Messenger' : 'Contact via Messenger'}
    </a>
  )
}
