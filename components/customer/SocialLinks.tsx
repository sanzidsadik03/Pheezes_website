import { MessageCircle } from 'lucide-react'
import { FacebookIcon, InstagramIcon, TikTokIcon } from '@/components/ui/icons'
import { cn } from '@/lib/utils'

interface SocialLinksProps {
  facebookUrl?: string
  instagramUrl?: string
  tiktokUrl?: string
  messengerUrl?: string
  className?: string
  iconSize?: string
}

export function SocialLinks({
  facebookUrl,
  instagramUrl,
  tiktokUrl,
  messengerUrl,
  className,
  iconSize = 'h-4 w-4',
}: SocialLinksProps) {
  const links = [
    { icon: FacebookIcon, href: facebookUrl, label: 'Facebook' },
    { icon: InstagramIcon, href: instagramUrl, label: 'Instagram' },
    { icon: TikTokIcon, href: tiktokUrl, label: 'TikTok' },
    { icon: MessageCircle, href: messengerUrl, label: 'Messenger' },
  ].filter((l) => Boolean(l.href))

  if (links.length === 0) return null

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {links.map(({ icon: Icon, href, label }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="w-9 h-9 rounded-xl bg-white/10 hover:bg-pheezes-yellow hover:text-pheezes-black flex items-center justify-center transition-all duration-200 text-white/70"
        >
          <Icon className={iconSize} />
        </a>
      ))}
    </div>
  )
}
