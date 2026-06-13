'use client'

import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import {
  ShieldAlert,
  Loader2,
  Calendar,
  Users,
  Mail,
  BarChart3,
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  Briefcase
} from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </AdminAuthProvider>
  )
}

function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { user, loading, logout } = useAdminAuth()
  const pathname = usePathname()
  const router = useRouter()
  const isLoginPage = pathname === '/admin/login'

  useEffect(() => {
    if (!loading && !user && !isLoginPage) {
      router.push('/admin/login')
    }
  }, [loading, user, isLoginPage, router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
        <Loader2 size={32} className="animate-spin text-muted" style={{ color: '#888' }} />
      </div>
    )
  }

  if (!user) {
    if (isLoginPage) {
      return <>{children}</>
    }
    return null
  }

  // Navigation Items
  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={16} /> },
    { label: 'Events', href: '/admin/events', icon: <Calendar size={16} /> },
    { label: 'Registrations', href: '/admin/registrations', icon: <Users size={16} /> },
    { label: 'Communication', href: '/admin/communication', icon: <Mail size={16} /> },
    { label: 'Partner Enquiries', href: '/admin/partners', icon: <Briefcase size={16} /> },
    { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={16} /> },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
  }

  const handleSignOut = async () => {
    await logout()
    router.push('/admin/login')
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: '#fff' }}>

      {/* Sticky Header Navbar */}
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: 64,
          background: 'rgba(13, 13, 13, 0.8)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #1a1a1a',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <ShieldAlert size={20} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
            RALLYVERSE <span style={{ color: 'var(--accent-primary)' }}>ADMIN</span>
          </span>
        </Link>

        <nav style={{ alignItems: 'center', gap: 8 }} className="hidden md:flex">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 16px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: 'none',
                  color: active ? '#fff' : '#888',
                  background: active ? '#111' : 'transparent',
                  border: active ? '1px solid #222' : '1px solid transparent',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#fff'
                    e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#888'
                    e.currentTarget.style.background = 'transparent'
                  }
                }}
              >
                {item.icon}
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {user?.email && (
            <span style={{ color: '#888', fontSize: 12 }} className="hidden sm:inline">
              {user.email}
            </span>
          )}
          <button
            onClick={handleSignOut}
            className="hidden sm:flex"
            style={{
              alignItems: 'center',
              gap: 6,
              height: 36,
              padding: '0 14px',
              borderRadius: 6,
              border: '1px solid #222',
              background: 'transparent',
              color: '#ccc',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#ff4444'
              e.currentTarget.style.borderColor = 'rgba(255,68,68,0.2)'
              e.currentTarget.style.background = 'rgba(255,68,68,0.02)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#ccc'
              e.currentTarget.style.borderColor = '#222'
              e.currentTarget.style.background = 'transparent'
            }}
          >
            <LogOut size={14} />
            Sign Out
          </button>

          <button
            onClick={() => {}}
            className="md:hidden"
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: 4,
            }}
            aria-label="Toggle Navigation Menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      <main
        style={{
          paddingTop: 96,
          paddingBottom: 40,
          paddingLeft: 24,
          paddingRight: 24,
          maxWidth: 1400,
          margin: '0 auto',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        {children}
      </main>
    </div>
  )
}
