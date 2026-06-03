'use client'

import { useCallback, useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Shield,
  Loader2,
  Users,
  Mail,
  BarChart3,
  LogOut,
  Menu,
  X
} from 'lucide-react'

export default function EventAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [adminName, setAdminName] = useState('')
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Determine if it's the login page
  const isLoginPage = pathname === '/event-admin' || pathname === '/event-admin/'

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/event-admin/me')
      if (res.status === 401) {
        if (!isLoginPage) {
          router.push('/event-admin')
        }
        return
      }
      if (res.ok) {
        const data = await res.json()
        setAdminName(data.admin.name)
        if (isLoginPage) {
          router.push('/event-admin/dashboard')
        }
      }
    } catch {
      console.error('Failed to verify event admin session')
    } finally {
      setLoading(false)
    }
  }, [router, isLoginPage])

  useEffect(() => {
    checkSession()
  }, [checkSession, pathname])

  const handleSignOut = async () => {
    try {
      await fetch('/api/event-admin/logout', { method: 'POST' })
      setAdminName('')
      setMobileMenuOpen(false)
      router.push('/event-admin')
    } catch (e) {
      console.error('Failed to sign out', e)
    }
  }

  // If loading and we are on an authenticated page, show a spinner
  if (loading && !isLoginPage) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: '#888' }} />
      </div>
    )
  }

  // If we are on the login page, render children directly without header/nav
  if (isLoginPage) {
    return <>{children}</>
  }

  const navItems = [
    { label: 'Dashboard', href: '/event-admin/dashboard', icon: <Users size={16} /> },
    { label: 'Communication', href: '/event-admin/communication', icon: <Mail size={16} /> },
    { label: 'Analytics', href: '/event-admin/analytics', icon: <BarChart3 size={16} /> },
  ]

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff' }}>
      
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
          borderBottom: '1px solid #222',
          zIndex: 40,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        {/* Brand/Logo */}
        <Link href="/event-admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <Shield size={20} style={{ color: '#4ade80' }} />
          <span style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
            RALLYVERSE <span style={{ color: '#4ade80' }}>PARTNER</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
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
                  background: active ? '#1a1a1a' : 'transparent',
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

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {adminName && (
            <span style={{ color: '#4ade80', fontSize: 13, fontWeight: 600 }} className="hidden sm:inline">
              {adminName}
            </span>
          )}
          <button
            onClick={handleSignOut}
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
            className="hidden sm:flex"
          >
            <LogOut size={14} />
            Sign Out
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: 4,
            }}
            className="md:hidden"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 64,
            left: 0,
            right: 0,
            bottom: 0,
            background: '#0d0d0d',
            borderTop: '1px solid #222',
            zIndex: 35,
            padding: '24px 16px',
            flexDirection: 'column',
            gap: 16,
          }}
          className="flex md:hidden"
        >
          {adminName && (
            <div style={{ padding: '0 16px 12px', borderBottom: '1px solid #222' }}>
              <p style={{ color: '#888', fontSize: 12, margin: 0 }}>Logged in as</p>
              <p style={{ color: '#4ade80', fontSize: 16, fontWeight: 600, margin: '4px 0 0' }}>{adminName}</p>
            </div>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {navItems.map((item) => {
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '14px 16px',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 600,
                    textDecoration: 'none',
                    color: active ? '#fff' : '#888',
                    background: active ? '#1a1a1a' : 'transparent',
                    border: active ? '1px solid #222' : '1px solid transparent',
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            })}
          </div>
          <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #222' }}>
            <button
              onClick={handleSignOut}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                height: 48,
                borderRadius: 8,
                border: '1px solid rgba(255, 68, 68, 0.3)',
                background: 'rgba(255, 68, 68, 0.05)',
                color: '#ff4444',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}

      {/* Main Page Content Wrapper Container */}
      <main
        style={{
          paddingTop: 96, // 64px header + 32px spacing
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
