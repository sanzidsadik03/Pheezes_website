import { z } from 'zod'

// ─── Product Schemas ───────────────────────────────────────

export const productFormSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200, 'Name too long'),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(200)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  shortDescription: z.string().max(500, 'Short description too long').optional(),
  description: z.string().optional(),
  regularPrice: z
    .number()
    .min(0, 'Price cannot be negative')
    .max(999999, 'Price too large'),
  offerPrice: z
    .number()
    .min(0, 'Offer price cannot be negative')
    .max(999999, 'Offer price too large')
    .nullable()
    .optional(),
  offerEnabled: z.boolean().optional(),
  categoryId: z.string().nullable().optional(),
  availability: z.enum(['IN_STOCK', 'OUT_OF_STOCK', 'COMING_SOON']),
  visible: z.boolean().optional(),
  featured: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  metaTitle: z.string().max(200).optional(),
  metaDescription: z.string().max(500).optional(),
})

export type ProductFormValues = {
  name: string
  slug: string
  shortDescription?: string
  description?: string
  regularPrice: number
  offerPrice?: number | null
  offerEnabled?: boolean
  categoryId?: string | null
  availability: 'IN_STOCK' | 'OUT_OF_STOCK' | 'COMING_SOON'
  visible?: boolean
  featured?: boolean
  displayOrder?: number
  metaTitle?: string
  metaDescription?: string
}

// ─── Review Schemas ────────────────────────────────────────

export const reviewFormSchema = z.object({
  customerName: z.string().min(1, 'Customer name is required').max(200),
  description: z.string().max(2000, 'Review too long').optional(),
  rating: z.number().int().min(1).max(5).nullable().optional(),
  productName: z.string().max(200).optional(),
  visible: z.boolean().optional(),
  displayOrder: z.number().int().optional(),
  reviewDate: z.string().min(1, 'Review date is required'),
})

export type ReviewFormValues = {
  customerName: string
  description?: string
  rating?: number | null
  productName?: string
  visible?: boolean
  displayOrder?: number
  reviewDate: string
}

// ─── Settings Schemas ──────────────────────────────────────

export const deliverySettingsSchema = z.object({
  insideCharge: z
    .string()
    .min(1, 'Charge is required')
    .regex(/^\d+(\.\d{0,2})?$/, 'Enter a valid amount'),
  insidePayment: z.string().min(1, 'Payment method is required'),
  outsideCharge: z
    .string()
    .min(1, 'Charge is required')
    .regex(/^\d+(\.\d{0,2})?$/, 'Enter a valid amount'),
  outsidePayment: z.string().min(1, 'Payment method is required'),
  description: z.string().max(1000).optional(),
})

export type DeliverySettingsValues = {
  insideCharge: string
  insidePayment: string
  outsideCharge: string
  outsidePayment: string
  description?: string
}

export const socialSettingsSchema = z.object({
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
})

export type SocialSettingsValues = {
  facebookUrl?: string
  instagramUrl?: string
  tiktokUrl?: string
}

export const messengerSettingsSchema = z.object({
  messengerUrl: z.string().min(1, 'Messenger URL is required'),
  defaultMessage: z.string().max(500, 'Message too long').optional(),
})

export type MessengerSettingsValues = {
  messengerUrl: string
  defaultMessage?: string
}

export const homepageSettingsSchema = z.object({
  heroTitle: z.string().max(200).optional(),
  heroSubtitle: z.string().max(500).optional(),
  aboutText: z.string().max(2000).optional(),
})

export type HomepageSettingsValues = {
  heroTitle?: string
  heroSubtitle?: string
  aboutText?: string
}

export const generalSettingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required').max(100),
  tagline: z.string().max(200).optional(),
})

export type GeneralSettingsValues = {
  siteName: string
  tagline?: string
}

// ─── Auth Schemas ──────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export type LoginValues = z.infer<typeof loginSchema>

// ─── Category Schema ───────────────────────────────────────

export const categorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  slug: z
    .string()
    .min(1, 'Slug is required')
    .max(100)
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
})

export type CategoryValues = z.infer<typeof categorySchema>
