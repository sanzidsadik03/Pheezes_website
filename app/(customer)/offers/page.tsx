import { getSettings } from '@/actions/settings'
import { getProducts } from '@/actions/products'
import { FeaturedProducts } from '@/components/customer/FeaturedProducts'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Special Offers',
  description: 'Browse all products with active special offers and discounts.',
}

export default async function OffersPage() {
  const [settings, offersResult] = await Promise.all([
    getSettings(),
    getProducts({ visible: true, offerEnabled: true, pageSize: 50, sortBy: 'order' }),
  ])

  const offerProducts = offersResult.data

  return (
    <div className="min-h-screen bg-pheezes-gray-50">
      {/* Header */}
      <div className="bg-pheezes-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-0.5 w-8 bg-pheezes-yellow" />
            <span className="text-pheezes-yellow text-sm font-semibold uppercase tracking-wider">
              Limited Time
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white">Special Offers</h1>
          <p className="text-white/50 mt-2">
            {offerProducts.length} offer{offerProducts.length !== 1 ? 's' : ''} available
          </p>
        </div>
      </div>

      {/* Offers Grid */}
      {offerProducts.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="w-16 h-16 bg-pheezes-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">🏷️</span>
          </div>
          <p className="text-pheezes-black font-semibold text-lg">No offers right now</p>
          <p className="text-pheezes-gray-400 text-sm mt-1">
            Check back soon — new deals are added regularly.
          </p>
        </div>
      ) : (
        <FeaturedProducts
          products={offerProducts}
          settings={settings}
          title="All Special Offers"
          subtitle={`Don't miss these ${offerProducts.length} limited-time deals.`}
          showViewAll={false}
        />
      )}
    </div>
  )
}
