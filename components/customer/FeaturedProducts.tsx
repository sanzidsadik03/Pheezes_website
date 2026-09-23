import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProductCard } from './ProductCard'
import type { ProductWithRelations, SiteSettings } from '@/types'

interface FeaturedProductsProps {
  products: ProductWithRelations[]
  settings: SiteSettings
  title?: string
  subtitle?: string
  showViewAll?: boolean
  viewAllHref?: string
}

export function FeaturedProducts({
  products,
  settings,
  title = 'Our Collection',
  subtitle = 'Thoughtfully curated gifts for every occasion.',
  showViewAll = true,
  viewAllHref = '/products',
}: FeaturedProductsProps) {
  if (products.length === 0) return null

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-0.5 w-8 bg-pheezes-yellow" />
              <span className="text-pheezes-yellow text-sm font-semibold uppercase tracking-wider">
                Featured
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-pheezes-black">{title}</h2>
            <p className="text-pheezes-gray-400 mt-2 text-base">{subtitle}</p>
          </div>
          {showViewAll && (
            <Link
              href={viewAllHref}
              className="flex items-center gap-2 text-pheezes-black font-semibold hover:text-pheezes-yellow transition-colors group flex-shrink-0"
            >
              View All
              <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              messengerUrl={settings.messengerUrl}
              messengerMessage={settings.messengerDefaultMessage}
            />
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Offers Section Variant ───────────────────────────────

interface OffersSectionProps {
  products: ProductWithRelations[]
  settings: SiteSettings
}

export function OffersSection({ products, settings }: OffersSectionProps) {
  if (products.length === 0) return null

  return (
    <section className="py-20 bg-pheezes-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-0.5 w-8 bg-pheezes-yellow" />
              <span className="text-pheezes-yellow text-sm font-semibold uppercase tracking-wider">
                Limited Time
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-pheezes-black">Special Offers</h2>
            <p className="text-pheezes-gray-400 mt-2 text-base">
              Don't miss out — these deals won't last long.
            </p>
          </div>
          <Link
            href="/offers"
            className="flex items-center gap-2 text-pheezes-black font-semibold hover:text-pheezes-yellow transition-colors group flex-shrink-0"
          >
            All Offers
            <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              messengerUrl={settings.messengerUrl}
              messengerMessage={settings.messengerDefaultMessage}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
