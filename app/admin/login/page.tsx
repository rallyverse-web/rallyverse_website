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
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [forgotLoading, setForgotLoading] = useState(false)
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

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setForgotLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(forgotEmail.trim(), {
        redirectTo: `${window.location.origin}/auth/callback`,
      })
      if (resetError) {
        setError(resetError.message)
        return
      }
      setForgotSent(true)
    } catch {
      setError('Failed to send reset email')
    } finally {
      setForgotLoading(false)
    }
  }

  if (showForgot) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', padding: 24 }}>
        <form onSubmit={handleForgotPassword} style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 24, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Reset Password
            </h1>
            <p style={{ color: '#888', fontSize: 13, marginTop: 6 }}>
              {forgotSent ? 'Check your email for the reset link' : 'Enter your email to receive a password reset link'}
            </p>
          </div>
          {!forgotSent ? (
            <>
              <input
                type="email"
                placeholder="Email address"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 8, border: '1px solid #222', background: '#111', color: '#fff', fontSize: 14, outline: 'none' }}
                autoFocus
                required
              />
              {error && <p style={{ color: '#ff4444', fontSize: 13, margin: 0 }}>{error}</p>}
              <button
                type="submit"
                disabled={forgotLoading || !forgotEmail.trim()}
                style={{
                  height: 44, padding: '0 24px', borderRadius: 8, border: 'none',
                  background: 'var(--rallyverse-gradient)', color: '#000', fontSize: 14, fontWeight: 700,
                  cursor: forgotLoading || !forgotEmail.trim() ? 'not-allowed' : 'pointer',
                  opacity: forgotLoading || !forgotEmail.trim() ? 0.6 : 1,
                }}
              >
                {forgotLoading ? <><Loader2 size={16} className="animate-spin" style={{ marginRight: 6, verticalAlign: 'middle' }} /> Sending...</> : 'Send Reset Link'}
              </button>
              <button
                type="button"
                onClick={() => { setShowForgot(false); setError(''); setForgotSent(false) }}
                style={{ background: 'none', border: 'none', color: '#666', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Back to Sign In
              </button>
            </>
          ) : (
            <div style={{ textAlign: 'center' }}>
              <p style={{ color: '#4ade80', fontSize: 14, marginBottom: 16 }}>Password reset email sent to {forgotEmail}</p>
              <button
                type="button"
                onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail('') }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}
              >
                Back to Sign In
              </button>
            </div>
          )}
        </form>
      </div>
    )
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -12 }}>
          <button
            type="button"
            onClick={() => { setShowForgot(true); setForgotEmail(email) }}
            style={{ background: 'none', border: 'none', color: '#666', fontSize: 12, cursor: 'pointer', textDecoration: 'underline', padding: 0 }}
          >
            Forgot Password?
          </button>
        </div>
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
