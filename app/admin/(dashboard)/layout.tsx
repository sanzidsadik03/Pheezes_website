import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect('/admin/login')

  return (
    <div className="fixed inset-0 flex bg-pheezes-gray-50 overflow-hidden">
      {/* Sidebar */}
      <AdminSidebar userEmail={session.user?.email} />

      {/* Main Content */}
      <main className="flex-1 min-w-0 h-full overflow-y-auto overscroll-none">
        <div className="max-w-6xl mx-auto px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
