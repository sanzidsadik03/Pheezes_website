import { getCategories } from '@/actions/products'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ProductForm } from '@/components/admin/ProductForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div>
      <AdminHeader
        title="Add Product"
        subtitle="Create a new product in your Pheezes catalog."
        breadcrumbs={[{ label: 'Products', href: '/admin/products' }, { label: 'Add Product' }]}
        actions={
          <Link href="/admin/products">
            <Button variant="ghost" size="md">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        }
      />

      <div className="bg-pheezes-gray-50 rounded-2xl p-1">
        <div className="bg-white rounded-xl p-6">
          <div className="mb-4 p-4 bg-pheezes-yellow/10 border border-pheezes-yellow/30 rounded-xl">
            <p className="text-sm text-pheezes-gray-700">
              <strong>💡 Tip:</strong> After creating the product, you can add images and videos in the{' '}
              <strong>Media</strong> tab.
            </p>
          </div>
          <ProductForm categories={categories} mode="create" />
        </div>
      </div>
    </div>
  )
}
