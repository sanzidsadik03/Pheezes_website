'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  createProduct, updateProduct, addProductImage, deleteProductImage,
  setPrimaryImage, addProductVideo, deleteProductVideo, generateUniqueSlug
} from '@/actions/products'
import { productFormSchema, type ProductFormValues } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MediaUploader, ImagePreviewGrid, type UploadedAsset } from '@/components/admin/MediaUploader'
import { Save, Wand2, Video, X, Loader2 } from 'lucide-react'
import type { ProductWithRelations } from '@/types'

interface ProductFormProps {
  product?: ProductWithRelations
  categories: Array<{ id: string; name: string }>
  mode: 'create' | 'edit'
}

export function ProductForm({ product, categories, mode }: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [images, setImages] = useState(
    product?.images?.map((img) => ({ id: img.id, url: img.url, isPrimary: img.isPrimary })) ?? []
  )
  const [videos, setVideos] = useState(product?.videos ?? [])
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product?.name ?? '',
      slug: product?.slug ?? '',
      shortDescription: product?.shortDescription ?? '',
      description: product?.description ?? '',
      regularPrice: product ? Number(product.regularPrice) : 0,
      offerPrice: product?.offerPrice ? Number(product.offerPrice) : null,
      offerEnabled: product?.offerEnabled ?? false,
      categoryId: product?.categoryId ?? null,
      availability: product?.availability ?? 'IN_STOCK',
      visible: product?.visible ?? true,
      featured: product?.featured ?? false,
      displayOrder: product?.displayOrder ?? 0,
      metaTitle: product?.metaTitle ?? '',
      metaDescription: product?.metaDescription ?? '',
    },
  })

  const watchName = watch('name')
  const watchOfferEnabled = watch('offerEnabled')
  const watchVisible = watch('visible')
  const watchFeatured = watch('featured')

  const autoSlug = async () => {
    const name = watchName
    if (!name) return
    const slug = await generateUniqueSlug(name)
    setValue('slug', slug, { shouldDirty: true })
  }

  const onSubmit = async (data: ProductFormValues) => {
    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createProduct(data)
          : await updateProduct(product!.id, data)

      if (result.success) {
        toast.success(mode === 'create' ? 'Product created!' : 'Product updated!')
        if (mode === 'create' && result.data) {
          router.push(`/admin/products/${result.data.id}`)
        } else {
          router.refresh()
        }
      } else {
        toast.error(result.error ?? 'Something went wrong')
      }
    })
  }

  const handleImageUpload = async (asset: UploadedAsset) => {
    if (!product) return // Can't add images until product is created
    const result = await addProductImage(product.id, asset.url, asset.publicId, images.length === 0)
    if (result.success) {
      setImages((prev) => [...prev, { id: result.data!.id, url: asset.url, isPrimary: prev.length === 0 }])
    } else {
      toast.error('Failed to save image')
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    setDeletingImageId(imageId)
    const result = await deleteProductImage(imageId)
    setDeletingImageId(null)
    if (result.success) {
      setImages((prev) => prev.filter((img) => img.id !== imageId))
      toast.success('Image deleted')
    } else {
      toast.error('Failed to delete image')
    }
  }

  const handleSetPrimary = async (imageId: string) => {
    if (!product) return
    const result = await setPrimaryImage(imageId, product.id)
    if (result.success) {
      setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === imageId })))
      toast.success('Primary image set')
    }
  }

  const handleVideoUpload = async (asset: UploadedAsset) => {
    if (!product) return
    const result = await addProductVideo(product.id, asset.url, asset.publicId)
    if (result.success) {
      setVideos((prev) => [...prev, { id: result.data!.id, url: asset.url, publicId: asset.publicId, displayOrder: prev.length, productId: product.id }])
    }
  }

  const handleDeleteVideo = async (videoId: string) => {
    setDeletingVideoId(videoId)
    const result = await deleteProductVideo(videoId)
    setDeletingVideoId(null)
    if (result.success) {
      setVideos((prev) => prev.filter((v) => v.id !== videoId))
      toast.success('Video deleted')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Tabs defaultValue="basic">
        <TabsList className="mb-6">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          {mode === 'edit' && <TabsTrigger value="media">Media</TabsTrigger>}
          <TabsTrigger value="seo">SEO</TabsTrigger>
        </TabsList>

        {/* ── Basic Info ── */}
        <TabsContent value="basic">
          <Card>
            <CardHeader><CardTitle>Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="name" required>Product Name</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="e.g., Premium Canvas Wallet"
                  error={errors.name?.message}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <Label htmlFor="slug" required>URL Slug</Label>
                <div className="flex gap-2">
                  <Input
                    id="slug"
                    {...register('slug')}
                    placeholder="e.g., premium-canvas-wallet"
                    error={errors.slug?.message}
                  />
                  <Button type="button" variant="outline" size="md" onClick={autoSlug} title="Auto-generate slug">
                    <Wand2 className="h-4 w-4" />
                  </Button>
                </div>
                {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <select
                  id="category"
                  {...register('categoryId')}
                  className="w-full h-10 px-3 rounded-xl border border-pheezes-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pheezes-yellow"
                >
                  <option value="">No Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="shortDescription">Short Description</Label>
                <Textarea
                  id="shortDescription"
                  {...register('shortDescription')}
                  placeholder="Brief product description (shown on product card)"
                  rows={2}
                />
              </div>

              <div>
                <Label htmlFor="description">Full Description</Label>
                <Textarea
                  id="description"
                  {...register('description')}
                  placeholder="Detailed product description, features, specifications..."
                  rows={6}
                />
              </div>

              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  {...register('displayOrder', { valueAsNumber: true })}
                  placeholder="0"
                />
                <p className="text-xs text-pheezes-gray-400 mt-1">Lower numbers appear first.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Pricing ── */}
        <TabsContent value="pricing">
          <Card>
            <CardHeader><CardTitle>Pricing</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="regularPrice" required>Regular Price (TK)</Label>
                <Input
                  id="regularPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('regularPrice', { valueAsNumber: true })}
                  placeholder="699"
                  error={errors.regularPrice?.message}
                />
                {errors.regularPrice && <p className="text-red-500 text-xs mt-1">{errors.regularPrice.message}</p>}
              </div>

              <div>
                <Label htmlFor="offerPrice">Offer Price (TK)</Label>
                <Input
                  id="offerPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  {...register('offerPrice', { valueAsNumber: true, setValueAs: (v) => (v === '' || isNaN(Number(v)) ? null : Number(v)) })}
                  placeholder="599"
                />
                <p className="text-xs text-pheezes-gray-400 mt-1">Leave blank if no offer price.</p>
              </div>

              <div className="flex items-center gap-3 p-4 bg-pheezes-gray-50 rounded-xl">
                <Switch
                  id="offerEnabled"
                  checked={watchOfferEnabled}
                  onCheckedChange={(v) => setValue('offerEnabled', v, { shouldDirty: true })}
                />
                <div>
                  <Label htmlFor="offerEnabled" className="mb-0">Enable Offer</Label>
                  <p className="text-xs text-pheezes-gray-400">
                    When enabled, shows offer badge and crossed-out regular price.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Availability ── */}
        <TabsContent value="availability">
          <Card>
            <CardHeader><CardTitle>Availability & Visibility</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="availability" required>Stock Status</Label>
                <select
                  id="availability"
                  {...register('availability')}
                  className="w-full h-10 px-3 rounded-xl border border-pheezes-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pheezes-yellow"
                >
                  <option value="IN_STOCK">In Stock</option>
                  <option value="OUT_OF_STOCK">Out of Stock</option>
                  <option value="COMING_SOON">Coming Soon</option>
                </select>
              </div>

              <div className="flex items-center gap-3 p-4 bg-pheezes-gray-50 rounded-xl">
                <Switch
                  id="visible"
                  checked={watchVisible}
                  onCheckedChange={(v) => setValue('visible', v, { shouldDirty: true })}
                />
                <div>
                  <Label htmlFor="visible" className="mb-0">Visible on Website</Label>
                  <p className="text-xs text-pheezes-gray-400">
                    Hidden products are not shown to customers.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-pheezes-gray-50 rounded-xl">
                <Switch
                  id="featured"
                  checked={watchFeatured}
                  onCheckedChange={(v) => setValue('featured', v, { shouldDirty: true })}
                />
                <div>
                  <Label htmlFor="featured" className="mb-0">Featured Product</Label>
                  <p className="text-xs text-pheezes-gray-400">
                    Featured products appear in the homepage spotlight section.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Media (Edit mode only) ── */}
        {mode === 'edit' && (
          <TabsContent value="media">
            <div className="space-y-6">
              {/* Images */}
              <Card>
                <CardHeader><CardTitle>Product Images</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-pheezes-gray-400 mb-4">
                    Upload product photos. The primary image is shown first on the product card.
                  </p>
                  <MediaUploader
                    folder="pheezes/products"
                    accept="image"
                    onUpload={handleImageUpload}
                    label="Upload Product Images"
                    hint="JPG, PNG, WebP supported. Drag & drop or click to browse."
                  />
                  <ImagePreviewGrid
                    images={images}
                    onDelete={(id) => handleDeleteImage(id)}
                    onSetPrimary={handleSetPrimary}
                    deletingId={deletingImageId ?? undefined}
                  />
                </CardContent>
              </Card>

              {/* Videos */}
              <Card>
                <CardHeader><CardTitle>Product Videos</CardTitle></CardHeader>
                <CardContent>
                  <p className="text-sm text-pheezes-gray-400 mb-4">
                    Add product demo videos. Supported: MP4, MOV, WebM.
                  </p>
                  <MediaUploader
                    folder="pheezes/videos"
                    accept="video"
                    onUpload={handleVideoUpload}
                    label="Upload Product Videos"
                    hint="MP4, MOV, WebM — max 100MB recommended"
                  />
                  {videos.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {videos.map((video) => (
                        <div key={video.id} className="flex items-center gap-3 p-3 bg-pheezes-gray-50 rounded-xl">
                          <Video className="h-5 w-5 text-pheezes-gray-400 flex-shrink-0" />
                          <p className="text-sm text-pheezes-gray-600 truncate flex-1">{video.url}</p>
                          <button
                            type="button"
                            onClick={() => handleDeleteVideo(video.id)}
                            disabled={deletingVideoId === video.id}
                            className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0"
                          >
                            {deletingVideoId === video.id ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <X className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}

        {/* ── SEO ── */}
        <TabsContent value="seo">
          <Card>
            <CardHeader><CardTitle>SEO Settings</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  {...register('metaTitle')}
                  placeholder="Defaults to product name if left blank"
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  {...register('metaDescription')}
                  placeholder="Brief description for search engines (160 chars max)"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Save Button */}
      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-pheezes-gray-100 sticky bottom-0 bg-pheezes-gray-50 -mx-6 px-6 pb-4">
        <Button
          type="button"
          variant="ghost"
          size="md"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary" size="md" loading={isPending}>
          <Save className="h-4 w-4" />
          {isPending ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Save Changes'}
        </Button>
      </div>
    </form>
  )
}
