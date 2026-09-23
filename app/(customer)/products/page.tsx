import { getSettings } from '@/actions/settings'
import { getProducts, getCategories } from '@/actions/products'
import { ProductCatalogClient } from '@/components/customer/ProductGrid'
import type { Metadata } from 'next'
import type { Availability } from '@prisma/client'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse our full collection of premium gifts.',
}

interface ProductsPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    availability?: string
    offer?: string
    page?: string
    sort?: string
  }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page ?? '1'))
  const currentSearch = params.search ?? ''
  const currentCategory = params.category ?? ''
  const currentAvailability = params.availability ?? ''
  const currentOffer = params.offer ?? ''
  const currentSort = (params.sort as 'newest' | 'oldest' | 'name' | 'price' | 'order') ?? 'order'

  const [settings, productsResult, categories] = await Promise.all([
    getSettings(),
    getProducts({
      visible: true,
      search: currentSearch || undefined,
      categoryId: currentCategory || undefined,
      availability: (currentAvailability as Availability) || undefined,
      offerEnabled: currentOffer === '1' ? true : undefined,
      page: currentPage,
      pageSize: 12,
      sortBy: currentSort,
    }),
    getCategories(),
  ])

  return (
    <div className="min-h-screen bg-pheezes-gray-50">
      {/* Page Header */}
      <div className="bg-pheezes-black py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-0.5 w-8 bg-pheezes-yellow" />
            <span className="text-pheezes-yellow text-sm font-semibold uppercase tracking-wider">
              Catalog
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white">All Products</h1>
          <p className="text-white/50 mt-2">Premium gifts for every occasion.</p>
        </div>
      </div>

      {/* Catalog */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ProductCatalogClient
          initialProducts={productsResult.data}
          totalPages={productsResult.totalPages}
          total={productsResult.total}
          currentPage={currentPage}
          currentSearch={currentSearch}
          currentCategory={currentCategory}
          currentAvailability={currentAvailability}
          currentOffer={currentOffer}
          categories={categories}
          settings={settings}
        />
      </div>
    </div>
  )
}
