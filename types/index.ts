// ============================================================
// PHEEZES — Centralized TypeScript Types
// ============================================================

// ─── Enums ────────────────────────────────────────────────

export type Availability = 'IN_STOCK' | 'OUT_OF_STOCK' | 'COMING_SOON'

// ─── Database Models ──────────────────────────────────────

export interface AdminUser {
  id: string
  email: string
  name: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  createdAt: Date
}

export interface ProductImage {
  id: string
  productId: string
  url: string
  publicId: string
  isPrimary: boolean
  displayOrder: number
}

export interface ProductVideo {
  id: string
  productId: string
  url: string
  publicId: string
  displayOrder: number
}

export interface Product {
  id: string
  name: string
  slug: string
  shortDescription: string | null
  description: string | null
  regularPrice: number | any
  offerPrice: number | null | any
  offerEnabled: boolean
  categoryId: string | null
  availability: Availability
  visible: boolean
  featured: boolean
  displayOrder: number
  metaTitle: string | null
  metaDescription: string | null
  createdAt: Date
  updatedAt: Date
  category?: Category | null
  images?: ProductImage[]
  videos?: ProductVideo[]
}

export interface ReviewImage {
  id: string
  reviewId: string
  url: string
  publicId: string
}

export interface Review {
  id: string
  customerName: string
  description: string | null
  rating: number | null
  productName: string | null
  visible: boolean
  displayOrder: number
  reviewDate: Date
  createdAt: Date
  updatedAt: Date
  images?: ReviewImage[]
}

// ─── Settings ─────────────────────────────────────────────

export interface SiteSettings {
  deliveryInsideDhaka: string
  deliveryInsideDhakaPayment: string
  deliveryOutsideDhaka: string
  deliveryOutsideDhakaPayment: string
  deliveryDescription: string
  messengerUrl: string
  messengerDefaultMessage: string
  facebookUrl: string
  instagramUrl: string
  tiktokUrl: string
  heroTitle: string
  heroSubtitle: string
  aboutText: string
  siteName: string
  tagline: string
}

// ─── Form Data Types ──────────────────────────────────────

export interface ProductFormData {
  name: string
  slug: string
  shortDescription: string
  description: string
  regularPrice: number
  offerPrice: number | null
  offerEnabled: boolean
  categoryId: string | null
  availability: Availability
  visible: boolean
  featured: boolean
  displayOrder: number
  metaTitle: string
  metaDescription: string
}

export interface ReviewFormData {
  customerName: string
  description: string
  rating: number | null
  productName: string
  visible: boolean
  displayOrder: number
  reviewDate: string
}

export interface DeliverySettingsFormData {
  insideCharge: string
  insidePayment: string
  outsideCharge: string
  outsidePayment: string
  description: string
}

export interface SocialSettingsFormData {
  facebookUrl: string
  instagramUrl: string
  tiktokUrl: string
}

export interface MessengerSettingsFormData {
  messengerUrl: string
  defaultMessage: string
}

export interface HomepageSettingsFormData {
  heroTitle: string
  heroSubtitle: string
  aboutText: string
}

export interface GeneralSettingsFormData {
  siteName: string
  tagline: string
}

// ─── API Response Types ───────────────────────────────────

export interface ActionResult<T = void> {
  success: boolean
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// ─── Upload Types ─────────────────────────────────────────

export interface UploadedFile {
  url: string
  publicId: string
}

export interface CloudinarySignatureResponse {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
}

// ─── Product with relations (commonly used) ───────────────

export type ProductWithRelations = Product & {
  category: Category | null
  images: ProductImage[]
  videos: ProductVideo[]
}

export type ReviewWithImages = Review & {
  images: ReviewImage[]
}

// ─── Admin Dashboard Stats ────────────────────────────────

export interface DashboardStats {
  totalProducts: number
  activeProducts: number
  productsOnOffer: number
  hiddenProducts: number
  outOfStockProducts: number
  totalReviews: number
  visibleReviews: number
}
