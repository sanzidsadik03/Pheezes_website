'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/ui/Logo'
import { usePathname } from 'next/navigation'
import { Menu, X, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Offers', href: '/offers' },
  { label: 'Reviews', href: '/reviews' },
  { label: 'About', href: '/about' },
  { label: 'Delivery', href: '/delivery' },
]

interface NavbarProps {
  messengerUrl: string
}

export function Navbar({ messengerUrl }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const pathname = usePathname()

  // Track scroll for sticky nav shadow
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-40 bg-pheezes-black transition-shadow duration-300',
          isScrolled && 'shadow-lg shadow-black/30'
        )}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Logo lightText />

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || 
                  (link.href !== '/' && pathname.startsWith(link.href))
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150',
                      isActive
                        ? 'bg-pheezes-yellow text-pheezes-black'
                        : 'text-white/80 hover:text-white hover:bg-white/10'
                    )}
                  >
                    {link.label}
                  </Link>
                )
              })}
            </div>

            {/* Desktop Messenger CTA */}
            <div className="hidden md:flex items-center">
              <a
                href={messengerUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-pheezes-yellow text-pheezes-black px-4 py-2 rounded-xl text-sm font-semibold hover:bg-pheezes-yellow-dark transition-all duration-150 active:scale-[0.98]"
              >
                <MessageCircle className="h-4 w-4" />
                Order Now
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <div
          className={cn(
            'md:hidden overflow-hidden transition-all duration-300 ease-in-out',
            isMenuOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          )}
        >
          <div className="bg-pheezes-charcoal border-t border-white/10 px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href ||
                (link.href !== '/' && pathname.startsWith(link.href))
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'block px-4 py-2.5 rounded-xl text-sm font-medium transition-all',
                    isActive
                      ? 'bg-pheezes-yellow text-pheezes-black'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
            <div className="pt-3 pb-1">
              <a
                href={messengerUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-pheezes-yellow text-pheezes-black px-4 py-3 rounded-xl text-sm font-semibold hover:bg-pheezes-yellow-dark transition-all w-full"
              >
                <MessageCircle className="h-4 w-4" />
                Order via Messenger
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to push content below fixed navbar */}
      <div className="h-16" />
    </>
  )
}
