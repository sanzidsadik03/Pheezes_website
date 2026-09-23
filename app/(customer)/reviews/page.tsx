import { getSettings } from '@/actions/settings'
import { getReviews } from '@/actions/reviews'
import { ReviewCarousel } from '@/components/customer/ReviewCarousel'
import { ReviewCard } from '@/components/customer/ReviewCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Customer Reviews',
  description: 'Read what our customers have to say about their Pheezes experience.',
}

export default async function ReviewsPage() {
  const [settings, reviews] = await Promise.all([
    getSettings(),
    getReviews({ visible: true }),
  ])

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="bg-pheezes-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-0.5 w-8 bg-pheezes-yellow" />
            <span className="text-pheezes-yellow text-sm font-semibold uppercase tracking-wider">
              Testimonials
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white">Customer Reviews</h1>
          <p className="text-white/50 mt-2">
            {reviews.length} review{reviews.length !== 1 ? 's' : ''} from happy customers
          </p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
          <div className="w-16 h-16 bg-pheezes-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-pheezes-black font-semibold text-lg">No reviews yet</p>
          <p className="text-pheezes-gray-400 text-sm mt-1">
            Be the first to share your Pheezes experience!
          </p>
        </div>
      ) : (
        <>
          {/* Carousel */}
          <ReviewCarousel reviews={reviews} />

          {/* All Reviews Grid */}
          <div className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <h2 className="text-2xl font-bold text-pheezes-black">All Reviews</h2>
                <p className="text-pheezes-gray-400 mt-1">Browse all customer feedback</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reviews.map((review) => (
                  <div key={review.id} className="[&>article]:bg-pheezes-gray-50 [&>article]:border-pheezes-gray-100 [&_p]:text-pheezes-gray-700 [&_h3]:text-pheezes-black">
                    <ReviewCard review={review} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
