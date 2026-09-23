import { getReviews } from '@/actions/reviews'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ReviewsTable } from '@/components/admin/ReviewsTable'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle } from 'lucide-react'

export default async function AdminReviewsPage() {
  const reviews = await getReviews({})

  return (
    <div>
      <AdminHeader
        title="Reviews"
        subtitle={`${reviews.length} total reviews`}
        breadcrumbs={[{ label: 'Reviews' }]}
        actions={
          <Link href="/admin/reviews/new">
            <Button variant="primary" size="md">
              <PlusCircle className="h-4 w-4" />
              Add Review
            </Button>
          </Link>
        }
      />
      <ReviewsTable reviews={reviews} />
    </div>
  )
}
