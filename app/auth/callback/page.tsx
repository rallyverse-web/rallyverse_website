'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseClient } from '@/lib/supabase/client'
import { Loader2, AlertCircle } from 'lucide-react'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    const handleCallback = async () => {
      const supabase = getSupabaseClient()

      const hash = window.location.hash
      if (hash) {
        const hashParams = new URLSearchParams(hash.replace('#', '?'))
        const errorDesc = hashParams.get('error_description')
        const errorParam = hashParams.get('error')
        if (errorParam || errorDesc) {
          setError(errorDesc || errorParam || 'Authentication failed')
          return
        }
      }

      const errorParam = searchParams.get('error')
      const errorCode = searchParams.get('error_code')
      const errorDescription = searchParams.get('error_description')
      if (errorParam || errorCode || errorDescription) {
        const msg = errorDescription || errorParam || errorCode || 'Authentication failed'
        setError(msg)
        return
      }

      let accessToken: string | null = null
      let refreshToken: string | null = null
      let type: string | null = null

      if (hash) {
        const hashParams = new URLSearchParams(hash.replace('#', '?'))
        accessToken = hashParams.get('access_token')
        refreshToken = hashParams.get('refresh_token')
        type = hashParams.get('type')
      } else {
        accessToken = searchParams.get('access_token')
        refreshToken = searchParams.get('refresh_token')
        type = searchParams.get('type')
      }

      if (!accessToken || !refreshToken || type !== 'recovery') {
        setError('Invalid or missing recovery link')
        return
      }

      const { error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })

      if (cancelled) return

      if (sessionError) {
        if (
          sessionError.message?.toLowerCase().includes('expired') ||
          sessionError.message?.toLowerCase().includes('invalid')
        ) {
          setError('This recovery link has expired or is invalid. Please request a new one.')
        } else {
          setError(sessionError.message || 'Failed to process recovery link')
        }
        return
      }

      router.replace('/auth/set-password')
    }

    handleCallback()
    return () => { cancelled = true }
  }, [router, searchParams])

  if (error) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <AlertCircle size={28} color="#ff4444" />
          </div>
          <h1 style={{ color: '#fff', fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Link Expired or Invalid</h1>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 24, lineHeight: 1.5 }}>{error}</p>
          <a href="/admin/login" style={{ color: 'var(--accent-primary)', fontSize: 14, textDecoration: 'none', fontWeight: 600 }}>Return to Login</a>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
      <div style={{ textAlign: 'center' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
        <p style={{ color: '#888', fontSize: 14, marginTop: 16 }}>Processing your recovery link...</p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050505' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--accent-primary)' }} />
      </div>
    }>
      <CallbackHandler />
    </Suspense>
  )
}
