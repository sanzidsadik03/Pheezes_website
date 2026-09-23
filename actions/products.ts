'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { deleteCloudinaryAsset } from '@/lib/cloudinary'
import { productFormSchema } from '@/lib/validations'
import { generateSlug } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import type { ActionResult, ProductWithRelations } from '@/types'
import type { Availability } from '@prisma/client'

// ─── Auth Guard ───────────────────────────────────────────

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  return session
}

// ─── Get Products (public) ────────────────────────────────

export async function getProducts(options?: {
  visible?: boolean
  featured?: boolean
  offerEnabled?: boolean
  categoryId?: string
  availability?: Availability
  search?: string
  page?: number
  pageSize?: number
  sortBy?: 'newest' | 'oldest' | 'name' | 'price' | 'order'
}) {
  const {
    visible,
    featured,
    offerEnabled,
    categoryId,
    availability,
    search,
    page = 1,
    pageSize = 20,
    sortBy = 'order',
  } = options ?? {}

  const where: Record<string, unknown> = {}
  if (visible !== undefined) where.visible = visible
  if (featured !== undefined) where.featured = featured
  if (offerEnabled !== undefined) where.offerEnabled = offerEnabled
  if (categoryId) where.categoryId = categoryId
  if (availability) where.availability = availability
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { shortDescription: { contains: search, mode: 'insensitive' } },
    ]
  }

  const orderBy =
    sortBy === 'newest'
      ? { createdAt: 'desc' as const }
      : sortBy === 'oldest'
        ? { createdAt: 'asc' as const }
        : sortBy === 'name'
          ? { name: 'asc' as const }
          : sortBy === 'price'
            ? { regularPrice: 'asc' as const }
            : { displayOrder: 'asc' as const }

  try {
    const [data, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: {
          images: { orderBy: { displayOrder: 'asc' } },
          videos: { orderBy: { displayOrder: 'asc' } },
          category: true,
        },
        orderBy,
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.product.count({ where }),
    ])

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) }
  } catch (error) {
    console.warn('getProducts DB fallback to empty list')
    return { data: [], total: 0, page, pageSize, totalPages: 0 }
  }
}

// ─── Get Single Product by Slug (public) ─────────────────

export async function getProductBySlug(slug: string): Promise<ProductWithRelations | null> {
  try {
    const product = await prisma.product.findUnique({
      where: { slug, visible: true },
      include: {
        images: { orderBy: { displayOrder: 'asc' } },
        videos: { orderBy: { displayOrder: 'asc' } },
        category: true,
      },
    })
    return product as ProductWithRelations | null
  } catch {
    return null
  }
}

// ─── Get Product by ID (admin) ────────────────────────────

export async function getProductById(id: string): Promise<ProductWithRelations | null> {
  await requireAdmin()
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { displayOrder: 'asc' } },
      videos: { orderBy: { displayOrder: 'asc' } },
      category: true,
    },
  })
  return product as ProductWithRelations | null
}

// ─── Create Product (admin) ───────────────────────────────

export async function createProduct(
  formData: unknown
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    await requireAdmin()
    const parsed = productFormSchema.safeParse(formData)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Validation failed' }
    }

    const data = parsed.data

    // Ensure slug is unique
    const existing = await prisma.product.findUnique({ where: { slug: data.slug } })
    if (existing) {
      return { success: false, error: 'A product with this slug already exists' }
    }

    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription || null,
        description: data.description || null,
        regularPrice: data.regularPrice,
        offerPrice: data.offerPrice ?? null,
        offerEnabled: data.offerEnabled,
        categoryId: data.categoryId || null,
        availability: data.availability as Availability,
        visible: data.visible,
        featured: data.featured,
        displayOrder: data.displayOrder,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
      },
    })

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/products')
    return { success: true, data: { id: product.id, slug: product.slug } }
  } catch (error) {
    console.error('createProduct error:', error)
    return { success: false, error: 'Failed to create product. Please try again.' }
  }
}

// ─── Update Product (admin) ───────────────────────────────

export async function updateProduct(
  id: string,
  formData: unknown
): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    await requireAdmin()
    const parsed = productFormSchema.safeParse(formData)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Validation failed' }
    }

    const data = parsed.data

    // Check slug uniqueness (excluding current product)
    const existing = await prisma.product.findFirst({
      where: { slug: data.slug, NOT: { id } },
    })
    if (existing) {
      return { success: false, error: 'A product with this slug already exists' }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription || null,
        description: data.description || null,
        regularPrice: data.regularPrice,
        offerPrice: data.offerPrice ?? null,
        offerEnabled: data.offerEnabled,
        categoryId: data.categoryId || null,
        availability: data.availability as Availability,
        visible: data.visible,
        featured: data.featured,
        displayOrder: data.displayOrder,
        metaTitle: data.metaTitle || null,
        metaDescription: data.metaDescription || null,
      },
    })

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath(`/products/${product.slug}`)
    revalidatePath('/admin/products')
    return { success: true, data: { id: product.id, slug: product.slug } }
  } catch (error) {
    console.error('updateProduct error:', error)
    return { success: false, error: 'Failed to update product. Please try again.' }
  }
}

// ─── Delete Product (admin) ───────────────────────────────

export async function deleteProduct(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()

    // Get all images and videos for Cloudinary cleanup
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: true, videos: true },
    })

    if (!product) return { success: false, error: 'Product not found' }

    // Delete Cloudinary assets
    await Promise.all([
      ...product.images.map((img) => deleteCloudinaryAsset(img.publicId, 'image')),
      ...product.videos.map((vid) => deleteCloudinaryAsset(vid.publicId, 'video')),
    ])

    await prisma.product.delete({ where: { id } })

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    console.error('deleteProduct error:', error)
    return { success: false, error: 'Failed to delete product. Please try again.' }
  }
}

// ─── Toggle Visibility (admin) ────────────────────────────

export async function toggleProductVisibility(
  id: string,
  visible: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin()
    await prisma.product.update({ where: { id }, data: { visible } })
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update visibility.' }
  }
}

// ─── Toggle Offer (admin) ─────────────────────────────────

export async function toggleProductOffer(
  id: string,
  offerEnabled: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin()
    await prisma.product.update({ where: { id }, data: { offerEnabled } })
    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/offers')
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update offer status.' }
  }
}

// ─── Add Product Image (admin) ────────────────────────────

export async function addProductImage(
  productId: string,
  url: string,
  publicId: string,
  isPrimary = false
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()

    // If setting as primary, unset all others
    if (isPrimary) {
      await prisma.productImage.updateMany({
        where: { productId },
        data: { isPrimary: false },
      })
    }

    // Get next display order
    const count = await prisma.productImage.count({ where: { productId } })

    const image = await prisma.productImage.create({
      data: { productId, url, publicId, isPrimary, displayOrder: count },
    })

    revalidatePath(`/products`)
    revalidatePath(`/admin/products/${productId}`)
    return { success: true, data: { id: image.id } }
  } catch (error) {
    return { success: false, error: 'Failed to add image.' }
  }
}

// ─── Delete Product Image (admin) ─────────────────────────

export async function deleteProductImage(imageId: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    const image = await prisma.productImage.findUnique({ where: { id: imageId } })
    if (!image) return { success: false, error: 'Image not found' }

    await deleteCloudinaryAsset(image.publicId, 'image')
    await prisma.productImage.delete({ where: { id: imageId } })

    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete image.' }
  }
}

// ─── Reorder Product Images (admin) ──────────────────────

export async function reorderProductImages(
  images: Array<{ id: string; displayOrder: number }>
): Promise<ActionResult> {
  try {
    await requireAdmin()
    await Promise.all(
      images.map((img) =>
        prisma.productImage.update({
          where: { id: img.id },
          data: { displayOrder: img.displayOrder },
        })
      )
    )
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to reorder images.' }
  }
}

// ─── Set Primary Image (admin) ────────────────────────────

export async function setPrimaryImage(imageId: string, productId: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    await prisma.productImage.updateMany({
      where: { productId },
      data: { isPrimary: false },
    })
    await prisma.productImage.update({
      where: { id: imageId },
      data: { isPrimary: true },
    })
    revalidatePath('/admin/products')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to set primary image.' }
  }
}

// ─── Add Product Video (admin) ────────────────────────────

export async function addProductVideo(
  productId: string,
  url: string,
  publicId: string
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()
    const count = await prisma.productVideo.count({ where: { productId } })
    const video = await prisma.productVideo.create({
      data: { productId, url, publicId, displayOrder: count },
    })
    revalidatePath(`/admin/products/${productId}`)
    return { success: true, data: { id: video.id } }
  } catch (error) {
    return { success: false, error: 'Failed to add video.' }
  }
}

// ─── Delete Product Video (admin) ─────────────────────────

export async function deleteProductVideo(videoId: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    const video = await prisma.productVideo.findUnique({ where: { id: videoId } })
    if (!video) return { success: false, error: 'Video not found' }

    await deleteCloudinaryAsset(video.publicId, 'video')
    await prisma.productVideo.delete({ where: { id: videoId } })
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete video.' }
  }
}

// ─── Dashboard Stats (admin) ──────────────────────────────

export async function getDashboardStats() {
  await requireAdmin()

  try {
    const [
      totalProducts,
      activeProducts,
      productsOnOffer,
      hiddenProducts,
      outOfStockProducts,
      totalReviews,
      visibleReviews,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { visible: true, availability: 'IN_STOCK' } }),
      prisma.product.count({ where: { offerEnabled: true } }),
      prisma.product.count({ where: { visible: false } }),
      prisma.product.count({ where: { availability: 'OUT_OF_STOCK' } }),
      prisma.review.count(),
      prisma.review.count({ where: { visible: true } }),
    ])

    return {
      totalProducts,
      activeProducts,
      productsOnOffer,
      hiddenProducts,
      outOfStockProducts,
      totalReviews,
      visibleReviews,
    }
  } catch {
    return {
      totalProducts: 0,
      activeProducts: 0,
      productsOnOffer: 0,
      hiddenProducts: 0,
      outOfStockProducts: 0,
      totalReviews: 0,
      visibleReviews: 0,
    }
  }
}

// ─── Get Categories ────────────────────────────────────────

export async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { name: 'asc' } })
  } catch {
    return []
  }
}

// ─── Create Category (admin) ──────────────────────────────

export async function createCategory(
  name: string,
  slug: string
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()
    const existing = await prisma.category.findUnique({ where: { slug } })
    if (existing) return { success: false, error: 'A category with this slug already exists' }

    const category = await prisma.category.create({ data: { name, slug } })
    revalidatePath('/admin/products')
    return { success: true, data: { id: category.id } }
  } catch (error) {
    return { success: false, error: 'Failed to create category.' }
  }
}

// ─── Generate unique slug ─────────────────────────────────

export async function generateUniqueSlug(name: string): Promise<string> {
  const base = generateSlug(name)
  let slug = base
  let counter = 1

  while (await prisma.product.findUnique({ where: { slug } })) {
    slug = `${base}-${counter++}`
  }

  return slug
}
