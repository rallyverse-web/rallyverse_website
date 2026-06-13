'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Shield, Loader2 } from 'lucide-react'

export default function EventAdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/api/event-admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      })
      if (res.status === 401 || res.status === 403) {
        const data = await res.json()
        setError(data.error || 'Invalid credentials')
        return
      }
      if (!res.ok) {
        setError('Login failed')
        return
      }
      router.push('/event-admin/dashboard')
    } catch {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  const s = {
    input: { width: '100%', height: 48, padding: '0 16px', borderRadius: 6, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none' } as React.CSSProperties,
    btn: { height: 44, padding: '0 24px', borderRadius: 6, border: 'none', background: 'var(--rallyverse-gradient)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%' } as React.CSSProperties,
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: 24 }}>
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <Shield size={40} style={{ color: '#4ade80', margin: '0 auto 12px' }} />
          <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 24, fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>Event Admin</h1>
          <p style={{ color: '#888', fontSize: 13, marginTop: 4 }}>Sign in with your credentials to manage registrations.</p>
        </div>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={s.input}
          autoFocus
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={s.input}
          required
        />
        {error && <p style={{ color: '#ff4444', fontSize: 13 }}>{error}</p>}
        <button type="submit" disabled={loading || !email.trim() || !password} style={{ ...s.btn, ...((loading || !email.trim() || !password) ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
          {loading ? <><Loader2 size={16} className="animate-spin" style={{ marginRight: 6, verticalAlign: 'middle' }} />Signing in...</> : 'Sign In'}
        </button>
        <a href="/admin/login" style={{ color: '#555', fontSize: 12, textAlign: 'center', textDecoration: 'none', marginTop: 8 }}>Founder? Sign in here &rarr;</a>
      </form>
    </div>
  )
}
