import { notFound } from 'next/navigation'
import { getProductBySlug } from '@/actions/products'
import { getSettings } from '@/actions/settings'
import { ProductGallery } from '@/components/customer/ProductGallery'
import { MessengerButton } from '@/components/customer/MessengerButton'
import { DeliveryInfo } from '@/components/customer/DeliveryInfo'
import { OfferBadge } from '@/components/ui/badge'
import { formatPrice, getAvailabilityLabel, getAvailabilityColor, getDiscountPercent } from '@/lib/utils'
import { Package, Play } from 'lucide-react'
import type { Metadata } from 'next'
import { cn } from '@/lib/utils'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? '',
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
  ])

  if (!product) notFound()

  const regularPrice = Number(product.regularPrice)
  const offerPrice = product.offerEnabled && product.offerPrice ? Number(product.offerPrice) : null
  const discountPercent = offerPrice ? getDiscountPercent(regularPrice, offerPrice) : 0
  const availabilityClass = getAvailabilityColor(product.availability)

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-pheezes-gray-400 mb-8">
          <a href="/" className="hover:text-pheezes-black transition-colors">Home</a>
          <span className="mx-2">›</span>
          <a href="/products" className="hover:text-pheezes-black transition-colors">Products</a>
          <span className="mx-2">›</span>
          <span className="text-pheezes-black font-medium">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Gallery */}
          <div>
            <ProductGallery
              images={product.images ?? []}
              productName={product.name}
            />

            {/* Videos */}
            {product.videos && product.videos.length > 0 && (
              <div className="mt-6 space-y-4">
                <h3 className="font-semibold text-pheezes-black flex items-center gap-2">
                  <Play className="h-4 w-4 text-pheezes-yellow" />
                  Product Videos
                </h3>
                {product.videos.map((video) => (
                  <div key={video.id} className="rounded-xl overflow-hidden bg-black">
                    <video
                      src={video.url}
                      controls
                      className="w-full max-h-64 object-contain"
                      preload="metadata"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Category + Availability */}
            <div className="flex items-center gap-3 mb-4">
              {product.category && (
                <span className="text-xs font-semibold text-pheezes-yellow bg-pheezes-yellow/10 px-3 py-1 rounded-full uppercase tracking-wider">
                  {product.category.name}
                </span>
              )}
              <span className={cn('text-xs font-semibold px-3 py-1 rounded-full', availabilityClass)}>
                {getAvailabilityLabel(product.availability)}
              </span>
            </div>

            {/* Product Name */}
            <h1 className="text-3xl sm:text-4xl font-bold text-pheezes-black leading-tight mb-4">
              {product.name}
            </h1>

            {/* Short Description */}
            {product.shortDescription && (
              <p className="text-pheezes-gray-500 text-base leading-relaxed mb-6">
                {product.shortDescription}
              </p>
            )}

            {/* Offer Badge + Price */}
            <div className="flex items-center gap-3 mb-6">
              {product.offerEnabled && <OfferBadge discount={discountPercent || undefined} />}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-pheezes-black">
                  {formatPrice(offerPrice ?? regularPrice)} TK
                </span>
                {offerPrice && (
                  <span className="text-lg text-pheezes-gray-400 line-through">
                    {formatPrice(regularPrice)} TK
                  </span>
                )}
              </div>
            </div>

            {/* Order CTA */}
            {product.availability !== 'OUT_OF_STOCK' ? (
              <div className="space-y-3 mb-8">
                <MessengerButton
                  messengerUrl={settings.messengerUrl}
                  productName={product.name}
                  defaultMessage={settings.messengerDefaultMessage}
                  size="lg"
                  fullWidth
                />
                <p className="text-center text-xs text-pheezes-gray-400">
                  Order via Facebook Messenger — we'll confirm your order personally.
                </p>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-center">
                <p className="text-red-600 font-semibold">Currently Out of Stock</p>
                <p className="text-red-400 text-sm mt-1">
                  Message us on Messenger to be notified when it's available.
                </p>
              </div>
            )}

            {/* Compact Delivery Info */}
            <DeliveryInfo settings={settings} compact />

            {/* Full Description */}
            {product.description && (
              <div className="mt-8 pt-8 border-t border-pheezes-gray-100">
                <h2 className="text-lg font-semibold text-pheezes-black mb-4">About this product</h2>
                <div
                  className="text-pheezes-gray-600 leading-relaxed text-sm whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{ __html: product.description.replace(/\n/g, '<br>') }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
