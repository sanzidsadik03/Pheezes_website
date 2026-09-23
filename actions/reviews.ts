'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { deleteCloudinaryAsset } from '@/lib/cloudinary'
import { reviewFormSchema } from '@/lib/validations'
import { revalidatePath } from 'next/cache'
import type { ActionResult, ReviewWithImages } from '@/types'

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  return session
}

// ─── Get Reviews (public) ─────────────────────────────────

export async function getReviews(options?: {
  visible?: boolean
  page?: number
  pageSize?: number
}): Promise<ReviewWithImages[]> {
  const { visible, page = 1, pageSize = 50 } = options ?? {}

  const where: Record<string, unknown> = {}
  if (visible !== undefined) where.visible = visible

  try {
    const reviews = await prisma.review.findMany({
      where,
      include: { images: true },
      orderBy: { displayOrder: 'asc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    })

    return reviews as ReviewWithImages[]
  } catch (error) {
    console.warn('getReviews DB fallback to empty list')
    return []
  }
}

// ─── Get Review by ID (admin) ─────────────────────────────

export async function getReviewById(id: string): Promise<ReviewWithImages | null> {
  await requireAdmin()
  try {
    const review = await prisma.review.findUnique({
      where: { id },
      include: { images: true },
    })
    return review as ReviewWithImages | null
  } catch {
    return null
  }
}

// ─── Create Review (admin) ────────────────────────────────

export async function createReview(formData: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()
    const parsed = reviewFormSchema.safeParse(formData)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Validation failed' }
    }

    const data = parsed.data
    const count = await prisma.review.count()

    const review = await prisma.review.create({
      data: {
        customerName: data.customerName,
        description: data.description || null,
        rating: data.rating ?? null,
        productName: data.productName || null,
        visible: data.visible,
        displayOrder: data.displayOrder || count,
        reviewDate: new Date(data.reviewDate),
      },
    })

    revalidatePath('/')
    revalidatePath('/reviews')
    revalidatePath('/admin/reviews')
    return { success: true, data: { id: review.id } }
  } catch (error) {
    console.error('createReview error:', error)
    return { success: false, error: 'Failed to create review. Please try again.' }
  }
}

// ─── Update Review (admin) ────────────────────────────────

export async function updateReview(
  id: string,
  formData: unknown
): Promise<ActionResult> {
  try {
    await requireAdmin()
    const parsed = reviewFormSchema.safeParse(formData)
    if (!parsed.success) {
      return { success: false, error: parsed.error.issues[0]?.message ?? 'Validation failed' }
    }

    const data = parsed.data
    await prisma.review.update({
      where: { id },
      data: {
        customerName: data.customerName,
        description: data.description || null,
        rating: data.rating ?? null,
        productName: data.productName || null,
        visible: data.visible,
        displayOrder: data.displayOrder,
        reviewDate: new Date(data.reviewDate),
      },
    })

    revalidatePath('/')
    revalidatePath('/reviews')
    revalidatePath('/admin/reviews')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update review.' }
  }
}

// ─── Delete Review (admin) ────────────────────────────────

export async function deleteReview(id: string): Promise<ActionResult> {
  try {
    await requireAdmin()

    const review = await prisma.review.findUnique({
      where: { id },
      include: { images: true },
    })
    if (!review) return { success: false, error: 'Review not found' }

    await Promise.all(review.images.map((img) => deleteCloudinaryAsset(img.publicId, 'image')))
    await prisma.review.delete({ where: { id } })

    revalidatePath('/')
    revalidatePath('/reviews')
    revalidatePath('/admin/reviews')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete review.' }
  }
}

// ─── Toggle Visibility (admin) ────────────────────────────

export async function toggleReviewVisibility(
  id: string,
  visible: boolean
): Promise<ActionResult> {
  try {
    await requireAdmin()
    await prisma.review.update({ where: { id }, data: { visible } })
    revalidatePath('/')
    revalidatePath('/reviews')
    revalidatePath('/admin/reviews')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update visibility.' }
  }
}

// ─── Reorder Reviews (admin) ──────────────────────────────

export async function reorderReviews(
  reviews: Array<{ id: string; displayOrder: number }>
): Promise<ActionResult> {
  try {
    await requireAdmin()
    await Promise.all(
      reviews.map((r) =>
        prisma.review.update({
          where: { id: r.id },
          data: { displayOrder: r.displayOrder },
        })
      )
    )
    revalidatePath('/')
    revalidatePath('/reviews')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to reorder reviews.' }
  }
}

// ─── Add Review Image (admin) ─────────────────────────────

export async function addReviewImage(
  reviewId: string,
  url: string,
  publicId: string
): Promise<ActionResult<{ id: string }>> {
  try {
    await requireAdmin()
    const image = await prisma.reviewImage.create({
      data: { reviewId, url, publicId },
    })
    revalidatePath('/admin/reviews')
    return { success: true, data: { id: image.id } }
  } catch (error) {
    return { success: false, error: 'Failed to add image.' }
  }
}

// ─── Delete Review Image (admin) ──────────────────────────

export async function deleteReviewImage(imageId: string): Promise<ActionResult> {
  try {
    await requireAdmin()
    const image = await prisma.reviewImage.findUnique({ where: { id: imageId } })
    if (!image) return { success: false, error: 'Image not found' }

    await deleteCloudinaryAsset(image.publicId, 'image')
    await prisma.reviewImage.delete({ where: { id: imageId } })
    revalidatePath('/admin/reviews')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete image.' }
  }
}
