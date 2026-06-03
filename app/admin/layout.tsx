'use client'

import { AdminAuthProvider, useAdminAuth } from './AdminAuthContext'
import { useState } from 'react'
import { usePathname } from 'next/navigation'
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
  X
} from 'lucide-react'

// Styles
const s = {
  input: {
    width: '100%',
    height: 48,
    padding: '0 16px',
    borderRadius: 8,
    border: '1px solid #222',
    background: '#111',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color 0.2s',
  } as React.CSSProperties,
  btn: {
    height: 44,
    padding: '0 24px',
    borderRadius: 8,
    border: 'none',
    background: 'var(--rallyverse-gradient)',
    color: '#000',
    fontSize: 14,
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  } as React.CSSProperties,
  btnDisabled: (b: React.CSSProperties) => ({ ...b, opacity: 0.6, cursor: 'not-allowed' }) as React.CSSProperties,
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminAuthProvider>
      <AdminLayoutWrapper>{children}</AdminLayoutWrapper>
    </AdminAuthProvider>
  )
}

function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const { token, setToken, loading } = useAdminAuth()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password.trim() === '') {
      setError('Password cannot be empty')
      return
    }
    // Set the token
    setToken(password)
  }

  // Handle Loading State
  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
        <Loader2 size={32} className="animate-spin text-muted" style={{ color: '#888' }} />
      </div>
    )
  }

  // Handle Login State
  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', padding: 24 }}>
        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <ShieldAlert size={48} style={{ color: 'var(--accent-primary)', margin: '0 auto 16px' }} />
            <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 28, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Founder Control Panel
            </h1>
            <p style={{ color: '#666', fontSize: 13, marginTop: 6 }}>Authenticate using the system admin password</p>
          </div>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={s.input}
            autoFocus
          />
          {error && <p style={{ color: '#ff4444', fontSize: 13, margin: 0 }}>{error}</p>}
          <button type="submit" style={password ? s.btn : s.btnDisabled(s.btn)} disabled={!password}>
            Sign In
          </button>
        </form>
      </div>
    )
  }

  // Navigation Items
  const navItems = [
    { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard size={16} /> },
    { label: 'Events', href: '/admin/events', icon: <Calendar size={16} /> },
    { label: 'Registrations', href: '/admin/registrations', icon: <Users size={16} /> },
    { label: 'Communication', href: '/admin/communication', icon: <Mail size={16} /> },
    { label: 'Analytics', href: '/admin/analytics', icon: <BarChart3 size={16} /> },
  ]

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(href)
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
        {/* Brand/Logo */}
        <Link href="/admin" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: 'inherit' }}>
          <ShieldAlert size={20} style={{ color: 'var(--accent-primary)' }} />
          <span style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 20, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
            RALLYVERSE <span style={{ color: 'var(--accent-primary)' }}>ADMIN</span>
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

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={() => {
              setToken('')
              setMobileMenuOpen(false)
            }}
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
            borderTop: '1px solid #1a1a1a',
            zIndex: 35,
            padding: '24px 16px',
            flexDirection: 'column',
            gap: 16,
          }}
          className="flex md:hidden"
        >
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
          <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #1a1a1a' }}>
            <button
              onClick={() => {
                setToken('')
                setMobileMenuOpen(false)
              }}
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
