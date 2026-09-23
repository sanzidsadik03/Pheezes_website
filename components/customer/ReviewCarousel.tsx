'use client'

import { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { ReviewCard } from './ReviewCard'
import { cn } from '@/lib/utils'
import type { ReviewWithImages } from '@/types'

interface ReviewCarouselProps {
  reviews: ReviewWithImages[]
}

export function ReviewCarousel({ reviews }: ReviewCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: 'start',
      slidesToScroll: 1,
      breakpoints: {
        '(min-width: 768px)': { slidesToScroll: 1 },
      },
    },
    [
      Autoplay({
        delay: 5000,
        stopOnInteraction: true,
        stopOnMouseEnter: true,
      }),
    ]
  )

  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false)
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback(
    (index: number) => emblaApi?.scrollTo(index),
    [emblaApi]
  )

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setPrevBtnEnabled(emblaApi.canScrollPrev())
    setNextBtnEnabled(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    onSelect()
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  if (reviews.length === 0) return null

  return (
    <section className="py-20 bg-pheezes-black overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="h-0.5 w-8 bg-pheezes-yellow" />
              <span className="text-pheezes-yellow text-sm font-semibold uppercase tracking-wider">
                Customer Love
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">What People Say</h2>
            <p className="text-white/50 mt-2 text-base">Real reviews from happy customers.</p>
          </div>

          {/* Prev/Next Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={scrollPrev}
              disabled={!prevBtnEnabled && reviews.length <= 1}
              className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200',
                'border border-white/20 text-white hover:bg-pheezes-yellow hover:text-pheezes-black hover:border-pheezes-yellow',
                'disabled:opacity-30 disabled:cursor-not-allowed'
              )}
              aria-label="Previous review"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollNext}
              disabled={!nextBtnEnabled && reviews.length <= 1}
              className={cn(
                'w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200',
                'border border-white/20 text-white hover:bg-pheezes-yellow hover:text-pheezes-black hover:border-pheezes-yellow',
                'disabled:opacity-30 disabled:cursor-not-allowed'
              )}
              aria-label="Next review"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Embla Carousel */}
        <div className="embla" ref={emblaRef}>
          <div className="embla__container gap-5">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="embla__slide"
                style={{ flex: '0 0 min(340px, 90vw)' }}
              >
                <ReviewCard review={review} />
              </div>
            ))}
          </div>
        </div>

        {/* Dot Indicators */}
        {scrollSnaps.length > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  'rounded-full transition-all duration-300',
                  selectedIndex === index
                    ? 'w-6 h-2 bg-pheezes-yellow'
                    : 'w-2 h-2 bg-white/30 hover:bg-white/60'
                )}
                aria-label={`Go to review ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
