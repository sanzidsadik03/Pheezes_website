import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/ui/Logo'
import { MessageCircle } from 'lucide-react'
import { FacebookIcon, InstagramIcon, TikTokIcon } from '@/components/ui/icons'
import type { SiteSettings } from '@/types'

interface FooterProps {
  settings: SiteSettings
}

export function Footer({ settings }: FooterProps) {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { icon: FacebookIcon, href: settings.facebookUrl, label: 'Facebook' },
    { icon: InstagramIcon, href: settings.instagramUrl, label: 'Instagram' },
    { icon: TikTokIcon, href: settings.tiktokUrl, label: 'TikTok' },
    { icon: MessageCircle, href: settings.messengerUrl, label: 'Messenger' },
  ]

  const quickLinks = [
    { label: 'Products', href: '/products' },
    { label: 'Offers', href: '/offers' },
    { label: 'Reviews', href: '/reviews' },
    { label: 'Delivery Info', href: '/delivery' },
    { label: 'About', href: '/about' },
  ]

  return (
    <footer className="bg-pheezes-black text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <Logo lightText />
            </div>
            <p className="text-white/60 text-sm leading-relaxed max-w-xs">
              {settings.tagline || 'Gifts that elevate every moment.'}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3 mt-6">
              {socialLinks.map(({ icon: Icon, href, label }) =>
                href ? (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="w-9 h-9 rounded-xl bg-white/10 hover:bg-pheezes-yellow hover:text-pheezes-black flex items-center justify-center transition-all duration-200 text-white/70"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ) : null
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-pheezes-yellow uppercase tracking-wider mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/60 hover:text-pheezes-yellow text-sm transition-colors duration-150"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Delivery Info Preview */}
          <div>
            <h4 className="text-sm font-semibold text-pheezes-yellow uppercase tracking-wider mb-5">
              Delivery
            </h4>
            <div className="space-y-4">
              <div>
                <p className="text-white text-sm font-medium">Inside Dhaka</p>
                <p className="text-white/60 text-sm">{settings.deliveryInsideDhaka} TK</p>
                <p className="text-white/40 text-xs mt-0.5">{settings.deliveryInsideDhakaPayment}</p>
              </div>
              <div>
                <p className="text-white text-sm font-medium">Outside Dhaka</p>
                <p className="text-white/60 text-sm">{settings.deliveryOutsideDhaka} TK</p>
                <p className="text-white/40 text-xs mt-0.5">{settings.deliveryOutsideDhakaPayment}</p>
              </div>
              <Link
                href="/delivery"
                className="text-pheezes-yellow text-xs hover:underline inline-block mt-1"
              >
                View full delivery info →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {currentYear} Pheezes. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">
            Gifts that elevate every moment.
          </p>
        </div>
      </div>
    </footer>
  )
}
