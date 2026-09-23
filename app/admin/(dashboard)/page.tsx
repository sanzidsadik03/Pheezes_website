import { getDashboardStats } from '@/actions/products'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { StatsCard } from '@/components/admin/StatsCard'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import {
  Package, ShoppingBag, Tag, EyeOff, AlertTriangle, Star, Eye,
  PlusCircle, Truck, Share2, MessageCircle
} from 'lucide-react'

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats()

  const quickActions = [
    { label: 'Add Product', href: '/admin/products/new', icon: PlusCircle },
    { label: 'Add Review', href: '/admin/reviews/new', icon: Star },
    { label: 'Manage Offers', href: '/admin/products', icon: Tag },
    { label: 'Edit Delivery', href: '/admin/settings/delivery', icon: Truck },
    { label: 'Social Links', href: '/admin/settings/social', icon: Share2 },
    { label: 'Edit Messenger', href: '/admin/settings/messenger', icon: MessageCircle },
  ]

  return (
    <div>
      <AdminHeader
        title="Dashboard"
        subtitle="Welcome back! Here's an overview of your Pheezes store."
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard
          title="Total Products"
          value={stats.totalProducts}
          icon={Package}
          accent
        />
        <StatsCard
          title="Active Products"
          value={stats.activeProducts}
          icon={ShoppingBag}
        />
        <StatsCard
          title="On Offer"
          value={stats.productsOnOffer}
          icon={Tag}
        />
        <StatsCard
          title="Total Reviews"
          value={stats.totalReviews}
          icon={Star}
          accent
        />
        <StatsCard
          title="Hidden"
          value={stats.hiddenProducts}
          icon={EyeOff}
          description="Hidden products"
        />
        <StatsCard
          title="Out of Stock"
          value={stats.outOfStockProducts}
          icon={AlertTriangle}
          description="Need restocking"
        />
        <StatsCard
          title="Visible Reviews"
          value={stats.visibleReviews}
          icon={Eye}
          description="Showing to customers"
        />
        <StatsCard
          title="Hidden Reviews"
          value={stats.totalReviews - stats.visibleReviews}
          icon={EyeOff}
          description="Not visible"
        />
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-pheezes-black mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex flex-col items-center gap-2.5 bg-white border border-pheezes-gray-100 rounded-2xl p-4 hover:border-pheezes-yellow hover:bg-pheezes-yellow/5 transition-all duration-200 group text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-pheezes-gray-50 group-hover:bg-pheezes-yellow flex items-center justify-center transition-colors">
                <Icon className="h-5 w-5 text-pheezes-gray-500 group-hover:text-pheezes-black transition-colors" />
              </div>
              <span className="text-xs font-medium text-pheezes-gray-600 group-hover:text-pheezes-black transition-colors leading-tight">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-pheezes-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-pheezes-black">Products</h3>
            <Link href="/admin/products" className="text-xs text-pheezes-yellow hover:underline font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-pheezes-gray-100">
              <span className="text-sm text-pheezes-gray-500">Total Products</span>
              <span className="font-semibold text-pheezes-black">{stats.totalProducts}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-pheezes-gray-100">
              <span className="text-sm text-pheezes-gray-500">In Stock</span>
              <span className="font-semibold text-green-600">{stats.activeProducts}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-pheezes-gray-100">
              <span className="text-sm text-pheezes-gray-500">On Special Offer</span>
              <span className="font-semibold text-pheezes-yellow">{stats.productsOnOffer}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-pheezes-gray-500">Out of Stock</span>
              <span className="font-semibold text-red-500">{stats.outOfStockProducts}</span>
            </div>
          </div>
          <Link href="/admin/products/new" className="mt-4 block">
            <Button variant="primary" size="sm" className="w-full">
              <PlusCircle className="h-4 w-4" />
              Add Product
            </Button>
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-pheezes-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-pheezes-black">Reviews</h3>
            <Link href="/admin/reviews" className="text-xs text-pheezes-yellow hover:underline font-medium">
              View All →
            </Link>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-pheezes-gray-100">
              <span className="text-sm text-pheezes-gray-500">Total Reviews</span>
              <span className="font-semibold text-pheezes-black">{stats.totalReviews}</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-pheezes-gray-100">
              <span className="text-sm text-pheezes-gray-500">Visible to Customers</span>
              <span className="font-semibold text-green-600">{stats.visibleReviews}</span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-sm text-pheezes-gray-500">Hidden</span>
              <span className="font-semibold text-pheezes-gray-400">
                {stats.totalReviews - stats.visibleReviews}
              </span>
            </div>
          </div>
          <Link href="/admin/reviews/new" className="mt-4 block">
            <Button variant="secondary" size="sm" className="w-full">
              <PlusCircle className="h-4 w-4" />
              Add Review
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
