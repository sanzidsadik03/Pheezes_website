import { notFound } from 'next/navigation'
import { getProductById, getCategories } from '@/actions/products'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ProductForm } from '@/components/admin/ProductForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft, ExternalLink } from 'lucide-react'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ])

  if (!product) notFound()

  // Convert Decimal objects to numbers for Client Component compatibility
  const sanitizedProduct = {
    ...product,
    regularPrice: Number(product.regularPrice),
    offerPrice: product.offerPrice ? Number(product.offerPrice) : null,
  }

  return (
    <div>
      <AdminHeader
        title={`Edit: ${product.name}`}
        subtitle={`/${product.slug}`}
        breadcrumbs={[
          { label: 'Products', href: '/admin/products' },
          { label: product.name },
        ]}
        actions={
          <div className="flex gap-2">
            <a
              href={`/products/${product.slug}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="outline" size="md">
                <ExternalLink className="h-4 w-4" />
                View Page
              </Button>
            </a>
            <Link href="/admin/products">
              <Button variant="ghost" size="md">
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
            </Link>
          </div>
        }
      />

      <div className="bg-pheezes-gray-50 rounded-2xl p-1">
        <div className="bg-white rounded-xl p-6">
          <ProductForm product={sanitizedProduct as any} categories={categories} mode="edit" />
        </div>
      </div>
    </div>
  )
}
