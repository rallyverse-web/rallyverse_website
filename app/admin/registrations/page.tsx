'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdminAuth } from '../AdminAuthContext'
import { Loader2, Search, Download, RefreshCw, Users, CheckCircle, XCircle, Clock, Calendar, Eye, Trash2 } from 'lucide-react'
import type { Registration } from '@/lib/types/supabase'

const s = {
  input: { width: '100%', height: 48, padding: '0 16px', borderRadius: 6, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none' } as React.CSSProperties,
  btn: { height: 40, padding: '0 20px', borderRadius: 6, border: 'none', background: 'var(--rallyverse-gradient)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' } as React.CSSProperties,
  btnSm: { height: 32, padding: '0 12px', borderRadius: 4, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' } as React.CSSProperties,
  card: { padding: 20, borderRadius: 8, border: '1px solid #222', background: '#111' } as React.CSSProperties,
  th: { padding: '8px 10px', textAlign: 'left' as const, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222', whiteSpace: 'nowrap' as const },
  td: { padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a', verticalAlign: 'middle' as const },
  overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 },
  modal: { background: '#1a1a1a', borderRadius: 8, border: '1px solid #333', maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto' as const, padding: 24 },
}

function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: `${color}20`, color }}>
      {label}
    </span>
  )
}

function statusBadge(status: string) {
  switch (status) {
    case 'Approved': return <Badge color="#4ade80" label="Approved" />
    case 'Rejected': return <Badge color="#ff4444" label="Rejected" />
    case 'Pending': return <Badge color="#facc15" label="Pending" />
    default: return <Badge color="#888" label={status || '—'} />
  }
}

export default function AdminRegistrationsPage() {
  const { token, logout } = useAdminAuth()
  const [loading, setLoading] = useState(false)
  const [eventData, setEventData] = useState<Array<{ event: { id: string; name: string; slug: string; status: string }; registrations: Registration[]; metrics: { total: number; pending: number; approved: number; rejected: number } }>>([])
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null)
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

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
      if (res.status === 401) { logout(); return }
      if (!res.ok) { notify('error', 'Failed to load data'); return }
      const data = await res.json()
      setEventData(data.events || [])
    } catch { notify('error', 'Failed to connect') }
    finally { setLoading(false) }
  }, [authHeaders, logout, token])

  useEffect(() => { if (token) fetchData() }, [token, fetchData])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedReg(null)
        setConfirmDeleteId(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const totalMetrics = useMemo(() => {
    let total = 0, pending = 0, approved = 0, rejected = 0
    eventData.forEach((ed) => {
      total += ed.metrics.total
      pending += ed.metrics.pending
      approved += ed.metrics.approved
      rejected += ed.metrics.rejected
    })
    return { total, pending, approved, rejected }
  }, [eventData])

  const allRegs = useMemo(() => {
    const regs: Array<Registration & { eventName: string }> = []
    eventData.forEach((ed) => {
      ed.registrations.forEach((r) => {
        regs.push({ ...r, eventName: ed.event.name })
      })
    })
    return regs
  }, [eventData])

  const filteredRegs = useMemo(() => {
    if (!search) return allRegs
    const q = search.toLowerCase()
    return allRegs.filter((r) =>
      r.full_name.toLowerCase().includes(q) ||
      r.email.toLowerCase().includes(q) ||
      r.registration_id.toLowerCase().includes(q) ||
      r.eventName.toLowerCase().includes(q)
    )
  }, [allRegs, search])

  const handleDeleteRegistration = async (regId: string) => {
    try {
      const res = await fetch(`/api/admin/registrations/${regId}`, {
        method: 'DELETE', headers: authHeaders(),
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Failed to delete'); return }
      notify('success', 'Registration deleted')
      setConfirmDeleteId(null)
      fetchData()
    } catch { notify('error', 'Failed to delete registration') }
  }

  const downloadCSV = () => {
    const headers = ['Event', 'Registration ID', 'Full Name', 'Phone', 'Email', 'City', 'Gender', 'Format', 'Partner Name', 'Partner Phone', 'Status', 'Notes', 'Created At']
    const rows = filteredRegs.map((r) =>
      headers.map((h) => {
        const key = h.toLowerCase().replace(/ /g, '_') as keyof typeof r
        let val = String(r[key] ?? '')
        if (val.includes(',') || val.includes('"') || val.includes('\n')) val = `"${val.replace(/"/g, '""')}"`
        return val
      }).join(',')
    )
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `all-registrations-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 28, fontWeight: 700, color: '#fff', textTransform: 'uppercase', margin: 0 }}>Registrations</h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Monitor and manage player event registrations</p>
        </div>
      </div>

        {notification && (
          <div style={{ padding: '10px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, marginBottom: 16, background: notification.type === 'success' ? 'rgba(74,222,128,0.12)' : 'rgba(255,68,68,0.12)', border: `1px solid ${notification.type === 'success' ? 'rgba(74,222,128,0.3)' : 'rgba(255,68,68,0.3)'}`, color: notification.type === 'success' ? '#4ade80' : '#ff4444' }}>
            {notification.message}
          </div>
        )}

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          <Metric icon={<Calendar size={18} />} label="Events" value={eventData.length} />
          <Metric icon={<Users size={18} />} label="Total" value={totalMetrics.total} />
          <Metric icon={<Clock size={18} />} label="Pending" value={totalMetrics.pending} color="#facc15" />
          <Metric icon={<CheckCircle size={18} />} label="Approved" value={totalMetrics.approved} color="#4ade80" />
          <Metric icon={<XCircle size={18} />} label="Rejected" value={totalMetrics.rejected} color="#ff4444" />
        </div>

        {/* Search */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#555', pointerEvents: 'none' }} />
            <input placeholder="Search across all events..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', height: 36, padding: '0 12px 0 32px', borderRadius: 4, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 13, outline: 'none' }} />
          </div>
          <button onClick={fetchData} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }} title="Refresh"><RefreshCw size={16} className={loading ? 'animate-spin' : ''} /></button>
          <button onClick={downloadCSV} style={{ ...s.btn, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid #333', fontSize: 13 }}>
            <Download size={14} /> CSV
          </button>
        </div>

        {/* Events accordion */}
        {loading && eventData.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', fontSize: 14, padding: 40, justifyContent: 'center' }}>
            <Loader2 size={16} className="animate-spin" /> Loading registrations...
          </div>
        ) : eventData.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: '#666', fontSize: 14 }}>No events or registrations found</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {eventData.map((ed) => {
              const isExpanded = expandedEvent === ed.event.id
              const eventMetrics = ed.metrics
              return (
                <div key={ed.event.id} style={{ borderRadius: 8, border: '1px solid #222', background: '#111', overflow: 'hidden' }}>
                  <div
                    onClick={() => setExpandedEvent(isExpanded ? null : ed.event.id)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', cursor: 'pointer', borderBottom: isExpanded ? '1px solid #222' : 'none' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{ed.event.name}</span>
                      <Badge color={ed.event.status === 'published' ? '#4ade80' : '#888'} label={ed.event.status} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ color: '#888', fontSize: 12 }}>{eventMetrics.total} regs</span>
                      {eventMetrics.pending > 0 && (
                        <span style={{ color: '#facc15', fontSize: 12 }}>{eventMetrics.pending} pending</span>
                      )}
                      <span style={{ color: '#666', fontSize: 16 }}>{isExpanded ? '−' : '+'}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
                        <thead>
                          <tr>
                            {['ID', 'Name', 'Phone', 'Email', 'Format', 'Status', 'Date'].map((h) => (
                              <th key={h} style={s.th}>{h}</th>
                            ))}
                            <th style={{ ...s.th, textAlign: 'center' }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {ed.registrations.length === 0 ? (
                            <tr><td colSpan={8} style={{ padding: 20, textAlign: 'center', color: '#666', fontSize: 13 }}>No registrations</td></tr>
                          ) : ed.registrations.map((reg) => (
                            <tr key={reg.id} style={{ transition: 'background 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                              <td style={{ ...s.td, fontSize: 11, fontFamily: 'monospace', color: '#888' }}>{reg.registration_id}</td>
                              <td style={s.td}>{reg.full_name}</td>
                              <td style={s.td}>{reg.phone_number}</td>
                              <td style={{ ...s.td, fontSize: 12, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reg.email}</td>
                              <td style={s.td}>{reg.format}</td>
                              <td style={s.td}>{statusBadge(reg.status)}</td>
                              <td style={{ ...s.td, fontSize: 12 }}>{new Date(reg.created_at).toLocaleDateString('en-IN')}</td>
                              <td style={{ ...s.td, textAlign: 'center' }}>
                                <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                                  <button style={{ ...s.btnSm, background: '#88888820', color: '#ccc' }} onClick={() => setSelectedReg(reg)}><Eye size={12} /></button>
                                  <button style={{ ...s.btnSm, background: 'transparent', color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)' }} onClick={() => setConfirmDeleteId(reg.id)} title="Delete">
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Detail Modal */}
        {selectedReg && (
          <div style={s.overlay} onClick={() => setSelectedReg(null)}>
            <div style={s.modal} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: 0 }}>Registration Details</h3>
                <span style={{ color: '#888', fontSize: 12, fontFamily: 'monospace' }}>{selectedReg.registration_id}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  ['Full Name', selectedReg.full_name],
                  ['Phone', selectedReg.phone_number],
                  ['Email', selectedReg.email],
                  ['City', selectedReg.city],
                  ['Gender', selectedReg.gender],
                  ['Format', selectedReg.format],
                  ['Status', selectedReg.status],
                  ['Registered', new Date(selectedReg.created_at).toLocaleString('en-IN')],
                ].map(([label, value]) => (
                  <div key={label}>
                    <p style={{ color: '#888', fontSize: 11, margin: '0 0 2px' }}>{label}</p>
                    <p style={{ color: '#ccc', fontSize: 13, margin: 0 }}>{value}</p>
                  </div>
                ))}
                {selectedReg.partner_name && (
                  <>
                    <div><p style={{ color: '#888', fontSize: 11, margin: '0 0 2px' }}>Partner Name</p><p style={{ color: '#ccc', fontSize: 13, margin: 0 }}>{selectedReg.partner_name}</p></div>
                    <div><p style={{ color: '#888', fontSize: 11, margin: '0 0 2px' }}>Partner Phone</p><p style={{ color: '#ccc', fontSize: 13, margin: 0 }}>{selectedReg.partner_phone}</p></div>
                  </>
                )}
                {selectedReg.notes && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={{ color: '#888', fontSize: 11, margin: '0 0 2px' }}>Notes</p>
                    <p style={{ color: '#ccc', fontSize: 13, margin: 0 }}>{selectedReg.notes}</p>
                  </div>
                )}
                {selectedReg.approved_by && (
                  <div style={{ gridColumn: '1 / -1' }}>
                    <p style={{ color: '#888', fontSize: 11, margin: '0 0 2px' }}>Approved By</p>
                    <p style={{ color: '#ccc', fontSize: 13, margin: 0 }}>{selectedReg.approved_by} {selectedReg.approved_at ? `at ${new Date(selectedReg.approved_at).toLocaleString('en-IN')}` : ''}</p>
                  </div>
                )}
              </div>
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <button onClick={() => setSelectedReg(null)} style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}>Close</button>
              </div>
            </div>
          </div>
        )}
        {/* Delete Confirmation */}
        {confirmDeleteId && (
          <div style={s.overlay} onClick={() => setConfirmDeleteId(null)}>
            <div style={{ ...s.modal, maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Delete Registration</h3>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>Are you sure? This will permanently delete this registration. This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setConfirmDeleteId(null)} style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}>Cancel</button>
                <button onClick={() => handleDeleteRegistration(confirmDeleteId)} style={{ ...s.btnSm, background: '#ff4444', color: '#fff', fontWeight: 700 }}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
  )
}

function Metric({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color?: string }) {
  return (
    <div style={{ padding: 16, borderRadius: 8, border: '1px solid #222', background: '#111' }}>
      <div style={{ color: color || '#e5e5e5', marginBottom: 6 }}>{icon}</div>
      <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: 0 }}>{value}</p>
    </div>
  )
}
