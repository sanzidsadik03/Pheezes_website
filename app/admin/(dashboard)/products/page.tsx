import { getProducts, getCategories } from '@/actions/products'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ProductsTable } from '@/components/admin/ProductsTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'
import type { Availability } from '@prisma/client'

interface AdminProductsPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    availability?: string
    page?: string
  }>
}

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const params = await searchParams
  const currentPage = Math.max(1, parseInt(params.page ?? '1'))

  const [productsResult, categories] = await Promise.all([
    getProducts({
      search: params.search || undefined,
      categoryId: params.category || undefined,
      availability: (params.availability as Availability) || undefined,
      page: currentPage,
      pageSize: 20,
      sortBy: 'newest',
    }),
    getCategories(),
  ])

  const sanitizedProducts = productsResult.data.map((p) => ({
    ...p,
    regularPrice: Number(p.regularPrice),
    offerPrice: p.offerPrice ? Number(p.offerPrice) : null,
  }))

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Products"
        subtitle={`${productsResult.total} total products`}
        breadcrumbs={[{ label: 'Products' }]}
        actions={
          <Link href="/admin/products/new">
            <Button variant="primary" size="md">
              <PlusCircle className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        }
      />

      <ProductsTable products={sanitizedProducts as any} />
    </div>
  )
}
