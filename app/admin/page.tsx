'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  CheckCircle,
  Clock,
  Download,
  Edit,
  Loader2,
  Mail,
  RefreshCw,
  Search,
  ShieldAlert,
  Trash2,
  Users,
  Wallet,
  XCircle,
} from 'lucide-react'

/* ─── Types ─── */
type Registration = Record<string, string> & { rowIndex: string }

type Metrics = {
  totalRegistrations: number
  pendingPayments: number
  verifiedRegistrations: number
  rejectedRegistrations: number
  pendingVerification: number
  confirmationsSent: number
  confirmationsPending: number
}

/* ─── Styles ─── */
const s = {
  input: { width: '100%', height: 48, padding: '0 16px', borderRadius: 6, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none' } as React.CSSProperties,
  btn: { height: 40, padding: '0 20px', borderRadius: 6, border: 'none', background: 'var(--rallyverse-gradient)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' } as React.CSSProperties,
  btnSm: { height: 32, padding: '0 12px', borderRadius: 4, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' } as React.CSSProperties,
  btnDisabled: (b: React.CSSProperties) => ({ ...b, opacity: 0.6, cursor: 'not-allowed' }) as React.CSSProperties,
  card: { padding: 20, borderRadius: 8, border: '1px solid #222', background: '#111' } as React.CSSProperties,
  th: { padding: '8px 10px', textAlign: 'left' as const, fontSize: 11, textTransform: 'uppercase' as const, letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222', whiteSpace: 'nowrap' as const },
  td: { padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a', verticalAlign: 'middle' as const },
  overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 },
  modal: { background: '#1a1a1a', borderRadius: 8, border: '1px solid #333', maxWidth: 600, width: '100%', maxHeight: '90vh', overflowY: 'auto' as const, padding: 24 },
  label: { display: 'block', color: '#888', fontSize: 12, marginBottom: 4 },
  field: { width: '100%', height: 36, padding: '0 10px', borderRadius: 4, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 13, outline: 'none' } as React.CSSProperties,
}

/* ─── Badge helpers ─── */
function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 600,
      background: `${color}20`,
      color,
    }}>
      {label}
    </span>
  )
}

function statusBadge(status: string) {
  switch (status) {
    case 'Verified': return <Badge color="#4ade80" label="Verified" />
    case 'Rejected': return <Badge color="#ff4444" label="Rejected" />
    case 'Pending': return <Badge color="#facc15" label="Pending" />
    case 'Paid': return <Badge color="#4ade80" label="Paid" />
    case 'Yes': return <Badge color="#4ade80" label="Yes" />
    case 'No': return <Badge color="#666" label="No" />
    default: return <Badge color="#888" label={status || '—'} />
  }
}

/* ─── Editable fields map for the edit modal ─── */
const EDIT_FIELDS: { label: string; colIndex: number }[] = [
  { label: 'Player 1 Name', colIndex: 4 },
  { label: 'Player 1 Phone', colIndex: 5 },
  { label: 'Player 1 Email', colIndex: 6 },
  { label: 'Player 1 Skill Level', colIndex: 7 },
  { label: 'Player 2 Name', colIndex: 8 },
  { label: 'Player 2 Phone', colIndex: 9 },
  { label: 'Player 2 Email', colIndex: 10 },
  { label: 'Player 2 Skill Level', colIndex: 11 },
  { label: 'Category', colIndex: 2 },
  { label: 'Team Name', colIndex: 3 },
  { label: 'City', colIndex: 12 },
  { label: 'College / Organization', colIndex: 13 },
  { label: 'Amount Paid', colIndex: 14 },
  { label: 'UPI ID Used For Payment', colIndex: 15 },
  { label: 'Payment Phone', colIndex: 16 },
  { label: 'Remarks', colIndex: 17 },
]

/* ─── Table column definitions ─── */
const TABLE_COLUMNS: { key: string; label: string; sortable: boolean }[] = [
  { key: 'registrationId', label: 'ID', sortable: true },
  { key: 'registrationDate', label: 'Date', sortable: true },
  { key: 'category', label: 'Category', sortable: true },
  { key: 'player1Name', label: 'Player 1', sortable: true },
  { key: 'player1Phone', label: 'Phone', sortable: false },
  { key: 'player1Email', label: 'Email', sortable: false },
  { key: 'entryFee', label: 'Fee', sortable: true },
  { key: 'upiId', label: 'UPI ID', sortable: false },
  { key: 'paymentStatus', label: 'Payment', sortable: true },
  { key: 'verificationStatus', label: 'Verification', sortable: true },
  { key: 'confirmationSent', label: 'Confirmed', sortable: true },
]

/* ─── Main component ─── */
export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [authError, setAuthError] = useState('')

  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [lastSync, setLastSync] = useState('')

  /* Search & filters */
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortKey, setSortKey] = useState('registrationDate')
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc')
  const [page, setPage] = useState(0)
  const perPage = 20

  /* Email sending */
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<any>(null)

  /* Edit modal */
  const [editTarget, setEditTarget] = useState<Registration | null>(null)
  const [editValues, setEditValues] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  /* Confirm dialogs */
  const [confirmAction, setConfirmAction] = useState<{ type: string; row?: Registration } | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  /* Notification */
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    if (type === 'success') setAuthError('')
    setTimeout(() => setNotification(null), 5000)
  }

  /* ── Helpers ── */
  const authHeaders = useCallback(() => ({ Authorization: `Bearer ${token}` }), [token])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setAuthError('')
    try {
      const res = await fetch('/api/admin/registrations', { headers: authHeaders() })
      if (res.status === 401) { setToken(''); setAuthError('Invalid password'); return }
      if (!res.ok) { setAuthError('Failed to load data'); return }
      const data = await res.json()
      setRegistrations(data.registrations || [])
      setMetrics(data.metrics || null)
      setLastSync(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }))
    } catch { setAuthError('Failed to connect to server') }
    finally { setLoading(false) }
  }, [authHeaders])

  useEffect(() => { if (token) fetchData() }, [token, fetchData])

  /* ── Sorting + filtering ── */
  const toggleSort = (key: string) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    let list = [...registrations]
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((r) =>
        Object.values(r).some((v) => v.toLowerCase().includes(q))
      )
    }
    if (filterStatus === 'pending') list = list.filter((r) => r.verificationStatus === 'Pending')
    else if (filterStatus === 'verified') list = list.filter((r) => r.verificationStatus === 'Verified')
    else if (filterStatus === 'rejected') list = list.filter((r) => r.verificationStatus === 'Rejected')
    else if (filterStatus === 'confirmed') list = list.filter((r) => r.confirmationSent === 'Yes')
    else if (filterStatus === 'unconfirmed') list = list.filter((r) => r.verificationStatus === 'Verified' && r.confirmationSent === 'No')

    list.sort((a, b) => {
      const av = (a[sortKey] || '').toLowerCase()
      const bv = (b[sortKey] || '').toLowerCase()
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av)
    })
    return list
  }, [registrations, search, filterStatus, sortKey, sortDir])

  const pageCount = Math.ceil(filtered.length / perPage)
  const paged = filtered.slice(page * perPage, (page + 1) * perPage)

  useEffect(() => { setPage(0) }, [search, filterStatus])

  /* ── Actions ── */
  const emailsReady = metrics ? metrics.confirmationsPending : 0

  const handleSendConfirmations = async () => {
    setConfirmAction({ type: 'send-confirmations' })
  }

  const confirmSend = async () => {
    setSending(true)
    setSendResult(null)
    setConfirmAction(null)
    try {
      const res = await fetch('/api/admin/send-confirmations', { method: 'POST', headers: authHeaders() })
      if (res.status === 401) { setToken(''); return }
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Failed to send emails'); return }
      const data = await res.json()
      setSendResult(data)
      notify('success', `Emails sent: ${data.sent}, failed: ${data.failed}`)
      fetchData()
    } catch { notify('error', 'Failed to connect to server') }
    finally { setSending(false) }
  }

  const confirmThen = async () => {
    if (!confirmAction || !confirmAction.row) return
    setActionLoading(true)
    const { type, row } = confirmAction
    const rowIndex = parseInt(row.rowIndex, 10)
    try {
      const endpoint = type === 'send-verification' ? 'send-verification' : type
      const res = await fetch(`/api/admin/${endpoint}`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ rowIndex }),
      })
      if (res.status === 401) { setToken(''); return }
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Action failed'); setActionLoading(false); return }
      setConfirmAction(null)
      notify('success', `Registration ${type === 'delete' ? 'deleted' : type === 'verify' ? 'verified' : type === 'reject' ? 'rejected' : 'verification email sent'} successfully`)
      fetchData()
    } catch { notify('error', 'Action failed due to network error') }
    finally { setActionLoading(false) }
  }

  /* Column label lookup for edit modal (matches COLUMN_LABELS in registrations API) */
  const COLUMN_KEYS = [
    'registrationId', 'registrationDate', 'category', 'teamName',
    'player1Name', 'player1Phone', 'player1Email', 'player1SkillLevel',
    'player2Name', 'player2Phone', 'player2Email', 'player2SkillLevel',
    'city', 'collegeOrOrg', 'entryFee', 'upiId', 'paymentPhone',
    'remarks', 'paymentStatus', 'verificationStatus',
    'confirmationSent', 'paymentScreenshotReceived', 'confirmationDate',
    'additionalNotes',
  ]

  const openEdit = (row: Registration) => {
    setEditTarget(row)
    const vals: Record<string, string> = {}
    EDIT_FIELDS.forEach((f) => {
      vals[String(f.colIndex)] = row[COLUMN_KEYS[f.colIndex]] || ''
    })
    setEditValues(vals)
  }

  const handleSaveEdit = async () => {
    if (!editTarget) return
    setSaving(true)
    const rowIndex = parseInt(editTarget.rowIndex, 10)
    try {
      const res = await fetch('/api/admin/edit', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ rowIndex, updates: editValues }),
      })
      if (res.status === 401) { setToken(''); return }
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Edit failed'); setSaving(false); return }
      setEditTarget(null)
      notify('success', 'Registration updated successfully')
      fetchData()
    } catch { notify('error', 'Edit failed due to network error') }
    finally { setSaving(false) }
  }

  /* ── CSV export ── */
  const downloadCSV = useCallback(() => {
    const headers = TABLE_COLUMNS.map((c) => c.label).join(',')
    const rows = filtered.map((r) =>
      TABLE_COLUMNS.map((c) => {
        let val = r[c.key] || ''
        if (val.includes(',') || val.includes('"') || val.includes('\n')) {
          val = `"${val.replace(/"/g, '""')}"`
        }
        return val
      }).join(',')
    )
    const csv = [headers, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rallyverse-registrations-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }, [filtered])

  /* ── Login screen ── */
  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: 24 }}>
        <form onSubmit={(e) => { e.preventDefault(); setAuthError(''); setToken(password) }} style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <ShieldAlert size={40} style={{ color: '#e5e5e5', margin: '0 auto 12px' }} />
            <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 24, fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>Admin Access</h1>
          </div>
          <input type="password" placeholder="Enter admin password" value={password} onChange={(e) => setPassword(e.target.value)} style={s.input} autoFocus />
          {authError && <p style={{ color: '#ff4444', fontSize: 13 }}>{authError}</p>}
          <button type="submit" style={password ? s.btn : s.btnDisabled(s.btn)} disabled={!password}>Sign In</button>
        </form>
      </div>
    )
  }

  /* ── Main dashboard ── */
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: 24 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 28, fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>Dashboard</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {lastSync && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#666', fontSize: 12 }}>
                <Clock size={12} /> Last sync: {lastSync}
              </span>
            )}
            <a href="/admin/events" style={{ ...s.btnSm, background: '#88888820', color: '#ccc', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>Events</a>
            <a href="/admin/registrations" style={{ ...s.btnSm, background: '#4ade8020', color: '#4ade80', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>Phase 2 Registrations</a>
            <button onClick={fetchData} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }} title="Refresh">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => { setToken(''); setRegistrations([]); setMetrics(null); setSendResult(null); setNotification(null); setAuthError('') }} style={{ ...s.btn, background: 'transparent', border: '1px solid #333', fontSize: 13 }}>Sign Out</button>
          </div>
        </div>

        {authError && (
          <div style={{ padding: 12, borderRadius: 6, background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#ff4444', fontSize: 13, marginBottom: 24 }}>{authError}</div>
        )}

        {notification && (
          <div style={{
            padding: '10px 16px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 16,
            background: notification.type === 'success' ? 'rgba(74,222,128,0.12)' : 'rgba(255,68,68,0.12)',
            border: `1px solid ${notification.type === 'success' ? 'rgba(74,222,128,0.3)' : 'rgba(255,68,68,0.3)'}`,
            color: notification.type === 'success' ? '#4ade80' : '#ff4444',
          }}>
            {notification.message}
          </div>
        )}

        {/* Metric cards */}
        {metrics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
            <MetricCard icon={<Users size={18} />} label="Total" value={metrics.totalRegistrations} />
            <MetricCard icon={<Wallet size={18} />} label="Pending Verification" value={metrics.pendingVerification} color="#facc15" />
            <MetricCard icon={<CheckCircle size={18} />} label="Verified" value={metrics.verifiedRegistrations} color="#4ade80" />
            <MetricCard icon={<XCircle size={18} />} label="Rejected" value={metrics.rejectedRegistrations} color="#ff4444" />
            <MetricCard icon={<Mail size={18} />} label="Emails Pending" value={metrics.confirmationsPending} borderColor={metrics.confirmationsPending > 0 ? 'rgba(74, 222, 128, 0.3)' : undefined} valueColor={metrics.confirmationsPending > 0 ? '#4ade80' : undefined} />
            <MetricCard icon={<Mail size={18} />} label="Emails Sent" value={metrics.confirmationsSent} />
          </div>
        )}

        {/* Search & Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: '1 1 260px', minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#555', pointerEvents: 'none' }} />
            <input
              placeholder="Search registrations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '100%', height: 36, padding: '0 12px 0 32px', borderRadius: 4, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 13, outline: 'none' }}
            />
          </div>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ height: 36, padding: '0 10px', borderRadius: 4, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 13, outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending Verification</option>
            <option value="verified">Verified</option>
            <option value="rejected">Rejected</option>
            <option value="confirmed">Confirmation Sent</option>
            <option value="unconfirmed">Confirmation Pending</option>
          </select>
          <span style={{ color: '#666', fontSize: 12 }}>{filtered.length} registration{filtered.length !== 1 ? 's' : ''}</span>

          {/* CSV export */}
          <button
            onClick={downloadCSV}
            style={{
              ...s.btn,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'transparent',
              border: '1px solid #333',
              fontSize: 13,
            }}
          >
            <Download size={14} />
            CSV
          </button>

          {/* Email send section — inline with filters */}
          {emailsReady > 0 && (
            <button
              onClick={handleSendConfirmations}
              disabled={sending}
              style={{
                ...s.btn,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                ...(sending ? s.btnDisabled(s.btn) : {}),
              }}
            >
              {sending ? <Loader2 size={14} className="animate-spin" /> : <Mail size={14} />}
              {sending ? 'Sending...' : `Send (${emailsReady})`}
            </button>
          )}
        </div>

        {/* Send result */}
        {sendResult && (
          <div style={{
            marginBottom: 16,
            padding: 12,
            borderRadius: 6,
            fontSize: 13,
            background: sendResult.error ? 'rgba(255,68,68,0.1)' : sendResult.failed === 0 ? 'rgba(74,222,128,0.1)' : 'rgba(250,204,21,0.1)',
            border: `1px solid ${sendResult.error ? 'rgba(255,68,68,0.3)' : sendResult.failed === 0 ? 'rgba(74,222,128,0.3)' : 'rgba(250,204,21,0.3)'}`,
            color: sendResult.error ? '#ff4444' : sendResult.failed === 0 ? '#4ade80' : '#facc15',
          }}>
            <strong>{sendResult.error || `Emails Sent: ${sendResult.sent} | Failed: ${sendResult.failed}`}</strong>
            {sendResult.details && sendResult.details.length > 0 && (
              <div style={{ marginTop: 6, maxHeight: 120, overflowY: 'auto' }}>
                {sendResult.details.map((d: string, i: number) => (
                  <p key={i} style={{ color: d.includes('✗') ? '#ff4444' : '#888', fontSize: 11, fontFamily: 'monospace', padding: '1px 0' }}>{d}</p>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Registrations table */}
        {loading && registrations.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', fontSize: 14, padding: 40, justifyContent: 'center' }}>
            <Loader2 size={16} className="animate-spin" /> Loading registrations...
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #222', background: '#111' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 1100 }}>
              <thead>
                <tr>
                  {TABLE_COLUMNS.map((col) => (
                    <th key={col.key} style={s.th} onClick={() => col.sortable && toggleSort(col.key)}>
                      <span style={{ cursor: col.sortable ? 'pointer' : 'default', userSelect: 'none' }}>
                        {col.label}
                        {sortKey === col.key && (
                          <span style={{ marginLeft: 4, color: '#4ade80' }}>{sortDir === 'asc' ? '▲' : '▼'}</span>
                        )}
                      </span>
                    </th>
                  ))}
                  <th style={{ ...s.th, textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.length === 0 ? (
                  <tr><td colSpan={TABLE_COLUMNS.length + 1} style={{ padding: 40, textAlign: 'center', color: '#666', fontSize: 14 }}>No registrations found</td></tr>
                ) : paged.map((row) => (
                  <tr key={row.rowIndex} style={{ transition: 'background 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <td style={s.td}><span style={{ color: '#888', fontSize: 11, fontFamily: 'monospace' }}>{row.registrationId}</span></td>
                    <td style={s.td}>{row.registrationDate}</td>
                    <td style={s.td}>{row.category}</td>
                    <td style={s.td}>
                      {row.player1Name}
                      {row.player2Name && <><br /><span style={{ color: '#666', fontSize: 12 }}>+ {row.player2Name}</span></>}
                    </td>
                    <td style={s.td}>{row.player1Phone}</td>
                    <td style={{ ...s.td, fontSize: 12, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.player1Email}</td>
                    <td style={s.td}>{row.entryFee}</td>
                    <td style={{ ...s.td, fontSize: 11, fontFamily: 'monospace', maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.upiId}</td>
                    <td style={s.td}>{statusBadge(row.paymentStatus)}</td>
                    <td style={s.td}>{statusBadge(row.verificationStatus)}</td>
                    <td style={s.td}>{statusBadge(row.confirmationSent)}</td>
                    <td style={{ ...s.td, textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                        {row.verificationStatus === 'Pending' && (
                          <button style={{ ...s.btnSm, background: '#4ade8020', color: '#4ade80' }} onClick={() => setConfirmAction({ type: 'verify', row })}>Verify</button>
                        )}
                        {row.verificationStatus === 'Pending' && (
                          <button style={{ ...s.btnSm, background: '#ff444420', color: '#ff4444' }} onClick={() => setConfirmAction({ type: 'reject', row })}>Reject</button>
                        )}
                        {row.verificationStatus === 'Verified' && row.confirmationSent === 'No' && (
                          <button style={{ ...s.btnSm, background: '#88888820', color: '#4ade80' }} onClick={() => setConfirmAction({ type: 'send-verification', row })}>
                            <Mail size={12} style={{ marginRight: 3, verticalAlign: 'middle' }} />Notify
                          </button>
                        )}
                        <button style={{ ...s.btnSm, background: '#88888820', color: '#ccc' }} onClick={() => openEdit(row)}>
                          <Edit size={12} style={{ marginRight: 3, verticalAlign: 'middle' }} />Edit
                        </button>
                        <button style={{ ...s.btnSm, background: 'transparent', color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)' }} onClick={() => setConfirmAction({ type: 'delete', row })}>
                          <Trash2 size={12} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pageCount > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '12px 16px', borderTop: '1px solid #222' }}>
                <button disabled={page === 0} onClick={() => setPage((p) => p - 1)} style={page === 0 ? { ...s.btnSm, opacity: 0.4, cursor: 'not-allowed', background: 'transparent', border: '1px solid #333', color: '#888' } : { ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#ccc' }}>
                  Prev
                </button>
                {Array.from({ length: Math.min(pageCount, 8) }, (_, i) => {
                  const pageNum = Math.max(0, Math.min(page - 3, pageCount - 8)) + i
                  if (pageNum >= pageCount) return null
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      style={{
                        ...s.btnSm,
                        minWidth: 32,
                        background: page === pageNum ? '#333' : 'transparent',
                        border: page === pageNum ? 'none' : '1px solid #333',
                        color: page === pageNum ? '#fff' : '#888',
                      }}
                    >
                      {pageNum + 1}
                    </button>
                  )
                })}
                <button disabled={page >= pageCount - 1} onClick={() => setPage((p) => p + 1)} style={page >= pageCount - 1 ? { ...s.btnSm, opacity: 0.4, cursor: 'not-allowed', background: 'transparent', border: '1px solid #333', color: '#888' } : { ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#ccc' }}>
                  Next
                </button>
              </div>
            )}
          </div>
        )}

        {/* Confirm action modal */}
        {confirmAction && (
          <div style={s.overlay} onClick={() => !actionLoading && !sending && setConfirmAction(null)}>
            <div style={s.modal} onClick={(e) => e.stopPropagation()}>
              {confirmAction.type === 'send-confirmations' ? (
                <>
                  <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                    Send Confirmation Emails
                  </h3>
                  <p style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>
                    Send confirmation emails to all verified but unconfirmed registrations ({emailsReady} pending)?
                  </p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setConfirmAction(null)}
                      style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmSend}
                      disabled={sending}
                      style={{
                        ...s.btnSm,
                        background: '#4ade80',
                        color: '#000',
                        fontWeight: 700,
                        ...(sending ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
                      }}
                    >
                      {sending ? <><Loader2 size={12} className="animate-spin" style={{ marginRight: 4 }} />Sending...</> : `Send (${emailsReady})`}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                    {confirmAction.type === 'verify' && 'Verify Registration'}
                    {confirmAction.type === 'reject' && 'Reject Registration'}
                    {confirmAction.type === 'delete' && 'Delete Registration'}
                    {confirmAction.type === 'send-verification' && 'Send Verification Email'}
                  </h3>
                  <p style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>
                    {confirmAction.type === 'verify' && 'Mark this registration as verified? This will set Payment Status to "Paid" and Verification Status to "Verified".'}
                    {confirmAction.type === 'reject' && 'Reject this registration? This will set Verification Status to "Rejected" and add a remark.'}
                    {confirmAction.type === 'delete' && 'Are you sure? This action cannot be undone. The row will be permanently removed from Google Sheets.'}
                    {confirmAction.type === 'send-verification' && 'Send a verification/payment-confirmed email to this player?'}
                  </p>
                  {confirmAction.row && (
                    <p style={{
                      color: confirmAction.type === 'delete' ? '#ff4444' : '#666',
                      fontSize: 13,
                      marginBottom: 16,
                    }}>
                      <strong style={{ color: '#ccc' }}>{confirmAction.row.player1Name}</strong> — {confirmAction.row.registrationId}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => setConfirmAction(null)}
                      disabled={actionLoading}
                      style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmThen}
                      disabled={actionLoading}
                      style={{
                        ...s.btnSm,
                        background: confirmAction.type === 'delete' || confirmAction.type === 'reject' ? '#ff4444' : confirmAction.type === 'send-verification' ? '#88888820' : '#4ade80',
                        color: confirmAction.type === 'send-verification' ? '#4ade80' : '#000',
                        fontWeight: 700,
                        ...(actionLoading ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
                      }}
                    >
                      {actionLoading ? (
                        <><Loader2 size={12} className="animate-spin" style={{ marginRight: 4 }} />Processing...</>
                      ) : confirmAction.type === 'delete' ? 'Delete' : confirmAction.type === 'reject' ? 'Reject' : confirmAction.type === 'send-verification' ? 'Send Email' : 'Verify'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Edit modal */}
        {editTarget && (
          <div style={s.overlay} onClick={() => !saving && setEditTarget(null)}>
            <div style={s.modal} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600 }}>Edit Registration</h3>
                <span style={{ color: '#888', fontSize: 12, fontFamily: 'monospace' }}>{editTarget.registrationId}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {EDIT_FIELDS.map((field) => (
                  <div key={field.colIndex}>
                    <label style={s.label}>{field.label}</label>
                    <input
                      value={editValues[String(field.colIndex)] || ''}
                      onChange={(e) => setEditValues((v) => ({ ...v, [String(field.colIndex)]: e.target.value }))}
                      style={s.field}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 16 }}>
                <button onClick={() => setEditTarget(null)} disabled={saving} style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}>Cancel</button>
                <button onClick={handleSaveEdit} disabled={saving} style={{ ...s.btnSm, background: 'var(--rallyverse-gradient)', color: '#000', fontWeight: 700, ...(saving ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                  {saving ? <><Loader2 size={12} className="animate-spin" style={{ marginRight: 4 }} />Saving...</> : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

/* ── Metric card sub-component ── */
function MetricCard({
  icon, label, value, color, valueColor, borderColor,
}: {
  icon: React.ReactNode; label: string; value: number;
  color?: string; valueColor?: string; borderColor?: string;
}) {
  return (
    <div style={{
      padding: 16,
      borderRadius: 8,
      border: `1px solid ${borderColor || '#222'}`,
      background: '#111',
    }}>
      <div style={{ color: color || '#e5e5e5', marginBottom: 6 }}>{icon}</div>
      <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</p>
      <p style={{ color: valueColor || '#fff', fontSize: 26, fontWeight: 700 }}>{value}</p>
    </div>
  )
}
