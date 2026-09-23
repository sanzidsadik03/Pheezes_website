import { notFound } from 'next/navigation'
import { getReviewById } from '@/actions/reviews'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { ReviewForm } from '@/components/admin/ReviewForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface EditReviewPageProps {
  params: Promise<{ id: string }>
}

export default async function EditReviewPage({ params }: EditReviewPageProps) {
  const { id } = await params
  const review = await getReviewById(id)

  if (!review) notFound()

  return (
    <div>
      <AdminHeader
        title={`Edit Review: ${review.customerName}`}
        breadcrumbs={[
          { label: 'Reviews', href: '/admin/reviews' },
          { label: review.customerName },
        ]}
        actions={
          <Link href="/admin/reviews">
            <Button variant="ghost" size="md">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
        }
      />
      <div className="bg-white rounded-2xl border border-pheezes-gray-100 p-6">
        <ReviewForm review={review} mode="edit" />
      </div>
    </div>
  )
}
