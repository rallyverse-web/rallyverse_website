'use client'

import { useCallback, useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Eye, Loader2, RefreshCw, Calendar, Users, CheckCircle, XCircle } from 'lucide-react'
import type { EventWithFormats, EventFormData, AdminEventMetrics, EventStatus } from '@/lib/types/supabase'

const FORMAT_OPTIONS = [
  "Men's Singles", "Women's Singles", "Men's Doubles", "Women's Doubles", "Mixed Doubles",
]

const defaultForm: EventFormData = {
  name: '', slug: '', description: '', category: '', venue: '',
  event_date: '', date_label: '', time_label: '', is_date_confirmed: true,
  registration_fee: 0, payment_info: '', capacity: 0, rally_points: 0,
  poster_url: '', image_url: '', status: 'draft', formats: [],
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
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [authError, setAuthError] = useState('')

  const [events, setEvents] = useState<EventWithFormats[]>([])
  const [metrics, setMetrics] = useState<AdminEventMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<EventFormData>(defaultForm)
  const [saving, setSaving] = useState(false)

  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const authHeaders = useCallback(() => ({ Authorization: `Bearer ${token}` }), [token])

  const fetchEvents = useCallback(async () => {
    setLoading(true)
    setAuthError('')
    try {
      const res = await fetch('/api/admin/events', { headers: authHeaders() })
      if (res.status === 401) { setToken(''); setAuthError('Invalid password'); return }
      if (!res.ok) { setAuthError('Failed to load events'); return }
      const data = await res.json()
      setEvents(data.events || [])
      setMetrics(data.metrics || null)
    } catch { setAuthError('Failed to connect to server') }
    finally { setLoading(false) }
  }, [authHeaders])

  useEffect(() => { if (token) fetchEvents() }, [token, fetchEvents])

  const handleCreate = () => {
    setEditingId(null)
    setFormData(defaultForm)
    setShowForm(true)
  }

  const handleEdit = (event: EventWithFormats) => {
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
      payment_info: event.payment_info || '',
      capacity: event.capacity ?? 0,
      rally_points: event.rally_points ?? 0,
      poster_url: event.poster_url || '',
      image_url: event.image_url || '',
      status: event.status,
      formats: event.formats?.map(f => f.format_name) || [],
    })
    setShowForm(true)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (editingId) {
        const res = await fetch('/api/admin/events', {
          method: 'PUT',
          headers: authHeaders(),
          body: JSON.stringify({ id: editingId, ...formData }),
        })
        if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Update failed'); return }
        notify('success', 'Event updated successfully')
      } else {
        const res = await fetch('/api/admin/events', {
          method: 'POST',
          headers: authHeaders(),
          body: JSON.stringify(formData),
        })
        if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Create failed'); return }
        notify('success', 'Event created successfully')
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
        headers: authHeaders(),
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
        headers: authHeaders(),
        body: JSON.stringify({ id, action: 'publish' }),
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Publish failed'); return }
      notify('success', 'Event published')
      fetchEvents()
    } catch { notify('error', 'Failed to publish event') }
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

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', padding: 24 }}>
        <form onSubmit={(e) => { e.preventDefault(); setAuthError(''); setToken(password) }} style={{ width: '100%', maxWidth: 400, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ textAlign: 'center', marginBottom: 8 }}>
            <Users size={40} style={{ color: '#e5e5e5', margin: '0 auto 12px' }} />
            <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 24, fontWeight: 700, color: '#fff', textTransform: 'uppercase' }}>Events Admin</h1>
          </div>
          <input type="password" placeholder="Enter admin password" value={password} onChange={(e) => setPassword(e.target.value)} style={s.input} autoFocus />
          {authError && <p style={{ color: '#ff4444', fontSize: 13 }}>{authError}</p>}
          <button type="submit" style={password ? s.btn : { ...s.btn, opacity: 0.6, cursor: 'not-allowed' }} disabled={!password}>Sign In</button>
        </form>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: 24 }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 28, fontWeight: 700, color: '#fff', textTransform: 'uppercase', margin: 0 }}>Events</h1>
            <a href="/admin" style={{ color: '#888', fontSize: 12, textDecoration: 'none' }}>&larr; Back to Registrations</a>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={fetchEvents} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888', padding: 4 }} title="Refresh">
              <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
            </button>
            <button onClick={() => { setToken(''); setEvents([]); setMetrics(null); setNotification(null); setAuthError('') }} style={{ ...s.btn, background: 'transparent', border: '1px solid #333', fontSize: 13 }}>Sign Out</button>
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
        <div style={{ marginBottom: 16 }}>
          <button onClick={handleCreate} style={s.btn}>
            <Plus size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />
            Create Event
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
                    <option value="trek">Trek</option>
                    <option value="marathon">Marathon</option>
                    <option value="cycling">Cycling</option>
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
                  <label style={s.label}>Payment Info</label>
                  <input value={formData.payment_info} onChange={(e) => updateForm('payment_info', e.target.value)} style={s.input} placeholder="UPI ID, QR instructions, etc." />
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
                  <label style={s.label}>Poster URL</label>
                  <input value={formData.poster_url} onChange={(e) => updateForm('poster_url', e.target.value)} style={s.input} placeholder="/posters/color_poster.png" />
                </div>

                <div>
                  <label style={s.label}>Image URL</label>
                  <input value={formData.image_url} onChange={(e) => updateForm('image_url', e.target.value)} style={s.input} placeholder="https://picsum.photos/..." />
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

        {/* Delete Confirmation */}
        {confirmDelete && (
          <div style={s.overlay} onClick={() => setConfirmDelete(null)}>
            <div style={{ ...s.modal, maxWidth: 400 }} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 12 }}>Delete Event</h3>
              <p style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>Are you sure? This will permanently delete this event and its formats. This action cannot be undone.</p>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button onClick={() => setConfirmDelete(null)} style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}>Cancel</button>
                <button onClick={() => handleDelete(confirmDelete)} style={s.btnDanger}>Delete</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
