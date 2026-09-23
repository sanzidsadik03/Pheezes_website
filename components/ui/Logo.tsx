import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  href?: string
  lightText?: boolean
}

export function Logo({ className, href = '/', lightText = false }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative inline-flex items-center text-2xl sm:text-3xl font-black tracking-tighter',
        className
      )}
    >
      <span className={cn(
        'transition-colors duration-300 group-hover:text-pheezes-yellow drop-shadow-sm',
        lightText ? 'text-white' : 'text-pheezes-black'
      )}>
        PHEE
      </span>
      <span className={cn(
        'transition-colors duration-300 drop-shadow-sm',
        lightText ? 'text-pheezes-yellow group-hover:text-white' : 'text-pheezes-yellow group-hover:text-pheezes-black'
      )}>
        ZES
      </span>
      {/* Hover line effect */}
      <span className="absolute -bottom-1 left-0 w-0 h-1 bg-pheezes-yellow transition-all duration-300 ease-out group-hover:w-full" />
    </Link>
  )
}

