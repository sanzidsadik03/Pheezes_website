import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// ─── Tailwind Class Merger ────────────────────────────────

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ─── Slug Generator ───────────────────────────────────────

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // remove special chars
    .replace(/[\s_-]+/g, '-') // replace spaces/underscores with hyphens
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
}

// ─── Price Formatter ──────────────────────────────────────

export function formatPrice(price: number | string | null | undefined): string {
  if (price === null || price === undefined) return '0'
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return '0'
  return num.toLocaleString('en-BD')
}

// ─── Messenger URL Builder ────────────────────────────────
// Creates a pre-filled Messenger URL with the product name in the message.

export function buildMessengerUrl(baseUrl: string, productName?: string, template?: string): string {
  if (!baseUrl) return '#'

  const message = productName
    ? (template ?? 'Hi, I am interested in [Product Name].').replace('[Product Name]', productName)
    : undefined

  if (message) {
    const separator = baseUrl.includes('?') ? '&' : '?'
    return `${baseUrl}${separator}text=${encodeURIComponent(message)}`
  }

  return baseUrl
}

// ─── Availability Label ───────────────────────────────────

export function getAvailabilityLabel(availability: string): string {
  switch (availability) {
    case 'IN_STOCK':
      return 'In Stock'
    case 'OUT_OF_STOCK':
      return 'Out of Stock'
    case 'COMING_SOON':
      return 'Coming Soon'
    default:
      return availability
  }
}

export function getAvailabilityColor(availability: string): string {
  switch (availability) {
    case 'IN_STOCK':
      return 'text-green-600 bg-green-50'
    case 'OUT_OF_STOCK':
      return 'text-red-600 bg-red-50'
    case 'COMING_SOON':
      return 'text-orange-600 bg-orange-50'
    default:
      return 'text-gray-600 bg-gray-50'
  }
}

// ─── Date Formatter ───────────────────────────────────────

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatDateShort(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-BD', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

// ─── Truncate Text ────────────────────────────────────────

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + '…'
}

// ─── Discount Calculator ──────────────────────────────────

export function getDiscountPercent(regular: number, offer: number): number {
  if (regular <= 0 || offer >= regular) return 0
  return Math.round(((regular - offer) / regular) * 100)
}

// ─── Rating Stars ─────────────────────────────────────────

export function getStarArray(rating: number | null): boolean[] {
  if (!rating) return [false, false, false, false, false]
  return Array.from({ length: 5 }, (_, i) => i < rating)
}

// ─── Primary Image Getter ─────────────────────────────────

export function getPrimaryImage(
  images: Array<{ url: string; isPrimary: boolean; displayOrder: number }>
): string | null {
  if (!images || images.length === 0) return null
  const primary = images.find((img) => img.isPrimary)
  if (primary) return primary.url
  const sorted = [...images].sort((a, b) => a.displayOrder - b.displayOrder)
  return sorted[0]?.url ?? null
}
