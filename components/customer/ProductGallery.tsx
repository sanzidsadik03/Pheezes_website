'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Expand, X, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ProductImage } from '@/types'

interface ProductGalleryProps {
  images: ProductImage[]
  productName: string
  activeImageUrl?: string | null
  onImageChange?: (url: string | null) => void
}

export function ProductGallery({
  images,
  productName,
  activeImageUrl,
  onImageChange,
}: ProductGalleryProps) {
  const [internalActiveIndex, setInternalActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const sortedImages = [...images].sort((a, b) => {
    if (a.isPrimary && !b.isPrimary) return -1
    if (!a.isPrimary && b.isPrimary) return 1
    return a.displayOrder - b.displayOrder
  })

  const matchingIndex = activeImageUrl
    ? sortedImages.findIndex((img) => img.url === activeImageUrl)
    : -1

  const activeIndex = matchingIndex !== -1 ? matchingIndex : internalActiveIndex

  const activeUrl =
    activeImageUrl && matchingIndex === -1
      ? activeImageUrl
      : sortedImages[activeIndex]?.url

  const goTo = (index: number) => {
    const nextIndex = Math.max(0, Math.min(index, sortedImages.length - 1))
    setInternalActiveIndex(nextIndex)
    if (onImageChange && sortedImages[nextIndex]) {
      onImageChange(sortedImages[nextIndex].url)
    }
  }

  if (!activeUrl && sortedImages.length === 0) {
    return (
      <div className="aspect-square bg-pheezes-gray-50 rounded-2xl flex items-center justify-center">
        <Package className="w-20 h-20 text-pheezes-gray-200" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-square bg-pheezes-gray-50 rounded-2xl overflow-hidden group">
        <Image
          src={activeUrl!}
          alt={`${productName} - main view`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
          priority
        />

        {/* Nav Arrows (only if multiple images) */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={() => goTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/90 text-pheezes-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => goTo(activeIndex + 1)}
              disabled={activeIndex === sortedImages.length - 1}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-xl bg-white/90 text-pheezes-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-30 shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </>
        )}

        {/* Expand Button */}
        <button
          onClick={() => setLightboxOpen(true)}
          className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-white/90 text-pheezes-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-white"
        >
          <Expand className="h-4 w-4" />
        </button>

        {/* Image counter */}
        {sortedImages.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full">
            {activeIndex + 1} / {sortedImages.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {sortedImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {sortedImages.map((img, index) => (
            <button
              key={img.id}
              onClick={() => goTo(index)}
              className={cn(
                'flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-150',
                index === activeIndex && (!activeImageUrl || matchingIndex !== -1)
                  ? 'border-pheezes-yellow shadow-[var(--shadow-yellow)]'
                  : 'border-transparent hover:border-pheezes-gray-300'
              )}
            >
              <Image
                src={img.url}
                alt={`${productName} thumbnail ${index + 1}`}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4" onClick={() => setLightboxOpen(false)}>
          <div className="relative max-w-4xl max-h-full w-full" onClick={(e) => e.stopPropagation()}>
            <Image
              src={activeUrl!}
              alt={`${productName} - full view`}
              width={1200}
              height={1200}
              className="w-full h-full object-contain rounded-xl max-h-[85vh]"
            />
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-pheezes-black hover:bg-pheezes-yellow transition-colors shadow-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
