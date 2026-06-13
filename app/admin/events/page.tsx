'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAdminAuth } from '../AdminAuthContext'
import { Plus, Edit, Trash2, Eye, Loader2, RefreshCw, Calendar, Users, CheckCircle, XCircle, Wallet, Shield, Copy, Upload } from 'lucide-react'
import type { EventWithFormats, EventFormData, AdminEventMetrics, EventStatus, EventPaymentConfigFormData, EventAdmin } from '@/lib/types/supabase'

const FORMAT_OPTIONS = [
  "Men's Singles", "Women's Singles", "Men's Doubles", "Women's Doubles", "Mixed Doubles",
]

const defaultForm: EventFormData = {
  name: '', slug: '', description: '', category: '', venue: '',
  event_date: '', date_label: '', time_label: '', is_date_confirmed: true,
  registration_fee: 0, payment_enabled: false, capacity: 0, rally_points: 0,
  poster_url: '',
  whatsapp_number: '', whatsapp_group_link: '',
  featured: false,
  status: 'draft', formats: [],
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

const s = {
  input: { width: '100%', height: 48, padding: '0 16px', borderRadius: 6, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none' } as React.CSSProperties,
  textarea: { width: '100%', padding: '12px 16px', borderRadius: 6, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical' as const, minHeight: 100 } as React.CSSProperties,
  select: { width: '100%', height: 48, padding: '0 16px', borderRadius: 6, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none', cursor: 'pointer' } as React.CSSProperties,
  btn: { height: 40, padding: '0 20px', borderRadius: 6, border: 'none', background: 'var(--rallyverse-gradient)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' } as React.CSSProperties,
  btnDanger: { height: 40, padding: '0 20px', borderRadius: 6, border: 'none', background: '#ff4444', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' } as React.CSSProperties,
  btnSm: { height: 32, padding: '0 12px', borderRadius: 4, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const } as React.CSSProperties,
  card: { padding: 20, borderRadius: 8, border: '1px solid #222', background: '#111' } as React.CSSProperties,
  label: { display: 'block', color: '#888', fontSize: 12, marginBottom: 4 },
  overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 },
  modal: { background: '#1a1a1a', borderRadius: 8, border: '1px solid #333', maxWidth: 700, width: '100%', maxHeight: '90vh', overflowY: 'auto' as const, padding: 24 },
}

function StatusBadge({ status }: { status: EventStatus }) {
  const colors: Record<EventStatus, string> = {
    draft: '#facc15', published: '#4ade80', cancelled: '#ff4444', completed: '#888',
  }
  return (
    <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: `${colors[status]}20`, color: colors[status] }}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

function MetricCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: number; color?: string }) {
  return (
    <div style={{ padding: 16, borderRadius: 8, border: '1px solid #222', background: '#111' }}>
      <div style={{ color: color || '#e5e5e5', marginBottom: 6 }}>{icon}</div>
      <p style={{ color: '#888', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 4 }}>{label}</p>
      <p style={{ color: '#fff', fontSize: 26, fontWeight: 700 }}>{value}</p>
    </div>
  )
}

export default function AdminEventsPage() {
  const { user, logout } = useAdminAuth()

  const [events, setEvents] = useState<EventWithFormats[]>([])
  const [metrics, setMetrics] = useState<AdminEventMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<EventFormData>(defaultForm)
  const [saving, setSaving] = useState(false)

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [showBackfillConfirm, setShowBackfillConfirm] = useState(false)
  const [backfilling, setBackfilling] = useState(false)

  const [uploadingPoster, setUploadingPoster] = useState(false)
  const posterInputRef = useRef<HTMLInputElement>(null)

  const [uploadingQR, setUploadingQR] = useState(false)
  const qrInputRef = useRef<HTMLInputElement>(null)
  const [uploadingFormQR, setUploadingFormQR] = useState(false)
  const formQrInputRef = useRef<HTMLInputElement>(null)

  const [paymentConfigTarget, setPaymentConfigTarget] = useState<string | null>(null)
  const [paymentConfig, setPaymentConfig] = useState<EventPaymentConfigFormData>({
    upi_id: '', account_holder_name: '', mobile_number: '', whatsapp_number: '', qr_code_url: '', payment_enabled: false, transaction_ref_required: true,
  })
  const [savingPayment, setSavingPayment] = useState(false)

  const [formPaymentConfig, setFormPaymentConfig] = useState<Partial<EventPaymentConfigFormData>>({
    upi_id: '', qr_code_url: '', transaction_ref_required: true,
  })

  const [adminTarget, setAdminTarget] = useState<string | null>(null)
  const [eventAdmins, setEventAdmins] = useState<EventAdmin[]>([])
  const [createdAdminToken, setCreatedAdminToken] = useState<string | null>(null)
  const [loadingAdmins, setLoadingAdmins] = useState(false)
  const [newAdminName, setNewAdminName] = useState('')
  const [newAdminEmail, setNewAdminEmail] = useState('')
  const [savingAdmin, setSavingAdmin] = useState(false)
  const [copiedToken, setCopiedToken] = useState<string | null>(null)
  const [visibleToken, setVisibleToken] = useState<Record<string, string | null>>({})
  const [tokenLoading, setTokenLoading] = useState<Record<string, boolean>>({})
  const [confirmRegen, setConfirmRegen] = useState<string | null>(null)

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const fetchEvents = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const res = await fetch('/api/admin/events')
      if (res.status === 401) { logout(); return }
      if (!res.ok) { notify('error', 'Failed to load events'); return }
      const data = await res.json()
      setEvents(data.events || [])
      setMetrics(data.metrics || null)
    } catch { notify('error', 'Failed to connect to server') }
    finally { setLoading(false) }
  }, [logout, user])

  useEffect(() => { if (user) fetchEvents() }, [user, fetchEvents])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowForm(false)
        setPaymentConfigTarget(null)
        setAdminTarget(null)
        setConfirmRegen(null)
        setConfirmDelete(null)
        setShowBackfillConfirm(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleCreate = () => {
    setEditingId(null)
    setFormData(defaultForm)
    setFormPaymentConfig({ upi_id: '', qr_code_url: '', transaction_ref_required: true })
    setShowForm(true)
  }

  const handleEdit = async (event: EventWithFormats) => {
    setEditingId(event.id)
    setFormData({
      name: event.name,
      slug: event.slug,
      description: event.description || '',
      category: (event.category as EventFormData['category']) || '',
      venue: event.venue || '',
      event_date: event.event_date ? event.event_date.slice(0, 16) : '',
      date_label: event.date_label || '',
      time_label: event.time_label || '',
      is_date_confirmed: event.is_date_confirmed ?? true,
      registration_fee: event.registration_fee ?? 0,
      payment_enabled: event.payment_enabled ?? false,
      poster_url: event.poster_url || '',
      capacity: event.capacity ?? 0,
      rally_points: event.rally_points ?? 0,
      whatsapp_number: event.whatsapp_number || '',
      whatsapp_group_link: event.whatsapp_group_link || '',
      featured: event.featured ?? false,
      status: event.status,
      formats: event.formats?.map(f => f.format_name) || [],
    })
    // Load existing payment config for this event
    try {
      const res = await fetch(`/api/admin/payment-config/${event.id}`)
      if (res.ok) {
        const data = await res.json()
        if (data.config) {
          setFormPaymentConfig({
            upi_id: data.config.upi_id || '',
            qr_code_url: data.config.qr_code_url || '',
            transaction_ref_required: data.config.transaction_ref_required ?? true,
          })
        } else {
          setFormPaymentConfig({ upi_id: '', qr_code_url: '', transaction_ref_required: true })
        }
      }
    } catch {
      setFormPaymentConfig({ upi_id: '', qr_code_url: '', transaction_ref_required: true })
    }
    setShowForm(true)
  }

  const fetchPaymentConfig = async (eventId: string) => {
    try {
      const res = await fetch(`/api/admin/payment-config/${eventId}`)
      if (res.ok) {
        const data = await res.json()
        if (data.config) {
          setPaymentConfig({
            upi_id: data.config.upi_id || '',
            account_holder_name: data.config.account_holder_name || '',
            mobile_number: data.config.mobile_number || '',
            whatsapp_number: data.config.whatsapp_number || '',
            qr_code_url: data.config.qr_code_url || '',
            payment_enabled: data.config.payment_enabled ?? false,
            transaction_ref_required: data.config.transaction_ref_required ?? true,
          })
          return
        }
      }
    } catch {}
    setPaymentConfig({ upi_id: '', account_holder_name: '', mobile_number: '', whatsapp_number: '', qr_code_url: '', payment_enabled: false, transaction_ref_required: true })
  }

  const handleSavePaymentConfig = async () => {
    if (!paymentConfigTarget) return
    setSavingPayment(true)
    try {
      const res = await fetch(`/api/admin/payment-config/${paymentConfigTarget}`, {
        method: 'PUT',
        body: JSON.stringify(paymentConfig),
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Failed to save'); return }
      notify('success', 'Payment config saved')
      setPaymentConfigTarget(null)
    } catch { notify('error', 'Failed to save payment config') }
    finally { setSavingPayment(false) }
  }

  const fetchAdmins = async (eventId: string) => {
    setLoadingAdmins(true)
    try {
      const res = await fetch(`/api/admin/event-admins/${eventId}`)
      if (res.ok) {
        const data = await res.json()
        setEventAdmins(data.admins || [])
      }
    } catch {}
    finally { setLoadingAdmins(false) }
  }

  const handleAddAdmin = async () => {
    if (!adminTarget || !newAdminName || !newAdminEmail) return
    setSavingAdmin(true)
    try {
      const res = await fetch(`/api/admin/event-admins/${adminTarget}`, {
        method: 'POST',
        body: JSON.stringify({ name: newAdminName, email: newAdminEmail }),
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Failed to add admin'); return }
      const data = await res.json()
      setEventAdmins(prev => [data.admin, ...prev])
      setNewAdminName('')
      setNewAdminEmail('')
      setCreatedAdminToken(data.admin.email)
      notify('success', 'Invitation sent — they will receive a password reset email.')
      setTimeout(() => setCreatedAdminToken(null), 15000)
    } catch { notify('error', 'Failed to add admin') }
    finally { setSavingAdmin(false) }
  }

  const handleRemoveAdmin = async (adminId: string) => {
    try {
      const res = await fetch(`/api/admin/event-admins/${adminTarget}?adminId=${adminId}`, {
        method: 'DELETE',
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Failed to remove'); return }
      setEventAdmins(prev => prev.filter(a => a.id !== adminId))
      setVisibleToken(prev => { const n = { ...prev }; delete n[adminId]; return n })
      notify('success', 'Admin removed')
    } catch { notify('error', 'Failed to remove admin') }
  }

  const handleShowToken = async (adminId: string) => {
    if (visibleToken[adminId]) { setVisibleToken(prev => ({ ...prev, [adminId]: null })); return }
    setTokenLoading(prev => ({ ...prev, [adminId]: true }))
    try {
      const res = await fetch(`/api/admin/event-admins/${adminTarget}/${adminId}`)
      if (res.ok) { const data = await res.json(); setVisibleToken(prev => ({ ...prev, [adminId]: data.admin.access_token })) }
      else { notify('error', 'Failed to fetch token') }
    } catch { notify('error', 'Failed to fetch token') }
    finally { setTokenLoading(prev => ({ ...prev, [adminId]: false })) }
  }

  const handleRegenToken = async (adminId: string) => {
    try {
      const res = await fetch(`/api/admin/event-admins/${adminTarget}/${adminId}/regenerate`, {
        method: 'POST',
      })
      if (res.ok) { const data = await res.json(); setVisibleToken(prev => ({ ...prev, [adminId]: data.access_token })); setConfirmRegen(null); notify('success', 'Token regenerated') }
      else { const d = await res.json(); notify('error', d.error || 'Failed to regenerate') }
    } catch { notify('error', 'Failed to regenerate') }
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedToken(text)
      setTimeout(() => setCopiedToken(null), 2000)
    } catch {}
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch('/api/admin/events', {
          method: 'PUT',
            body: JSON.stringify({ id: editingId, ...formData }),
        })
        if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Update failed'); return }
        notify('success', 'Event updated successfully')
        // Save payment config if payment is enabled
        if (formData.payment_enabled) {
          const payRes = await fetch(`/api/admin/payment-config/${editingId}`, {
            method: 'PUT',
                body: JSON.stringify(formPaymentConfig),
          })
          if (!payRes.ok) { const d = await payRes.json(); notify('error', 'Payment config: ' + (d.error || 'save failed')); return }
        }
      } else {
        const res = await fetch('/api/admin/events', {
          method: 'POST',
            body: JSON.stringify(formData),
        })
        if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Create failed'); return }
        const data = await res.json()
        notify('success', 'Event created successfully')
        // Save payment config if payment is enabled
        if (formData.payment_enabled && data.event?.id) {
          const payRes = await fetch(`/api/admin/payment-config/${data.event.id}`, {
            method: 'PUT',
                body: JSON.stringify(formPaymentConfig),
          })
          if (!payRes.ok) { const d = await payRes.json(); notify('error', 'Payment config: ' + (d.error || 'save failed')); return }
        }
      }
      setShowForm(false)
      fetchEvents()
    } catch { notify('error', 'Failed to save event') }
    finally { setSaving(false) }
  }

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/events?id=${id}`, {
        method: 'DELETE',
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Delete failed'); return }
      notify('success', 'Event deleted')
      setConfirmDelete(null)
      fetchEvents()
    } catch { notify('error', 'Failed to delete event') }
  }

  const handlePublish = async (id: string) => {
    try {
      const res = await fetch('/api/admin/events', {
        method: 'PATCH',
        body: JSON.stringify({ id, action: 'publish' }),
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Publish failed'); return }
      notify('success', 'Event published')
      fetchEvents()
    } catch { notify('error', 'Failed to publish event') }
  }

  const handlePosterUpload = async (file: File) => {
    setUploadingPoster(true)
    try {
      const body = new FormData()
      body.append('file', file)
      body.append('bucket', 'event-assets')
      body.append('folder', 'posters')
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Upload failed'); return }
      const data = await res.json()
      updateForm('poster_url', data.url)
      notify('success', 'Poster uploaded')
    } catch { notify('error', 'Poster upload failed') }
    finally { setUploadingPoster(false) }
  }

  const triggerPosterUpload = () => {
    if (posterInputRef.current) {
      posterInputRef.current.value = ''
      posterInputRef.current.click()
    }
  }

  const handleQRUpload = async (file: File) => {
    setUploadingQR(true)
    try {
      const body = new FormData()
      body.append('file', file)
      body.append('bucket', 'event-assets')
      body.append('folder', 'qr-codes')
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Upload failed'); return }
      const data = await res.json()
      setPaymentConfig(p => ({ ...p, qr_code_url: data.url }))
      notify('success', 'QR code uploaded')
    } catch { notify('error', 'QR code upload failed') }
    finally { setUploadingQR(false) }
  }

  const triggerQRUpload = () => {
    if (qrInputRef.current) {
      qrInputRef.current.value = ''
      qrInputRef.current.click()
    }
  }

  const handleFormQRUpload = async (file: File) => {
    setUploadingFormQR(true)
    try {
      const body = new FormData()
      body.append('file', file)
      body.append('bucket', 'event-assets')
      body.append('folder', 'qr-codes')
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body,
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Upload failed'); return }
      const data = await res.json()
      setFormPaymentConfig(p => ({ ...p, qr_code_url: data.url }))
      notify('success', 'QR code uploaded')
    } catch { notify('error', 'QR code upload failed') }
    finally { setUploadingFormQR(false) }
  }

  const triggerFormQRUpload = () => {
    if (formQrInputRef.current) {
      formQrInputRef.current.value = ''
      formQrInputRef.current.click()
    }
  }

  const handleBackfill = async () => {
    setBackfilling(true)
    setShowBackfillConfirm(false)
    try {
      const res = await fetch('/api/admin/seed-defaults', {
        method: 'POST',
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Backfill failed'); return }
      const data = await res.json()
      notify('success', `Backfill complete — ${data.settingsCreated} settings, ${data.templatesCreated} templates across ${data.eventsProcessed} events`)
    } catch { notify('error', 'Failed to backfill') }
    finally { setBackfilling(false) }
  }

  const updateForm = (field: keyof EventFormData, value: unknown) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (field === 'name' && !editingId) {
      setFormData(prev => ({ ...prev, slug: slugify(value as string) }))
    }
  }

  const toggleFormat = (format: string) => {
    setFormData(prev => ({
      ...prev,
      formats: prev.formats.includes(format)
        ? prev.formats.filter(f => f !== format)
        : [...prev.formats, format],
    }))
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: 24 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 28, fontWeight: 700, color: '#fff', textTransform: 'uppercase', margin: 0 }}>Events</h1>
            <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Create and manage event campaigns</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={fetchEvents} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }} title="Refresh">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

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

        {/* Metrics */}
        {metrics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
            <MetricCard icon={<Calendar size={18} />} label="Total" value={metrics.total} />
            <MetricCard icon={<CheckCircle size={18} />} label="Published" value={metrics.published} color="#4ade80" />
            <MetricCard icon={<Edit size={18} />} label="Draft" value={metrics.draft} color="#facc15" />
            <MetricCard icon={<XCircle size={18} />} label="Cancelled" value={metrics.cancelled} color="#ff4444" />
            <MetricCard icon={<CheckCircle size={18} />} label="Completed" value={metrics.completed} color="#888" />
          </div>
        )}

        {/* Actions */}
        <div style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <button onClick={handleCreate} style={s.btn}>
            <Plus size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Create Event
          </button>
          <button onClick={() => setShowBackfillConfirm(true)} disabled={backfilling} style={{ ...s.btnSm, background: '#facc1520', color: '#facc15', ...(backfilling ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
            {backfilling ? <><Loader2 size={12} className="animate-spin" style={{ marginRight: 4 }} />Seeding...</> : 'Seed Defaults for All Events'}
          </button>
        </div>

        {/* Events Table */}
        {loading && events.length === 0 ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', fontSize: 14, padding: 40, justifyContent: 'center' }}>
            <Loader2 size={16} className="animate-spin" /> Loading events...
          </div>
        ) : (
          <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #222', background: '#111' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 800 }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222' }}>Name</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222' }}>Slug</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222' }}>Status</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222' }}>Date</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222' }}>Venue</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222' }}>Fee</th>
                  <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222' }}>Formats</th>
                  <th style={{ padding: '8px 10px', textAlign: 'center', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr><td colSpan={8} style={{ padding: 40, textAlign: 'center', color: '#666', fontSize: 14 }}>No events found. Create your first event.</td></tr>
                ) : events.map((event) => (
                  <tr key={event.id} style={{ transition: 'background 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                    <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a' }}>
                      <span style={{ color: '#fff', fontWeight: 600 }}>{event.name}</span>
                    </td>
                    <td style={{ padding: '8px 10px', fontSize: 12, color: '#888', borderBottom: '1px solid #1a1a1a', fontFamily: 'monospace' }}>{event.slug}</td>
                    <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a' }}><StatusBadge status={event.status} /></td>
                    <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a' }}>{event.date_label || (event.event_date ? new Date(event.event_date).toLocaleDateString() : '—')}</td>
                    <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a' }}>{event.venue || '—'}</td>
                    <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a' }}>{event.registration_fee ? `₹${event.registration_fee}` : 'Free'}</td>
                    <td style={{ padding: '8px 10px', fontSize: 12, color: '#888', borderBottom: '1px solid #1a1a1a' }}>
                      {event.formats?.map(f => f.format_name).join(', ') || '—'}
                    </td>
                    <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a', textAlign: 'center' }}>
                      <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap' }}>
                        <a href={`/events/${event.slug}`} target="_blank" rel="noopener noreferrer" style={{ ...s.btnSm, background: '#88888820', color: '#ccc', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                          <Eye size={12} /> View
                        </a>
                        {event.status !== 'published' && (
                          <button style={{ ...s.btnSm, background: '#4ade8020', color: '#4ade80' }} onClick={() => handlePublish(event.id)}>Publish</button>
                        )}
                        <button style={{ ...s.btnSm, background: '#88888820', color: '#ccc' }} onClick={() => handleEdit(event)}>
                          <Edit size={12} style={{ marginRight: 3, verticalAlign: 'middle' }} />Edit
                        </button>
                        <button style={{ ...s.btnSm, background: '#facc1520', color: '#facc15' }} onClick={() => { setPaymentConfigTarget(event.id); fetchPaymentConfig(event.id) }}>
                          <Wallet size={12} style={{ marginRight: 3, verticalAlign: 'middle' }} />Payment
                        </button>
                        <button style={{ ...s.btnSm, background: '#88888820', color: '#4ade80' }} onClick={() => { setAdminTarget(event.id); fetchAdmins(event.id) }}>
                          <Shield size={12} style={{ marginRight: 3, verticalAlign: 'middle' }} />Admins
                        </button>
                        <button style={{ ...s.btnSm, background: 'transparent', color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)' }} onClick={() => setConfirmDelete(event.id)}>
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

        {/* Create/Edit Modal */}
        {showForm && (
          <div style={s.overlay} onClick={() => !saving && setShowForm(false)}>
            <div style={s.modal} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: 0 }}>{editingId ? 'Edit Event' : 'Create Event'}</h3>
                <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 20 }}>&times;</button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={s.label}>Event Name *</label>
                  <input value={formData.name} onChange={(e) => updateForm('name', e.target.value)} style={s.input} placeholder="e.g. Rally Series 01" />
                </div>

                <div>
                  <label style={s.label}>Slug *</label>
                  <input value={formData.slug} onChange={(e) => updateForm('slug', e.target.value)} style={s.input} placeholder="e.g. rally-series-01" />
                </div>

                <div>
                  <label style={s.label}>Category</label>
                  <select value={formData.category} onChange={(e) => updateForm('category', e.target.value)} style={s.select}>
                    <option value="">Select category</option>
                    <option value="badminton">Badminton</option>
                    <option value="pickleball">Pickleball</option>
                    <option value="football">Football</option>
                    <option value="basketball">Basketball</option>
                    <option value="running">Running</option>
                    <option value="cycling">Cycling</option>
                    <option value="other">Other Sports</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={s.label}>Description</label>
                  <textarea value={formData.description} onChange={(e) => updateForm('description', e.target.value)} style={s.textarea} placeholder="Event description..." />
                </div>

                <div>
                  <label style={s.label}>Venue</label>
                  <input value={formData.venue} onChange={(e) => updateForm('venue', e.target.value)} style={s.input} placeholder="e.g. A2V Badminton Academy" />
                </div>

                <div>
                  <label style={s.label}>Event Date & Time</label>
                  <input type="datetime-local" value={formData.event_date} onChange={(e) => updateForm('event_date', e.target.value)} style={s.input} />
                </div>

                <div>
                  <label style={s.label}>Date Label (display text)</label>
                  <input value={formData.date_label} onChange={(e) => updateForm('date_label', e.target.value)} style={s.input} placeholder="e.g. 5 July 2026" />
                </div>

                <div>
                  <label style={s.label}>Time Label</label>
                  <input value={formData.time_label} onChange={(e) => updateForm('time_label', e.target.value)} style={s.input} placeholder="e.g. 11:00 AM – 7:00 PM" />
                </div>

                <div>
                  <label style={s.label}>Registration Fee (₹)</label>
                  <input type="number" value={formData.registration_fee} onChange={(e) => updateForm('registration_fee', Number(e.target.value))} style={s.input} />
                </div>

                <div>
                  <label style={s.label}>Enable Online Payments</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 48 }}>
                    <label style={{ color: '#ccc', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={formData.payment_enabled} onChange={(e) => updateForm('payment_enabled', e.target.checked)} />
                      Collect payment details during registration
                    </label>
                  </div>
                </div>

                {/* Payment Fields (shown only when payment is enabled) */}
                {formData.payment_enabled && (
                  <div style={{ gridColumn: '1 / -1', padding: 16, borderRadius: 8, border: '1px solid #333', background: '#151515' }}>
                    <h4 style={{ color: '#fff', fontSize: 13, fontWeight: 600, marginBottom: 12 }}>Payment Details</h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <label style={s.label}>UPI ID</label>
                        <input value={formPaymentConfig.upi_id} onChange={(e) => setFormPaymentConfig(p => ({ ...p, upi_id: e.target.value }))} style={s.input} placeholder="e.g. rallyverse@upi" />
                      </div>
                      <div>
                        <label style={s.label}>QR Code Image</label>
                        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
                          <input ref={formQrInputRef} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFormQRUpload(f) }} />
                          <button onClick={triggerFormQRUpload} disabled={uploadingFormQR} style={{ ...s.btnSm, background: '#38bdf820', color: '#38bdf8', ...(uploadingFormQR ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                            {uploadingFormQR ? <><Loader2 size={12} className="animate-spin" style={{ marginRight: 4 }} />Uploading...</> : <><Upload size={12} style={{ marginRight: 4 }} />Upload QR</>}
                          </button>
                          {formPaymentConfig.qr_code_url && (
                            <span style={{ color: '#4ade80', fontSize: 12 }}>QR uploaded</span>
                          )}
                          {formPaymentConfig.qr_code_url && (
                            <button onClick={() => setFormPaymentConfig(p => ({ ...p, qr_code_url: '' }))} style={{ ...s.btnSm, background: 'transparent', border: '1px solid rgba(255,68,68,0.3)', color: '#ff4444', fontSize: 11 }}>Remove</button>
                          )}
                        </div>
                        {formPaymentConfig.qr_code_url && (
                          <div style={{ marginTop: 8 }}>
                            <img src={formPaymentConfig.qr_code_url} alt="QR Code" style={{ width: 120, height: 120, borderRadius: 8, objectFit: 'contain', border: '1px solid #333' }} />
                          </div>
                        )}
                      </div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <label style={s.label}>Require UPI Transaction Reference Number</label>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                          <label style={{ color: '#ccc', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                            <input type="checkbox" checked={formPaymentConfig.transaction_ref_required ?? true} onChange={(e) => setFormPaymentConfig(p => ({ ...p, transaction_ref_required: e.target.checked }))} />
                            Require transaction reference ID during registration
                          </label>
                          <p style={{ color: '#666', fontSize: 11, margin: 0 }}>When enabled, participants must provide a UPI transaction reference number to complete registration.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Poster Upload */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={s.label}>Event Poster</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
                    <input ref={posterInputRef} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handlePosterUpload(f) }} />
                    <button onClick={triggerPosterUpload} disabled={uploadingPoster} style={{ ...s.btnSm, background: '#38bdf820', color: '#38bdf8', ...(uploadingPoster ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                      {uploadingPoster ? <><Loader2 size={12} className="animate-spin" style={{ marginRight: 4 }} />Uploading...</> : <><Upload size={12} style={{ marginRight: 4 }} />Upload Poster</>}
                    </button>
                    {formData.poster_url && (
                      <span style={{ color: '#4ade80', fontSize: 12 }}>Poster uploaded</span>
                    )}
                    {formData.poster_url && (
                      <button onClick={() => updateForm('poster_url', '')} style={{ ...s.btnSm, background: 'transparent', border: '1px solid rgba(255,68,68,0.3)', color: '#ff4444', fontSize: 11 }}>Remove</button>
                    )}
                  </div>
                </div>

                <div>
                  <label style={s.label}>Capacity</label>
                  <input type="number" value={formData.capacity} onChange={(e) => updateForm('capacity', Number(e.target.value))} style={s.input} />
                </div>

                <div>
                  <label style={s.label}>Rally Points</label>
                  <input type="number" value={formData.rally_points} onChange={(e) => updateForm('rally_points', Number(e.target.value))} style={s.input} />
                </div>

                <div>
                  <label style={s.label}>WhatsApp Number</label>
                  <input value={formData.whatsapp_number} onChange={(e) => updateForm('whatsapp_number', e.target.value)} style={s.input} placeholder="e.g. +919876543210" />
                </div>

                <div>
                  <label style={s.label}>WhatsApp Group Link</label>
                  <input value={formData.whatsapp_group_link} onChange={(e) => updateForm('whatsapp_group_link', e.target.value)} style={s.input} placeholder="e.g. https://chat.whatsapp.com/..." />
                </div>

                <div>
                  <label style={s.label}>Featured Event</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 48 }}>
                    <label style={{ color: '#ccc', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={formData.featured} onChange={(e) => updateForm('featured', e.target.checked)} />
                      Show this event first on the homepage
                    </label>
                  </div>
                </div>

                <div>
                  <label style={s.label}>Status</label>
                  <select value={formData.status} onChange={(e) => updateForm('status', e.target.value)} style={s.select}>
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label style={s.label}>Date Confirmed?</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, height: 48 }}>
                    <label style={{ color: '#ccc', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer' }}>
                      <input type="checkbox" checked={formData.is_date_confirmed} onChange={(e) => updateForm('is_date_confirmed', e.target.checked)} />
                      Yes, date is confirmed
                    </label>
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={s.label}>Available Formats</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                    {FORMAT_OPTIONS.map((fmt) => (
                      <label
                        key={fmt}
                        style={{
                          display: 'inline-flex', alignItems: 'center', gap: 6,
                          padding: '6px 12px', borderRadius: 4, cursor: 'pointer', fontSize: 13,
                          background: formData.formats.includes(fmt) ? '#4ade8020' : '#222',
                          color: formData.formats.includes(fmt) ? '#4ade80' : '#ccc',
                          border: `1px solid ${formData.formats.includes(fmt) ? '#4ade80' : '#333'}`,
                          transition: 'all 0.15s',
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={formData.formats.includes(fmt)}
                          onChange={() => toggleFormat(fmt)}
                          style={{ display: 'none' }}
                        />
                        {fmt}
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
                <button onClick={() => setShowForm(false)} disabled={saving} style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}>Cancel</button>
                <button
                  onClick={handleSave}
                  disabled={saving || !formData.name || !formData.slug}
                  style={{
                    ...s.btnSm, background: 'var(--rallyverse-gradient)', color: '#000', fontWeight: 700,
                    ...((saving || !formData.name || !formData.slug) ? { opacity: 0.6, cursor: 'not-allowed' } : {}),
                  }}
                >
                  {saving ? <><Loader2 size={12} className="animate-spin" style={{ marginRight: 4 }} />Saving...</> : (editingId ? 'Save Changes' : 'Create Event')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Payment Config Modal */}
        {paymentConfigTarget && (
          <div style={s.overlay} onClick={() => !savingPayment && setPaymentConfigTarget(null)}>
            <div style={{ ...s.modal, maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: 0 }}>Payment Configuration</h3>
                <button onClick={() => setPaymentConfigTarget(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 20 }}>&times;</button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>
                <div>
                  <label style={s.label}>UPI ID</label>
                  <input value={paymentConfig.upi_id} onChange={(e) => setPaymentConfig(p => ({ ...p, upi_id: e.target.value }))} style={s.input} placeholder="e.g. rallyverse@upi" />
                </div>
                <div>
                  <label style={s.label}>QR Code Image</label>
                  <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginTop: 4 }}>
                    <input ref={qrInputRef} type="file" accept="image/png,image/jpeg,image/webp" style={{ display: 'none' }} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleQRUpload(f) }} />
                    <button onClick={triggerQRUpload} disabled={uploadingQR} style={{ ...s.btnSm, background: '#38bdf820', color: '#38bdf8', ...(uploadingQR ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                      {uploadingQR ? <><Loader2 size={12} className="animate-spin" style={{ marginRight: 4 }} />Uploading...</> : <><Upload size={12} style={{ marginRight: 4 }} />Upload QR Code</>}
                    </button>
                    {paymentConfig.qr_code_url && (
                      <span style={{ color: '#4ade80', fontSize: 12 }}>QR uploaded</span>
                    )}
                    {paymentConfig.qr_code_url && (
                      <button onClick={() => setPaymentConfig(p => ({ ...p, qr_code_url: '' }))} style={{ ...s.btnSm, background: 'transparent', border: '1px solid rgba(255,68,68,0.3)', color: '#ff4444', fontSize: 11 }}>Remove</button>
                    )}
                  </div>
                  {paymentConfig.qr_code_url && (
                    <div style={{ marginTop: 8 }}>
                      <img src={paymentConfig.qr_code_url} alt="QR Code" style={{ width: 120, height: 120, borderRadius: 8, objectFit: 'contain', border: '1px solid #333' }} />
                    </div>
                  )}
                </div>
                <div>
                  <label style={s.label}>Require UPI Transaction Reference Number</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <label style={{ color: '#ccc', fontSize: 13, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                      <input type="checkbox" checked={paymentConfig.transaction_ref_required ?? true} onChange={(e) => setPaymentConfig(p => ({ ...p, transaction_ref_required: e.target.checked }))} />
                      Require transaction reference ID during registration
                    </label>
                    <p style={{ color: '#666', fontSize: 11, margin: 0 }}>When enabled, participants must provide a UPI transaction reference number to complete registration.</p>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
                <button onClick={() => setPaymentConfigTarget(null)} disabled={savingPayment} style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}>Cancel</button>
                <button onClick={handleSavePaymentConfig} disabled={savingPayment} style={{ ...s.btnSm, background: 'var(--rallyverse-gradient)', color: '#000', fontWeight: 700, ...(savingPayment ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                  {savingPayment ? <><Loader2 size={12} className="animate-spin" style={{ marginRight: 4 }} />Saving...</> : 'Save Payment Config'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Event Admins Modal */}
        {adminTarget && (
          <div style={s.overlay} onClick={() => setAdminTarget(null)}>
            <div style={{ ...s.modal, maxWidth: 500 }} onClick={(e) => e.stopPropagation()}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: 0 }}>Event Admins</h3>
                <button onClick={() => { setAdminTarget(null); setEventAdmins([]) }} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 20 }}>&times;</button>
              </div>

              {createdAdminToken && (
                <div style={{ marginBottom: 16, padding: 12, borderRadius: 6, background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)' }}>
                  <p style={{ color: '#4ade80', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Invitation Sent ✓</p>
                  <p style={{ color: '#ccc', fontSize: 12 }}>A password reset email has been sent to <strong>{createdAdminToken}</strong>. They can use it to set their own password and log in.</p>
                </div>
              )}

              {/* Add admin form */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                <input value={newAdminName} onChange={(e) => setNewAdminName(e.target.value)} style={{ ...s.input, flex: 1 }} placeholder="Admin name" />
                <input value={newAdminEmail} onChange={(e) => setNewAdminEmail(e.target.value)} style={{ ...s.input, flex: 1 }} placeholder="Admin email" />
                <button onClick={handleAddAdmin} disabled={savingAdmin || !newAdminName || !newAdminEmail} style={{ ...s.btnSm, background: '#4ade80', color: '#000', fontWeight: 700, whiteSpace: 'nowrap', ...((savingAdmin || !newAdminName || !newAdminEmail) ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                  {savingAdmin ? <Loader2 size={12} className="animate-spin" /> : 'Add'}
                </button>
              </div>

              {/* Admin list */}
              {loadingAdmins ? (
                <div style={{ color: '#888', fontSize: 13, padding: 20, textAlign: 'center' }}><Loader2 size={14} className="animate-spin" /> Loading...</div>
              ) : eventAdmins.length === 0 ? (
                <div style={{ color: '#666', fontSize: 13, padding: 20, textAlign: 'center' }}>No admins assigned yet</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {eventAdmins.map((admin) => (
                    <div key={admin.id} style={{ padding: 12, borderRadius: 6, border: '1px solid #333', background: '#111' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ color: '#fff', fontSize: 13, fontWeight: 600, margin: 0 }}>{admin.name}</p>
                          <p style={{ color: '#888', fontSize: 12, margin: '2px 0 0 0' }}>{admin.email}</p>
                        </div>
                        <div style={{ display: 'flex', gap: 4 }}>
                          <button onClick={() => handleShowToken(admin.id)} style={{ ...s.btnSm, background: '#88888820', color: '#ccc', fontSize: 11 }}>
                            {tokenLoading[admin.id] ? <Loader2 size={11} className="animate-spin" /> : (visibleToken[admin.id] ? 'Hide' : 'Token')}
                          </button>
                          <button onClick={() => setConfirmRegen(admin.id)} style={{ ...s.btnSm, background: '#facc1520', color: '#facc15', fontSize: 11 }}>Regen</button>
                          <button onClick={() => handleRemoveAdmin(admin.id)} style={{ ...s.btnSm, background: 'transparent', color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      {visibleToken[admin.id] && (
                        <div style={{ marginTop: 8, padding: '8px 10px', borderRadius: 4, background: '#222', display: 'flex', alignItems: 'center', gap: 6 }}>
                          <code style={{ flex: 1, fontSize: 11, color: '#4ade80', overflow: 'hidden', textOverflow: 'ellipsis' }}>{visibleToken[admin.id]}</code>
                          <button onClick={() => copyToClipboard(visibleToken[admin.id]!)} style={{ ...s.btnSm, background: '#4ade80', color: '#000', fontSize: 11, fontWeight: 700 }}>
                            {copiedToken === visibleToken[admin.id] ? <CheckCircle size={11} /> : <Copy size={11} />}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Regenerate Token Confirmation */}
        {confirmRegen && (
          <div style={s.overlay} onClick={() => setConfirmRegen(null)}>
            <div style={{ ...s.modal, maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Regenerate Token</h3>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>This will invalidate the current token. The admin will need to log in again with the new token. Continue?</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setConfirmRegen(null)} style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}>Cancel</button>
                <button onClick={() => handleRegenToken(confirmRegen)} style={{ ...s.btnSm, background: '#facc15', color: '#000', fontWeight: 700 }}>Regenerate</button>
              </div>
            </div>
          </div>
        )}

        {/* Delete Confirmation */}
        {confirmDelete && (
          <div style={s.overlay} onClick={() => setConfirmDelete(null)}>
            <div style={{ ...s.modal, maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Delete Event</h3>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>Are you sure? This will permanently delete this event, all registrations, payment config, admins, and formats. This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setConfirmDelete(null)} style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}>Cancel</button>
                <button onClick={() => handleDelete(confirmDelete)} style={s.btnDanger}>Delete</button>
              </div>
            </div>
          </div>
        )}

        {/* Backfill Confirmation */}
        {showBackfillConfirm && (
          <div style={s.overlay} onClick={() => setShowBackfillConfirm(false)}>
            <div style={{ ...s.modal, maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Seed Defaults for All Events</h3>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>
                This will create default email settings and templates for all existing events that are missing them. Existing records will not be duplicated. Continue?
              </p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setShowBackfillConfirm(false)} style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}>Cancel</button>
                <button onClick={handleBackfill} disabled={backfilling} style={{ ...s.btnSm, background: '#facc15', color: '#000', fontWeight: 700, ...(backfilling ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                  {backfilling ? <Loader2 size={12} className="animate-spin" /> : 'Seed Defaults'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
