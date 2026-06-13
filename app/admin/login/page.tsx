'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ShieldAlert, Loader2 } from 'lucide-react'
import { getSupabaseClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
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
      const supabase = getSupabaseClient()
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })
      if (signInError) {
        setError(signInError.message)
        return
      }
      router.push('/admin')
    } catch {
      setError('Failed to connect to server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', padding: 24 }}>
      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <ShieldAlert size={48} style={{ color: 'var(--accent-primary)', margin: '0 auto 16px' }} />
          <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 28, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Founder Control Panel
          </h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 6 }}>Sign in with your admin credentials</p>
        </div>
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 8, border: '1px solid #222', background: '#111', color: '#fff', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
          autoFocus
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 8, border: '1px solid #222', background: '#111', color: '#fff', fontSize: 14, outline: 'none', transition: 'border-color 0.2s' }}
          required
        />
        {error && <p style={{ color: '#ff4444', fontSize: 13, margin: 0 }}>{error}</p>}
        <button
          type="submit"
          disabled={loading || !email.trim() || !password}
          style={{
            height: 44,
            padding: '0 24px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--rallyverse-gradient)',
            color: '#000',
            fontSize: 14,
            fontWeight: 700,
            cursor: loading || !email.trim() || !password ? 'not-allowed' : 'pointer',
            opacity: loading || !email.trim() || !password ? 0.6 : 1,
          }}
        >
          {loading ? <><Loader2 size={16} className="animate-spin" style={{ marginRight: 6, verticalAlign: 'middle' }} /> Signing in...</> : 'Sign In'}
        </button>
      </form>
    </div>
  )
}
