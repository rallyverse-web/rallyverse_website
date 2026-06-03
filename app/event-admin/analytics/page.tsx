'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Loader2, RefreshCw, ArrowLeft, CheckCircle, XCircle, Clock, Users, Mail, MessageCircle, Eye } from 'lucide-react'

const s = {
  btn: { height: 40, padding: '0 20px', borderRadius: 6, border: 'none', background: 'var(--rallyverse-gradient)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' } as React.CSSProperties,
  btnSm: { height: 32, padding: '0 12px', borderRadius: 4, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const } as React.CSSProperties,
  card: { padding: 20, borderRadius: 8, border: '1px solid #222', background: '#111' } as React.CSSProperties,
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string | number; color?: string }) {
  return (
    <div style={{ padding: 16, borderRadius: 8, border: '1px solid #222', background: '#111' }}>
      <div style={{ color: color || '#e5e5e5', marginBottom: 6 }}>{icon}</div>
      <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#fff', fontSize: 26, fontWeight: 700 }}>{value}</p>
    </div>
  )
}

function MiniChart({ data, color }: { data: { date: string; count: number }[]; color: string }) {
  if (data.length === 0) return <div style={{ color: '#666', fontSize: 12, padding: 20, textAlign: 'center' }}>No data</div>
  const max = Math.max(...data.map(d => d.count), 1)
  const barW = Math.max(4, (580 - 2 * data.length) / data.length)

  return (
    <svg width={600} height={100} style={{ width: '100%', maxWidth: 600, height: 100 }}>
      {data.map((d, i) => {
        const barH = (d.count / max) * 90
        return (
          <rect key={d.date} x={i * (barW + 2)} y={100 - 10 - barH} width={barW} height={barH} fill={color} rx={2} opacity={0.8}>
            <title>{d.date}: {d.count}</title>
          </rect>
        )
      })}
    </svg>
  )
}

interface AnalyticsData {
  event_id: string
  event_name: string
  views: number
  registration_page_views: number
  registrations: number
  approved: number
  pending: number
  rejected: number
  conversion_rate: number
  approval_rate: number
  whatsapp_contact_clicks: number
  whatsapp_group_clicks: number
  emails_sent: number
  emails_failed: number
}

interface TrendsData {
  registrations_over_time: { date: string; count: number }[]
  approvals_over_time: { date: string; count: number }[]
  emails_over_time: { date: string; count: number }[]
  views_over_time: { date: string; count: number }[]
}

export default function EventAdminAnalyticsPage() {
  const router = useRouter()
  const [adminName, setAdminName] = useState('')
  const [eventId, setEventId] = useState('')
  const [loading, setLoading] = useState(true)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [trends, setTrends] = useState<TrendsData | null>(null)

  const fetchData = useCallback(async () => {
    if (!eventId) return
    setLoading(true)
    try {
      const res = await fetch(`/api/event-admin/analytics/${eventId}`)
      if (res.status === 401) { router.push('/event-admin'); return }
      if (!res.ok) return
      const d = await res.json()
      setAnalytics(d.analytics)
      setTrends(d.trends)
    } catch {}
    finally { setLoading(false) }
  }, [eventId, router])

  useEffect(() => {
    (async () => {
      try {
        const meRes = await fetch('/api/event-admin/me')
        if (meRes.status === 401) { router.push('/event-admin'); return }
        if (!meRes.ok) return
        const meData = await meRes.json()
        setAdminName(meData.admin.name)
        setEventId(meData.admin.event_id)
      } catch {} finally { setLoading(false) }
    })()
  }, [router])

  useEffect(() => { if (eventId) fetchData() }, [eventId, fetchData])

  const handleSignOut = async () => {
    await fetch('/api/event-admin/logout', { method: 'POST' })
    router.push('/event-admin')
  }

  if (loading && !analytics) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 40 }}>
        <Loader2 size={24} className="animate-spin" style={{ color: '#888' }} />
      </div>
    )
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 24, fontWeight: 700, color: '#fff', textTransform: 'uppercase', margin: 0 }}>Analytics</h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Track traffic, conversion rates, and email performance</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={fetchData} style={{ ...s.btnSm, background: '#88888820', color: '#ccc', display: 'flex', alignItems: 'center', gap: 4 }}>
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

        {!analytics ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#666', fontSize: 14 }}>No analytics data available</div>
        ) : (
          <>
            {/* Key Metrics */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 32 }}>
              <MetricCard icon={<Eye size={18} />} label="Event Views" value={analytics.views} />
              <MetricCard icon={<Users size={18} />} label="Registrations" value={analytics.registrations} />
              <MetricCard icon={<CheckCircle size={18} />} label="Approved" value={analytics.approved} color="#4ade80" />
              <MetricCard icon={<XCircle size={18} />} label="Rejected" value={analytics.rejected} color="#ff4444" />
            </div>

            {/* Rates & Details */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12, marginBottom: 32 }}>
              <div style={s.card}>
                <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>Conversion Rate</p>
                <p style={{ color: '#facc15', fontSize: 32, fontWeight: 700 }}>{analytics.conversion_rate}%</p>
                <p style={{ color: '#666', fontSize: 12 }}>{analytics.registrations} / {analytics.views} views</p>
              </div>
              <div style={s.card}>
                <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>Approval Rate</p>
                <p style={{ color: '#4ade80', fontSize: 32, fontWeight: 700 }}>{analytics.approval_rate}%</p>
                <p style={{ color: '#666', fontSize: 12 }}>{analytics.approved} / {analytics.registrations} regs</p>
              </div>
              <div style={s.card}>
                <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>WhatsApp Engagement</p>
                <p style={{ color: '#25d366', fontSize: 32, fontWeight: 700 }}>{analytics.whatsapp_contact_clicks + analytics.whatsapp_group_clicks}</p>
                <p style={{ color: '#666', fontSize: 12 }}>{analytics.whatsapp_contact_clicks} contact · {analytics.whatsapp_group_clicks} group</p>
              </div>
              <div style={s.card}>
                <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', marginBottom: 8 }}>Email Activity</p>
                <p style={{ color: '#a78bfa', fontSize: 32, fontWeight: 700 }}>{analytics.emails_sent}</p>
                <p style={{ color: '#666', fontSize: 12 }}>{analytics.emails_failed > 0 ? `${analytics.emails_failed} failed` : 'All sent'}</p>
              </div>
            </div>

            {/* Trend Charts */}
            {trends && (
              <>
                <h2 style={{ color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Trends (Last 30 Days)</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
                  <div style={s.card}>
                    <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>Registrations</p>
                    <MiniChart data={trends.registrations_over_time} color="#4ade80" />
                  </div>
                  <div style={s.card}>
                    <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>Approvals</p>
                    <MiniChart data={trends.approvals_over_time} color="#22d3ee" />
                  </div>
                  <div style={s.card}>
                    <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>Emails Sent</p>
                    <MiniChart data={trends.emails_over_time} color="#a78bfa" />
                  </div>
                  <div style={s.card}>
                    <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>Event Views</p>
                    <MiniChart data={trends.views_over_time} color="#facc15" />
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
  )
}
