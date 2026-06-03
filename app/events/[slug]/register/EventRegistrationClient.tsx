'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, ArrowRight, Loader2, ExternalLink, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import { trackPageView, trackEvent, trackWhatsappClick } from '@/lib/analytics'
import type { EventWithPaymentConfig, EventPaymentConfig } from '@/lib/types/supabase'

const phoneRegex = /^[+]?[0-9\s-]{10,15}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const FORMAT_OPTIONS = [
  "Men's Singles", "Women's Singles", "Men's Doubles", "Women's Doubles", "Mixed Doubles",
]

const s = {
  input: { width: '100%', height: 48, padding: '0 16px', borderRadius: 6, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none' } as React.CSSProperties,
  select: { width: '100%', height: 48, padding: '0 16px', borderRadius: 6, border: '1px solid #333', background: '#111', color: '#fff', fontSize: 14, outline: 'none', cursor: 'pointer' } as React.CSSProperties,
  btn: { height: 48, padding: '0 24px', borderRadius: 6, border: 'none', background: 'var(--rallyverse-gradient)', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', width: '100%' } as React.CSSProperties,
  label: { display: 'block', color: '#888', fontSize: 12, marginBottom: 4 },
  card: { padding: 20, borderRadius: 8, border: '1px solid #222', background: '#111' } as React.CSSProperties,
}

export default function EventRegistrationClient({
  event,
  paymentConfig,
}: {
  event: EventWithPaymentConfig
  paymentConfig: EventPaymentConfig | null
}) {
  useEffect(() => { trackPageView('registration', event.id, event.slug) }, [event.id, event.slug])

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    full_name: '', phone_number: '', email: '', city: '', gender: '', format: '',
    partner_name: '', partner_phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [registrationId, setRegistrationId] = useState('')
  const [regId, setRegId] = useState('')

  const availableFormats = event.formats?.map((f) => f.format_name) || FORMAT_OPTIONS
  const isDoubles = formData.format.includes('Doubles')

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = (s: number) => {
    const e: Record<string, string> = {}
    if (s === 1) {
      if (!formData.format) e.format = 'Select a format'
    }
    if (s === 2) {
      if (!formData.full_name.trim()) e.full_name = 'Full name is required'
      if (!phoneRegex.test(formData.phone_number)) e.phone_number = 'Valid phone number required'
      if (!formData.email.trim()) e.email = 'Email is required'
      else if (!emailRegex.test(formData.email)) e.email = 'Invalid email'
      if (!formData.city.trim()) e.city = 'City is required'
      if (!formData.gender) e.gender = 'Select gender'
      if (isDoubles) {
        if (!formData.partner_name.trim()) e.partner_name = 'Partner name required'
        if (!phoneRegex.test(formData.partner_phone)) e.partner_phone = 'Valid partner phone required'
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => { if (validate(step)) setStep((s) => s + 1) }

  const handleSubmit = async () => {
    if (!validate(2)) return
    setSubmitError('')
    setSubmitting(true)
    try {
      const res = await fetch(`/api/events/${event.slug}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Registration failed')
      setRegistrationId(data.registration_id)
      setRegId(data.id)
      trackEvent('registration_submitted', { event_id: event.id, event_slug: event.slug, registration_id: data.registration_id })
      trackPageView('registration_success', event.id, event.slug)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  if (registrationId) {
    const whatsappNumber = paymentConfig?.whatsapp_number || ''
    const whatsappLink = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}` : '#'

    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: 24 }}>
        <div style={{ maxWidth: 600, margin: '60px auto', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', border: '1px solid rgba(74,222,128,0.3)', background: 'rgba(74,222,128,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle size={32} color="#4ade80" />
            </div>
            <h1 style={{ color: '#fff', fontSize: 24, fontWeight: 700, margin: 0 }}>Registration Submitted</h1>
            <p style={{ color: '#888', fontSize: 14 }}>Registration ID: <strong style={{ color: '#4ade80' }}>{registrationId}</strong></p>

            {paymentConfig && (
              <div style={{ ...s.card, textAlign: 'left', width: '100%', maxWidth: 440 }}>
                <h3 style={{ color: '#facc15', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Complete Your Payment</h3>
                <div style={{ display: 'grid', gap: 8, fontSize: 13, color: '#ccc' }}>
                  <p><span style={{ color: '#888' }}>UPI ID:</span> {paymentConfig.upi_id}</p>
                  <p><span style={{ color: '#888' }}>Account Holder:</span> {paymentConfig.account_holder_name}</p>
                  <p><span style={{ color: '#888' }}>Mobile:</span> {paymentConfig.mobile_number}</p>
                </div>
                <p style={{ color: '#888', fontSize: 12, marginTop: 12, lineHeight: 1.6 }}>
                  After completing payment, send payment confirmation and screenshot to the WhatsApp number below.
                </p>
                <p style={{ color: '#facc15', fontSize: 13, fontWeight: 600 }}>WhatsApp: {paymentConfig.whatsapp_number}</p>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsappClick(event.id, 'contact')}
                  style={{ ...s.btn, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 12, textDecoration: 'none' }}
                >
                  <ExternalLink size={16} /> Open WhatsApp
                </a>
              </div>
            )}

            {!paymentConfig && (
              <div style={{ ...s.card, textAlign: 'left', width: '100%', maxWidth: 440 }}>
                <p style={{ color: '#888', fontSize: 13 }}>Payment details will be shared separately. You will receive a confirmation once your registration is processed.</p>
              </div>
            )}

            {(event.whatsapp_number || event.whatsapp_group_link) && (
              <div style={{ ...s.card, textAlign: 'left', width: '100%', maxWidth: 440 }}>
                <h3 style={{ color: '#25d366', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                  <MessageCircle size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />Event Contact
                </h3>
                <div style={{ display: 'grid', gap: 8, fontSize: 13, color: '#ccc' }}>
                  {event.whatsapp_number && (
                    <p>
                      <span style={{ color: '#888' }}>WhatsApp:</span>{' '}
                      {event.whatsapp_number}{' '}
                      <a
                        href={`https://wa.me/${event.whatsapp_number.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#25d366', textDecoration: 'none', fontWeight: 600 }}
                      >
                        <ExternalLink size={12} style={{ verticalAlign: 'middle' }} /> Chat
                      </a>
                    </p>
                  )}
                  {event.whatsapp_group_link && (
                    <p>
                      <span style={{ color: '#888' }}>Group:</span>{' '}
                      <a
                        href={event.whatsapp_group_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: '#25d366', textDecoration: 'none', fontWeight: 600 }}
                      >
                        Join WhatsApp Group <ExternalLink size={12} style={{ verticalAlign: 'middle' }} />
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <Link href={`/events/${event.slug}`} style={{ padding: '12px 24px', borderRadius: 6, border: '1px solid #333', color: '#888', fontSize: 13, textDecoration: 'none' }}>
                &larr; Back to Event
              </Link>
              <Link href="/" style={{ padding: '12px 24px', borderRadius: 6, border: '1px solid #333', color: '#888', fontSize: 13, textDecoration: 'none' }}>
                Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', padding: 24 }}>
      <div style={{ maxWidth: 600, margin: '40px auto' }}>
        <Link href={`/events/${event.slug}`} style={{ color: '#888', fontSize: 13, textDecoration: 'none', display: 'inline-block', marginBottom: 24 }}>
          &larr; Back to {event.name}
        </Link>

        <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 700, margin: '0 0 4px 0' }}>Register for {event.name}</h1>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 24 }}>
          Fee: {event.registration_fee ? `₹${event.registration_fee}` : 'Free'} &middot; {event.venue}
        </p>

        {submitError && (
          <div style={{ padding: 12, borderRadius: 6, background: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: '#ff4444', fontSize: 13, marginBottom: 16 }}>{submitError}</div>
        )}

        {/* Step indicator */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
          {[1, 2].map((s) => (
            <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: step >= s ? '#4ade80' : '#222', transition: 'background 0.2s' }} />
          ))}
        </div>

        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: 0 }}>Select Format</h2>
            <div>
              <label style={s.label}>Format *</label>
              <select value={formData.format} onChange={(e) => updateField('format', e.target.value)} style={s.select}>
                <option value="">Choose format</option>
                {availableFormats.map((fmt) => (
                  <option key={fmt} value={fmt}>{fmt}</option>
                ))}
              </select>
              {errors.format && <p style={{ color: '#ff4444', fontSize: 12, marginTop: 4 }}>{errors.format}</p>}
            </div>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: 0 }}>Your Details</h2>

            <div>
              <label style={s.label}>Full Name *</label>
              <input value={formData.full_name} onChange={(e) => updateField('full_name', e.target.value)} style={s.input} placeholder="Your full name" />
              {errors.full_name && <p style={{ color: '#ff4444', fontSize: 12, marginTop: 4 }}>{errors.full_name}</p>}
            </div>

            <div>
              <label style={s.label}>Phone Number *</label>
              <input value={formData.phone_number} onChange={(e) => updateField('phone_number', e.target.value)} style={s.input} placeholder="WhatsApp number" />
              {errors.phone_number && <p style={{ color: '#ff4444', fontSize: 12, marginTop: 4 }}>{errors.phone_number}</p>}
            </div>

            <div>
              <label style={s.label}>Email *</label>
              <input value={formData.email} onChange={(e) => updateField('email', e.target.value)} style={s.input} placeholder="your@email.com" />
              {errors.email && <p style={{ color: '#ff4444', fontSize: 12, marginTop: 4 }}>{errors.email}</p>}
            </div>

            <div>
              <label style={s.label}>City *</label>
              <input value={formData.city} onChange={(e) => updateField('city', e.target.value)} style={s.input} placeholder="Your city" />
              {errors.city && <p style={{ color: '#ff4444', fontSize: 12, marginTop: 4 }}>{errors.city}</p>}
            </div>

            <div>
              <label style={s.label}>Gender *</label>
              <select value={formData.gender} onChange={(e) => updateField('gender', e.target.value)} style={s.select}>
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p style={{ color: '#ff4444', fontSize: 12, marginTop: 4 }}>{errors.gender}</p>}
            </div>

            {isDoubles && (
              <>
                <div style={{ borderTop: '1px solid #222', marginTop: 8, paddingTop: 16 }}>
                  <h3 style={{ color: '#facc15', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Partner Details</h3>
                </div>
                <div>
                  <label style={s.label}>Partner Name *</label>
                  <input value={formData.partner_name} onChange={(e) => updateField('partner_name', e.target.value)} style={s.input} placeholder="Partner's full name" />
                  {errors.partner_name && <p style={{ color: '#ff4444', fontSize: 12, marginTop: 4 }}>{errors.partner_name}</p>}
                </div>
                <div>
                  <label style={s.label}>Partner Phone *</label>
                  <input value={formData.partner_phone} onChange={(e) => updateField('partner_phone', e.target.value)} style={s.input} placeholder="Partner's WhatsApp number" />
                  {errors.partner_phone && <p style={{ color: '#ff4444', fontSize: 12, marginTop: 4 }}>{errors.partner_phone}</p>}
                </div>
              </>
            )}
          </div>
        )}

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          {step > 1 && (
            <button onClick={() => setStep((s) => s - 1)} style={{ ...s.btn, background: 'transparent', border: '1px solid #333', color: '#888', width: 'auto', padding: '0 32px' }}>
              Back
            </button>
          )}
          {step < 2 ? (
            <button onClick={goNext} style={s.btn}>
              Next <ArrowRight size={16} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} style={{ ...s.btn, ...(submitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }}>
              {submitting ? <><Loader2 size={16} className="animate-spin" style={{ marginRight: 6, verticalAlign: 'middle' }} />Submitting...</> : 'Submit Registration'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
