'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdminAuth } from './AdminAuthContext'
import {
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  ExternalLink,
  Loader2,
  Mail,
  RefreshCw,
  ShieldAlert,
  Users,
  XCircle,
} from 'lucide-react'

/* ─── Types ─── */
type EventMetrics = {
  total: number
  pending: number
  approved: number
  rejected: number
}

type EventSummary = {
  event: {
    id: string
    name: string
    slug: string
    status: string
  }
  registrations: any[]
  metrics: EventMetrics
}

type GlobalMetrics = {
  totalEvents: number
  totalRegistrations: number
  pendingApprovals: number
  approvedRegistrations: number
  rejectedRegistrations: number
}

/* ─── Styles ─── */
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
  btnSm: {
    height: 32,
    padding: '0 12px',
    borderRadius: 6,
    border: 'none',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap' as const,
  } as React.CSSProperties,
  btnDisabled: (b: React.CSSProperties) => ({ ...b, opacity: 0.6, cursor: 'not-allowed' }) as React.CSSProperties,
  card: {
    padding: 24,
    borderRadius: 12,
    border: '1px solid #1a1a1a',
    background: '#0d0d0d',
    transition: 'border-color 0.2s, background 0.2s',
  } as React.CSSProperties,
  navCard: {
    padding: 24,
    borderRadius: 12,
    border: '1px solid #1a1a1a',
    background: '#0d0d0d',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'transform 0.2s, border-color 0.2s, background 0.2s',
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    minHeight: 160,
  } as React.CSSProperties,
  th: {
    padding: '12px 16px',
    textAlign: 'left' as const,
    fontSize: 11,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.05em',
    color: '#666',
    borderBottom: '1px solid #1a1a1a',
    whiteSpace: 'nowrap' as const,
  },
  td: {
    padding: '16px',
    fontSize: 13,
    color: '#ccc',
    borderBottom: '1px solid #0d0d0d',
    verticalAlign: 'middle' as const,
  },
}

export default function AdminPage() {
  const { token, logout } = useAdminAuth()
  const [eventsData, setEventsData] = useState<EventSummary[]>([])
  const [loading, setLoading] = useState(false)
  const [lastSync, setLastSync] = useState('')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const authHeaders = useCallback(() => ({ Authorization: `Bearer ${token}` }), [token])

  const fetchData = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/all-registrations', { headers: authHeaders() })
      if (res.status === 401) {
        logout()
        return
      }
      if (!res.ok) {
        notify('error', 'Failed to load portal data')
        return
      }
      const data = await res.json()
      setEventsData(data.events || [])
      setLastSync(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }))
    } catch {
      notify('error', 'Failed to connect to backend server')
    } finally {
      setLoading(false)
    }
  }, [authHeaders, logout, token])

  useEffect(() => {
    if (token) fetchData()
  }, [token, fetchData])

  const globalMetrics = useMemo<GlobalMetrics>(() => {
    let totalRegistrations = 0
    let pendingApprovals = 0
    let approvedRegistrations = 0
    let rejectedRegistrations = 0

    eventsData.forEach((ed) => {
      totalRegistrations += ed.metrics.total
      pendingApprovals += ed.metrics.pending
      approvedRegistrations += ed.metrics.approved
      rejectedRegistrations += ed.metrics.rejected
    })

    return {
      totalEvents: eventsData.length,
      totalRegistrations,
      pendingApprovals,
      approvedRegistrations,
      rejectedRegistrations,
    }
  }, [eventsData])

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 32, fontWeight: 700, color: '#fff', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 0 }}>
            Founder Dashboard
          </h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Control centre for RallyVerse events, payments, and communication</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {lastSync && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#444', fontSize: 12 }}>
              <Clock size={12} /> Sync: {lastSync}
            </span>
          )}
          <button
            onClick={fetchData}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', padding: 4 }}
            title="Sync metrics"
          >
            <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

        {notification && (
          <div
            style={{
              padding: '12px 16px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 24,
              background: notification.type === 'success' ? 'rgba(74,222,128,0.06)' : 'rgba(255,68,68,0.06)',
              border: `1px solid ${notification.type === 'success' ? 'rgba(74,222,128,0.2)' : 'rgba(255,68,68,0.2)'}`,
              color: notification.type === 'success' ? '#4ade80' : '#ff4444',
            }}
          >
            {notification.message}
          </div>
        )}

        {/* Global Platform Overview Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 40 }}>
          <MetricCard icon={<Calendar size={20} />} label="Total Events" value={globalMetrics.totalEvents} />
          <MetricCard icon={<Users size={20} />} label="Total Registrations" value={globalMetrics.totalRegistrations} />
          <MetricCard icon={<Clock size={20} />} label="Pending Verification" value={globalMetrics.pendingApprovals} color="#facc15" />
          <MetricCard icon={<CheckCircle size={20} />} label="Approved Players" value={globalMetrics.approvedRegistrations} color="#4ade80" />
          <MetricCard icon={<XCircle size={20} />} label="Rejected Registrations" value={globalMetrics.rejectedRegistrations} color="#ff4444" />
        </div>

        {/* Navigation Grid */}
        <h2 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 16 }}>
          Platform Management
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16, marginBottom: 48 }}>
          <a
            href="/admin/events"
            style={s.navCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#1a1a1a'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div>
              <Calendar size={24} style={{ color: 'var(--accent-primary)', marginBottom: 12 }} />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Events Management</h3>
              <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: 13, lineHeight: 1.4 }}>
                Create, configure, publish, and delete events. Define event formats and configure registration capacities.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--accent-primary)', fontSize: 12, fontWeight: 700, marginTop: 16 }}>
              Open Events Manager <ExternalLink size={12} />
            </div>
          </a>

          <a
            href="/admin/registrations"
            style={s.navCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#1a1a1a'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div>
              <Users size={24} style={{ color: '#4ade80', marginBottom: 12 }} />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Registration Portal</h3>
              <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: 13, lineHeight: 1.4 }}>
                Monitor submissions across all active campaigns, verify offline payment details, approve and delete registrations.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#4ade80', fontSize: 12, fontWeight: 700, marginTop: 16 }}>
              Open Registrations <ExternalLink size={12} />
            </div>
          </a>

          <a
            href="/admin/communication"
            style={s.navCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#1a1a1a'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div>
              <Mail size={24} style={{ color: '#38bdf8', marginBottom: 12 }} />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Communication Hub</h3>
              <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: 13, lineHeight: 1.4 }}>
                Manage event-specific email templates, configure custom sender details, trigger confirmations, broadcasts, and reminders.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#38bdf8', fontSize: 12, fontWeight: 700, marginTop: 16 }}>
              Open Comms Panel <ExternalLink size={12} />
            </div>
          </a>

          <a
            href="/admin/analytics"
            style={s.navCard}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = '#1a1a1a'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <div>
              <BarChart3 size={24} style={{ color: '#facc15', marginBottom: 12 }} />
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Platform Analytics</h3>
              <p style={{ margin: '6px 0 0 0', color: '#666', fontSize: 13, lineHeight: 1.4 }}>
                Review conversion funnels, track page views, WhatsApp engagement, registration growth trends, and email metrics.
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#facc15', fontSize: 12, fontWeight: 700, marginTop: 16 }}>
              Open Dashboard <ExternalLink size={12} />
            </div>
          </a>
        </div>

        {/* Live Events Status List */}
        <h2 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 18, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 16 }}>
          Live Event Summary
        </h2>
        
        {loading && eventsData.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#666', fontSize: 14, padding: 32, justifyContent: 'center' }}>
            <Loader2 size={16} className="animate-spin" /> Fetching event overview data...
          </div>
        ) : eventsData.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#444', border: '1px dashed #222', borderRadius: 12 }}>
            No events found. Go to the Events Manager to create your first event campaign.
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: 12, border: '1px solid #111', background: '#090909' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
              <thead>
                <tr>
                  <th style={s.th}>Campaign Name</th>
                  <th style={s.th}>URL Slug</th>
                  <th style={s.th}>Status</th>
                  <th style={{ ...s.th, textAlign: 'center' }}>Registrations</th>
                  <th style={{ ...s.th, textAlign: 'center' }}>Pending</th>
                  <th style={{ ...s.th, textAlign: 'center' }}>Approved</th>
                  <th style={{ ...s.th, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {eventsData.map((ed) => (
                  <tr
                    key={ed.event.id}
                    style={{ transition: 'background 0.15s' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = '#0d0d0d')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={s.td}>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{ed.event.name}</span>
                    </td>
                    <td style={{ ...s.td, fontFamily: 'monospace', color: '#666' }}>{ed.event.slug}</td>
                    <td style={s.td}>
                      <span
                        style={{
                          display: 'inline-block',
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          background: ed.event.status === 'published' ? 'rgba(74,222,128,0.06)' : 'rgba(250,204,21,0.06)',
                          color: ed.event.status === 'published' ? '#4ade80' : '#facc15',
                          border: `1px solid ${ed.event.status === 'published' ? 'rgba(74,222,128,0.1)' : 'rgba(250,204,21,0.1)'}`,
                        }}
                      >
                        {ed.event.status}
                      </span>
                    </td>
                    <td style={{ ...s.td, textAlign: 'center', fontWeight: 600 }}>{ed.metrics.total}</td>
                    <td style={{ ...s.td, textAlign: 'center', color: ed.metrics.pending > 0 ? '#facc15' : '#666', fontWeight: 600 }}>
                      {ed.metrics.pending}
                    </td>
                    <td style={{ ...s.td, textAlign: 'center', color: ed.metrics.approved > 0 ? '#4ade80' : '#666', fontWeight: 600 }}>
                      {ed.metrics.approved}
                    </td>
                    <td style={{ ...s.td, textAlign: 'center' }}>
                      <a
                        href={`/events/${ed.event.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--accent-primary)', fontSize: 13, textDecoration: 'none' }}
                      >
                        View Page <ExternalLink size={12} />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
  )
}

/* ── Metric card sub-component ── */
function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode
  label: string
  value: number
  color?: string
}) {
  return (
    <div style={s.card}>
      <div style={{ color: color || '#888', marginBottom: 8 }}>{icon}</div>
      <p style={{ color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, margin: '0 0 4px 0' }}>
        {label}
      </p>
      <p style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: 0 }}>{value}</p>
    </div>
  )
}
