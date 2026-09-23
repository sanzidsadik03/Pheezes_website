'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteReview, toggleReviewVisibility } from '@/actions/reviews'
import { ConfirmDialog } from '@/components/admin/ConfirmDialog'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Edit, Trash2, Star } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { cn, formatDateShort } from '@/lib/utils'
import { toast } from 'sonner'
import type { ReviewWithImages } from '@/types'

interface ReviewsTableProps {
  reviews: ReviewWithImages[]
}

export function ReviewsTable({ reviews }: ReviewsTableProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteName, setDeleteName] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleDelete = async () => {
    if (!deleteId) return
    setDeletingId(deleteId)
    const result = await deleteReview(deleteId)
    setDeletingId(null)
    setConfirmOpen(false)
    if (result.success) {
      toast.success('Review deleted')
      router.refresh()
    } else {
      toast.error(result.error ?? 'Failed to delete')
    }
  }

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    startTransition(async () => {
      const result = await toggleReviewVisibility(id, visible)
      if (result.success) {
        toast.success(visible ? 'Review visible' : 'Review hidden')
        router.refresh()
      } else {
        toast.error('Failed to update')
      }
    })
  }

  if (reviews.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-pheezes-gray-100 p-16 text-center">
        <Star className="h-10 w-10 text-pheezes-gray-200 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-pheezes-black mb-1">No Reviews Yet</h3>
        <p className="text-pheezes-gray-400 text-sm">Add customer reviews to build social proof.</p>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-2xl border border-pheezes-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Photos</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Visible</TableHead>
              <TableHead>Order</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {review.images?.[0]?.url ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={review.images[0].url}
                          alt={review.customerName}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-pheezes-yellow/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-pheezes-yellow font-bold text-sm">
                          {review.customerName[0]}
                        </span>
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm text-pheezes-black">{review.customerName}</p>
                      {review.description && (
                        <p className="text-xs text-pheezes-gray-400 truncate max-w-[180px]">
                          {review.description}
                        </p>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  {review.rating ? (
                    <div className="flex items-center gap-1">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 fill-pheezes-yellow text-pheezes-yellow" />
                      ))}
                    </div>
                  ) : (
                    <span className="text-pheezes-gray-300 text-xs">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <span className="text-sm text-pheezes-gray-500">
                    {review.productName || '—'}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium">
                    {review.images?.length ?? 0} photo{review.images?.length !== 1 ? 's' : ''}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-pheezes-gray-500">
                    {formatDateShort(review.reviewDate)}
                  </span>
                </TableCell>
                <TableCell>
                  <Switch
                    checked={review.visible}
                    onCheckedChange={(v) => handleToggleVisibility(review.id, v)}
                    disabled={isPending}
                  />
                </TableCell>
                <TableCell>
                  <span className="text-sm text-pheezes-gray-500">{review.displayOrder}</span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-end gap-2">
                    <Link href={`/admin/reviews/${review.id}`}>
                      <Button variant="ghost" size="icon-sm">
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-red-400 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setDeleteId(review.id)
                        setDeleteName(review.customerName)
                        setConfirmOpen(true)
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete Review?"
        description={`Are you sure you want to delete the review by "${deleteName}"?`}
        confirmLabel="Delete Review"
        onConfirm={handleDelete}
        loading={!!deletingId}
      />
    </>
  )
}
