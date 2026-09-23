import Image from 'next/image'
import { Star, User } from 'lucide-react'
import { cn, formatDateShort, getStarArray } from '@/lib/utils'
import type { ReviewWithImages } from '@/types'

interface ReviewCardProps {
  review: ReviewWithImages
}

export function ReviewCard({ review }: ReviewCardProps) {
  const stars = getStarArray(review.rating)
  const primaryImage = review.images?.[0]?.url

  return (
    <article className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 h-full flex flex-col hover:bg-white/8 hover:border-white/20 transition-all duration-200">
      {/* Review Photo */}
      {primaryImage && (
        <div className="mb-4 rounded-xl overflow-hidden aspect-video bg-white/5">
          <Image
            src={primaryImage}
            alt={`Review by ${review.customerName}`}
            width={340}
            height={190}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Stars */}
      {review.rating && (
        <div className="flex items-center gap-1 mb-3">
          {stars.map((filled, i) => (
            <Star
              key={i}
              className={cn('h-4 w-4', filled ? 'fill-pheezes-yellow text-pheezes-yellow' : 'text-white/20')}
            />
          ))}
        </div>
      )}

      {/* Review Text */}
      {review.description && (
        <p className="text-white/70 text-sm leading-relaxed line-clamp-5 flex-1 mb-4">
          "{review.description}"
        </p>
      )}

      {/* Customer Info */}
      <div className="flex items-center gap-3 mt-auto pt-4 border-t border-white/10">
        <div className="w-9 h-9 rounded-full bg-pheezes-yellow/20 flex items-center justify-center flex-shrink-0">
          <User className="h-4 w-4 text-pheezes-yellow" />
        </div>
        <div className="min-w-0">
          <p className="text-white font-semibold text-sm truncate">{review.customerName}</p>
          <div className="flex items-center gap-2">
            {review.productName && (
              <p className="text-white/40 text-xs truncate">{review.productName}</p>
            )}
            {review.productName && review.reviewDate && (
              <span className="text-white/20 text-xs">•</span>
            )}
            <p className="text-white/30 text-xs flex-shrink-0">
              {formatDateShort(review.reviewDate)}
            </p>
          </div>
        </div>
      </div>
    </article>
  )
}
