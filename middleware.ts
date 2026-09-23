import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ─── Admin Route Protection Middleware ────────────────────
// All routes under /admin/* are protected, except /admin/login.
// Unauthenticated users are redirected to the login page.
// Authenticated users trying to access /admin/login are redirected to /admin.

export default auth((req: NextRequest & { auth: any }) => {
  const { pathname } = req.nextUrl
  const isAdminRoute = pathname.startsWith('/admin')
  const isLoginPage = pathname === '/admin/login'
  const isAuthenticated = !!req.auth

  if (isAdminRoute && !isLoginPage && !isAuthenticated) {
    const loginUrl = new URL('/admin/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isLoginPage && isAuthenticated) {
    return NextResponse.redirect(new URL('/admin', req.nextUrl.origin))
  }

  return NextResponse.next()
})

export const config = {
  // Match all /admin routes
  matcher: ['/admin/:path*'],
}
