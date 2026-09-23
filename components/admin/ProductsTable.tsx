'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  deleteProduct, toggleProductVisibility, toggleProductOffer
} from '@/actions/products'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from '@/components/ui/table'
import {
  PlusCircle, Edit, Trash2, Package, Eye, EyeOff
} from 'lucide-react'
import { formatPrice, getPrimaryImage } from '@/lib/utils'
import { toast } from 'sonner'
import type { ProductWithRelations } from '@/types'

interface ProductsTableProps {
  products: ProductWithRelations[]
}

export function ProductsTable({ products }: ProductsTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return
    setDeletingId(deleteId)
    const result = await deleteProduct(deleteId)
    setDeletingId(null)
    setConfirmOpen(false)
    if (result.success) {
      toast.success('Product deleted')
      router.refresh()
    } else {
      toast.error(result.error ?? 'Failed to delete product')
    }
  }

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    startTransition(async () => {
      const result = await toggleProductVisibility(id, visible)
      if (result.success) {
        toast.success(visible ? 'Product visible' : 'Product hidden')
        router.refresh()
      } else {
        toast.error('Failed to update visibility')
      }
    })
  }

  const handleToggleOffer = async (id: string, offerEnabled: boolean) => {
    startTransition(async () => {
      const result = await toggleProductOffer(id, offerEnabled)
      if (result.success) {
        toast.success(offerEnabled ? 'Offer activated' : 'Offer deactivated')
        router.refresh()
      } else {
        toast.error('Failed to update offer status')
      }
    })
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-pheezes-gray-100 p-16 text-center">
        <div className="w-16 h-16 bg-pheezes-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Package className="h-7 w-7 text-pheezes-gray-300" />
        </div>
        <h3 className="text-lg font-semibold text-pheezes-black mb-1">No Products Yet</h3>
        <p className="text-pheezes-gray-400 text-sm mb-6">
          Add your first product to start building your Pheezes catalog.
        </p>
        <Link href="/admin/products/new">
          <Button variant="primary" size="md">
            <PlusCircle className="h-4 w-4" />
            Add First Product
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-pheezes-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Offer</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => {
              const primaryImage = getPrimaryImage(product.images ?? [])
              const regularPrice = Number(product.regularPrice)
              const offerPrice = product.offerPrice ? Number(product.offerPrice) : null

              return (
                <TableRow key={product.id}>
                  {/* Product */}
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-pheezes-gray-50 flex-shrink-0">
                        {primaryImage ? (
                          <Image
                            src={primaryImage}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="h-4 w-4 text-pheezes-gray-300" />
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-pheezes-black text-sm truncate max-w-[180px]">
                          {product.name}
                        </p>
                        <p className="text-xs text-pheezes-gray-400 truncate max-w-[180px]">
                          /{product.slug}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  {/* Category */}
                  <TableCell>
                    {product.category ? (
                      <span className="text-xs bg-pheezes-gray-100 text-pheezes-gray-600 px-2 py-1 rounded-full">
                        {product.category.name}
                      </span>
                    ) : (
                      <span className="text-pheezes-gray-300 text-xs">—</span>
                    )}
                  </TableCell>

                  {/* Price */}
                  <TableCell>
                    <div>
                      {product.offerEnabled && offerPrice ? (
                        <>
                          <p className="font-semibold text-pheezes-black text-sm">
                            {formatPrice(offerPrice)} TK
                          </p>
                          <p className="text-xs text-pheezes-gray-400 line-through">
                            {formatPrice(regularPrice)} TK
                          </p>
                        </>
                      ) : (
                        <p className="font-semibold text-pheezes-black text-sm">
                          {formatPrice(regularPrice)} TK
                        </p>
                      )}
                    </div>
                  </TableCell>

                  {/* Offer Toggle */}
                  <TableCell>
                    <Switch
                      checked={product.offerEnabled}
                      onCheckedChange={(v) => handleToggleOffer(product.id, v)}
                      disabled={isPending}
                    />
                  </TableCell>

                  {/* Visible Toggle */}
                  <TableCell>
                    <Switch
                      checked={product.visible}
                      onCheckedChange={(v) => handleToggleVisibility(product.id, v)}
                      disabled={isPending}
                    />
                  </TableCell>

                  {/* Stock */}
                  <TableCell>
                    <Badge
                      variant={
                        product.availability === 'IN_STOCK'
                          ? 'success'
                          : product.availability === 'OUT_OF_STOCK'
                            ? 'error'
                            : 'warning'
                      }
                    >
                      {product.availability === 'IN_STOCK'
                        ? 'In Stock'
                        : product.availability === 'OUT_OF_STOCK'
                          ? 'Out of Stock'
                          : 'Coming Soon'}
                    </Badge>
                  </TableCell>

                  {/* Actions */}
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/products/${product.id}`}>
                        <Button variant="ghost" size="icon-sm" title="Edit product">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-red-400 hover:text-red-600 hover:bg-red-50"
                        title="Delete product"
                        onClick={() => {
                          setDeleteId(product.id)
                          setDeleteName(product.name)
                          setConfirmOpen(true)
                        }}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Product?"
        description={`Are you sure you want to delete "${deleteName}"? This will also delete all product images and videos. This action cannot be undone.`}
        confirmLabel="Delete Product"
        onConfirm={handleDelete}
        loading={!!deletingId}
      />
    </>
  )
}
