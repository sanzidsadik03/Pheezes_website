import Link from 'next/link'
import Image from 'next/image'
import { Package, MessageCircle } from 'lucide-react'
import { OfferBadge } from '@/components/ui/badge'
import { cn, formatPrice, getDiscountPercent, getPrimaryImage, buildMessengerUrl, getAvailabilityLabel } from '@/lib/utils'
import type { ProductWithRelations } from '@/types'

interface ProductCardProps {
  product: ProductWithRelations
  messengerUrl: string
  messengerMessage?: string
}

export function ProductCard({ product, messengerUrl, messengerMessage }: ProductCardProps) {
  const primaryImage = getPrimaryImage(product.images ?? [])
  const discountPercent =
    product.offerEnabled && product.offerPrice
      ? getDiscountPercent(Number(product.regularPrice), Number(product.offerPrice))
      : 0
  const orderUrl = buildMessengerUrl(messengerUrl, product.name, messengerMessage)
  const isOutOfStock = product.availability === 'OUT_OF_STOCK'

  return (
    <article className="group bg-white rounded-2xl border border-pheezes-gray-100 overflow-hidden shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-all duration-300 hover:-translate-y-0.5 flex flex-col">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-pheezes-gray-50">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={cn(
              'object-cover transition-transform duration-500 group-hover:scale-105',
              isOutOfStock && 'opacity-60 grayscale'
            )}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-16 h-16 text-pheezes-gray-300" />
          </div>
        )}

        {/* Offer Badge */}
        {product.offerEnabled && (
          <div className="absolute top-3 left-3">
            <OfferBadge discount={discountPercent || undefined} />
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-end justify-center pb-4">
            <span className="bg-pheezes-black/80 text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              Out of Stock
            </span>
          </div>
        )}

        {/* Category Tag */}
        {product.category && (
          <div className="absolute top-3 right-3">
            <span className="bg-white/90 backdrop-blur-sm text-pheezes-gray-600 text-xs px-2.5 py-1 rounded-full font-medium">
              {product.category.name}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-pheezes-black text-base leading-snug line-clamp-2 mb-1">
          {product.name}
        </h3>
        {product.shortDescription && (
          <p className="text-sm text-pheezes-gray-400 line-clamp-2 mb-3 leading-relaxed flex-1">
            {product.shortDescription}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-4 mt-auto">
          {product.offerEnabled && product.offerPrice ? (
            <>
              <span className="text-xl font-bold text-pheezes-black">
                {formatPrice(Number(product.offerPrice))} TK
              </span>
              <span className="text-sm text-pheezes-gray-400 line-through">
                {formatPrice(Number(product.regularPrice))} TK
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-pheezes-black">
              {formatPrice(Number(product.regularPrice))} TK
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Link
            href={`/products/${product.slug}`}
            className="flex-1 flex items-center justify-center py-2.5 text-sm font-semibold border-2 border-pheezes-black text-pheezes-black rounded-xl hover:bg-pheezes-black hover:text-white transition-all duration-200 active:scale-[0.97]"
          >
            View Details
          </Link>
          <a
            href={isOutOfStock ? undefined : orderUrl}
            target={isOutOfStock ? undefined : '_blank'}
            rel="noopener noreferrer"
            className={cn(
              'flex items-center justify-center p-2.5 rounded-xl transition-all duration-200 active:scale-[0.97]',
              isOutOfStock
                ? 'bg-pheezes-gray-100 text-pheezes-gray-400 cursor-not-allowed'
                : 'bg-pheezes-yellow text-pheezes-black hover:bg-pheezes-yellow-dark'
            )}
            title={isOutOfStock ? 'Currently unavailable' : 'Order via Messenger'}
            aria-disabled={isOutOfStock}
          >
            <MessageCircle className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  )
}
