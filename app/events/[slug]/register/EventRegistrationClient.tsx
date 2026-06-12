'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, ArrowRight, ArrowLeft, Loader2, ExternalLink, MessageCircle, CreditCard } from 'lucide-react'
import Link from 'next/link'
import { trackPageView, trackEvent, trackWhatsappClick } from '@/lib/analytics'
import { getQrCodeUrl } from '@/lib/assets'
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
  btnSecondary: { height: 48, padding: '0 24px', borderRadius: 6, border: '1px solid #333', background: 'transparent', color: '#888', fontSize: 14, fontWeight: 600, cursor: 'pointer', width: '100%' } as React.CSSProperties,
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
    payment_upi_id: '', transaction_name: '', transaction_reference: '', screenshot_url: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitError, setSubmitError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [registrationId, setRegistrationId] = useState('')
  const [regId, setRegId] = useState('')

  const availableFormats = event.formats?.map((f) => f.format_name) || FORMAT_OPTIONS
  const isDoubles = formData.format.includes('Doubles')
  const hasPayConfig = !!(paymentConfig?.upi_id)
  const paymentEnabled = event.payment_enabled || !!paymentConfig?.payment_enabled

  const [uploadingScreenshot, setUploadingScreenshot] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) {
      setErrors((prev) => ({ ...prev, screenshot_url: 'Only PNG, JPG, JPEG, WEBP files are allowed' }))
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({ ...prev, screenshot_url: 'File too large. Max 10MB' }))
      return
    }

    setUploadingScreenshot(true)
    setErrors((prev) => ({ ...prev, screenshot_url: '' }))

    try {
      const body = new FormData()
      body.append('file', file)
      body.append('folder', 'screenshots')

      const res = await fetch('/api/upload', { method: 'POST', body })
      const data = await res.json()

      if (!res.ok) throw new Error(data.error || 'Upload failed')

      updateField('screenshot_url', data.url)
    } catch (err) {
      setErrors((prev) => ({ ...prev, screenshot_url: err instanceof Error ? err.message : 'Upload failed' }))
    } finally {
      setUploadingScreenshot(false)
    }
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
    if (s === 3) {
      if (paymentEnabled && hasPayConfig) {
        if (!formData.payment_upi_id.trim()) e.payment_upi_id = 'UPI ID used for payment is required'
        if (!formData.transaction_name.trim()) e.transaction_name = 'Name appearing on transaction is required'
        if (paymentConfig?.transaction_ref_required && !formData.transaction_reference.trim()) e.transaction_reference = 'Transaction reference ID is required'
      }
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const goNext = () => { if (validate(step)) setStep((s) => s + 1) }
  const goBack = () => setStep((s) => s - 1)

  const handleSubmit = async () => {
    if (!validate(3)) return
    setSubmitError('')
    setSubmitting(true)
    try {
      const { screenshot_url, ...rest } = formData
      const body = screenshot_url ? { ...rest, payment_screenshot_url: screenshot_url } : rest
      const res = await fetch(`/api/events/${event.slug}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
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
    const whatsappNumber = paymentConfig?.whatsapp_number || event.whatsapp_number || ''
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
            <p style={{ color: '#facc15', fontSize: 13 }}>Your registration has been submitted and is awaiting payment verification.</p>

            {paymentEnabled && hasPayConfig && (
              <div style={{ ...s.card, textAlign: 'left', width: '100%', maxWidth: 440 }}>
                <h3 style={{ color: '#facc15', fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Payment Details Submitted</h3>
                <div style={{ display: 'grid', gap: 8, fontSize: 13, color: '#ccc' }}>
                  <p><span style={{ color: '#888' }}>UPI ID Used:</span> {formData.payment_upi_id}</p>
                  <p><span style={{ color: '#888' }}>Transaction Name:</span> {formData.transaction_name}</p>
                  {formData.transaction_reference && <p><span style={{ color: '#888' }}>Reference ID:</span> {formData.transaction_reference}</p>}
                </div>
                <p style={{ color: '#888', fontSize: 12, marginTop: 12, lineHeight: 1.6 }}>
                  Your payment details have been recorded. The organizer will verify your payment and approve your registration.
                </p>
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

  const totalSteps = paymentEnabled && hasPayConfig ? 3 : 2

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
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((s) => (
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

        {step === 3 && paymentEnabled && hasPayConfig && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: 0 }}>Payment</h2>

            {/* Fee Info */}
            <div style={{ ...s.card }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <CreditCard size={18} color="#facc15" />
                <h3 style={{ color: '#fff', fontSize: 16, fontWeight: 600, margin: 0 }}>Event Fee</h3>
              </div>
              <p style={{ color: '#4ade80', fontSize: 28, fontWeight: 700, margin: 0 }}>
                {event.registration_fee ? `₹${event.registration_fee}` : 'Free'}
              </p>
            </div>

            {/* UPI ID */}
            <div style={{ ...s.card }}>
              <p style={{ color: '#888', fontSize: 11, marginBottom: 4, textTransform: 'uppercase', letterSpacing: 0.5 }}>Pay to this UPI ID</p>
              <p style={{ color: '#fff', fontSize: 18, fontWeight: 600, margin: 0, fontFamily: 'monospace' }}>{paymentConfig.upi_id}</p>
              <p style={{ color: '#888', fontSize: 12, marginTop: 4 }}>Account: {paymentConfig.account_holder_name}</p>
            </div>

            {/* QR Code */}
            {paymentConfig.qr_code_url && (
              <div style={{ ...s.card, textAlign: 'center' }}>
                <p style={{ color: '#888', fontSize: 11, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>Scan to Pay</p>
                <img
                  src={getQrCodeUrl(paymentConfig.qr_code_url) || ''}
                  alt="QR Code for payment"
                  style={{ width: 200, height: 200, borderRadius: 8, margin: '0 auto', display: 'block', objectFit: 'contain' }}
                />
              </div>
            )}

            {/* Payment Info Fields */}
            <div style={{ borderTop: '1px solid #222', paddingTop: 16 }}>
              <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 12 }}>Confirm Your Payment</h3>
              <p style={{ color: '#888', fontSize: 12, marginBottom: 16 }}>
                After making the payment, enter the details below so the organizer can verify.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                <div>
                  <label style={s.label}>Your UPI ID *</label>
                  <input value={formData.payment_upi_id} onChange={(e) => updateField('payment_upi_id', e.target.value)} style={s.input} placeholder="e.g. aditya@oksbi" />
                  {errors.payment_upi_id && <p style={{ color: '#ff4444', fontSize: 12, marginTop: 4 }}>{errors.payment_upi_id}</p>}
                </div>

                <div>
                  <label style={s.label}>Name Appearing On Transaction *</label>
                  <input value={formData.transaction_name} onChange={(e) => updateField('transaction_name', e.target.value)} style={s.input} placeholder="e.g. Aditya Gangwani" />
                  {errors.transaction_name && <p style={{ color: '#ff4444', fontSize: 12, marginTop: 4 }}>{errors.transaction_name}</p>}
                </div>

                  <div>
                    <label style={s.label}>Transaction Reference ID {paymentConfig?.transaction_ref_required ? '*' : <span style={{ color: '#666' }}>(optional)</span>}</label>
                    <input value={formData.transaction_reference} onChange={(e) => updateField('transaction_reference', e.target.value)} style={s.input} placeholder="e.g. Txn123456 or UTR number" />
                    {errors.transaction_reference && <p style={{ color: '#ff4444', fontSize: 12, marginTop: 4 }}>{errors.transaction_reference}</p>}
                  </div>

                  {/* Screenshot Upload */}
                  <div style={{ borderTop: '1px solid #222', paddingTop: 16, marginTop: 8 }}>
                    <h3 style={{ color: '#fff', fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Payment Screenshot</h3>
                    <p style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>
                      Upload a screenshot of the payment confirmation for organizer verification.
                    </p>
                    <div>
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/webp"
                        onChange={handleScreenshotUpload}
                        style={{ display: 'none' }}
                        id="screenshot-upload"
                      />
                      <label htmlFor="screenshot-upload">
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderRadius: 6, border: '1px solid #333', cursor: 'pointer', background: formData.screenshot_url ? 'rgba(74,222,128,0.1)' : 'transparent', color: formData.screenshot_url ? '#4ade80' : '#ccc', fontSize: 13 }}>
                          {uploadingScreenshot ? (
                            <><Loader2 size={16} className="animate-spin" /> Uploading...</>
                          ) : formData.screenshot_url ? (
                            <><CheckCircle size={16} /> Screenshot Uploaded</>
                          ) : (
                            'Upload Screenshot'
                          )}
                        </div>
                      </label>
                      {errors.screenshot_url && <p style={{ color: '#ff4444', fontSize: 12, marginTop: 4 }}>{errors.screenshot_url}</p>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

        <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
          {step > 1 && (
            <button onClick={goBack} style={s.btnSecondary}>
              <ArrowLeft size={16} style={{ marginRight: 6, verticalAlign: 'middle' }} />
              Back
            </button>
          )}
          {step < totalSteps ? (
            <button onClick={goNext} style={s.btn}>
              Next <ArrowRight size={16} style={{ marginLeft: 6, verticalAlign: 'middle' }} />
            </button>
          ) : (
            <button onClick={handleSubmit} disabled={submitting} style={{ ...s.btn, ...(submitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}) }}>
              {submitting ? <><Loader2 size={16} className="animate-spin" style={{ marginRight: 6, verticalAlign: 'middle' }} />Submitting...</> : 'Submit Registration'}
            </button>
          )}
        </div>

        {/* Standardized payment info shown when config exists but payments disabled */}
        {!paymentEnabled && hasPayConfig && (
          <div style={{ marginTop: 24, ...s.card }}>
            <p style={{ color: '#facc15', fontSize: 13, fontWeight: 600, marginBottom: 8 }}>Payment Information</p>
            <div style={{ display: 'grid', gap: 6, fontSize: 13, color: '#ccc' }}>
              <p><span style={{ color: '#888' }}>UPI ID:</span> {paymentConfig.upi_id}</p>
              <p><span style={{ color: '#888' }}>Amount:</span> {event.registration_fee ? `₹${event.registration_fee}` : 'Free'}</p>
            </div>
            <p style={{ color: '#888', fontSize: 12, marginTop: 12 }}>
              After completing payment, send the screenshot to the organizer via WhatsApp.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
