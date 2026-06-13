'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAdminAuth } from '../AdminAuthContext'
import { BarChart3, ShieldAlert, Loader2, RefreshCw, ArrowLeft, Calendar, CheckCircle, XCircle, Clock, Users, Mail, MessageCircle } from 'lucide-react'

const s = {
  input: { width: '100%', height: 48, padding: '0 16px', borderRadius: 6, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none' } as React.CSSProperties,
  btn: { height: 40, padding: '0 20px', borderRadius: 6, border: 'none', background: 'var(--rallyverse-gradient)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' } as React.CSSProperties,
  btnSm: { height: 32, padding: '0 12px', borderRadius: 4, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const } as React.CSSProperties,
  card: { padding: 20, borderRadius: 8, border: '1px solid #222', background: '#111' } as React.CSSProperties,
  label: { display: 'block', color: '#888', fontSize: 12, marginBottom: 4 },
  select: { height: 36, padding: '0 10px', borderRadius: 4, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 13, outline: 'none', cursor: 'pointer' } as React.CSSProperties,
}

function MetricCard({ icon, label, value, color, valueColor }: { icon: React.ReactNode; label: string; value: string | number; color?: string; valueColor?: string }) {
  return (
    <div style={{ padding: 16, borderRadius: 8, border: '1px solid #222', background: '#111' }}>
      <div style={{ color: color || '#e5e5e5', marginBottom: 6 }}>{icon}</div>
      <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</p>
      <p style={{ color: valueColor || '#fff', fontSize: 26, fontWeight: 700 }}>{value}</p>
    </div>
  )
}

function MiniChart({ data, color }: { data: { date: string; count: number }[]; color: string }) {
  if (data.length === 0) return <div style={{ color: '#666', fontSize: 12, padding: 20, textAlign: 'center' }}>No data</div>
  const max = Math.max(...data.map(d => d.count), 1)
  const w = 600
  const h = 120
  const pad = 2
  const barW = Math.max(4, (w - pad * data.length) / data.length)

  return (
    <svg width={w} height={h} style={{ width: '100%', maxWidth: w, height: h }}>
      {data.map((d, i) => {
        const barH = (d.count / max) * (h - 10)
        return (
          <rect key={d.date} x={i * (barW + pad)} y={h - 10 - barH} width={barW} height={barH} fill={color} rx={2} opacity={0.8}>
            <title>{d.date}: {d.count}</title>
          </rect>
        )
      })}
    </svg>
  )
}

interface Overview { total_events: number; total_registrations: number; approved_registrations: number; pending_registrations: number; rejected_registrations: number; emails_sent: number; emails_failed: number; whatsapp_contact_clicks: number; whatsapp_group_clicks: number }

interface EventAnalyticsItem { event_id: string; event_name: string; event_slug: string; views: number; registrations: number; approved: number; conversion_rate: number; approval_rate: number; whatsapp_contact_clicks: number; whatsapp_group_clicks: number; emails_sent: number }

interface Trends { registrations_over_time: { date: string; count: number }[]; approvals_over_time: { date: string; count: number }[]; emails_over_time: { date: string; count: number }[]; views_over_time: { date: string; count: number }[] }

export default function AdminAnalyticsPage() {
  const { user, logout } = useAdminAuth()
  const [loading, setLoading] = useState(false)
  const [overview, setOverview] = useState<Overview | null>(null)
  const [events, setEvents] = useState<EventAnalyticsItem[]>([])
  const [trends, setTrends] = useState<Trends | null>(null)
  const [sortBy, setSortBy] = useState<'registrations' | 'conversion_rate' | 'views'>('registrations')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const fetchData = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/analytics')
      if (res.status === 401) { logout(); return }
      if (!res.ok) { notify('error', 'Failed to load'); return }
      const d = await res.json()
      setOverview(d.overview)
      setEvents(d.events || [])
      setTrends(d.trends)
    } catch { notify('error', 'Failed to load analytics') }
    finally { setLoading(false) }
  }, [logout, user])

  useEffect(() => { if (user) fetchData() }, [user, fetchData])

  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'views') return b.views - a.views
    if (sortBy === 'conversion_rate') return b.conversion_rate - a.conversion_rate
    return b.registrations - a.registrations
  })

  return (
    <div>
      {notification && (
        <div style={{
          padding: '10px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, marginBottom: 16,
          background: notification.type === 'success' ? 'rgba(74,222,128,0.12)' : 'rgba(255,68,68,0.12)',
          border: `1px solid ${notification.type === 'success' ? 'rgba(74,222,128,0.3)' : 'rgba(255,68,68,0.3)'}`,
          color: notification.type === 'success' ? '#4ade80' : '#ff4444',
        }}>
          {notification.message}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 28, fontWeight: 700, color: '#fff', textTransform: 'uppercase', margin: 0 }}>Analytics</h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Platform traffic, registrations and email logs metrics</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={fetchData} style={{ ...s.btnSm, background: '#88888820', color: '#ccc', display: 'flex', alignItems: 'center', gap: 4 }}>
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      </div>

        {loading && !overview ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', fontSize: 14, padding: 40, justifyContent: 'center' }}>
            <Loader2 size={16} className="animate-spin" /> Loading analytics...
          </div>
        ) : (
          <>
            {/* Platform Overview */}
            {overview && (
              <>
                <h2 style={{ color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Platform Overview</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12, marginBottom: 32 }}>
                  <MetricCard icon={<BarChart3 size={18} />} label="Total Events" value={overview.total_events} />
                  <MetricCard icon={<Users size={18} />} label="Total Registrations" value={overview.total_registrations} />
                  <MetricCard icon={<CheckCircle size={18} />} label="Approved" value={overview.approved_registrations} color="#4ade80" valueColor="#4ade80" />
                  <MetricCard icon={<Clock size={18} />} label="Pending" value={overview.pending_registrations} color="#facc15" valueColor="#facc15" />
                  <MetricCard icon={<XCircle size={18} />} label="Rejected" value={overview.rejected_registrations} color="#ff4444" valueColor="#ff4444" />
                  <MetricCard icon={<Mail size={18} />} label="Emails Sent" value={overview.emails_sent} color="#4ade80" />
                  <Mail size={18} style={{ display: 'none' }} />
                  <MetricCard icon={<MessageCircle size={18} />} label="WhatsApp Clicks" value={overview.whatsapp_contact_clicks + overview.whatsapp_group_clicks} color="#25d366" valueColor="#25d366" />
                </div>
              </>
            )}

            {/* Trend Charts */}
            {trends && (
              <>
                <h2 style={{ color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Trends (Last 30 Days)</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 32 }}>
                  <div style={s.card}>
                    <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>Registrations Over Time</p>
                    <MiniChart data={trends.registrations_over_time} color="#4ade80" />
                  </div>
                  <div style={s.card}>
                    <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>Approvals Over Time</p>
                    <MiniChart data={trends.approvals_over_time} color="#22d3ee" />
                  </div>
                  <div style={s.card}>
                    <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>Emails Over Time</p>
                    <MiniChart data={trends.emails_over_time} color="#a78bfa" />
                  </div>
                  <div style={s.card}>
                    <p style={{ color: '#888', fontSize: 12, marginBottom: 8 }}>Event Views Over Time</p>
                    <MiniChart data={trends.views_over_time} color="#facc15" />
                  </div>
                </div>
              </>
            )}

            {/* Event Performance */}
            <h2 style={{ color: '#888', fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Event Performance</h2>
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <label style={{ ...s.label, marginBottom: 0, alignSelf: 'center' }}>Sort by:</label>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as typeof sortBy)} style={s.select}>
                <option value="registrations">Registrations</option>
                <option value="conversion_rate">Conversion Rate</option>
                <option value="views">Views</option>
              </select>
            </div>

            {sortedEvents.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#666', fontSize: 14 }}>No event data available</div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #222', background: '#111' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                  <thead>
                    <tr>
                      {['Event', 'Views', 'Reg Page Views', 'Registrations', 'Approved', 'Rejected', 'Conversion', 'Approval Rate', 'WhatsApp Clicks', 'Group Clicks', 'Emails Sent'].map(h => (
                        <th key={h} style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {sortedEvents.map(ev => (
                      <tr key={ev.event_id} style={{ transition: 'background 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '8px 10px', fontSize: 13, color: '#fff', fontWeight: 600, borderBottom: '1px solid #1a1a1a' }}>{ev.event_name}</td>
                        <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a' }}>{ev.views}</td>
                        <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a' }}>{(ev as { registration_page_views?: number }).registration_page_views ?? '—'}</td>
                        <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a' }}>{ev.registrations}</td>
                        <td style={{ padding: '8px 10px', fontSize: 13, color: '#4ade80', borderBottom: '1px solid #1a1a1a' }}>{ev.approved}</td>
                        <td style={{ padding: '8px 10px', fontSize: 13, color: '#ff4444', borderBottom: '1px solid #1a1a1a' }}>{(ev as { rejected?: number }).rejected ?? '—'}</td>
                        <td style={{ padding: '8px 10px', fontSize: 13, color: '#facc15', borderBottom: '1px solid #1a1a1a' }}>{ev.conversion_rate}%</td>
                        <td style={{ padding: '8px 10px', fontSize: 13, color: '#4ade80', borderBottom: '1px solid #1a1a1a' }}>{ev.approval_rate}%</td>
                        <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a' }}>{ev.whatsapp_contact_clicks}</td>
                        <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a' }}>{ev.whatsapp_group_clicks}</td>
                        <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a' }}>{ev.emails_sent}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
  )
}
