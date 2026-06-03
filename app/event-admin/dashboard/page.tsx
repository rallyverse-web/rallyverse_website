'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BarChart3, Loader2, Users, CheckCircle, XCircle, Clock, Search, Download, RefreshCw, ArrowLeft, ExternalLink, Trash2, Mail } from 'lucide-react'
import type { Registration } from '@/lib/types/supabase'

const s = {
  input: { width: '100%', height: 48, padding: '0 16px', borderRadius: 6, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none' } as React.CSSProperties,
  btn: { height: 40, padding: '0 20px', borderRadius: 6, border: 'none', background: 'var(--rallyverse-gradient)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' } as React.CSSProperties,
  btnSm: { height: 32, padding: '0 12px', borderRadius: 4, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' } as React.CSSProperties,
  card: { padding: 20, borderRadius: 8, border: '1px solid #222', background: '#111' } as React.CSSProperties,
  th: { padding: '8px 10px', textAlign: 'left' as const, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222', whiteSpace: 'nowrap' as const },
  td: { padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a', verticalAlign: 'middle' as const },
  overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 },
  modal: { background: '#1a1a1a', borderRadius: 8, border: '1px solid #333', maxWidth: 500, width: '100%', maxHeight: '90vh', overflowY: 'auto' as const, padding: 24 },
  label: { display: 'block', color: '#888', fontSize: 12, marginBottom: 4 },
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

export default function EventAdminDashboard() {
  const router = useRouter()
  const [adminName, setAdminName] = useState('')
  const [eventId, setEventId] = useState('')
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [metrics, setMetrics] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [selectedReg, setSelectedReg] = useState<Registration | null>(null)
  const [approvalNotes, setApprovalNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [sendEmailCheck, setSendEmailCheck] = useState(true)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const fetchData = useCallback(async () => {
    try {
      const meRes = await fetch('/api/event-admin/me')
      if (meRes.status === 401) { router.push('/event-admin'); return }
      if (!meRes.ok) { notify('error', 'Failed to load session'); return }
      const meData = await meRes.json()
      setAdminName(meData.admin.name)
      setEventId(meData.admin.event_id)

      const regRes = await fetch(`/api/event-admin/registrations/${meData.admin.event_id}`)
      if (regRes.ok) {
        const regData = await regRes.json()
        setRegistrations(regData.registrations || [])
        setMetrics(regData.metrics || { total: 0, pending: 0, approved: 0, rejected: 0 })
      }
    } catch {
      notify('error', 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => { fetchData() }, [fetchData])

  const filtered = useMemo(() => {
    let list = [...registrations]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((r) =>
        r.full_name.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q) ||
        r.registration_id.toLowerCase().includes(q)
      )
    }
    if (filterStatus !== 'all') {
      list = list.filter((r) => r.status === filterStatus)
    }
    return list
  }, [registrations, search, filterStatus])

  const handleApprove = async (reg: Registration, sendEmail = false) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/event-admin/approve', {
        method: 'POST',
        body: JSON.stringify({ registration_id: reg.id, status: 'Approved', notes: approvalNotes, send_email: sendEmail }),
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Failed'); return }
      const data = await res.json()
      const msg = sendEmail ? (data.email_sent?.success ? 'Registration approved & email sent' : 'Registration approved (email failed)') : 'Registration approved'
      notify('success', msg)
      setSelectedReg(null)
      setApprovalNotes('')
      fetchData()
    } catch { notify('error', 'Approval failed') }
    finally { setActionLoading(false) }
  }

  const handleReject = async (reg: Registration, sendEmail = false) => {
    setActionLoading(true)
    try {
      const res = await fetch('/api/event-admin/approve', {
        method: 'POST',
        body: JSON.stringify({ registration_id: reg.id, status: 'Rejected', notes: approvalNotes, send_email: sendEmail }),
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Failed'); return }
      const data = await res.json()
      const msg = sendEmail ? (data.email_sent?.success ? 'Registration rejected & email sent' : 'Registration rejected (email failed)') : 'Registration rejected'
      notify('success', msg)
      setSelectedReg(null)
      setApprovalNotes('')
      fetchData()
    } catch { notify('error', 'Rejection failed') }
    finally { setActionLoading(false) }
  }

  const handleDeleteRegistration = async (regId: string) => {
    try {
      const res = await fetch(`/api/event-admin/registrations/${eventId}?registrationId=${regId}`, { method: 'DELETE' })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Failed to delete'); return }
      notify('success', 'Registration deleted')
      setConfirmDeleteId(null)
      fetchData()
    } catch { notify('error', 'Failed to delete registration') }
  }

  const handleSignOut = async () => {
    await fetch('/api/event-admin/logout', { method: 'POST' })
    router.push('/event-admin')
  }

  const downloadCSV = () => {
    const headers = ['Registration ID', 'Full Name', 'Phone', 'Email', 'City', 'Gender', 'Format', 'Partner Name', 'Partner Phone', 'Status', 'Notes', 'Created At']
    const rows = filtered.map((r) =>
      headers.map((h) => {
        const key = h.toLowerCase().replace(/ /g, '_') as keyof Registration
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
    a.download = `registrations-${eventId.slice(0, 8)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <Loader2 size={24} className="animate-spin" style={{ color: '#888' }} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: 24 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 24, fontWeight: 700, color: '#fff', textTransform: 'uppercase', margin: 0 }}>Event Dashboard</h1>
            {adminName && <p style={{ color: '#4ade80', fontSize: 13, margin: '4px 0 0' }}>{adminName}</p>}
          </div>
          <a href="/event-admin/communication" style={{ ...s.btnSm, background: '#4ade8020', color: '#4ade80', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <Mail size={12} /> Communication
          </a>
          <a href="/event-admin/analytics" style={{ ...s.btnSm, background: '#facc1520', color: '#facc15', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <BarChart3 size={12} /> Analytics
          </a>
          <button onClick={handleSignOut} style={{ ...s.btn, background: 'transparent', border: '1px solid #333', fontSize: 13 }}>Sign Out</button>
        </div>

        {notification && (
          <div style={{ padding: '10px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, marginBottom: 16, background: notification.type === 'success' ? 'rgba(74,222,128,0.12)' : 'rgba(255,68,68,0.12)', border: `1px solid ${notification.type === 'success' ? 'rgba(74,222,128,0.3)' : 'rgba(255,68,68,0.3)'}`, color: notification.type === 'success' ? '#4ade80' : '#ff4444' }}>
            {notification.message}
          </div>
        )}

        {/* Metrics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          <div style={s.card}><Users size={18} color="#e5e5e5" /><p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', margin: '6px 0 4px' }}>Total</p><p style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: 0 }}>{metrics.total}</p></div>
          <div style={s.card}><Clock size={18} color="#facc15" /><p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', margin: '6px 0 4px' }}>Pending</p><p style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: 0 }}>{metrics.pending}</p></div>
          <div style={s.card}><CheckCircle size={18} color="#4ade80" /><p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', margin: '6px 0 4px' }}>Approved</p><p style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: 0 }}>{metrics.approved}</p></div>
          <div style={s.card}><XCircle size={18} color="#ff4444" /><p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', margin: '6px 0 4px' }}>Rejected</p><p style={{ color: '#fff', fontSize: 26, fontWeight: 700, margin: 0 }}>{metrics.rejected}</p></div>
        </div>

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#555', pointerEvents: 'none' }} />
            <input placeholder="Search name, email, ID..." value={search} onChange={(e) => setSearch(e.target.value)} style={{ width: '100%', height: 36, padding: '0 12px 0 32px', borderRadius: 4, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 13, outline: 'none' }} />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ height: 36, padding: '0 10px', borderRadius: 4, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
          <span style={{ color: '#666', fontSize: 12 }}>{filtered.length} registration{filtered.length !== 1 ? 's' : ''}</span>
          <button onClick={fetchData} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }} title="Refresh"><RefreshCw size={16} /></button>
          <button onClick={downloadCSV} style={{ ...s.btn, display: 'inline-flex', alignItems: 'center', gap: 6, background: 'transparent', border: '1px solid #333', fontSize: 13 }}>
            <Download size={14} /> CSV
          </button>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #222', background: '#111' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr>
                {['Registration ID', 'Name', 'Phone', 'Email', 'Format', 'Status', 'Created At', 'Actions'].map((h) => (
                  <th key={h} style={s.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#666', fontSize: 14 }}>No registrations found</td></tr>
              ) : filtered.map((reg) => (
                <tr key={reg.id} style={{ transition: 'background 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                  <td style={s.td}><span style={{ color: '#888', fontSize: 11, fontFamily: 'monospace' }}>{reg.registration_id}</span></td>
                  <td style={s.td}>
                    <span style={{ color: '#fff', fontWeight: 600 }}>{reg.full_name}</span>
                    {reg.partner_name && <><br /><span style={{ color: '#666', fontSize: 12 }}>+ {reg.partner_name}</span></>}
                  </td>
                  <td style={s.td}>{reg.phone_number}</td>
                  <td style={{ ...s.td, fontSize: 12, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{reg.email}</td>
                  <td style={s.td}>{reg.format}</td>
                  <td style={s.td}>{statusBadge(reg.status)}</td>
                  <td style={{ ...s.td, fontSize: 12 }}>{new Date(reg.created_at).toLocaleDateString('en-IN')}</td>
                    <td style={{ ...s.td, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center' }}>
                        <button style={{ ...s.btnSm, background: '#88888820', color: '#ccc' }} onClick={() => { setSelectedReg(reg); setApprovalNotes(reg.notes || '') }}>View</button>
                        {reg.status === 'Pending' && (
                          <>
                            <button style={{ ...s.btnSm, background: '#4ade80', color: '#000', fontWeight: 700, ...(actionLoading ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }} onClick={() => handleApprove(reg, true)} disabled={actionLoading} title="Approve & Send Email">Approve + Send</button>
                            <button style={{ ...s.btnSm, background: '#4ade8020', color: '#4ade80', ...(actionLoading ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }} onClick={() => handleApprove(reg)} disabled={actionLoading}>Approve</button>
                            <button style={{ ...s.btnSm, background: '#ff4444', color: '#fff', fontWeight: 700, ...(actionLoading ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }} onClick={() => handleReject(reg, true)} disabled={actionLoading} title="Reject & Send Email">Reject + Send</button>
                            <button style={{ ...s.btnSm, background: '#ff444420', color: '#ff4444', ...(actionLoading ? { opacity: 0.5, cursor: 'not-allowed' } : {}) }} onClick={() => handleReject(reg)} disabled={actionLoading}>Reject</button>
                          </>
                        )}
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

        {/* View Details Modal */}
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
              </div>

              <div style={{ borderTop: '1px solid #222', marginTop: 16, paddingTop: 16 }}>
                <label style={s.label}>Verification Notes</label>
                <textarea
                  value={approvalNotes}
                  onChange={(e) => setApprovalNotes(e.target.value)}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: 4, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 13, outline: 'none', resize: 'vertical', minHeight: 60 }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
                <input type="checkbox" id="sendEmailChk" checked={sendEmailCheck} onChange={(e) => setSendEmailCheck(e.target.checked)} />
                <label htmlFor="sendEmailChk" style={{ color: '#888', fontSize: 12, cursor: 'pointer' }}>Send email notification</label>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 12 }}>
                {selectedReg.status === 'Pending' && (
                  <>
                    <button onClick={() => { handleReject(selectedReg, sendEmailCheck); setApprovalNotes(approvalNotes) }} disabled={actionLoading} style={{ ...s.btnSm, background: '#ff4444', color: '#fff', fontWeight: 700, ...(actionLoading ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                      {actionLoading ? <Loader2 size={12} className="animate-spin" /> : 'Reject'}
                    </button>
                    <button onClick={() => { handleApprove(selectedReg, sendEmailCheck); setApprovalNotes(approvalNotes) }} disabled={actionLoading} style={{ ...s.btnSm, background: '#4ade80', color: '#000', fontWeight: 700, ...(actionLoading ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                      {actionLoading ? <Loader2 size={12} className="animate-spin" /> : 'Approve'}
                    </button>
                  </>
                )}
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
    </div>
  )
}
