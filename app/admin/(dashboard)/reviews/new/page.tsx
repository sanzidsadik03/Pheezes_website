import { AdminHeader } from '@/components/admin/AdminHeader'
import { ReviewForm } from '@/components/admin/ReviewForm'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default async function NewReviewPage() {
  return (
    <div>
      <AdminHeader
        title="Add Review"
        subtitle="Add a customer review to display on the website."
        breadcrumbs={[{ label: 'Reviews', href: '/admin/reviews' }, { label: 'Add Review' }]}
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
        <div className="mb-4 p-4 bg-pheezes-yellow/10 border border-pheezes-yellow/30 rounded-xl">
          <p className="text-sm text-pheezes-gray-700">
            <strong>💡 Tip:</strong> After creating the review, you can add customer photos from the edit page.
          </p>
        </div>
        <ReviewForm mode="create" />
      </div>
    </div>
  )
}
