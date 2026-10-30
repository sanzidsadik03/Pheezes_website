'use server'

import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { generateSlug } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
import type { ActionResult, CategoryWithCount } from '@/types'

async function requireAdmin() {
  const session = await auth()
  if (!session) throw new Error('Unauthorized')
  return session
}

// ─── Get Categories with Product Count (Admin) ────────────
export async function getCategoriesWithCount(): Promise<CategoryWithCount[]> {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { products: true },
        },
      },
    })

    return categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      productCount: c._count.products,
      createdAt: c.createdAt,
    }))
  } catch (error) {
    console.error('getCategoriesWithCount error:', error)
    return []
  }
}

// ─── Get Categories (Public) ──────────────────────────────
export async function getCategories() {
  try {
    return await prisma.category.findMany({ orderBy: { name: 'asc' } })
  } catch {
    return []
  }
}

// ─── Create Category (Admin) ──────────────────────────────
export async function createCategory(
  name: string,
  slugInput?: string
): Promise<ActionResult<{ id: string; name: string; slug: string }>> {
  try {
    await requireAdmin()
    const trimmedName = name.trim()
    if (!trimmedName) {
      return { success: false, error: 'Category name is required' }
    }

    const baseSlug = generateSlug(slugInput?.trim() || trimmedName)
    if (!baseSlug) {
      return { success: false, error: 'A valid slug could not be generated' }
    }

    // Check name collision
    const existingName = await prisma.category.findFirst({
      where: { name: { equals: trimmedName, mode: 'insensitive' } },
    })
    if (existingName) {
      return { success: false, error: 'A category with this name already exists' }
    }

    // Ensure slug is unique
    let slug = baseSlug
    let counter = 1
    while (await prisma.category.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`
    }

    const category = await prisma.category.create({
      data: {
        name: trimmedName,
        slug,
      },
    })

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/products')
    revalidatePath('/admin/categories')

    return {
      success: true,
      data: { id: category.id, name: category.name, slug: category.slug },
    }
  } catch (error) {
    console.error('createCategory error:', error)
    return { success: false, error: 'Failed to create category.' }
  }
}

// ─── Update Category (Admin) ──────────────────────────────
export async function updateCategory(
  id: string,
  name: string,
  slugInput?: string
): Promise<ActionResult<{ id: string; name: string; slug: string }>> {
  try {
    await requireAdmin()
    const trimmedName = name.trim()
    if (!trimmedName) {
      return { success: false, error: 'Category name is required' }
    }

    const category = await prisma.category.findUnique({ where: { id } })
    if (!category) {
      return { success: false, error: 'Category not found' }
    }

    // Check name collision with other categories
    const existingName = await prisma.category.findFirst({
      where: {
        name: { equals: trimmedName, mode: 'insensitive' },
        NOT: { id },
      },
    })
    if (existingName) {
      return { success: false, error: 'Another category already has this name' }
    }

    let slug = category.slug
    if (slugInput?.trim()) {
      const candidate = generateSlug(slugInput.trim())
      if (candidate !== category.slug) {
        let uniqueSlug = candidate
        let counter = 1
        while (
          await prisma.category.findFirst({
            where: { slug: uniqueSlug, NOT: { id } },
          })
        ) {
          uniqueSlug = `${candidate}-${counter++}`
        }
        slug = uniqueSlug
      }
    } else if (trimmedName !== category.name) {
      const candidate = generateSlug(trimmedName)
      let uniqueSlug = candidate
      let counter = 1
      while (
        await prisma.category.findFirst({
          where: { slug: uniqueSlug, NOT: { id } },
        })
      ) {
        uniqueSlug = `${candidate}-${counter++}`
      }
      slug = uniqueSlug
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        name: trimmedName,
        slug,
      },
    })

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/products')
    revalidatePath('/admin/categories')

    return {
      success: true,
      data: { id: updated.id, name: updated.name, slug: updated.slug },
    }
  } catch (error) {
    console.error('updateCategory error:', error)
    return { success: false, error: 'Failed to update category.' }
  }
}

// ─── Delete Category (Admin) ──────────────────────────────
// In case of category deletion, before deleting, moves existing products
// under that category to another category (moveToCategoryId).
// Otherwise, they'll get assigned to uncategorized (null).
export async function deleteCategory(
  id: string,
  moveToCategoryId?: string | null
): Promise<ActionResult> {
  try {
    await requireAdmin()

    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      return { success: false, error: 'Category not found' }
    }

    // Reassign existing products
    if (moveToCategoryId && moveToCategoryId !== id && moveToCategoryId !== 'uncategorized') {
      const targetCategory = await prisma.category.findUnique({
        where: { id: moveToCategoryId },
      })
      if (!targetCategory) {
        return { success: false, error: 'Selected destination category was not found' }
      }

      await prisma.product.updateMany({
        where: { categoryId: id },
        data: { categoryId: moveToCategoryId },
      })
    } else {
      // Reassign to null (uncategorized)
      await prisma.product.updateMany({
        where: { categoryId: id },
        data: { categoryId: null },
      })
    }

    // Delete the category
    await prisma.category.delete({
      where: { id },
    })

    revalidatePath('/')
    revalidatePath('/products')
    revalidatePath('/admin/products')
    revalidatePath('/admin/categories')

    return { success: true }
  } catch (error) {
    console.error('deleteCategory error:', error)
    return { success: false, error: 'Failed to delete category.' }
  }
}
