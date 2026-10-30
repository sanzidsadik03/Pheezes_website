'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ProductGallery } from '@/components/customer/ProductGallery'
import { MessengerButton } from '@/components/customer/MessengerButton'
import { DeliveryInfo } from '@/components/customer/DeliveryInfo'
import { OfferBadge } from '@/components/ui/badge'
import {
  formatPrice,
  getAvailabilityLabel,
  getAvailabilityColor,
  getDiscountPercent,
  getPrimaryImage,
  cn,
} from '@/lib/utils'
import { Package, Play } from 'lucide-react'
import type { ProductWithRelations, ProductVariation, SiteSettings } from '@/types'

interface ProductDetailViewProps {
  product: ProductWithRelations
  settings: SiteSettings
}

export function ProductDetailView({ product, settings }: ProductDetailViewProps) {
  // Only display variations marked as visible
  const visibleVariations = (product.variations ?? []).filter((v) => v.visible !== false)

  // Default to first visible variation if variations exist
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | null>(
    visibleVariations.length > 0 ? visibleVariations[0] : null
  )

  const primaryImage = getPrimaryImage(product.images ?? [])
  const [activeImageUrl, setActiveImageUrl] = useState<string | null>(
    primaryImage || selectedVariation?.imageUrl || null
  )

  const regularPrice = Number(product.regularPrice)
  const offerPrice = product.offerEnabled && product.offerPrice ? Number(product.offerPrice) : null
  const discountPercent = offerPrice ? getDiscountPercent(regularPrice, offerPrice) : 0

  // If a variation is selected, its availability takes precedence
  const currentAvailability = selectedVariation
    ? selectedVariation.availability
    : product.availability

  const availabilityClass = getAvailabilityColor(currentAvailability)
  const isOutOfStock = currentAvailability === 'OUT_OF_STOCK'

  const handleVariationClick = (variation: ProductVariation) => {
    setSelectedVariation(variation)
    if (variation.imageUrl) {
      setActiveImageUrl(variation.imageUrl)
    }
  }

  // Messenger order item name
  const orderProductName = selectedVariation
    ? `${product.name} (${selectedVariation.name})`
    : product.name

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
      {/* Left Column: Gallery & Videos */}
      <div>
        <ProductGallery
          images={product.images ?? []}
          productName={product.name}
          activeImageUrl={activeImageUrl}
          onImageChange={(url) => setActiveImageUrl(url)}
        />

        {/* Product Videos */}
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

      {/* Right Column: Details */}
      <div className="flex flex-col">
        {/* Category + Stock Availability */}
        <div className="flex items-center gap-3 mb-4">
          {product.category && (
            <span className="text-xs font-semibold text-pheezes-yellow bg-pheezes-yellow/10 px-3 py-1 rounded-full uppercase tracking-wider">
              {product.category.name}
            </span>
          )}
          <span className={cn('text-xs font-semibold px-3 py-1 rounded-full transition-colors', availabilityClass)}>
            {getAvailabilityLabel(currentAvailability)}
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

        {/* Ordering Options / CTA */}
        {!isOutOfStock ? (
          <div className="space-y-3 mb-8">
            <MessengerButton
              messengerUrl={settings.messengerUrl}
              productName={orderProductName}
              defaultMessage={settings.messengerDefaultMessage}
              size="lg"
              fullWidth
            />
            <p className="text-center text-xs text-pheezes-gray-400">
              Order via Facebook Messenger — we&apos;ll confirm your order personally.
            </p>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8 text-center">
            <p className="text-red-600 font-semibold">
              {selectedVariation
                ? `"${selectedVariation.name}" is currently Out of Stock`
                : 'Currently Out of Stock'}
            </p>
            <p className="text-red-400 text-sm mt-1">
              Message us on Messenger to be notified when it&apos;s back in stock.
            </p>
          </div>
        )}

        {/* Variations Section: Placed strictly between ordering options and delivery info */}
        {visibleVariations.length > 0 && (
          <div className="mb-8 pt-4 pb-2 border-t border-b border-pheezes-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-semibold text-pheezes-black">Variations:</span>
              <span className="text-sm text-pheezes-gray-700 font-medium">
                {selectedVariation?.name}
              </span>
            </div>

            {/* Small images of each variation (slightly smaller than the gallery thumbnails) with its name */}
            <div className="flex flex-wrap gap-2.5">
              {visibleVariations.map((v) => {
                const isSelected = selectedVariation?.id === v.id
                const isVarOutOfStock = v.availability === 'OUT_OF_STOCK'
                const displayImg = v.imageUrl || primaryImage

                return (
                  <button
                    key={v.id}
                    type="button"
                    onClick={() => handleVariationClick(v)}
                    className={cn(
                      'group relative flex flex-col items-center p-1.5 rounded-xl border-2 transition-all duration-150 text-left cursor-pointer bg-white',
                      isSelected
                        ? 'border-pheezes-yellow bg-pheezes-yellow/5 shadow-xs'
                        : 'border-pheezes-gray-200 hover:border-pheezes-gray-300'
                    )}
                  >
                    {/* Small image: 48x48 (gallery thumbnails are 64x64) */}
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-pheezes-gray-50 flex items-center justify-center">
                      {displayImg ? (
                        <Image
                          src={displayImg}
                          alt={v.name}
                          fill
                          sizes="48px"
                          className={cn(
                            'object-cover transition-transform duration-200 group-hover:scale-105',
                            isVarOutOfStock && 'opacity-60'
                          )}
                        />
                      ) : (
                        <Package className="w-5 h-5 text-pheezes-gray-300" />
                      )}
                      {isVarOutOfStock && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white bg-red-600/90 px-1 py-0.5 rounded-xs">
                            Out
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Variation Name */}
                    <span
                      className={cn(
                        'text-xs mt-1.5 max-w-[68px] truncate text-center',
                        isSelected
                          ? 'text-pheezes-black font-semibold'
                          : 'text-pheezes-gray-600 font-medium'
                      )}
                      title={v.name}
                    >
                      {v.name}
                    </span>
                  </button>
                )
              })}
            </div>
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
  )
}
