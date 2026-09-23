'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createReview, updateReview, addReviewImage, deleteReviewImage } from '@/actions/reviews'
import { reviewFormSchema, type ReviewFormValues } from '@/lib/validations'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { MediaUploader, ImagePreviewGrid, type UploadedAsset } from '@/components/admin/MediaUploader'
import { Star, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ReviewWithImages } from '@/types'

interface ReviewFormProps {
  review?: ReviewWithImages
  mode: 'create' | 'edit'
}

export function ReviewForm({ review, mode }: ReviewFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [images, setImages] = useState(review?.images ?? [])
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const [hoveredStar, setHoveredStar] = useState(0)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      customerName: review?.customerName ?? '',
      description: review?.description ?? '',
      rating: review?.rating ?? null,
      productName: review?.productName ?? '',
      visible: review?.visible ?? true,
      displayOrder: review?.displayOrder ?? 0,
      reviewDate: review?.reviewDate
        ? new Date(review.reviewDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0],
    },
  })

  const watchRating = watch('rating')
  const watchVisible = watch('visible')

  const onSubmit = async (data: ReviewFormValues) => {
    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createReview(data)
          : await updateReview(review!.id, data)

      if (result.success) {
        toast.success(mode === 'create' ? 'Review added!' : 'Review updated!')
        if (mode === 'create' && result.data) {
          router.push(`/admin/reviews/${result.data.id}`)
        } else {
          router.refresh()
        }
      } else {
        toast.error(result.error ?? 'Something went wrong')
      }
    })
  }

  const handleImageUpload = async (asset: UploadedAsset) => {
    if (!review) return
    const result = await addReviewImage(review.id, asset.url, asset.publicId)
    if (result.success) {
      setImages((prev) => [...prev, { id: result.data!.id, url: asset.url, publicId: asset.publicId, reviewId: review.id }])
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    setDeletingImageId(imageId)
    const result = await deleteReviewImage(imageId)
    setDeletingImageId(null)
    if (result.success) {
      setImages((prev) => prev.filter((img) => img.id !== imageId))
      toast.success('Image deleted')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader><CardTitle>Review Details</CardTitle></CardHeader>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="customerName" required>Customer Name</Label>
              <Input
                id="customerName"
                {...register('customerName')}
                placeholder="e.g., Rafiq Ahmed"
                error={errors.customerName?.message}
              />
              {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
            </div>
            <div>
              <Label htmlFor="productName">Product Name (optional)</Label>
              <Input
                id="productName"
                {...register('productName')}
                placeholder="e.g., Premium Canvas Wallet"
              />
            </div>
          </div>

          {/* Star Rating */}
          <div>
            <Label>Rating</Label>
            <div className="flex items-center gap-2 mt-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => {
                    setValue('rating', watchRating === star ? null : star, { shouldDirty: true })
                  }}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={cn(
                      'h-7 w-7 transition-colors',
                      (hoveredStar || watchRating || 0) >= star
                        ? 'fill-pheezes-yellow text-pheezes-yellow'
                        : 'text-pheezes-gray-200'
                    )}
                  />
                </button>
              ))}
              {watchRating && (
                <button
                  type="button"
                  onClick={() => setValue('rating', null, { shouldDirty: true })}
                  className="text-xs text-pheezes-gray-400 hover:text-red-400 ml-2"
                >
                  Clear
                </button>
              )}
              <span className="text-sm text-pheezes-gray-400 ml-1">
                {watchRating ? `${watchRating} / 5` : 'No rating'}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Review Text</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="What did the customer say?"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="reviewDate" required>Review Date</Label>
              <Input id="reviewDate" type="date" {...register('reviewDate')} />
            </div>
            <div>
              <Label htmlFor="displayOrder">Display Order</Label>
              <Input
                id="displayOrder"
                type="number"
                {...register('displayOrder', { valueAsNumber: true })}
                placeholder="0"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-pheezes-gray-50 rounded-xl">
            <Switch
              id="visible"
              checked={watchVisible}
              onCheckedChange={(v) => setValue('visible', v, { shouldDirty: true })}
            />
            <div>
              <Label htmlFor="visible" className="mb-0">Visible to Customers</Label>
              <p className="text-xs text-pheezes-gray-400">
                Hidden reviews are not shown on the website.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review Photos (edit mode only) */}
      {mode === 'edit' && (
        <Card>
          <CardHeader><CardTitle>Review Photos</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-pheezes-gray-400 mb-4">
              Upload customer-provided product photos from this review.
            </p>
            <MediaUploader
              folder="pheezes/reviews"
              accept="image"
              onUpload={handleImageUpload}
              label="Upload Review Photos"
            />
            <ImagePreviewGrid
              images={images.map((img) => ({ id: img.id, url: img.url }))}
              onDelete={(id) => handleDeleteImage(id)}
              deletingId={deletingImageId ?? undefined}
            />
          </CardContent>
        </Card>
      )}

      {/* Save */}
      <div className="flex justify-end gap-3 pt-4 border-t border-pheezes-gray-100">
        <Button type="button" variant="ghost" size="md" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" loading={isPending}>
          <Save className="h-4 w-4" />
          {mode === 'create' ? 'Add Review' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
