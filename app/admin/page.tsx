'use client'

import { useCallback, useEffect, useState } from 'react'
import { CheckCircle, Clock, Loader2, Mail, RefreshCw, ShieldAlert, Users, Wallet } from 'lucide-react'

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 48,
  padding: '0 16px',
  borderRadius: 6,
  border: '1px solid #333',
  background: '#111',
  color: '#fff',
  fontSize: 14,
  outline: 'none',
}
const buttonStyle: React.CSSProperties = {
  height: 48,
  padding: '0 24px',
  borderRadius: 6,
  border: 'none',
  background: 'var(--rallyverse-gradient)',
  color: '#fff',
  fontSize: 14,
  fontWeight: 700,
  cursor: 'pointer',
}
const disabledButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  opacity: 0.6,
  cursor: 'not-allowed',
}
const cardStyle: React.CSSProperties = {
  padding: 24,
  borderRadius: 8,
  border: '1px solid #222',
  background: '#111',
}

type Metrics = {
  totalRegistrations: number
  pendingPayments: number
  verifiedRegistrations: number
  confirmationsSent: number
}

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [authError, setAuthError] = useState('')
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [metricsLoading, setMetricsLoading] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ message: string; sent?: number; failed?: number; details?: string[] } | string>('')
  const [lastSync, setLastSync] = useState('')

  const emailsReady = metrics
    ? metrics.verifiedRegistrations - metrics.confirmationsSent
    : 0

  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${token}`,
  }), [token])

  const fetchMetrics = useCallback(async () => {
    setMetricsLoading(true)
    setAuthError('')
    try {
      const res = await fetch('/api/admin/metrics', { headers: authHeaders() })
      if (res.status === 401) {
        setToken('')
        setAuthError('Invalid password')
        return
      }
      if (!res.ok) {
        setAuthError('Failed to load metrics')
        return
      }
      const data = await res.json()
      setMetrics(data)
      setLastSync(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }))
    } catch {
      setAuthError('Failed to connect to server')
    } finally {
      setMetricsLoading(false)
    }
  }, [authHeaders])

  useEffect(() => {
    if (token) fetchMetrics()
  }, [token, fetchMetrics])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setToken(password)
  }

  const handleSendConfirmations = async () => {
    setSending(true)
    setSendResult('')
    try {
      const res = await fetch('/api/admin/send-confirmations', {
        method: 'POST',
        headers: authHeaders(),
      })
      if (res.status === 401) {
        setSendResult('Session expired. Please re-authenticate.')
        setToken('')
        return
      }
      const data = await res.json()
      if (!res.ok) {
        setSendResult(data.error || 'Failed to send confirmations')
        return
      }
      setSendResult({
        message: data.message,
        sent: data.sent,
        failed: data.failed,
        details: data.details,
      })
      fetchMetrics()
    } catch {
      setSendResult('Failed to connect to server')
    } finally {
      setSending(false)
    }
  }

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: 24 }}>
        <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <ShieldAlert size={40} style={{ color: '#e5e5e5', margin: '0 auto 12px' }} />
            <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 24, fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>Admin Access</h1>
          </div>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={inputStyle}
            autoFocus
          />
          {authError && <p style={{ color: '#ff4444', fontSize: 13 }}>{authError}</p>}
          <button type="submit" style={password ? buttonStyle : disabledButtonStyle} disabled={!password}>
            Sign In
          </button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: 32 }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 28, fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {lastSync && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#666', fontSize: 12 }}>
                <Clock size={12} /> Last sync: {lastSync}
              </span>
            )}
            <button onClick={fetchMetrics} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }} title="Refresh metrics">
              <RefreshCw size={16} className={metricsLoading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => { setToken(''); setMetrics(null); setSendResult('') }} style={{ ...buttonStyle, background: 'transparent', border: '1px solid #333', fontSize: 13 }}>
              Sign Out
            </button>
          </div>
        </div>

        {metricsLoading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', fontSize: 14, marginBottom: 24 }}>
            <Loader2 size={16} className="animate-spin" /> Loading metrics...
          </div>
        )}

        {authError && (
          <div style={{ padding: 12, borderRadius: 6, background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#ff4444', fontSize: 13, marginBottom: 24 }}>
            {authError}
          </div>
        )}

        {metrics && (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 16, marginBottom: 32 }}>
              <div style={cardStyle}>
                <Users size={20} style={{ color: '#e5e5e5', marginBottom: 8 }} />
                <p style={{ color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Total Registrations</p>
                <p style={{ color: '#fff', fontSize: 32, fontWeight: 700 }}>{metrics.totalRegistrations}</p>
              </div>
              <div style={cardStyle}>
                <Wallet size={20} style={{ color: '#e5e5e5', marginBottom: 8 }} />
                <p style={{ color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Pending Payments</p>
                <p style={{ color: '#fff', fontSize: 32, fontWeight: 700 }}>{metrics.pendingPayments}</p>
              </div>
              <div style={cardStyle}>
                <CheckCircle size={20} style={{ color: '#e5e5e5', marginBottom: 8 }} />
                <p style={{ color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Verified Registrations</p>
                <p style={{ color: '#fff', fontSize: 32, fontWeight: 700 }}>{metrics.verifiedRegistrations}</p>
              </div>
              <div style={{
                ...cardStyle,
                borderColor: emailsReady > 0 ? 'rgba(74, 222, 128, 0.3)' : '#222',
              }}>
                <Mail size={20} style={{ color: emailsReady > 0 ? '#4ade80' : '#e5e5e5', marginBottom: 8 }} />
                <p style={{ color: '#888', fontSize: 12, textTransform: 'uppercase', letterSpacing: 1 }}>Confirmations Sent</p>
                <p style={{ color: '#fff', fontSize: 32, fontWeight: 700 }}>{metrics.confirmationsSent}</p>
                {emailsReady > 0 && (
                  <p style={{ color: '#4ade80', fontSize: 13, marginTop: 4 }}>
                    {emailsReady} ready to send
                  </p>
                )}
              </div>
            </div>

            <div style={cardStyle}>
              <h2 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 8 }}>Send Confirmation Emails</h2>
              <p style={{ color: '#888', fontSize: 13, marginBottom: 12 }}>
                Sends confirmation emails to all registrations with <strong style={{ color: '#fff' }}>Verified</strong> status and <strong style={{ color: '#fff' }}>Confirmation Sent = No</strong>.
              </p>

              {typeof sendResult !== 'string' && sendResult.message && (
                <div style={{
                  marginBottom: 16,
                  padding: 16,
                  borderRadius: 6,
                  background: sendResult.failed === 0
                    ? 'rgba(74, 222, 128, 0.1)'
                    : sendResult.sent && sendResult.failed
                      ? 'rgba(250, 204, 21, 0.1)'
                      : 'rgba(255, 68, 68, 0.1)',
                  border: `1px solid ${
                    sendResult.failed === 0
                      ? 'rgba(74, 222, 128, 0.3)'
                      : sendResult.sent && sendResult.failed
                        ? 'rgba(250, 204, 21, 0.3)'
                        : 'rgba(255, 68, 68, 0.3)'
                  }`,
                }}>
                  <p style={{
                    color: sendResult.failed === 0 ? '#4ade80' : '#facc15',
                    fontSize: 14,
                    fontWeight: 600,
                  }}>
                    Emails Sent: {sendResult.sent} | Failed: {sendResult.failed}
                  </p>
                  {sendResult.details && sendResult.details.length > 0 && (
                    <div style={{ marginTop: 8, maxHeight: 200, overflowY: 'auto' }}>
                      {sendResult.details.map((d, i) => (
                        <p key={i} style={{
                          color: d.includes('✗') ? '#ff4444' : '#888',
                          fontSize: 12,
                          fontFamily: 'monospace',
                          padding: '2px 0',
                        }}>{d}</p>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {typeof sendResult === 'string' && sendResult && (
                <p style={{
                  marginBottom: 16,
                  padding: 12,
                  borderRadius: 6,
                  fontSize: 13,
                  color: sendResult.includes('failed: 0') ? '#4ade80' : sendResult.includes('No pending') ? '#888' : '#ff4444',
                  background: sendResult.includes('failed: 0') ? 'rgba(74, 222, 128, 0.1)' : 'transparent',
                  border: sendResult.includes('failed: 0') ? '1px solid rgba(74, 222, 128, 0.3)' : 'none',
                }}>
                  {sendResult}
                </p>
              )}

              {emailsReady > 0 && typeof sendResult !== 'object' && (
                <p style={{ color: '#facc15', fontSize: 13, marginBottom: 12 }}>
                  {emailsReady} registration{emailsReady > 1 ? 's' : ''} ready for confirmation.
                </p>
              )}

              <button
                onClick={handleSendConfirmations}
                disabled={sending || emailsReady === 0}
                style={{
                  ...(sending || emailsReady === 0 ? disabledButtonStyle : buttonStyle),
                }}
              >
                {sending ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Loader2 size={16} className="animate-spin" /> Sending...
                  </span>
                ) : (
                  `Send Confirmation Emails${emailsReady > 0 ? ` (${emailsReady})` : ''}`
                )}
              </button>
              {emailsReady === 0 && metrics.confirmationsSent > 0 && (
                <p style={{ marginTop: 8, color: '#666', fontSize: 12 }}>
                  All verified registrations have been confirmed.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
