import Link from 'next/link'
import { ExternalLink, Bell } from 'lucide-react'

interface AdminHeaderProps {
  title: string
  subtitle?: string
  breadcrumbs?: Array<{ label: string; href?: string }>
  actions?: React.ReactNode
}

export function AdminHeader({ title, subtitle, breadcrumbs, actions }: AdminHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
      <div>
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 text-xs text-pheezes-gray-400 mb-2">
            <Link href="/admin" className="hover:text-pheezes-black transition-colors">
              Admin
            </Link>
            {breadcrumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <span className="text-pheezes-gray-300">›</span>
                {crumb.href ? (
                  <Link href={crumb.href} className="hover:text-pheezes-black transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-pheezes-gray-600">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}

        {/* Title */}
        <h1 className="text-2xl font-bold text-pheezes-black">{title}</h1>
        {subtitle && <p className="text-sm text-pheezes-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Right-side actions */}
      <div className="flex items-center gap-3">
        {actions}
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 text-xs text-pheezes-gray-400 hover:text-pheezes-black transition-colors border border-pheezes-gray-200 px-3 py-2 rounded-lg hover:border-pheezes-gray-300"
          title="View live website"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          Live Site
        </a>
      </div>
    </div>
  )
}
