import { getSettings } from '@/actions/settings'
import { getProducts } from '@/actions/products'
import { getReviews } from '@/actions/reviews'
import { prisma } from '@/lib/prisma'
import { Hero } from '@/components/customer/Hero'
import { FeaturedProducts, OffersSection } from '@/components/customer/FeaturedProducts'
import { ReviewCarousel } from '@/components/customer/ReviewCarousel'
import { AboutSection } from '@/components/customer/AboutSection'
import { DeliveryInfo } from '@/components/customer/DeliveryInfo'
import type { Metadata } from 'next'

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings()
  return {
    title: `${settings.siteName} — ${settings.tagline}`,
    description: settings.heroSubtitle,
  }
}

export default async function HomePage() {
  const [settings, featuredResult, offersResult, reviews] = await Promise.all([
    getSettings(),
    getProducts({ visible: true, featured: true, pageSize: 6, sortBy: 'order' }),
    getProducts({ visible: true, offerEnabled: true, pageSize: 4, sortBy: 'order' }),
    getReviews({ visible: true }),
  ])

  const featuredProducts = featuredResult.data
  const offerProducts = offersResult.data

  return (
    <>
      {/* Hero */}
      <Hero settings={settings} />

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <FeaturedProducts
          products={featuredProducts}
          settings={settings}
          title="Our Collection"
          subtitle="Thoughtfully curated gifts for every special occasion."
        />
      )}

      {/* Offers Section */}
      {offerProducts.length > 0 && (
        <OffersSection products={offerProducts} settings={settings} />
      )}

      {/* Reviews Carousel */}
      <ReviewCarousel reviews={reviews} />

      {/* About */}
      <AboutSection settings={settings} />

      {/* Delivery Info */}
      <DeliveryInfo settings={settings} />
    </>
  )
}
