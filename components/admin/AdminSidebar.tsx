'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Logo } from '@/components/ui/Logo'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Star, Settings, ChevronLeft, ChevronRight,
  PlusCircle, Tag, Truck, Share2, MessageCircle, Globe, LogOut,
  ShoppingBag, Home, Menu
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { signOut } from 'next-auth/react'

// ─── Navigation Config ────────────────────────────────────

const navItems = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'Products',
    icon: Package,
    children: [
      { label: 'All Products', href: '/admin/products', icon: ShoppingBag },
      { label: 'Add Product', href: '/admin/products/new', icon: PlusCircle },
    ],
  },
  {
    label: 'Reviews',
    icon: Star,
    children: [
      { label: 'All Reviews', href: '/admin/reviews', icon: Star },
      { label: 'Add Review', href: '/admin/reviews/new', icon: PlusCircle },
    ],
  },
  {
    label: 'Website',
    icon: Globe,
    children: [
      { label: 'Homepage', href: '/admin/settings/homepage', icon: Home },
      { label: 'Delivery', href: '/admin/settings/delivery', icon: Truck },
      { label: 'Social Media', href: '/admin/settings/social', icon: Share2 },
      { label: 'Messenger', href: '/admin/settings/messenger', icon: MessageCircle },
    ],
  },
  {
    label: 'General Settings',
    href: '/admin/settings/general',
    icon: Settings,
  },
]

interface AdminSidebarProps {
  userEmail?: string | null
}

export function AdminSidebar({ userEmail }: AdminSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedSections, setExpandedSections] = useState<string[]>(['Products', 'Reviews', 'Website'])

  const toggleSection = (label: string) => {
    setExpandedSections((prev) =>
      prev.includes(label) ? prev.filter((s) => s !== label) : [...prev, label]
    )
  }

  const isActive = (href: string, exact = false) => {
    if (exact) return pathname === href
    return pathname.startsWith(href)
  }

  const isParentActive = (children?: Array<{ href: string }>) => {
    return children?.some((child) => pathname.startsWith(child.href)) ?? false
  }

  return (
    <aside
      className={cn(
        'h-screen bg-pheezes-black border-r border-white/10 flex flex-col transition-all duration-300 flex-shrink-0 sticky top-0',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo + Collapse Toggle */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 min-h-[64px]">
        {!collapsed && (
          <div className="block w-full">
            <Logo lightText href="/admin" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            'w-8 h-8 rounded-lg text-white/50 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors flex-shrink-0',
            collapsed && 'mx-auto'
          )}
          title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 no-scrollbar">
        {navItems.map((item) => {
          if (item.children) {
            const parentActive = isParentActive(item.children)
            const isExpanded = expandedSections.includes(item.label)
            const Icon = item.icon

            return (
              <div key={item.label}>
                <button
                  onClick={() => !collapsed && toggleSection(item.label)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                    parentActive
                      ? 'text-pheezes-yellow bg-pheezes-yellow/10'
                      : 'text-white/60 hover:text-white hover:bg-white/8',
                    collapsed && 'justify-center'
                  )}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronRight
                        className={cn(
                          'h-3.5 w-3.5 transition-transform duration-200',
                          isExpanded && 'rotate-90'
                        )}
                      />
                    </>
                  )}
                </button>

                {/* Sub-items */}
                {!collapsed && isExpanded && (
                  <div className="ml-4 mt-1 space-y-0.5 border-l border-white/10 pl-3">
                    {item.children.map((child) => {
                      const ChildIcon = child.icon
                      const active = isActive(child.href)
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          className={cn(
                            'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all',
                            active
                              ? 'bg-pheezes-yellow text-pheezes-black font-semibold'
                              : 'text-white/50 hover:text-white hover:bg-white/8'
                          )}
                        >
                          <ChildIcon className="h-3.5 w-3.5 flex-shrink-0" />
                          {child.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          const Icon = item.icon
          const active = item.exact ? isActive(item.href!, true) : isActive(item.href!)

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active
                  ? 'bg-pheezes-yellow text-pheezes-black font-semibold'
                  : 'text-white/60 hover:text-white hover:bg-white/8',
                collapsed && 'justify-center'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              {!collapsed && item.label}
            </Link>
          )
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-3 border-t border-white/10">
        {!collapsed && userEmail && (
          <div className="px-3 py-2 mb-2">
            <p className="text-white/30 text-xs truncate">{userEmail}</p>
          </div>
        )}
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className={cn(
            'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all',
            collapsed && 'justify-center'
          )}
          title="Sign out"
        >
          <LogOut className="h-4 w-4 flex-shrink-0" />
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </aside>
  )
}
