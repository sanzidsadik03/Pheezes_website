import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/ui/Logo'
import { ArrowRight, Gift } from 'lucide-react'
import type { SiteSettings } from '@/types'

interface HeroProps {
  settings: SiteSettings
}

export function Hero({ settings }: HeroProps) {
  return (
    <section className="relative min-h-[92vh] flex items-center bg-pheezes-black overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Subtle radial gradient */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              'radial-gradient(ellipse 80% 80% at 50% -20%, rgba(255,217,61,0.15) 0%, transparent 60%)',
          }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        {/* Floating decorative dots */}
        <div className="absolute top-20 left-10 w-2 h-2 rounded-full bg-pheezes-yellow opacity-40" />
        <div className="absolute top-40 left-1/4 w-1 h-1 rounded-full bg-pheezes-yellow opacity-30" />
        <div className="absolute bottom-32 right-1/4 w-2 h-2 rounded-full bg-pheezes-yellow opacity-20" />
        <div className="absolute top-60 right-20 w-1.5 h-1.5 rounded-full bg-white opacity-20" />
        <div className="absolute bottom-20 left-1/3 w-1 h-1 rounded-full bg-white opacity-15" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-10 animate-fade-in scale-150">
            <Logo lightText />
          </div>

          {/* Gift Tag Label */}
          <div className="flex items-center gap-2 bg-pheezes-yellow/15 border border-pheezes-yellow/30 text-pheezes-yellow px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-fade-in">
            <Gift className="h-4 w-4" />
            Premium Gift Store
          </div>

          {/* Hero Title */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight tracking-tight mb-6 animate-slide-up">
            {settings.heroTitle || 'Gifts that'}
            <span className="block text-gradient-yellow">
              {settings.heroTitle ? '' : 'elevate every moment.'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-white/60 max-w-2xl leading-relaxed mb-12 animate-fade-in">
            {settings.heroSubtitle ||
              'Discover our curated collection of premium gifts crafted for every special occasion.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in">
            <Link
              href="/products"
              className="flex items-center justify-center gap-2.5 bg-pheezes-yellow text-pheezes-black px-8 py-4 rounded-2xl text-base font-bold hover:bg-pheezes-yellow-dark transition-all duration-200 active:scale-[0.98] btn-yellow-glow shadow-lg"
            >
              Explore Products
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/offers"
              className="flex items-center justify-center gap-2.5 border-2 border-white/20 text-white px-8 py-4 rounded-2xl text-base font-semibold hover:bg-white/10 hover:border-white/40 transition-all duration-200 active:scale-[0.98]"
            >
              View Offers
            </Link>
          </div>

        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/5 to-transparent pointer-events-none" />
    </section>
  )
}

