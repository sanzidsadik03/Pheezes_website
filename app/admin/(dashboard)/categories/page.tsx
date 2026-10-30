import { getCategoriesWithCount } from '@/actions/categories'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { CategoriesManager } from '@/components/admin/CategoriesManager'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Categories | Admin Dashboard',
  description: 'Manage product categories and organize your catalog.',
}

export default async function AdminCategoriesPage() {
  const categories = await getCategoriesWithCount()

  return (
    <div className="space-y-6">
      <AdminHeader
        title="Categories"
        subtitle={`${categories.length} total ${categories.length === 1 ? 'category' : 'categories'}`}
        breadcrumbs={[{ label: 'Categories' }]}
      />

      <CategoriesManager initialCategories={categories} />
    </div>
  )
}
