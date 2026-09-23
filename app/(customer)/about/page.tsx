import { getSettings } from '@/actions/settings'
import { AboutSection } from '@/components/customer/AboutSection'
import { MessengerButton } from '@/components/customer/MessengerButton'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Pheezes',
  description: 'Learn about Pheezes — your destination for premium gifts that elevate every moment.',
}

export default async function AboutPage() {
  const settings = await getSettings()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-pheezes-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-0.5 w-8 bg-pheezes-yellow" />
            <span className="text-pheezes-yellow text-sm font-semibold uppercase tracking-wider">
              Our Story
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white">About Pheezes</h1>
          <p className="text-white/50 mt-2 text-lg italic">"{settings.tagline}"</p>
        </div>
      </div>

      {/* About Content */}
      <AboutSection settings={settings} />

      {/* CTA */}
      <div className="bg-pheezes-gray-50 py-16">
        <div className="max-w-xl mx-auto text-center px-4">
          <h2 className="text-2xl font-bold text-pheezes-black mb-3">Ready to find the perfect gift?</h2>
          <p className="text-pheezes-gray-500 mb-6">
            Browse our collection and order via Messenger — we'll help you pick the perfect gift.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/products"
              className="flex items-center justify-center px-8 py-3 bg-pheezes-black text-white rounded-xl font-semibold hover:bg-pheezes-charcoal transition-colors"
            >
              Browse Products
            </a>
            <MessengerButton
              messengerUrl={settings.messengerUrl}
              variant="primary"
              size="md"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
