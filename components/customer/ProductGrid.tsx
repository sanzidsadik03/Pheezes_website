'use client'

import { useState, useCallback, useTransition } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import { ProductCard } from '@/components/customer/ProductCard'
import { ProductCardSkeleton } from '@/components/ui/skeleton'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { ProductWithRelations, SiteSettings } from '@/types'

interface ProductCatalogClientProps {
  initialProducts: ProductWithRelations[]
  totalPages: number
  total: number
  currentPage: number
  currentSearch: string
  currentCategory: string
  currentAvailability: string
  currentOffer: string
  categories: Array<{ id: string; name: string }>
  settings: SiteSettings
}

export function ProductCatalogClient({
  initialProducts,
  totalPages,
  total,
  currentPage,
  currentSearch,
  currentCategory,
  currentAvailability,
  currentOffer,
  categories,
  settings,
}: ProductCatalogClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [searchValue, setSearchValue] = useState(currentSearch)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const updateParams = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())
      Object.entries(updates).forEach(([key, value]) => {
        if (value === undefined || value === '') {
          params.delete(key)
        } else {
          params.set(key, value)
        }
      })
      params.delete('page') // reset to page 1 on filter change
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [pathname, router, searchParams]
  )

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      updateParams({ search: searchValue || undefined })
    },
    [searchValue, updateParams]
  )

  const handlePage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const hasActiveFilters = currentCategory || currentAvailability || currentOffer || currentSearch

  return (
    <div>
      {/* Search + Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-pheezes-gray-400" />
            <Input
              type="search"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-9"
            />
          </div>
          <Button type="submit" variant="primary" size="md" loading={isPending}>
            Search
          </Button>
        </form>

        <Button
          variant="outline"
          size="md"
          onClick={() => setFiltersOpen(!filtersOpen)}
          className={cn(filtersOpen && 'bg-pheezes-black text-white border-pheezes-black')}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-1 bg-pheezes-yellow text-pheezes-black text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              !
            </span>
          )}
        </Button>
      </div>

      {/* Filter Panel */}
      {filtersOpen && (
        <div className="bg-pheezes-gray-50 border border-pheezes-gray-200 rounded-2xl p-5 mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {/* Category */}
          <div>
            <label className="text-xs font-semibold text-pheezes-gray-500 uppercase tracking-wider mb-2 block">
              Category
            </label>
            <select
              value={currentCategory}
              onChange={(e) => updateParams({ category: e.target.value || undefined })}
              className="w-full h-9 px-3 rounded-xl border border-pheezes-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pheezes-yellow"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Availability */}
          <div>
            <label className="text-xs font-semibold text-pheezes-gray-500 uppercase tracking-wider mb-2 block">
              Availability
            </label>
            <select
              value={currentAvailability}
              onChange={(e) => updateParams({ availability: e.target.value || undefined })}
              className="w-full h-9 px-3 rounded-xl border border-pheezes-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pheezes-yellow"
            >
              <option value="">All</option>
              <option value="IN_STOCK">In Stock</option>
              <option value="OUT_OF_STOCK">Out of Stock</option>
              <option value="COMING_SOON">Coming Soon</option>
            </select>
          </div>

          {/* Offer */}
          <div>
            <label className="text-xs font-semibold text-pheezes-gray-500 uppercase tracking-wider mb-2 block">
              Offers
            </label>
            <select
              value={currentOffer}
              onChange={(e) => updateParams({ offer: e.target.value || undefined })}
              className="w-full h-9 px-3 rounded-xl border border-pheezes-gray-200 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pheezes-yellow"
            >
              <option value="">All Products</option>
              <option value="1">On Offer Only</option>
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="flex items-end">
              <Button
                variant="ghost"
                size="md"
                onClick={() => {
                  setSearchValue('')
                  updateParams({ search: undefined, category: undefined, availability: undefined, offer: undefined })
                }}
                className="text-red-500 hover:bg-red-50 w-full"
              >
                <X className="h-4 w-4" />
                Clear All
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Results Count */}
      <p className="text-sm text-pheezes-gray-400 mb-6">
        {total} product{total !== 1 ? 's' : ''} found
        {currentSearch && (
          <span>
            {' '}for <strong className="text-pheezes-black">"{currentSearch}"</strong>
          </span>
        )}
      </p>

      {/* Grid */}
      {isPending ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : initialProducts.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-pheezes-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="h-7 w-7 text-pheezes-gray-300" />
          </div>
          <p className="text-pheezes-black font-semibold text-lg">No products found</p>
          <p className="text-pheezes-gray-400 text-sm mt-1">
            Try adjusting your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {initialProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              messengerUrl={settings.messengerUrl}
              messengerMessage={settings.messengerDefaultMessage}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage <= 1}
            onClick={() => handlePage(currentPage - 1)}
          >
            Previous
          </Button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            const page = i + 1
            return (
              <button
                key={page}
                onClick={() => handlePage(page)}
                className={cn(
                  'w-9 h-9 rounded-xl text-sm font-medium transition-all',
                  page === currentPage
                    ? 'bg-pheezes-yellow text-pheezes-black font-bold'
                    : 'border border-pheezes-gray-200 text-pheezes-gray-600 hover:border-pheezes-black'
                )}
              >
                {page}
              </button>
            )
          })}
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage >= totalPages}
            onClick={() => handlePage(currentPage + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
