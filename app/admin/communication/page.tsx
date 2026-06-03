'use client'

import { useCallback, useEffect, useState } from 'react'
import { useAdminAuth } from '../AdminAuthContext'
import { useRouter } from 'next/navigation'
import { Mail, Plus, Edit, Trash2, Copy, Eye, Send, Loader2, RefreshCw, FileText, History, CheckCircle, XCircle, ShieldAlert, Users } from 'lucide-react'
import type { EmailTemplate, EmailTemplateType, EventEmailSettings, EmailLog } from '@/lib/types/supabase'
import { getTemplateVariableDefinitions } from '@/lib/template-renderer'

const TEMPLATE_TYPES: { value: EmailTemplateType; label: string }[] = [
  { value: 'approval', label: 'Approval' },
  { value: 'rejection', label: 'Rejection' },
  { value: 'reminder', label: 'Reminder' },
  { value: 'results', label: 'Results' },
  { value: 'broadcast', label: 'Broadcast' },
]

const VARIABLE_DEFS = getTemplateVariableDefinitions()

const s = {
  input: { width: '100%', height: 48, padding: '0 16px', borderRadius: 6, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none' } as React.CSSProperties,
  textarea: { width: '100%', padding: '12px 16px', borderRadius: 6, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none', resize: 'vertical' as const, minHeight: 150 } as React.CSSProperties,
  select: { width: '100%', height: 48, padding: '0 16px', borderRadius: 6, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none', cursor: 'pointer' } as React.CSSProperties,
  btn: { height: 40, padding: '0 20px', borderRadius: 6, border: 'none', background: 'var(--rallyverse-gradient)', color: '#fff', fontSize: 13, fontWeight: 700, cursor: 'pointer' } as React.CSSProperties,
  btnSm: { height: 32, padding: '0 12px', borderRadius: 4, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' as const } as React.CSSProperties,
  card: { padding: 20, borderRadius: 8, border: '1px solid #222', background: '#111' } as React.CSSProperties,
  label: { display: 'block', color: '#888', fontSize: 12, marginBottom: 4 },
  overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 20 },
  modal: { background: '#1a1a1a', borderRadius: 8, border: '1px solid #333', maxWidth: 700, width: '100%', maxHeight: '90vh', overflowY: 'auto' as const, padding: 24 },
}

type Tab = 'templates' | 'test-email' | 'send-email' | 'logs'

export default function AdminCommunicationPage() {
  const router = useRouter()
  const { token, logout } = useAdminAuth()
  const [activeTab, setActiveTab] = useState<Tab>('templates')
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [events, setEvents] = useState<Array<{ id: string; name: string }>>([])

  const notify = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const authHeaders = useCallback(() => ({ Authorization: `Bearer ${token}` }), [token])

  // ─── Events ───
  const fetchEvents = useCallback(async () => {
    if (!token) return
    try {
      const res = await fetch('/api/admin/events', { headers: authHeaders() })
      if (res.status === 401) { logout(); return }
      if (res.ok) { const d = await res.json(); setEvents(d.events || []) }
    } catch {}
  }, [authHeaders, logout, token])

  useEffect(() => { if (token) fetchEvents() }, [token, fetchEvents])

  // ─── Templates ───
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [selectedEventId, setSelectedEventId] = useState('')
  const [showTemplateForm, setShowTemplateForm] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null)
  const [templateForm, setTemplateForm] = useState({ template_type: 'approval' as EmailTemplateType, subject: '', content: '' })
  const [savingTemplate, setSavingTemplate] = useState(false)
  const [previewResult, setPreviewResult] = useState<{ subject: string; content: string } | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [settings, setSettings] = useState<EventEmailSettings | null>(null)

  const fetchTemplates = useCallback(async () => {
    if (!selectedEventId) return
    try {
      const res = await fetch(`/api/admin/email-templates/${selectedEventId}`, { headers: authHeaders() })
      if (res.ok) { const d = await res.json(); setTemplates(d.templates || []) }
    } catch {}
  }, [selectedEventId, authHeaders])

  const fetchSettings = useCallback(async () => {
    if (!selectedEventId) return
    try {
      const res = await fetch(`/api/admin/email-settings/${selectedEventId}`, { headers: authHeaders() })
      if (res.ok) { const d = await res.json(); setSettings(d.settings || null) }
    } catch {}
  }, [selectedEventId, authHeaders])

  useEffect(() => { fetchTemplates(); fetchSettings() }, [fetchTemplates, fetchSettings])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowTemplateForm(false)
        setPreviewResult(null)
        setShowSendConfirm(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleCreateTemplate = async () => {
    if (!selectedEventId) return
    setSavingTemplate(true)
    try {
      const res = await fetch(`/api/admin/email-templates/${selectedEventId}`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify(templateForm),
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Failed'); return }
      notify('success', 'Template created')
      setShowTemplateForm(false)
      setTemplateForm({ template_type: 'approval', subject: '', content: '' })
      fetchTemplates()
    } catch { notify('error', 'Failed to create template') }
    finally { setSavingTemplate(false) }
  }

  const handleEditTemplate = async () => {
    if (!editingTemplate) return
    setSavingTemplate(true)
    try {
      const res = await fetch(`/api/admin/email-templates/${selectedEventId}/${editingTemplate}`, {
        method: 'PUT', headers: authHeaders(),
        body: JSON.stringify(templateForm),
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Failed'); return }
      notify('success', 'Template updated')
      setShowTemplateForm(false)
      setEditingTemplate(null)
      setTemplateForm({ template_type: 'approval', subject: '', content: '' })
      fetchTemplates()
    } catch { notify('error', 'Failed to update template') }
    finally { setSavingTemplate(false) }
  }

  const handleDeleteTemplate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/email-templates/${selectedEventId}/${id}`, {
        method: 'DELETE', headers: authHeaders(),
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Failed'); return }
      notify('success', 'Template deleted')
      fetchTemplates()
    } catch { notify('error', 'Failed to delete template') }
  }

  const handleDuplicateTemplate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/email-templates/${id}/duplicate`, {
        method: 'POST', headers: authHeaders(),
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Failed'); return }
      notify('success', 'Template duplicated')
      fetchTemplates()
    } catch { notify('error', 'Failed to duplicate template') }
  }

  const openEdit = (tpl: EmailTemplate) => {
    setEditingTemplate(tpl.id)
    setTemplateForm({ template_type: tpl.template_type, subject: tpl.subject, content: tpl.content })
    setShowTemplateForm(true)
  }

  const handlePreview = async (tpl: EmailTemplate) => {
    setPreviewLoading(true)
    setPreviewResult(null)
    try {
      const mockVars: Record<string, string> = {
        participant_name: 'Aditya',
        event_name: events.find(e => e.id === selectedEventId)?.name || 'Rally Series 01',
        event_date: '5 July 2026',
        event_venue: 'A2V Badminton Academy',
        format: "Men's Doubles",
        registration_status: 'Approved',
        support_email: settings?.support_email || 'support@rallyverse.social',
        whatsapp_number: '+91 89517 60369',
      }
      const res = await fetch(`/api/admin/email-templates/${tpl.id}/preview`, {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({ variables: mockVars }),
      })
      if (res.ok) { const d = await res.json(); setPreviewResult({ subject: d.subject, content: d.content }) }
      else notify('error', 'Failed to preview')
    } catch { notify('error', 'Failed to preview') }
    finally { setPreviewLoading(false) }
  }

  // ─── Test Email ───
  const [testEmailEventId, setTestEmailEventId] = useState('')
  const [testTemplateId, setTestTemplateId] = useState('')
  const [testRecipient, setTestRecipient] = useState('')
  const [sendingTest, setSendingTest] = useState(false)

  const handleSendTest = async () => {
    if (!testEmailEventId || !testTemplateId || !testRecipient) return
    setSendingTest(true)
    try {
      const res = await fetch('/api/admin/test-email', {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({
          event_id: testEmailEventId,
          template_id: testTemplateId,
          recipient_email: testRecipient,
          variables: {}
        }),
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Failed to send'); setSendingTest(false); return }
      notify('success', 'Test email sent')
      setTestRecipient('')
    } catch { notify('error', 'Failed to send test email') }
    finally { setSendingTest(false) }
  }

  // ─── Send Email ───
  const [sendEmailEventId, setSendEmailEventId] = useState('')
  const [sendTemplateType, setSendTemplateType] = useState<EmailTemplateType>('broadcast')
  const [sendAudience, setSendAudience] = useState('all')
  const [sendFormat, setSendFormat] = useState('')
  const [sendIncludeWhatsapp, setSendIncludeWhatsapp] = useState(true)
  const [sendCount, setSendCount] = useState(0)
  const [loadingCount, setLoadingCount] = useState(false)
  const [showSendConfirm, setShowSendConfirm] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<{ total: number; sent: number; failed: number } | null>(null)

  const handleEstimateCount = async () => {
    setLoadingCount(true)
    try {
      const params = new URLSearchParams({ eventId: sendEmailEventId, audience: sendAudience })
      if (sendFormat) params.set('format', sendFormat)
      const res = await fetch(`/api/admin/send-email?${params}`, { headers: authHeaders() })
      if (res.ok) { const d = await res.json(); setSendCount(d.count) }
    } catch {}
    finally { setLoadingCount(false) }
  }

  const handleSendEmails = async () => {
    if (sendResult) { setShowSendConfirm(false); setSendResult(null); setSendCount(0); return }
    setSending(true)
    try {
      const res = await fetch('/api/admin/send-email', {
        method: 'POST', headers: authHeaders(),
        body: JSON.stringify({
          event_id: sendEmailEventId,
          template_type: sendTemplateType,
          audience: sendAudience,
          format: sendFormat || undefined,
          include_whatsapp: sendIncludeWhatsapp,
        }),
      })
      if (!res.ok) { const d = await res.json(); notify('error', d.error || 'Failed'); setSending(false); return }
      const d = await res.json()
      setSendResult({ total: d.total, sent: d.sent, failed: d.failed })
      notify('success', `Sent ${d.sent} of ${d.total} emails`)
    } catch { notify('error', 'Failed to send emails') }
    finally { setSending(false) }
  }

  // ─── Logs ───
  const [logs, setLogs] = useState<EmailLog[]>([])
  const [logsEventId, setLogsEventId] = useState('')
  const [loadingLogs, setLoadingLogs] = useState(false)
  const [logFilterTemplateType, setLogFilterTemplateType] = useState('')
  const [logFilterStatus, setLogFilterStatus] = useState('')
  const [logFilterDateFrom, setLogFilterDateFrom] = useState('')
  const [logFilterDateTo, setLogFilterDateTo] = useState('')

  const fetchLogs = useCallback(async () => {
    setLoadingLogs(true)
    try {
      const params = new URLSearchParams()
      if (logsEventId) params.set('eventId', logsEventId)
      if (logFilterTemplateType) params.set('templateType', logFilterTemplateType)
      if (logFilterStatus) params.set('status', logFilterStatus)
      if (logFilterDateFrom) params.set('dateFrom', logFilterDateFrom)
      if (logFilterDateTo) params.set('dateTo', logFilterDateTo)
      const res = await fetch(`/api/admin/email-logs?${params}`, { headers: authHeaders() })
      if (res.ok) { const d = await res.json(); setLogs(d.logs || []) }
    } catch {}
    finally { setLoadingLogs(false) }
  }, [logsEventId, logFilterTemplateType, logFilterStatus, logFilterDateFrom, logFilterDateTo, authHeaders])

  useEffect(() => { if (token) fetchLogs() }, [fetchLogs, token])

  const downloadLogsCSV = () => {
    if (logs.length === 0) return
    const headers = ['Recipient', 'Subject', 'Status', 'Sent At']
    const rows = logs.map(l => [l.recipient_email, l.subject, l.status, new Date(l.created_at).toLocaleString('en-IN')].join(','))
    const csv = [headers.join(','), ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'email-logs.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'templates', label: 'Templates', icon: <FileText size={14} /> },
    { key: 'test-email', label: 'Test Emails', icon: <Send size={14} /> },
    { key: 'send-email', label: 'Send Email', icon: <Users size={14} /> },
    { key: 'logs', label: 'Logs', icon: <History size={14} /> },
  ]

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display, sans-serif)', fontSize: 28, fontWeight: 700, color: '#fff', textTransform: 'uppercase', margin: 0 }}>Communication</h1>
          <p style={{ color: '#666', fontSize: 13, marginTop: 4 }}>Manage email templates, send notifications and check log files</p>
        </div>
      </div>

      {notification && (
        <div style={{ padding: '10px 16px', borderRadius: 6, fontSize: 13, fontWeight: 600, marginBottom: 16, background: notification.type === 'success' ? 'rgba(74,222,128,0.12)' : 'rgba(255,68,68,0.12)', border: `1px solid ${notification.type === 'success' ? 'rgba(74,222,128,0.3)' : 'rgba(255,68,68,0.3)'}`, color: notification.type === 'success' ? '#4ade80' : '#ff4444' }}>
          {notification.message}
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid #222' }}>
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', fontSize: 13, fontWeight: 600,
              color: activeTab === tab.key ? '#fff' : '#888', background: 'none', border: 'none', cursor: 'pointer',
              borderBottom: activeTab === tab.key ? '2px solid #ff5e00' : '2px solid transparent', transition: 'all 0.15s',
            }}>
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* ─── TEMPLATES TAB ─── */}
        {activeTab === 'templates' && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
              <select value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} style={{ ...s.select, width: 300 }}>
                <option value="">Select an event</option>
                {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <button onClick={() => { setEditingTemplate(null); setTemplateForm({ template_type: 'approval', subject: '', content: '' }); setShowTemplateForm(true) }} style={s.btn} disabled={!selectedEventId}>
                <Plus size={14} style={{ marginRight: 6, verticalAlign: 'middle' }} />Create Template
              </button>
            </div>

            {selectedEventId && templates.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: '#666', fontSize: 14 }}>No templates yet. Create your first template.</div>
            )}

            {selectedEventId && templates.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {templates.map(tpl => (
                  <div key={tpl.id} style={{ padding: 16, borderRadius: 8, border: '1px solid #222', background: '#111' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Mail size={16} color="#888" />
                        <span style={{ color: '#fff', fontWeight: 600, fontSize: 14 }}>{tpl.template_type.charAt(0).toUpperCase() + tpl.template_type.slice(1)}</span>
                        <span style={{ color: '#888', fontSize: 12 }}>{tpl.subject || 'No subject'}</span>
                      </div>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button onClick={() => handlePreview(tpl)} disabled={previewLoading} style={{ ...s.btnSm, background: '#88888820', color: '#ccc' }}>
                          {previewLoading ? <Loader2 size={12} className="animate-spin" /> : <Eye size={12} />}
                        </button>
                        <button onClick={() => handleDuplicateTemplate(tpl.id)} style={{ ...s.btnSm, background: '#88888820', color: '#ccc' }}>
                          <Copy size={12} />
                        </button>
                        <button onClick={() => openEdit(tpl)} style={{ ...s.btnSm, background: '#88888820', color: '#ccc' }}>
                          <Edit size={12} />
                        </button>
                        <button onClick={() => handleDeleteTemplate(tpl.id)} style={{ ...s.btnSm, background: 'transparent', color: '#ff4444', border: '1px solid rgba(255,68,68,0.3)' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                    {tpl.content && (
                      <p style={{ color: '#666', fontSize: 12, marginTop: 8, maxHeight: 40, overflow: 'hidden' }}>{tpl.content.slice(0, 200)}</p>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Preview Modal */}
            {previewResult && (
              <div style={s.overlay} onClick={() => setPreviewResult(null)}>
                <div style={{ ...s.modal, maxWidth: 700 }} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                    <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: 0 }}>Email Preview</h3>
                    <button onClick={() => setPreviewResult(null)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 20 }}>&times;</button>
                  </div>
                  <div style={{ marginBottom: 12, padding: 12, borderRadius: 6, background: '#222' }}>
                    <p style={{ color: '#888', fontSize: 12, marginBottom: 4 }}>Subject</p>
                    <p style={{ color: '#fff', fontSize: 14 }}>{previewResult.subject}</p>
                  </div>
                  <div style={{ border: '1px solid #333', borderRadius: 6, overflow: 'hidden' }}>
                    <iframe srcDoc={previewResult.content} style={{ width: '100%', height: 400, border: 'none', background: '#fff' }} title="Email Preview" />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                    <button onClick={() => setPreviewResult(null)} style={{ ...s.btnSm, background: '#88888820', color: '#ccc' }}>Close</button>
                  </div>
                </div>
              </div>
            )}

            {/* Template Form Modal */}
            {showTemplateForm && (
              <div style={s.overlay} onClick={() => !savingTemplate && setShowTemplateForm(false)}>
                <div style={s.modal} onClick={(e) => e.stopPropagation()}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                    <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: 0 }}>{editingTemplate ? 'Edit Template' : 'Create Template'}</h3>
                    <button onClick={() => setShowTemplateForm(false)} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: 20 }}>&times;</button>
                  </div>

                  <div style={{ display: 'grid', gap: 14 }}>
                    <div>
                      <label style={s.label}>Template Type</label>
                      <select value={templateForm.template_type} onChange={(e) => setTemplateForm(f => ({ ...f, template_type: e.target.value as EmailTemplateType }))} style={s.select}>
                        {TEMPLATE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={s.label}>Subject</label>
                      <input value={templateForm.subject} onChange={(e) => setTemplateForm(f => ({ ...f, subject: e.target.value }))} style={s.input} placeholder="e.g. Registration Approved - {{event_name}}" />
                    </div>
                    <div>
                      <label style={s.label}>Content (HTML)</label>
                      <textarea value={templateForm.content} onChange={(e) => setTemplateForm(f => ({ ...f, content: e.target.value }))} style={s.textarea} placeholder="<h1>Hi {{participant_name}},</h1><p>Your registration for {{event_name}} has been {{registration_status}}.</p>" />
                    </div>

                    {/* Available Variables */}
                    <div style={{ padding: 12, borderRadius: 6, background: '#222' }}>
                      <p style={{ color: '#888', fontSize: 12, fontWeight: 600, marginBottom: 8 }}>Available Variables</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {VARIABLE_DEFS.map(v => (
                          <button key={v.key} type="button" onClick={() => setTemplateForm(f => ({ ...f, content: f.content + `{{${v.key}}}` }))} style={{ ...s.btnSm, background: '#333', color: '#4ade80', fontSize: 11, cursor: 'pointer' }} title={v.description}>
                            {'{{' + v.key + '}}'}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 20 }}>
                    <button onClick={() => setShowTemplateForm(false)} disabled={savingTemplate} style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}>Cancel</button>
                    <button onClick={editingTemplate ? handleEditTemplate : handleCreateTemplate} disabled={savingTemplate || !templateForm.subject || !templateForm.content} style={{ ...s.btnSm, background: 'var(--rallyverse-gradient)', color: '#000', fontWeight: 700, ...((savingTemplate || !templateForm.subject || !templateForm.content) ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                      {savingTemplate ? <><Loader2 size={12} className="animate-spin" style={{ marginRight: 4 }} />Saving...</> : (editingTemplate ? 'Save Changes' : 'Create Template')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── TEST EMAIL TAB ─── */}
        {activeTab === 'test-email' && (
          <div>
            <div style={{ maxWidth: 500, ...s.card }}>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Send size={16} color="#888" /> Send Test Email
              </h3>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={s.label}>Event</label>
                  <select value={testEmailEventId} onChange={(e) => { setTestEmailEventId(e.target.value); setTestTemplateId('') }} style={s.select}>
                    <option value="">Select an event</option>
                    {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Template</label>
                  <select value={testTemplateId} onChange={(e) => setTestTemplateId(e.target.value)} style={s.select} disabled={!testEmailEventId}>
                    <option value="">Select a template</option>
                    {templates
                      .filter(t => t.event_id === testEmailEventId)
                      .map(t => <option key={t.id} value={t.id}>{t.template_type} - {t.subject || 'No subject'}</option>)
                    }
                  </select>
                </div>
                <div>
                  <label style={s.label}>Recipient Email</label>
                  <input value={testRecipient} onChange={(e) => setTestRecipient(e.target.value)} style={s.input} placeholder="admin@example.com" type="email" />
                </div>
                <button onClick={handleSendTest} disabled={sendingTest || !testEmailEventId || !testTemplateId || !testRecipient} style={{ ...s.btn, ...((sendingTest || !testEmailEventId || !testTemplateId || !testRecipient) ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                  {sendingTest ? <><Loader2 size={14} className="animate-spin" style={{ marginRight: 6 }} />Sending...</> : 'Send Test Email'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ─── SEND EMAIL TAB ─── */}
        {activeTab === 'send-email' && (
          <div>
            <div style={{ maxWidth: 600, ...s.card }}>
              <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Send size={16} color="#888" /> Send Email to Participants
              </h3>
              <div style={{ display: 'grid', gap: 14 }}>
                <div>
                  <label style={s.label}>Event</label>
                  <select value={sendEmailEventId} onChange={(e) => { setSendEmailEventId(e.target.value); setSendCount(0) }} style={s.select}>
                    <option value="">Select an event</option>
                    {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Template Type</label>
                  <select value={sendTemplateType} onChange={(e) => setSendTemplateType(e.target.value as EmailTemplateType)} style={s.select}>
                    {TEMPLATE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                <div>
                  <label style={s.label}>Audience</label>
                  <select value={sendAudience} onChange={(e) => { setSendAudience(e.target.value); setSendCount(0); setSendFormat('') }} style={s.select}>
                    <option value="all">All Registrations</option>
                    <option value="approved">Approved Participants</option>
                    <option value="pending">Pending Participants</option>
                    <option value="rejected">Rejected Participants</option>
                  </select>
                </div>
                <div>
                  <label style={s.label}>Format (optional)</label>
                  <select value={sendFormat} onChange={(e) => { setSendFormat(e.target.value); setSendCount(0) }} style={s.select}>
                    <option value="">All Formats</option>
                    <option value="Men's Singles">Men's Singles</option>
                    <option value="Women's Singles">Women's Singles</option>
                    <option value="Men's Doubles">Men's Doubles</option>
                    <option value="Women's Doubles">Women's Doubles</option>
                    <option value="Mixed Doubles">Mixed Doubles</option>
                  </select>
                </div>
                {sendTemplateType === 'reminder' && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input type="checkbox" id="adminIncludeWhatsapp" checked={sendIncludeWhatsapp} onChange={(e) => setSendIncludeWhatsapp(e.target.checked)} />
                    <label htmlFor="adminIncludeWhatsapp" style={{ color: '#ccc', fontSize: 13, cursor: 'pointer' }}>Include WhatsApp Group Link</label>
                  </div>
                )}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <button onClick={handleEstimateCount} disabled={loadingCount || !sendEmailEventId} style={{ ...s.btnSm, background: '#88888820', color: '#ccc', ...((loadingCount || !sendEmailEventId) ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                    {loadingCount ? <Loader2 size={12} className="animate-spin" /> : 'Estimate Recipients'}
                  </button>
                  {sendCount > 0 && (
                    <span style={{ color: '#facc15', fontSize: 13, fontWeight: 600 }}>
                      Estimated: {sendCount} recipient{sendCount !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <button onClick={() => setShowSendConfirm(true)} disabled={sendCount === 0 || sending || !sendEmailEventId} style={{ ...s.btn, ...((sendCount === 0 || sending || !sendEmailEventId) ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                  {sending ? <><Loader2 size={14} className="animate-spin" style={{ marginRight: 6 }} />Sending...</> : 'Send Email'}
                </button>
              </div>
            </div>

            {/* Send Confirmation Modal */}
            {showSendConfirm && (
              <div style={s.overlay} onClick={() => !sending && setShowSendConfirm(false)}>
                <div style={{ ...s.modal, maxWidth: 450 }} onClick={(e) => e.stopPropagation()}>
                  <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Confirm Send</h3>
                  <div style={{ padding: 16, borderRadius: 6, background: '#222', marginBottom: 16 }}>
                    <p style={{ color: '#888', fontSize: 13, marginBottom: 8 }}>You are about to send:</p>
                    <p style={{ color: '#facc15', fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
                      {TEMPLATE_TYPES.find(t => t.value === sendTemplateType)?.label} Email
                    </p>
                    <p style={{ color: '#ccc', fontSize: 13 }}>
                      Recipients: <strong style={{ color: '#fff' }}>{sendCount}</strong>
                    </p>
                    <p style={{ color: '#ccc', fontSize: 13 }}>
                      Event: <strong style={{ color: '#fff' }}>{events.find(e => e.id === sendEmailEventId)?.name}</strong>
                    </p>
                    {sendFormat && <p style={{ color: '#ccc', fontSize: 13 }}>Format: <strong style={{ color: '#fff' }}>{sendFormat}</strong></p>}
                  </div>
                  {sendResult && (
                    <div style={{ padding: 12, borderRadius: 6, marginBottom: 16, background: sendResult.failed > 0 ? 'rgba(255,68,68,0.1)' : 'rgba(74,222,128,0.1)', border: `1px solid ${sendResult.failed > 0 ? 'rgba(255,68,68,0.3)' : 'rgba(74,222,128,0.3)'}` }}>
                      <p style={{ color: sendResult.failed > 0 ? '#ff4444' : '#4ade80', fontSize: 13, fontWeight: 600, margin: 0 }}>
                        Sent: {sendResult.sent} / {sendResult.total} &middot; Failed: {sendResult.failed}
                      </p>
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    <button onClick={() => { setShowSendConfirm(false); setSendResult(null) }} disabled={sending} style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#888' }}>Cancel</button>
                    <button onClick={handleSendEmails} disabled={sending} style={{ ...s.btnSm, background: sendResult ? '#4ade80' : 'var(--rallyverse-gradient)', color: sendResult ? '#000' : '#fff', fontWeight: 700, ...(sending ? { opacity: 0.6, cursor: 'not-allowed' } : {}) }}>
                      {sending ? <><Loader2 size={12} className="animate-spin" style={{ marginRight: 4 }} />Sending...</> : (sendResult ? 'Close' : 'Continue')}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── LOGS TAB ─── */}
        {activeTab === 'logs' && (
          <div>
            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
              <select value={logsEventId} onChange={(e) => setLogsEventId(e.target.value)} style={{ ...s.select, width: 200 }}>
                <option value="">All Events</option>
                {events.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
              </select>
              <div>
                <label style={{ ...s.label, marginBottom: 2 }}>Template Type</label>
                <select value={logFilterTemplateType} onChange={(e) => setLogFilterTemplateType(e.target.value)} style={{ height: 36, padding: '0 10px', borderRadius: 4, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                  <option value="">All Types</option>
                  {TEMPLATE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ ...s.label, marginBottom: 2 }}>Status</label>
                <select value={logFilterStatus} onChange={(e) => setLogFilterStatus(e.target.value)} style={{ height: 36, padding: '0 10px', borderRadius: 4, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 13, outline: 'none', cursor: 'pointer' }}>
                  <option value="">All Status</option>
                  <option value="sent">Sent</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <label style={{ ...s.label, marginBottom: 2 }}>From</label>
                <input type="date" value={logFilterDateFrom} onChange={(e) => setLogFilterDateFrom(e.target.value)} style={{ height: 36, padding: '0 10px', borderRadius: 4, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 13, outline: 'none' }} />
              </div>
              <div>
                <label style={{ ...s.label, marginBottom: 2 }}>To</label>
                <input type="date" value={logFilterDateTo} onChange={(e) => setLogFilterDateTo(e.target.value)} style={{ height: 36, padding: '0 10px', borderRadius: 4, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 13, outline: 'none' }} />
              </div>
              <button onClick={fetchLogs} style={{ ...s.btnSm, background: '#88888820', color: '#ccc', display: 'flex', alignItems: 'center', gap: 4 }}>
                <RefreshCw size={12} className={loadingLogs ? 'animate-spin' : ''} /> Apply
              </button>
              <button onClick={downloadLogsCSV} disabled={logs.length === 0} style={{ ...s.btnSm, background: 'transparent', border: '1px solid #333', color: '#ccc', ...(logs.length === 0 ? { opacity: 0.4, cursor: 'not-allowed' } : {}) }}>
                CSV
              </button>
            </div>

            {loadingLogs ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#888', fontSize: 14, padding: 40, justifyContent: 'center' }}>
                <Loader2 size={16} className="animate-spin" /> Loading logs...
              </div>
            ) : logs.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#666', fontSize: 14 }}>No email logs found</div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid #222', background: '#111' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 900 }}>
                  <thead>
                    <tr>
                      <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222' }}>Recipient</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222' }}>Subject</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222' }}>Template</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222' }}>Event</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222' }}>Status</th>
                      <th style={{ padding: '8px 10px', textAlign: 'left', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#888', borderBottom: '1px solid #222' }}>Sent At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map(log => (
                      <tr key={log.id} style={{ transition: 'background 0.15s' }} onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')} onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}>
                        <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a' }}>{log.recipient_email}</td>
                        <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.subject}</td>
                        <td style={{ padding: '8px 10px', fontSize: 12, color: '#888', borderBottom: '1px solid #1a1a1a' }}>{(log as { template_type?: string }).template_type || '—'}</td>
                        <td style={{ padding: '8px 10px', fontSize: 12, color: '#888', borderBottom: '1px solid #1a1a1a' }}>{(log as { event_name?: string }).event_name || '—'}</td>
                        <td style={{ padding: '8px 10px', fontSize: 13, color: '#ccc', borderBottom: '1px solid #1a1a1a' }}>
                          {log.status === 'sent' ? <CheckCircle size={14} color="#4ade80" /> : <XCircle size={14} color="#ff4444" />}
                          <span style={{ marginLeft: 6, color: log.status === 'sent' ? '#4ade80' : '#ff4444' }}>{log.status}</span>
                        </td>
                        <td style={{ padding: '8px 10px', fontSize: 12, color: '#888', borderBottom: '1px solid #1a1a1a' }}>{new Date(log.created_at).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
  )
}
