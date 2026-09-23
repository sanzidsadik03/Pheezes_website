import { Gift, Star, Truck, Shield } from 'lucide-react'
import type { SiteSettings } from '@/types'

interface AboutSectionProps {
  settings: SiteSettings
}

const values = [
  {
    icon: Gift,
    title: 'Premium Quality',
    desc: 'Every product is carefully selected for quality and beauty.',
  },
  {
    icon: Star,
    title: 'Customer First',
    desc: 'Your satisfaction is our highest priority, always.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Quick shipping across Bangladesh — inside and outside Dhaka.',
  },
  {
    icon: Shield,
    title: 'Trusted Brand',
    desc: 'Hundreds of happy customers and growing every day.',
  },
]

export function AboutSection({ settings }: AboutSectionProps) {
  return (
    <section className="py-20 bg-white" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="h-0.5 w-8 bg-pheezes-yellow" />
              <span className="text-pheezes-yellow text-sm font-semibold uppercase tracking-wider">
                About Us
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-pheezes-black mb-6 leading-tight">
              More Than a Gift Shop
            </h2>
            <p className="text-pheezes-gray-500 text-base leading-relaxed whitespace-pre-line">
              {settings.aboutText ||
                'Pheezes is your destination for premium, thoughtfully curated gifts. We believe every moment deserves something special — something beautiful, meaningful, and memorable.'}
            </p>

            <div className="mt-8 inline-flex items-center gap-3 bg-pheezes-black text-white px-6 py-3 rounded-xl hover:bg-pheezes-charcoal transition-colors cursor-default">
              <span className="text-pheezes-yellow font-bold text-lg">P</span>
              <span className="text-sm font-medium tracking-wide">
                {settings.tagline || 'Gifts that elevate every moment.'}
              </span>
            </div>
          </div>

          {/* Values Grid */}
          <div className="grid grid-cols-2 gap-4">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="bg-pheezes-gray-50 border border-pheezes-gray-100 rounded-2xl p-5 hover:border-pheezes-yellow hover:bg-pheezes-yellow-light/20 transition-all duration-200 group"
              >
                <div className="w-10 h-10 rounded-xl bg-pheezes-yellow group-hover:scale-105 transition-transform flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-pheezes-black" />
                </div>
                <h3 className="font-semibold text-pheezes-black mb-1.5">{title}</h3>
                <p className="text-pheezes-gray-500 text-xs leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
