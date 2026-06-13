'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Loader2, CheckCircle, AlertCircle, Eye, EyeOff, Lock } from 'lucide-react'

function SetPasswordForm() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [checkingSession, setCheckingSession] = useState(true)
  const [sessionValid, setSessionValid] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [redirectingTo, setRedirectingTo] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const err = searchParams.get('error')
    if (err) {
      setError(decodeURIComponent(err))
    }

    const checkSession = async () => {
      const supabase = getSupabaseClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setSessionValid(true)
      }
      setCheckingSession(false)
    }
    checkSession()
  }, [searchParams])

  const getStrength = (pwd: string) => {
    let score = 0
    if (pwd.length >= 8) score++
    if (pwd.length >= 12) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[a-z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    return score
  }

  const strengthScore = getStrength(password)
  const strengthLabel = strengthScore <= 2 ? 'Weak' : strengthScore <= 4 ? 'Medium' : 'Strong'
  const strengthColor = strengthScore <= 2 ? '#ff4444' : strengthScore <= 4 ? '#facc15' : '#4ade80'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!password || !confirmPassword) {
      setError('Please fill in both fields')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }

    if (strengthScore < 3) {
      setError('Password is too weak. Use a mix of uppercase, lowercase, numbers, and symbols.')
      return
    }

    setLoading(true)
    try {
      const supabase = getSupabaseClient()
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        if (updateError.message.includes('same password')) {
          setError('New password must be different from your current password')
        } else {
          setError(updateError.message)
        }
        return
      }

      setSuccess(true)

      const adminRes = await fetch('/api/admin/me')
      if (adminRes.ok) {
        setRedirectingTo('Admin Dashboard')
        setTimeout(() => router.push('/admin'), 1500)
        return
      }

      const eventAdminRes = await fetch('/api/event-admin/me')
      if (eventAdminRes.ok) {
        setRedirectingTo('Event Admin Dashboard')
        setTimeout(() => router.push('/event-admin/dashboard'), 1500)
        return
      }

      setRedirectingTo('Login')
      setTimeout(() => router.push('/admin/login'), 1500)
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (checkingSession) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
      </div>
    )
  }

  if (!sessionValid) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <AlertCircle size={28} color="#ff4444" />
          </div>
          <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Session Required</h1>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>
            Please use the link from your invitation or password reset email to access this page.
          </p>
          <a href="/admin/login" style={{ color: 'var(--accent-primary)', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>Go to Login</a>
        </div>
      </div>
    )
  }

  if (success) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(74,222,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={28} color="#4ade80" />
          </div>
          <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Password Set Successfully!</h1>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 16, lineHeight: 1.5 }}>
            {redirectingTo ? `Redirecting to ${redirectingTo}...` : 'You can now sign in with your new password.'}
          </p>
          <Loader2 size={20} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', padding: 24 }}>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 420, display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <Lock size={40} style={{ color: 'var(--accent-primary)', margin: '0 auto 16px' }} />
          <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 24, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Set Your Password
          </h1>
          <p style={{ color: '#888', fontSize: 13, marginTop: 6 }}>
            {error ? '' : 'Create a strong password for your account'}
          </p>
        </div>

        <div>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="New Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError('') }}
            style={{ width: '100%', height: 48, padding: '0 16px', borderRadius: 8, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none' }}
            autoFocus
            required
          />
          {password && (
            <div style={{ marginTop: 8 }}>
              <div style={{ height: 4, borderRadius: 2, background: '#222', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 2, background: strengthColor, width: `${(strengthScore / 6) * 100}%`, transition: 'all 0.3s' }} />
              </div>
              <p style={{ color: strengthColor, fontSize: 11, marginTop: 4 }}>{strengthLabel}</p>
            </div>
          )}
        </div>

        <div style={{ position: 'relative' }}>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError('') }}
            style={{ width: '100%', height: 48, padding: '0 44px 0 16px', borderRadius: 8, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#666', cursor: 'pointer', padding: 4 }}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        {confirmPassword && password !== confirmPassword && (
          <p style={{ color: '#ff4444', fontSize: 12, margin: '-12px 0 0' }}>Passwords do not match</p>
        )}

        {error && (
          <div style={{ padding: 12, borderRadius: 6, background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.2)' }}>
            <p style={{ color: '#ff4444', fontSize: 13, margin: 0 }}>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !password || !confirmPassword}
          style={{
            height: 48,
            padding: '0 24px',
            borderRadius: 8,
            border: 'none',
            background: 'var(--rallyverse-gradient)',
            color: '#000',
            fontSize: 14,
            fontWeight: 700,
            cursor: loading || !password || !confirmPassword ? 'not-allowed' : 'pointer',
            opacity: loading || !password || !confirmPassword ? 0.6 : 1,
          }}
        >
          {loading ? (
            <><Loader2 size={16} className="animate-spin" style={{ marginRight: 6, verticalAlign: 'middle' }} /> Setting Password...</>
          ) : (
            'Set Password'
          )}
        </button>
      </form>
    </div>
  )
}

export default function SetPasswordPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
      </div>
    }>
      <SetPasswordForm />
    </Suspense>
  )
}
