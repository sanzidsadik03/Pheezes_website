import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getProductBySlug } from '@/actions/products'
import { getSettings } from '@/actions/settings'
import { ProductDetailView } from '@/components/customer/ProductDetailView'
import type { Metadata } from 'next'

interface ProductPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: 'Product Not Found' }

  return {
    title: product.metaTitle || product.name,
    description: product.metaDescription || product.shortDescription || product.description?.slice(0, 160),
    openGraph: {
      title: product.name,
      description: product.shortDescription ?? '',
      images: product.images?.[0]?.url ? [{ url: product.images[0].url }] : [],
    },
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params

  const [product, settings] = await Promise.all([
    getProductBySlug(slug),
    getSettings(),
  ])

  if (!product) notFound()

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="text-sm text-pheezes-gray-400 mb-8">
          <Link href="/" className="hover:text-pheezes-black transition-colors">Home</Link>
          <span className="mx-2">›</span>
          <Link href="/products" className="hover:text-pheezes-black transition-colors">Products</Link>
          <span className="mx-2">›</span>
          <span className="text-pheezes-black font-medium">{product.name}</span>
        </nav>

        {/* Interactive Product Detail with Gallery & Variations */}
        <ProductDetailView product={product} settings={settings} />
      </div>
    </div>
  )
}
