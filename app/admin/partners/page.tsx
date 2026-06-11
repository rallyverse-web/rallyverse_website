'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAdminAuth } from '../AdminAuthContext'
import {
  Loader2,
  Search,
  Download,
  RefreshCw,
  Eye,
  Trash2,
  Edit,
  Check,
  X,
  Mail,
  Phone,
  Copy,
  ExternalLink,
  MessageSquare,
  Plus,
  Trash,
  Calendar,
  Briefcase,
  AlertCircle,
  Undo
} from 'lucide-react'

// Layout and UI styles
const s = {
  input: {
    width: '100%',
    height: 40,
    padding: '0 12px',
    borderRadius: 6,
    border: '1px solid #333',
    background: '#111',
    color: '#fff',
    fontSize: 13,
    outline: 'none',
  } as React.CSSProperties,
  select: {
    height: 40,
    padding: '0 12px',
    borderRadius: 6,
    border: '1px solid #333',
    background: '#111',
    color: '#fff',
    fontSize: 13,
    outline: 'none',
    cursor: 'pointer',
  } as React.CSSProperties,
  btn: {
    height: 40,
    padding: '0 16px',
    borderRadius: 6,
    border: 'none',
    background: 'var(--rallyverse-gradient, #ff5e00)',
    color: '#000',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
  } as React.CSSProperties,
  btnSm: {
    height: 32,
    padding: '0 10px',
    borderRadius: 4,
    border: 'none',
    fontSize: 12,
    fontWeight: 600,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  } as React.CSSProperties,
  card: {
    padding: 16,
    borderRadius: 8,
    border: '1px solid #222',
    background: '#111',
  } as React.CSSProperties,
  th: {
    padding: '12px 10px',
    textAlign: 'left' as const,
    fontSize: 11,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
    color: '#888',
    borderBottom: '1px solid #222',
    whiteSpace: 'nowrap' as const,
  },
  td: {
    padding: '12px 10px',
    fontSize: 13,
    color: '#ccc',
    borderBottom: '1px solid #1a1a1a',
    verticalAlign: 'middle' as const,
  },
  overlay: {
    position: 'fixed' as const,
    inset: 0,
    background: 'rgba(0,0,0,0.85)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    padding: 20,
  },
  modal: {
    background: '#0f0f0f',
    borderRadius: 12,
    border: '1px solid #222',
    maxWidth: 700,
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
    padding: 24,
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.5)',
  },
}

// Sub-badges
function Badge({ color, label }: { color: string; label: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 8px',
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 700,
        textTransform: 'uppercase',
        background: `${color}15`,
        border: `1px solid ${color}30`,
        color,
      }}
    >
      {label}
    </span>
  )
}

function statusBadge(status: string) {
  switch (status) {
    case 'New':
      return <Badge color="#ff8c00" label="New" />
    case 'Contacted':
      return <Badge color="#facc15" label="Contacted" />
    case 'Qualified':
      return <Badge color="#38bdf8" label="Qualified" />
    case 'Proposal Sent':
      return <Badge color="#c084fc" label="Proposal" />
    case 'Won':
      return <Badge color="#4ade80" label="Won" />
    case 'Lost':
      return <Badge color="#ff4444" label="Lost" />
    default:
      return <Badge color="#888" label={status || '—'} />
  }
}

// Available organization types and services list
const organizationTypes = [
  'Sports Brand',
  'Academy',
  'Club',
  'Event Organizer',
  'Corporate',
  'Community',
  'Other',
]

const servicesList = [
  'Sports Marketing',
  'Community Building',
  'Registration Management',
  'Event Promotion',
  'Partnerships',
  'Sponsorship Opportunities',
]

interface CRMNote {
  id: string
  text: string
  created_at: string
}

interface PartnerEnquiry {
  id: string
  name: string
  organization: string | null
  email: string
  phone: string
  organization_type: string
  services_interested: string[]
  message: string | null
  status: string
  internal_notes: CRMNote[]
  assigned_to: string | null
  is_deleted: boolean
  created_at: string
  updated_at: string
}

export default function AdminPartnersCRMPage() {
  const { token, logout } = useAdminAuth()
  const [loading, setLoading] = useState(false)
  const [enquiries, setEnquiries] = useState<PartnerEnquiry[]>([])
  const [metrics, setMetrics] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    proposal_sent: 0,
    won: 0,
    lost: 0,
    conversion_rate: 0,
  })

  // Filter States
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterOrgType, setFilterOrgType] = useState('')
  const [filterService, setFilterService] = useState('')
  const [filterDateStart, setFilterDateStart] = useState('')
  const [filterDateEnd, setFilterDateEnd] = useState('')
  const [showDeleted, setShowDeleted] = useState(false)

  // Modal States
  const [selectedEnquiry, setSelectedEnquiry] = useState<PartnerEnquiry | null>(null)
  const [editingEnquiry, setEditingEnquiry] = useState<PartnerEnquiry | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Internal Notes Sub-States (inside Detail View)
  const [newNoteText, setNewNoteText] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingNoteText, setEditingNoteText] = useState('')

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const authHeaders = useCallback(() => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }), [token])

  // Fetch enquiries with active filters
  const fetchData = useCallback(async () => {
    if (!token) return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append('search', search)
      if (filterStatus) params.append('status', filterStatus)
      if (filterOrgType) params.append('organization_type', filterOrgType)
      if (filterService) params.append('service', filterService)
      if (filterDateStart) params.append('date_start', filterDateStart)
      if (filterDateEnd) params.append('date_end', filterDateEnd)
      if (showDeleted) params.append('show_deleted', 'true')

      const res = await fetch(`/api/admin/partner-enquiries?${params.toString()}`, {
        headers: authHeaders(),
      })

      if (res.status === 401) {
        logout()
        return
      }

      if (!res.ok) {
        notify('error', 'Failed to load partner enquiries')
        return
      }

      const data = await res.json()
      setEnquiries(data.enquiries || [])
      setMetrics(data.metrics || metrics)
    } catch {
      notify('error', 'Failed to connect to backend server')
    } finally {
      setLoading(false)
    }
  }, [authHeaders, logout, token, search, filterStatus, filterOrgType, filterService, filterDateStart, filterDateEnd, showDeleted])

  useEffect(() => {
    if (token) fetchData()
  }, [token, fetchData])

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedEnquiry(null)
        setEditingEnquiry(null)
        setConfirmDeleteId(null)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Quick action: clipboard copy helpers
  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    notify('success', `Copied ${type} to clipboard`)
  }

  // Quick action: WhatsApp link generator
  const getWhatsAppLink = (phone: string) => {
    const digits = phone.replace(/\D/g, '')
    return `https://wa.me/${digits}`
  }

  // Soft Delete / Restore handler
  const handleToggleDelete = async (id: string, currentDeletedState: boolean) => {
    try {
      const res = await fetch('/api/admin/partner-enquiries', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ id, is_deleted: !currentDeletedState }),
      })

      if (!res.ok) {
        notify('error', 'Failed to update deletion status')
        return
      }

      notify('success', currentDeletedState ? 'Enquiry restored successfully' : 'Enquiry soft-deleted')
      setConfirmDeleteId(null)
      if (selectedEnquiry && selectedEnquiry.id === id) {
        setSelectedEnquiry(null)
      }
      fetchData()
    } catch {
      notify('error', 'Error toggling delete status')
    }
  }

  // Inline Status Change handler
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/partner-enquiries', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ id, status: newStatus }),
      })

      if (!res.ok) {
        notify('error', 'Failed to update status')
        return
      }

      notify('success', `Status updated to ${newStatus}`)
      fetchData()
    } catch {
      notify('error', 'Error updating status')
    }
  }

  // Save Enquiry Edit Metadata
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingEnquiry) return

    try {
      const res = await fetch('/api/admin/partner-enquiries', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          id: editingEnquiry.id,
          name: editingEnquiry.name,
          organization: editingEnquiry.organization || null,
          email: editingEnquiry.email,
          phone: editingEnquiry.phone,
          organization_type: editingEnquiry.organization_type,
          services_interested: editingEnquiry.services_interested,
          message: editingEnquiry.message || null,
          status: editingEnquiry.status,
          assigned_to: editingEnquiry.assigned_to || null,
        }),
      })

      if (!res.ok) {
        notify('error', 'Failed to save changes')
        return
      }

      notify('success', 'Enquiry updated successfully')
      setEditingEnquiry(null)
      fetchData()
    } catch {
      notify('error', 'Error updating enquiry')
    }
  }

  // Internal Notes Manager (saves array of notes directly into JSONB field)
  const handleAddNote = async () => {
    if (!selectedEnquiry || !newNoteText.trim()) return

    const newNoteObj: CRMNote = {
      id: typeof window !== 'undefined' && window.crypto?.randomUUID ? window.crypto.randomUUID() : Math.random().toString(36).substring(2, 11),
      text: newNoteText.trim(),
      created_at: new Date().toISOString(),
    }

    const currentNotes = selectedEnquiry.internal_notes || []
    const updatedNotesList = [...currentNotes, newNoteObj]

    try {
      const res = await fetch('/api/admin/partner-enquiries', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          id: selectedEnquiry.id,
          internal_notes: updatedNotesList,
        }),
      })

      if (!res.ok) {
        notify('error', 'Failed to add note')
        return
      }

      const updatedEnquiry = { ...selectedEnquiry, internal_notes: updatedNotesList }
      setSelectedEnquiry(updatedEnquiry)
      // Update local enquiries list state to maintain consistency
      setEnquiries(prev => prev.map(e => e.id === selectedEnquiry.id ? updatedEnquiry : e))
      setNewNoteText('')
      notify('success', 'Note added')
    } catch {
      notify('error', 'Error adding note')
    }
  }

  const handleEditNoteStart = (noteId: string, noteText: string) => {
    setEditingNoteId(noteId)
    setEditingNoteText(noteText)
  }

  const handleSaveEditedNote = async () => {
    if (!selectedEnquiry || !editingNoteId || !editingNoteText.trim()) return

    const currentNotes = selectedEnquiry.internal_notes || []
    const updatedNotesList = currentNotes.map(n =>
      n.id === editingNoteId ? { ...n, text: editingNoteText.trim() } : n
    )

    try {
      const res = await fetch('/api/admin/partner-enquiries', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          id: selectedEnquiry.id,
          internal_notes: updatedNotesList,
        }),
      })

      if (!res.ok) {
        notify('error', 'Failed to update note')
        return
      }

      const updatedEnquiry = { ...selectedEnquiry, internal_notes: updatedNotesList }
      setSelectedEnquiry(updatedEnquiry)
      setEnquiries(prev => prev.map(e => e.id === selectedEnquiry.id ? updatedEnquiry : e))
      setEditingNoteId(null)
      setEditingNoteText('')
      notify('success', 'Note updated')
    } catch {
      notify('error', 'Error updating note')
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    if (!selectedEnquiry) return

    const currentNotes = selectedEnquiry.internal_notes || []
    const updatedNotesList = currentNotes.filter(n => n.id !== noteId)

    try {
      const res = await fetch('/api/admin/partner-enquiries', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({
          id: selectedEnquiry.id,
          internal_notes: updatedNotesList,
        }),
      })

      if (!res.ok) {
        notify('error', 'Failed to delete note')
        return
      }

      const updatedEnquiry = { ...selectedEnquiry, internal_notes: updatedNotesList }
      setSelectedEnquiry(updatedEnquiry)
      setEnquiries(prev => prev.map(e => e.id === selectedEnquiry.id ? updatedEnquiry : e))
      notify('success', 'Note deleted')
    } catch {
      notify('error', 'Error deleting note')
    }
  }

  // CSV Export client-side generator (exports currently filtered enquiries)
  const downloadCSV = () => {
    const headers = [
      'Name',
      'Organization',
      'Email',
      'Phone',
      'Organization Type',
      'Status',
      'Assigned To',
      'Submitted Date',
      'Services Interested In',
      'Message',
    ]

    const rows = enquiries.map((e) => {
      const org = e.organization ?? '—'
      const services = e.services_interested.join('; ')
      const submitted = new Date(e.created_at).toLocaleDateString('en-IN')
      const msg = (e.message ?? '').replace(/\n/g, ' ')
      const assignee = e.assigned_to ?? 'Unassigned'

      const fields = [
        e.name,
        org,
        e.email,
        e.phone,
        e.organization_type,
        e.status,
        assignee,
        submitted,
        services,
        msg,
      ]

      return fields.map((val) => {
        let cleanVal = String(val)
        if (cleanVal.includes(',') || cleanVal.includes('"') || cleanVal.includes('\n')) {
          cleanVal = `"${cleanVal.replace(/"/g, '""')}"`
        }
        return cleanVal
      }).join(',')
    })

    const csvContent = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `partner-enquiries-${new Date().toISOString().slice(0, 10)}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }

  const handleEditCheckboxChange = (service: string) => {
    if (!editingEnquiry) return
    const services = editingEnquiry.services_interested || []
    const updatedServices = services.includes(service)
      ? services.filter(s => s !== service)
      : [...services, service]

    setEditingEnquiry({
      ...editingEnquiry,
      services_interested: updatedServices,
    })
  }

  return (
    <div>
      {/* Header section */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 28, fontWeight: 700, color: '#fff', textTransform: 'uppercase', margin: 0 }}>
            Partner Enquiries
          </h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Lightweight B2B CRM and lead pipeline management</p>
        </div>
      </div>

      {notification && (
        <div
          style={{
            padding: '10px 16px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 600,
            marginBottom: 16,
            background: notification.type === 'success' ? 'rgba(74,222,128,0.12)' : 'rgba(255,68,68,0.12)',
            border: `1px solid ${notification.type === 'success' ? 'rgba(74,222,128,0.3)' : 'rgba(255,68,68,0.3)'}`,
            color: notification.type === 'success' ? '#4ade80' : '#ff4444',
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Analytics widgets grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        <MetricCard label="Total Leads" value={metrics.total} color="#fff" />
        <MetricCard label="New Leads" value={metrics.new} color="#ff8c00" />
        <MetricCard label="Qualified" value={metrics.qualified} color="#38bdf8" />
        <MetricCard label="Won Deals" value={metrics.won} color="#4ade80" />
        <MetricCard label="Conversion" value={`${metrics.conversion_rate}%`} color="#c084fc" />
      </div>

      {/* Search & filters panel */}
      <div style={{ padding: 16, borderRadius: 8, border: '1px solid #1a1a1a', background: '#0a0a0a', marginBottom: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 12 }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#555', pointerEvents: 'none' }} />
            <input
              placeholder="Search leads..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ ...s.input, paddingLeft: 32 }}
            />
          </div>

          {/* Filter Status */}
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={s.select}>
            <option value="">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Proposal Sent">Proposal Sent</option>
            <option value="Won">Won</option>
            <option value="Lost">Lost</option>
          </select>

          {/* Filter Org Type */}
          <select value={filterOrgType} onChange={(e) => setFilterOrgType(e.target.value)} style={s.select}>
            <option value="">All Org Types</option>
            {organizationTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>

          {/* Filter Service */}
          <select value={filterService} onChange={(e) => setFilterService(e.target.value)} style={s.select}>
            <option value="">All Services</option>
            {servicesList.map(service => (
              <option key={service} value={service}>{service}</option>
            ))}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, borderTop: '1px solid #141414', paddingTop: 12 }}>
          {/* Date range picker */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 12, color: '#666' }}>Submitted Range:</span>
            <input
              type="date"
              value={filterDateStart}
              onChange={(e) => setFilterDateStart(e.target.value)}
              style={{ ...s.input, width: 130, height: 32 }}
            />
            <span style={{ fontSize: 12, color: '#666' }}>to</span>
            <input
              type="date"
              value={filterDateEnd}
              onChange={(e) => setFilterDateEnd(e.target.value)}
              style={{ ...s.input, width: 130, height: 32 }}
            />
            {(filterDateStart || filterDateEnd) && (
              <button
                onClick={() => { setFilterDateStart(''); setFilterDateEnd('') }}
                style={{ background: 'none', border: 'none', color: '#ff4444', fontSize: 11, cursor: 'pointer' }}
              >
                Clear
              </button>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Show Deleted Switch */}
            <label style={{ display: 'inline-flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: '#888' }}>
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Show Deleted
            </label>

            {/* Sync & CSV actions */}
            <button onClick={fetchData} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }} title="Sync data">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>

            <button onClick={downloadCSV} style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#ccc' }}>
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Main enquiries table */}
      {loading && enquiries.length === 0 ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', fontSize: 14, padding: 40, justifyContent: 'center' }}>
          <Loader2 size={16} className="animate-spin" /> Loading CRM Pipeline...
        </div>
      ) : enquiries.length === 0 ? (
        <div style={{ padding: 40, textAlign: 'center', color: '#555', border: '1px dashed #222', borderRadius: 8 }}>
          No partner enquiries found. Change search term or filters.
        </div>
      ) : (
        <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #222', background: '#0a0a0a' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
            <thead>
              <tr>
                <th style={s.th}>Name</th>
                <th style={s.th}>Organization</th>
                <th style={s.th}>Email</th>
                <th style={s.th}>Phone</th>
                <th style={s.th}>Org Type</th>
                <th style={s.th}>Status</th>
                <th style={s.th}>Submitted On</th>
                <th style={{ ...s.th, textAlign: 'center' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.map((enq) => (
                <tr
                  key={enq.id}
                  style={{
                    transition: 'background 0.15s',
                    background: enq.is_deleted ? 'rgba(255, 68, 68, 0.02)' : 'transparent',
                    opacity: enq.is_deleted ? 0.6 : 1,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = enq.is_deleted ? 'rgba(255, 68, 68, 0.02)' : 'transparent' }}
                >
                  <td style={{ ...s.td, fontWeight: 600, color: '#fff' }}>
                    {enq.name}
                    {enq.assigned_to && (
                      <span style={{ display: 'block', fontSize: 10, color: '#666', fontWeight: 400, marginTop: 2 }}>
                        Assigned: {enq.assigned_to}
                      </span>
                    )}
                  </td>
                  <td style={s.td}>{enq.organization || '—'}</td>
                  <td style={{ ...s.td, fontFamily: 'monospace', fontSize: 12 }}>{enq.email}</td>
                  <td style={s.td}>{enq.phone}</td>
                  <td style={s.td}>{enq.organization_type}</td>
                  <td style={s.td}>
                    <select
                      value={enq.status}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                      style={{
                        background: 'transparent',
                        color: enq.status === 'Won' ? '#4ade80' : enq.status === 'Lost' ? '#ff4444' : enq.status === 'New' ? '#ff8c00' : '#ccc',
                        border: 'none',
                        fontSize: 13,
                        fontWeight: 600,
                        cursor: 'pointer',
                        outline: 'none',
                      }}
                    >
                      <option value="New" style={{ background: '#111', color: '#ff8c00' }}>New</option>
                      <option value="Contacted" style={{ background: '#111', color: '#facc15' }}>Contacted</option>
                      <option value="Qualified" style={{ background: '#111', color: '#38bdf8' }}>Qualified</option>
                      <option value="Proposal Sent" style={{ background: '#111', color: '#c084fc' }}>Proposal Sent</option>
                      <option value="Won" style={{ background: '#111', color: '#4ade80' }}>Won</option>
                      <option value="Lost" style={{ background: '#111', color: '#ff4444' }}>Lost</option>
                    </select>
                  </td>
                  <td style={{ ...s.td, fontSize: 12 }}>
                    {new Date(enq.created_at).toLocaleDateString('en-IN')}
                  </td>
                  <td style={{ ...s.td, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      {/* View details */}
                      <button
                        style={{ ...s.btnSm, background: '#111', color: '#38bdf8', border: '1px solid #222' }}
                        onClick={() => setSelectedEnquiry(enq)}
                        title="View Details"
                      >
                        <Eye size={12} />
                      </button>

                      {/* Edit enquiry details */}
                      <button
                        style={{ ...s.btnSm, background: '#111', color: '#c084fc', border: '1px solid #222' }}
                        onClick={() => setEditingEnquiry(enq)}
                        title="Edit enquiry"
                      >
                        <Edit size={12} />
                      </button>

                      {/* Soft Delete / Restore toggler */}
                      {enq.is_deleted ? (
                        <button
                          style={{ ...s.btnSm, background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)' }}
                          onClick={() => handleToggleDelete(enq.id, true)}
                          title="Restore Enquiry"
                        >
                          <Undo size={12} />
                        </button>
                      ) : (
                        <button
                          style={{ ...s.btnSm, background: 'transparent', color: '#ff4444', border: '1px solid rgba(255,68,68,0.2)' }}
                          onClick={() => setConfirmDeleteId(enq.id)}
                          title="Delete Enquiry"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* CRM Detailed Enquiry View Modal */}
      {selectedEnquiry && (
        <div style={s.overlay} onClick={() => setSelectedEnquiry(null)}>
          <div style={{ ...s.modal, maxWidth: 750 }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: 16, marginBottom: 20 }}>
              <div>
                <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: 0 }}>Partner Enquiry Details</h3>
                <p style={{ color: '#666', fontSize: 12, margin: '4px 0 0' }}>Received: {new Date(selectedEnquiry.created_at).toLocaleString('en-IN')}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                {statusBadge(selectedEnquiry.status)}
                {selectedEnquiry.is_deleted && <Badge color="#ff4444" label="DELETED" />}
                <button
                  onClick={() => setSelectedEnquiry(null)}
                  style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 4 }}
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }} className="grid md:grid-cols-2">
              {/* Contact details */}
              <div>
                <h4 style={{ color: 'var(--accent-primary, #ff5e00)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 12px 0', borderBottom: '1px solid #1a1a1a', paddingBottom: 6 }}>
                  Contact Information
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <tbody>
                    <tr>
                      <td style={{ color: '#555', padding: '6px 0', width: 100 }}>Name:</td>
                      <td style={{ color: '#fff', padding: '6px 0', fontWeight: 600 }}>{selectedEnquiry.name}</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#555', padding: '6px 0' }}>Organization:</td>
                      <td style={{ color: '#ccc', padding: '6px 0' }}>{selectedEnquiry.organization || '—'}</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#555', padding: '6px 0' }}>Email:</td>
                      <td style={{ color: '#ccc', padding: '6px 0', fontFamily: 'monospace' }}>{selectedEnquiry.email}</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#555', padding: '6px 0' }}>Phone:</td>
                      <td style={{ color: '#ccc', padding: '6px 0' }}>{selectedEnquiry.phone}</td>
                    </tr>
                  </tbody>
                </table>

                {/* Quick Actions buttons */}
                <div style={{ display: 'flex', gap: 6, marginTop: 16, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => handleCopy(selectedEnquiry.email, 'email')}
                    style={{ ...s.btnSm, background: '#111', border: '1px solid #222', color: '#ccc' }}
                  >
                    <Copy size={11} /> Copy Email
                  </button>
                  <button
                    onClick={() => handleCopy(selectedEnquiry.phone, 'phone number')}
                    style={{ ...s.btnSm, background: '#111', border: '1px solid #222', color: '#ccc' }}
                  >
                    <Copy size={11} /> Copy Phone
                  </button>
                  <a
                    href={`mailto:${selectedEnquiry.email}`}
                    style={{ ...s.btnSm, background: 'rgba(56,189,248,0.1)', color: '#38bdf8', border: '1px solid rgba(56,189,248,0.2)', textDecoration: 'none' }}
                  >
                    <Mail size={11} /> Email
                  </a>
                  <a
                    href={getWhatsAppLink(selectedEnquiry.phone)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ ...s.btnSm, background: 'rgba(74,222,128,0.1)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', textDecoration: 'none' }}
                  >
                    <MessageSquare size={11} /> WhatsApp
                  </a>
                </div>
              </div>

              {/* Organization details */}
              <div>
                <h4 style={{ color: 'var(--accent-primary, #ff5e00)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 12px 0', borderBottom: '1px solid #1a1a1a', paddingBottom: 6 }}>
                  Organization Details
                </h4>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <tbody>
                    <tr>
                      <td style={{ color: '#555', padding: '6px 0', width: 100 }}>Org Type:</td>
                      <td style={{ color: '#ccc', padding: '6px 0' }}>{selectedEnquiry.organization_type}</td>
                    </tr>
                    <tr>
                      <td style={{ color: '#555', padding: '6px 0', verticalAlign: 'top' }}>Interested in:</td>
                      <td style={{ color: '#ccc', padding: '6px 0' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {selectedEnquiry.services_interested.map((s, idx) => (
                            <span key={idx} style={{ color: '#fff', fontSize: 12 }}>
                              • {s}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td style={{ color: '#555', padding: '6px 0' }}>Assigned To:</td>
                      <td style={{ color: '#fff', padding: '6px 0', fontWeight: 600 }}>{selectedEnquiry.assigned_to || 'Unassigned'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Message block */}
            <div style={{ marginBottom: 24 }}>
              <h4 style={{ color: 'var(--accent-primary, #ff5e00)', fontSize: 12, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 8px 0', borderBottom: '1px solid #1a1a1a', paddingBottom: 6 }}>
                Enquiry Message
              </h4>
              <div
                style={{
                  background: '#070707',
                  border: '1px solid #1a1a1a',
                  padding: 12,
                  borderRadius: 6,
                  color: '#ddd',
                  fontSize: 13,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  maxHeight: 150,
                  overflowY: 'auto',
                }}
              >
                {selectedEnquiry.message || 'No additional message provided.'}
              </div>
            </div>

            {/* Timeline block */}
            <div style={{ display: 'flex', gap: 24, marginBottom: 24, fontSize: 11, color: '#666' }}>
              <span>Created: {new Date(selectedEnquiry.created_at).toLocaleString('en-IN')}</span>
              {selectedEnquiry.updated_at && (
                <span>Last Updated: {new Date(selectedEnquiry.updated_at).toLocaleString('en-IN')}</span>
              )}
            </div>

            {/* Internal notes manager */}
            <div style={{ borderTop: '1px solid #222', paddingTop: 20 }}>
              <h4 style={{ color: 'var(--accent-primary, #ff5e00)', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5, margin: '0 0 12px 0', display: 'flex', alignItems: 'center', gap: 6 }}>
                <MessageSquare size={14} /> Internal CRM Notes <span style={{ fontSize: 10, textTransform: 'none', color: '#555', fontWeight: 400 }}>(Admin Only)</span>
              </h4>

              {/* Notes list */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16, maxHeight: 200, overflowY: 'auto' }}>
                {(selectedEnquiry.internal_notes || []).length === 0 ? (
                  <p style={{ color: '#555', fontSize: 12, margin: 0, fontStyle: 'italic' }}>No internal notes saved yet.</p>
                ) : (
                  (selectedEnquiry.internal_notes || []).map((note) => {
                    const isEditing = editingNoteId === note.id
                    return (
                      <div key={note.id} style={{ background: '#141414', border: '1px solid #222', borderRadius: 6, padding: 10, fontSize: 12.5 }}>
                        {isEditing ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                            <textarea
                              value={editingNoteText}
                              onChange={(e) => setEditingNoteText(e.target.value)}
                              style={{ ...s.input, minHeight: 60, padding: 8, resize: 'none' }}
                            />
                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                              <button onClick={() => setEditingNoteId(null)} style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}>
                                Cancel
                              </button>
                              <button onClick={handleSaveEditedNote} style={{ ...s.btnSm, background: 'var(--rallyverse-gradient, #ff5e00)', color: '#000' }}>
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
                              <span style={{ color: 'var(--accent-primary, #ff5e00)', fontSize: 11, fontWeight: 700 }}>Admin Note</span>
                              <div style={{ display: 'flex', gap: 6 }}>
                                <button
                                  onClick={() => handleEditNoteStart(note.id, note.text)}
                                  style={{ background: 'none', border: 'none', color: '#c084fc', cursor: 'pointer', padding: 2, fontSize: 10 }}
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDeleteNote(note.id)}
                                  style={{ background: 'none', border: 'none', color: '#ff4444', cursor: 'pointer', padding: 2, fontSize: 10 }}
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                            <p style={{ color: '#ccc', margin: '0 0 6px 0', lineHeight: 1.4 }}>{note.text}</p>
                            <span style={{ color: '#555', fontSize: 10 }}>{new Date(note.created_at).toLocaleString('en-IN')}</span>
                          </div>
                        )}
                      </div>
                    )
                  })
                )}
              </div>

              {/* Add Note box */}
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end' }}>
                <div style={{ flex: 1 }}>
                  <textarea
                    placeholder="Type a new internal CRM note (e.g. 'WhatsApp call completed...')"
                    value={newNoteText}
                    onChange={(e) => setNewNoteText(e.target.value)}
                    style={{ ...s.input, minHeight: 64, padding: '8px 12px', resize: 'none' }}
                  />
                </div>
                <button
                  onClick={handleAddNote}
                  disabled={!newNoteText.trim()}
                  style={{ ...s.btn, height: 44, opacity: newNoteText.trim() ? 1 : 0.5, cursor: newNoteText.trim() ? 'pointer' : 'not-allowed' }}
                >
                  <Plus size={14} /> Note
                </button>
              </div>
            </div>

            <div style={{ marginTop: 24, borderTop: '1px solid #222', paddingTop: 16, textAlign: 'right' }}>
              <button
                onClick={() => setSelectedEnquiry(null)}
                style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CRM Edit Lead Modal */}
      {editingEnquiry && (
        <div style={s.overlay} onClick={() => setEditingEnquiry(null)}>
          <div style={s.modal} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #222', paddingBottom: 16, marginBottom: 20 }}>
              <h3 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: 0 }}>Edit Partner Enquiry</h3>
              <button
                onClick={() => setEditingEnquiry(null)}
                style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', padding: 4 }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="grid md:grid-cols-2">
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Full Name *</label>
                  <input
                    type="text"
                    required
                    value={editingEnquiry.name}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, name: e.target.value })}
                    style={s.input}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Organization</label>
                  <input
                    type="text"
                    value={editingEnquiry.organization || ''}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, organization: e.target.value })}
                    style={s.input}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="grid md:grid-cols-2">
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Email *</label>
                  <input
                    type="email"
                    required
                    value={editingEnquiry.email}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, email: e.target.value })}
                    style={s.input}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Phone *</label>
                  <input
                    type="text"
                    required
                    value={editingEnquiry.phone}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, phone: e.target.value })}
                    style={s.input}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="grid md:grid-cols-2">
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Organization Type *</label>
                  <select
                    value={editingEnquiry.organization_type}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, organization_type: e.target.value })}
                    style={{ ...s.select, width: '100%' }}
                  >
                    {organizationTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Lead Status *</label>
                  <select
                    value={editingEnquiry.status}
                    onChange={(e) => setEditingEnquiry({ ...editingEnquiry, status: e.target.value })}
                    style={{ ...s.select, width: '100%' }}
                  >
                    <option value="New">New</option>
                    <option value="Contacted">Contacted</option>
                    <option value="Qualified">Qualified</option>
                    <option value="Proposal Sent">Proposal Sent</option>
                    <option value="Won">Won</option>
                    <option value="Lost">Lost</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Assigned CRM Admin</label>
                <input
                  type="text"
                  placeholder="Type assignee name (e.g. 'Aditya G')"
                  value={editingEnquiry.assigned_to || ''}
                  onChange={(e) => setEditingEnquiry({ ...editingEnquiry, assigned_to: e.target.value })}
                  style={s.input}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Services Interested In *</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, background: '#050505', border: '1px solid #1f1f1f', padding: 12, borderRadius: 6 }} className="grid sm:grid-cols-2">
                  {servicesList.map((service) => {
                    const isChecked = (editingEnquiry.services_interested || []).includes(service)
                    return (
                      <label key={service} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 12.5, color: '#ccc' }}>
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleEditCheckboxChange(service)}
                          style={{ cursor: 'pointer' }}
                        />
                        {service}
                      </label>
                    )
                  })}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 11, color: '#888', textTransform: 'uppercase', marginBottom: 6 }}>Message</label>
                <textarea
                  value={editingEnquiry.message || ''}
                  onChange={(e) => setEditingEnquiry({ ...editingEnquiry, message: e.target.value })}
                  style={{ ...s.input, minHeight: 80, padding: 10, resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
                <button
                  type="button"
                  onClick={() => setEditingEnquiry(null)}
                  style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ ...s.btn, height: 32, padding: '0 16px', fontSize: 12 }}
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div style={s.overlay} onClick={() => setConfirmDeleteId(null)}>
          <div style={{ ...s.modal, maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <AlertCircle size={18} style={{ color: '#ff4444' }} /> Soft-delete enquiry
            </h3>
            <p style={{ color: '#888', fontSize: 13, lineHeight: 1.4, margin: '0 0 20px 0' }}>
              Are you sure you want to soft-delete this partner enquiry? It will be hidden from the default CRM pipeline list but can be recovered under the &quot;Show Deleted&quot; filter.
            </p>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setConfirmDeleteId(null)}
                style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleToggleDelete(confirmDeleteId, false)}
                style={{ ...s.btnSm, background: '#ff4444', color: '#fff', fontWeight: 700 }}
              >
                Soft-delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Analytics metric card component
function MetricCard({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <div style={s.card}>
      <p style={{ color: '#666', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: 700, margin: '0 0 4px 0' }}>
        {label}
      </p>
      <p style={{ color, fontSize: 24, fontWeight: 700, margin: 0 }}>
        {value}
      </p>
    </div>
  )
}
