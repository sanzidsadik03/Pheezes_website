'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  createProduct, updateProduct, addProductImage, deleteProductImage,
  setPrimaryImage, reorderProductImages, addProductVideo, deleteProductVideo, generateUniqueSlug
} from '@/actions/products'
import { createCategory } from '@/actions/categories'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import Link from 'next/link'
import { productFormSchema, type ProductFormValues, type ProductVariationValues } from '@/lib/validations'
import { generateSlug, cn } from '@/lib/utils'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MediaUploader, uploadToCloudinary, type UploadedAsset } from '@/components/admin/MediaUploader'
import { ImageReorder } from '@/components/admin/ImageReorder'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Save, Wand2, Video, X, Loader2, Plus, Trash2, Upload, GripVertical, Tag } from 'lucide-react'
import type { ProductWithRelations } from '@/types'

interface ProductFormProps {
  product?: ProductWithRelations
  categories: Array<{ id: string; name: string }>
  mode: 'create' | 'edit'
}

interface FormVariationItem extends ProductVariationValues {
  dndId: string
}

function SortableVariationItem({
  v,
  index,
  uploadingVarIndex,
  onImageUpload,
  onImageRemove,
  onUpdate,
  onRemove,
}: {
  v: FormVariationItem
  index: number
  uploadingVarIndex: number | null
  onImageUpload: (index: number, file: File) => void
  onImageRemove: (index: number) => void
  onUpdate: (index: number, field: keyof ProductVariationValues, value: any) => void
  onRemove: (index: number) => void
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: v.dndId })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'flex flex-col sm:flex-row sm:items-center gap-3 p-3.5 bg-pheezes-gray-50/70 border border-pheezes-gray-200 rounded-2xl transition-all',
        isDragging && 'opacity-50 z-50 shadow-xl bg-white border-pheezes-yellow',
        'hover:border-pheezes-yellow/60'
      )}
    >
      {/* Drag handle */}
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="p-1.5 text-pheezes-gray-400 hover:text-pheezes-black cursor-grab active:cursor-grabbing rounded-lg hover:bg-white transition-colors flex-shrink-0"
        title="Drag to reorder variation"
      >
        <GripVertical className="h-4 w-4" />
      </button>

      {/* Upload that variation's image */}
      <div className="flex-shrink-0">
        <div className="relative w-14 h-14 rounded-xl bg-white border border-pheezes-gray-200 overflow-hidden flex items-center justify-center group shadow-2xs">
          {v.imageUrl ? (
            <>
              <Image
                src={v.imageUrl}
                alt={v.name || 'Variation image'}
                fill
                className="object-cover"
              />
              <button
                type="button"
                onClick={() => onImageRemove(index)}
                className="absolute inset-0 bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </>
          ) : uploadingVarIndex === index ? (
            <Loader2 className="h-5 w-5 text-pheezes-yellow animate-spin" />
          ) : (
            <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center text-pheezes-gray-400 hover:text-pheezes-black hover:bg-pheezes-yellow/10 transition-colors">
              <Upload className="h-4 w-4" />
              <span className="text-[9px] font-medium mt-0.5">Upload</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) onImageUpload(index, file)
                }}
              />
            </label>
          )}
        </div>
      </div>

      {/* Text box variation name */}
      <div className="flex-1 min-w-[160px]">
        <Input
          placeholder="Variation name (e.g., Black, Red, Sky Blue)"
          value={v.name}
          onChange={(e) => onUpdate(index, 'name', e.target.value)}
          className="bg-white h-10 text-sm"
        />
      </div>

      {/* Toggle switch for availability */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-pheezes-gray-200/80">
        <Switch
          id={`var-avail-${v.dndId}`}
          checked={v.availability === 'IN_STOCK'}
          onCheckedChange={(checked) =>
            onUpdate(
              index,
              'availability',
              checked ? 'IN_STOCK' : 'OUT_OF_STOCK'
            )
          }
        />
        <Label
          htmlFor={`var-avail-${v.dndId}`}
          className="text-xs font-medium cursor-pointer mb-0 select-none whitespace-nowrap min-w-[65px]"
        >
          {v.availability === 'IN_STOCK' ? (
            <span className="text-green-600 font-semibold">In Stock</span>
          ) : (
            <span className="text-red-500 font-semibold">Out of Stock</span>
          )}
        </Label>
      </div>

      {/* Toggle switch for visible */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white rounded-xl border border-pheezes-gray-200/80">
        <Switch
          id={`var-vis-${v.dndId}`}
          checked={v.visible}
          onCheckedChange={(checked) => onUpdate(index, 'visible', checked)}
        />
        <Label
          htmlFor={`var-vis-${v.dndId}`}
          className="text-xs font-medium cursor-pointer mb-0 select-none whitespace-nowrap min-w-[45px]"
        >
          {v.visible ? (
            <span className="text-pheezes-black">Visible</span>
          ) : (
            <span className="text-pheezes-gray-400">Hidden</span>
          )}
        </Label>
      </div>

      {/* Delete variation button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="w-9 h-9 rounded-xl text-pheezes-gray-400 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-colors flex-shrink-0"
        title="Delete variation"
      >
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ProductForm({ product, categories, mode }: ProductFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  // 1. If an image is added in variation, it should be available to see in media section too
  const [images, setImages] = useState(() => {
    const list =
      product?.images?.map((img) => ({
        id: img.id,
        url: img.url,
        isPrimary: img.isPrimary,
        publicId: img.publicId,
      })) ?? []

    const existingUrls = new Set(list.map((img) => img.url))
    product?.variations?.forEach((v) => {
      if (v.imageUrl && !existingUrls.has(v.imageUrl)) {
        list.push({
          id: `var-img-${v.id}`,
          url: v.imageUrl,
          isPrimary: false,
          publicId: v.imagePublicId ?? '',
        })
        existingUrls.add(v.imageUrl)
      }
    })

    return list
  })

  const [videos, setVideos] = useState(product?.videos ?? [])
  const [deletingImageId, setDeletingImageId] = useState<string | null>(null)
  const [deletingVideoId, setDeletingVideoId] = useState<string | null>(null)

  const [hasVariations, setHasVariations] = useState<boolean>(
    Boolean(product?.variations && product.variations.length > 0)
  )
  const [variations, setVariations] = useState<FormVariationItem[]>(
    product?.variations?.map((v, i) => ({
      id: v.id,
      dndId: v.id || `var-${i}-${Date.now()}`,
      name: v.name,
      imageUrl: v.imageUrl,
      imagePublicId: v.imagePublicId,
      availability: v.availability,
      visible: v.visible,
      displayOrder: v.displayOrder ?? i,
    })) ?? []
  )
  const [uploadingVarIndex, setUploadingVarIndex] = useState<number | null>(null)

  const variationSensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleVariationDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      const oldIndex = variations.findIndex((v) => v.dndId === active.id)
      const newIndex = variations.findIndex((v) => v.dndId === over.id)
      if (oldIndex !== -1 && newIndex !== -1) {
        const next = arrayMove(variations, oldIndex, newIndex).map((item, idx) => ({
          ...item,
          displayOrder: idx,
        }))
        setVariations(next)
      }
    }
  }

  const addVariation = () => {
    setVariations((prev) => [
      ...prev,
      {
        dndId: `var-new-${Date.now()}-${Math.random()}`,
        name: '',
        imageUrl: null,
        imagePublicId: null,
        availability: 'IN_STOCK',
        visible: true,
        displayOrder: prev.length,
      },
    ])
  }

  const updateVariation = (
    index: number,
    field: keyof ProductVariationValues,
    value: any
  ) => {
    setVariations((prev) => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const removeVariation = (index: number) => {
    setVariations((prev) => prev.filter((_, i) => i !== index))
  }

  const handleVariationImageUpload = async (index: number, file: File) => {
    try {
      setUploadingVarIndex(index)
      const res = await uploadToCloudinary(file, 'pheezes/variations')
      updateVariation(index, 'imageUrl', res.url)
      updateVariation(index, 'imagePublicId', res.publicId)

      // 1. If an image is added in variation, make it immediately visible in media section too:
      if (mode === 'edit' && product) {
        const imgResult = await addProductImage(product.id, res.url, res.publicId, images.length === 0)
        if (imgResult.success && imgResult.data) {
          setImages((prev) => [
            ...prev,
            { id: imgResult.data!.id, url: res.url, isPrimary: prev.length === 0, publicId: res.publicId },
          ])
        }
      } else {
        setImages((prev) => [
          ...prev,
          { id: `temp-var-img-${Date.now()}`, url: res.url, isPrimary: prev.length === 0, publicId: res.publicId },
        ])
      }

      toast.success('Variation image uploaded & added to Media')
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload variation image')
    } finally {
      setUploadingVarIndex(null)
    }
  }

  const removeVariationImage = (index: number) => {
    updateVariation(index, 'imageUrl', null)
    updateVariation(index, 'imagePublicId', null)
  }

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

  // Quick category state
  const [categoryList, setCategoryList] = useState(categories)
  const [isQuickAddCategoryOpen, setIsQuickAddCategoryOpen] = useState(false)
  const [quickCategoryName, setQuickCategoryName] = useState('')
  const [isCreatingCategory, setIsCreatingCategory] = useState(false)

  const handleQuickCreateCategory = async () => {
    const name = quickCategoryName.trim()
    if (!name) {
      toast.error('Category name is required')
      return
    }
    setIsCreatingCategory(true)
    const res = await createCategory(name)
    setIsCreatingCategory(false)
    if (res.success && res.data) {
      const newCat = { id: res.data.id, name: res.data.name }
      setCategoryList((prev) => [...prev, newCat].sort((a, b) => a.name.localeCompare(b.name)))
      setValue('categoryId', newCat.id, { shouldDirty: true })
      setQuickCategoryName('')
      setIsQuickAddCategoryOpen(false)
      toast.success(`Category "${newCat.name}" created and selected!`)
    } else {
      toast.error(res.error || 'Failed to create category')
    }
  }

  const autoSlug = async () => {
    const name = watchName
    if (!name) return
    const slug = await generateUniqueSlug(name)
    setValue('slug', slug, { shouldDirty: true })
  }

  const onSubmit = async (data: ProductFormValues) => {
    if (hasVariations) {
      if (variations.length === 0) {
        toast.error('Please add at least one variation or uncheck Variations')
        return
      }
      const hasEmptyName = variations.some((v) => !v.name?.trim())
      if (hasEmptyName) {
        toast.error('Please enter a name for all variations')
        return
      }
      data.hasVariations = true
      data.variations = variations.map((v, idx) => ({
        ...v,
        name: v.name.trim(),
        displayOrder: idx,
      }))
    } else {
      data.hasVariations = false
      data.variations = []
    }

    // Include images and videos from Media tab
    data.images = images.map((img, idx) => ({
      id: img.id,
      url: img.url,
      publicId: img.publicId,
      isPrimary: Boolean(img.isPrimary),
      displayOrder: idx,
    }))

    data.videos = videos.map((v, idx) => ({
      id: v.id,
      url: v.url,
      publicId: v.publicId,
      displayOrder: idx,
    }))

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
    if (!product) {
      setImages((prev) => [
        ...prev,
        {
          id: `temp-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          url: asset.url,
          isPrimary: prev.length === 0,
          publicId: asset.publicId,
        },
      ])
      toast.success('Image uploaded')
      return
    }
    const result = await addProductImage(product.id, asset.url, asset.publicId, images.length === 0)
    if (result.success) {
      setImages((prev) => [...prev, { id: result.data!.id, url: asset.url, isPrimary: prev.length === 0, publicId: asset.publicId }])
      toast.success('Image uploaded')
    } else {
      toast.error('Failed to save image')
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!product || imageId.startsWith('temp-') || imageId.startsWith('var-img-')) {
      setImages((prev) => {
        const next = prev.filter((img) => img.id !== imageId)
        if (next.length > 0 && !next.some((img) => img.isPrimary)) {
          next[0].isPrimary = true
        }
        return next
      })
      toast.success('Image removed')
      return
    }
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
    if (!product) {
      setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === imageId })))
      return
    }
    const result = await setPrimaryImage(imageId, product.id)
    if (result.success) {
      setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.id === imageId })))
      toast.success('Primary image set for all product views')
    } else {
      toast.error('Failed to set primary image')
    }
  }

  const handleReorderImages = async (newOrderIds: string[]) => {
    const reordered = newOrderIds
      .map((id) => images.find((img) => img.id === id))
      .filter(Boolean) as typeof images
    setImages(reordered)

    if (product) {
      const payload = newOrderIds
        .map((id, index) => ({ id, displayOrder: index }))
        .filter((item) => !item.id.startsWith('temp-') && !item.id.startsWith('var-img-'))
      if (payload.length > 0) {
        const res = await reorderProductImages(payload, product.id)
        if (res.success) {
          toast.success('Image order saved')
        }
      }
    }
  }

  const handleVideoUpload = async (asset: UploadedAsset) => {
    if (!product) {
      setVideos((prev) => [
        ...prev,
        {
          id: `temp-vid-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          url: asset.url,
          publicId: asset.publicId,
          displayOrder: prev.length,
          productId: '',
        },
      ])
      toast.success('Video uploaded')
      return
    }
    const result = await addProductVideo(product.id, asset.url, asset.publicId)
    if (result.success) {
      setVideos((prev) => [...prev, { id: result.data!.id, url: asset.url, publicId: asset.publicId, displayOrder: prev.length, productId: product.id }])
      toast.success('Video uploaded')
    }
  }

  const handleDeleteVideo = async (videoId: string) => {
    if (!product || videoId.startsWith('temp-vid-')) {
      setVideos((prev) => prev.filter((v) => v.id !== videoId))
      toast.success('Video removed')
      return
    }
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
          <TabsTrigger value="media">Media</TabsTrigger>
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
                <div className="flex items-center justify-between mb-1.5">
                  <Label htmlFor="category" className="mb-0">Category</Label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsQuickAddCategoryOpen(true)}
                      className="text-xs font-semibold text-pheezes-black hover:text-pheezes-yellow transition-colors flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      New Category
                    </button>
                    <span className="text-pheezes-gray-300 text-xs">|</span>
                    <Link
                      href="/admin/categories"
                      target="_blank"
                      className="text-xs text-pheezes-gray-400 hover:text-pheezes-black transition-colors"
                    >
                      Manage
                    </Link>
                  </div>
                </div>
                <select
                  id="category"
                  {...register('categoryId')}
                  className="w-full h-10 px-3 rounded-xl border border-pheezes-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pheezes-yellow"
                >
                  <option value="">No Category</option>
                  {categoryList.map((cat) => (
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

              {/* ── Variations Checkbox & Bar Form ── */}
              <div className="pt-6 border-t border-pheezes-gray-100 space-y-4">
                <div className="flex items-center justify-between p-4 bg-pheezes-gray-50 rounded-2xl border border-pheezes-gray-200/80">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="variations-checkbox"
                      checked={hasVariations}
                      onChange={(e) => {
                        const checked = e.target.checked
                        setHasVariations(checked)
                        if (checked && variations.length === 0) {
                          setVariations([
                            {
                              dndId: `var-init-${Date.now()}`,
                              name: '',
                              availability: 'IN_STOCK',
                              visible: true,
                              imageUrl: null,
                              imagePublicId: null,
                              displayOrder: 0,
                            },
                          ])
                        }
                      }}
                      className="w-5 h-5 accent-pheezes-yellow rounded cursor-pointer"
                    />
                    <div>
                      <Label
                        htmlFor="variations-checkbox"
                        className="text-base font-semibold text-pheezes-black mb-0 cursor-pointer"
                      >
                        Variations
                      </Label>
                      <p className="text-xs text-pheezes-gray-500 mt-0.5">
                        Add product variations such as colors, sizes, or models.
                      </p>
                    </div>
                  </div>
                  {hasVariations && (
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-pheezes-yellow/20 text-pheezes-black">
                      {variations.length} {variations.length === 1 ? 'variation' : 'variations'}
                    </span>
                  )}
                </div>

                {hasVariations && (
                  <div className="space-y-3 pt-2">
                    <DndContext
                      sensors={variationSensors}
                      collisionDetection={closestCenter}
                      onDragEnd={handleVariationDragEnd}
                    >
                      <SortableContext
                        items={variations.map((v) => v.dndId)}
                        strategy={verticalListSortingStrategy}
                      >
                        <div className="space-y-3">
                          {variations.map((v, index) => (
                            <SortableVariationItem
                              key={v.dndId}
                              v={v}
                              index={index}
                              uploadingVarIndex={uploadingVarIndex}
                              onImageUpload={handleVariationImageUpload}
                              onImageRemove={removeVariationImage}
                              onUpdate={updateVariation}
                              onRemove={removeVariation}
                            />
                          ))}
                        </div>
                      </SortableContext>
                    </DndContext>

                    {/* Button to add another variation */}
                    <div className="pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addVariation}
                        className="flex items-center gap-1.5 border-dashed border-pheezes-gray-300 hover:border-pheezes-yellow"
                      >
                        <Plus className="h-4 w-4" />
                        Add Another Variation
                      </Button>
                    </div>
                  </div>
                )}
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

        {/* ── Media ── */}
        <TabsContent value="media">
          <div className="space-y-6">
            {/* Images */}
            <Card>
              <CardHeader><CardTitle>Product Images</CardTitle></CardHeader>
              <CardContent>
                <p className="text-sm text-pheezes-gray-400 mb-4">
                  Upload product photos. Drag and drop images to reorder them. The primary image is shown first on both all products page and dedicated product page.
                </p>
                <MediaUploader
                  folder="pheezes/products"
                  accept="image"
                  onUpload={handleImageUpload}
                  label="Upload Product Images"
                  hint="JPG, PNG, WebP supported. Drag & drop or click to browse."
                />
                <div className="mt-4">
                  <ImageReorder
                    images={images}
                    onReorder={handleReorderImages}
                    onDelete={(id) => handleDeleteImage(id)}
                    onSetPrimary={handleSetPrimary}
                    deletingId={deletingImageId ?? undefined}
                  />
                </div>
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
      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-pheezes-gray-100 sticky bottom-0 bg-white/95 backdrop-blur-sm -mx-6 px-6 pb-2 rounded-b-xl z-10">
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
      {/* Quick Add Category Modal */}
      <Dialog open={isQuickAddCategoryOpen} onOpenChange={setIsQuickAddCategoryOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <div className="flex items-center gap-2.5 mb-1">
              <div className="w-8 h-8 rounded-lg bg-pheezes-yellow/20 flex items-center justify-center text-pheezes-black">
                <Tag className="h-4 w-4" />
              </div>
              <div>
                <DialogTitle>Quick Add Category</DialogTitle>
                <DialogDescription>Add a new category to select for this product.</DialogDescription>
              </div>
            </div>
          </DialogHeader>
          <div className="py-4">
            <Label htmlFor="quick-cat-name" required>Category Name</Label>
            <Input
              id="quick-cat-name"
              value={quickCategoryName}
              onChange={(e) => setQuickCategoryName(e.target.value)}
              placeholder="e.g. Leather Wallets"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleQuickCreateCategory()
                }
              }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setIsQuickAddCategoryOpen(false)}
              disabled={isCreatingCategory}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="md"
              loading={isCreatingCategory}
              disabled={isCreatingCategory || !quickCategoryName.trim()}
              onClick={handleQuickCreateCategory}
            >
              Create Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  )
}
