'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Mail, MapPin, Headset, Phone, Send, Loader2, CheckCircle, ArrowRight } from 'lucide-react'
import WhatsAppIcon from '@/components/WhatsAppIcon'
import AnimatedSection from '@/components/AnimatedSection'
import SocialIcons from '@/components/SocialIcons'
import TrackPageView from '@/components/TrackPageView'
import ShinyText from '@/components/ShinyText'
import { CONTACT, ADDRESS_FULL, SOCIAL, WHATSAPP, EMAIL } from '@/lib/config'
import { trackEvent } from '@/lib/analytics'

const mapsQuery = encodeURIComponent(ADDRESS_FULL)
const MAPS_HREF = `https://www.google.com/maps/search/${mapsQuery}`

const contactMethods = [
  {
    icon: Mail,
    label: 'General Inquiries',
    value: CONTACT.email,
    href: SOCIAL.email,
  },
  {
    icon: Phone,
    label: 'Phone',
    value: CONTACT.phone,
    href: CONTACT.telUrl,
  },
  {
    icon: Headset,
    label: 'Organizer Tools',
    value: EMAIL.supportEmail,
    href: `mailto:${EMAIL.supportEmail}`,
  },
  {
    icon: WhatsAppIcon,
    label: 'WhatsApp Support',
    value: CONTACT.whatsapp,
    href: WHATSAPP.businessLink,
  },
  {
    icon: MapPin,
    label: 'Location',
    value: ADDRESS_FULL,
    href: MAPS_HREF,
  },
]

const phoneRegex = /^[+]?[0-9\s-]{10,15}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default function ContactClient() {
  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    message: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState(false)

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = 'Name is required'
    if (!formData.email.trim()) e.email = 'Email is required'
    else if (!emailRegex.test(formData.email)) e.email = 'Invalid email address'
    if (formData.phone.trim() && !phoneRegex.test(formData.phone)) e.phone = 'Invalid phone number'
    if (!formData.message.trim()) e.message = 'Message is required'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit form')

      setSuccess(true)
      trackEvent('contact_form_submitted', {
        has_organization: !!formData.organization,
        has_phone: !!formData.phone,
      })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const scrollToForm = () => {
    const el = document.getElementById('contact-form-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="mx-auto max-w-[1100px] px-6">
      <TrackPageView pageType="contact" />

      {/* ── Header ───────────────────────────────────────── */}
      <AnimatedSection>
        <div className="flex items-center gap-3 mb-5">
          <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
          <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            CONTACT
          </span>
        </div>

        <h1 className="font-display text-[36px] leading-none uppercase sm:text-[48px] md:text-[80px]" style={{ color: 'var(--text-primary)' }}>
          GET IN TOUCH
        </h1>
        <p className="mt-4 max-w-xl font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          Have a question, idea, or just want to say hello? Fill out the form below or reach out via our direct channels.
        </p>

        <button
          onClick={scrollToForm}
          className="mt-8 group relative overflow-hidden rounded-md px-10 py-4 font-body text-base font-semibold transition-all duration-200 active:scale-95 inline-flex items-center gap-2"
          style={{
            backgroundColor: 'var(--btn-primary-bg)',
            color: 'var(--btn-primary-text)',
          }}
        >
          <span className="relative z-10">Send a Message</span>
          <ArrowRight size={16} />
        </button>
      </AnimatedSection>

      {/* ── Response Time Pledge ──────────────────────────── */}
      <AnimatedSection delay={0.05}>
        <div
          className="mt-8 flex flex-wrap items-center justify-center gap-4 rounded-xl px-6 py-4 text-center text-sm"
          style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
        >
          <span style={{ color: 'var(--accent-primary)' }}>⚡</span>
          <span className="font-body" style={{ color: 'var(--text-muted)' }}>
            We typically respond within <strong style={{ color: 'var(--text-primary)' }}>a few hours</strong> during business hours.
          </span>
        </div>
      </AnimatedSection>

      {/* ── Contact Methods ─────────────────────────────────── */}
      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {contactMethods.map((method, i) => {
          const Icon = method.icon
          return (
            <AnimatedSection key={method.label} delay={i * 0.1}>
              {method.href ? (
                <a
                  href={method.href}
                  target={method.href.startsWith('http') ? '_blank' : undefined}
                  rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                  className="flex flex-col items-center text-center p-8 rounded-xl transition-all duration-200 group h-full justify-between"
                  style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
                >
                  <div className="flex flex-col items-center">
                    <Icon size={32} className="mb-4 transition-colors duration-200 group-hover:glow-accent-filter" style={{ color: 'var(--accent-primary)' }} />
                    <h3 className="font-display text-[18px] uppercase mb-2" style={{ color: 'var(--text-primary)' }}>
                      {method.label}
                    </h3>
                  </div>
                  <p className="font-body text-sm word-break-all" style={{ color: 'var(--text-muted)' }}>
                    {method.value}
                  </p>
                </a>
              ) : (
                <div className="flex flex-col items-center text-center p-8 rounded-xl h-full justify-between" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                  <div className="flex flex-col items-center">
                    <Icon size={32} className="mb-4" style={{ color: 'var(--accent-primary)' }} />
                    <h3 className="font-display text-[18px] uppercase mb-2" style={{ color: 'var(--text-primary)' }}>
                      {method.label}
                    </h3>
                  </div>
                  <p className="font-body text-sm" style={{ color: 'var(--text-muted)' }}>
                    {method.value}
                  </p>
                </div>
              )}
            </AnimatedSection>
          )
        })}
      </div>

      {/* ── Contact Form Section ───────────────────────────── */}
      <section id="contact-form-section" className="mt-24 scroll-mt-24 max-w-[720px] mx-auto">
        <AnimatedSection>
          <div
            className="rounded-xl p-8 sm:p-10 transition-all duration-300"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            {success ? (
              <div className="text-center py-6">
                <div className="mx-auto w-16 h-16 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center mb-6">
                  <CheckCircle size={32} className="text-[var(--success-color)]" />
                </div>
                <h2 className="font-display text-[28px] uppercase mb-4" style={{ color: 'var(--text-primary)' }}>
                  Message Sent
                </h2>
                <p className="font-body text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                  Thank you for reaching out to RallyVerse. Your message has been saved and our team has been notified. We will get back to you shortly.
                </p>
                <button
                  onClick={() => {
                    setSuccess(false)
                    setFormData({ name: '', organization: '', email: '', phone: '', message: '' })
                  }}
                  className="px-6 py-3 rounded-md font-body text-sm font-semibold transition-all duration-200"
                  style={{ background: 'var(--rallyverse-gradient)', color: 'var(--btn-primary-text)' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h2 className="font-display text-[28px] uppercase sm:text-[36px] mb-2" style={{ color: 'var(--text-primary)' }}>
                  Send Us a Message
                </h2>
                <p className="font-body text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                  Fill out this direct contact form and we will resolve your query or connect you with the right resource.
                </p>

                {submitError && (
                  <div className="p-4 rounded-md text-sm mb-6 font-body" style={{ backgroundColor: 'rgba(255,68,68,0.1)', border: '1px solid rgba(255,68,68,0.3)', color: 'var(--error-color)' }}>
                    {submitError}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Name *</label>
                      <input
                        type="text"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => updateField('name', e.target.value)}
                        className="w-full h-12 px-4 rounded-md font-body text-sm outline-none transition-all duration-200"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          border: '1px solid var(--input-border)',
                          color: 'var(--text-primary)',
                        }}
                      />
                      {errors.name && <p className="text-xs mt-1.5 font-body" style={{ color: 'var(--error-color)' }}>{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Organization (optional)</label>
                      <input
                        type="text"
                        placeholder="Company or Academy name"
                        value={formData.organization}
                        onChange={(e) => updateField('organization', e.target.value)}
                        className="w-full h-12 px-4 rounded-md font-body text-sm outline-none transition-all duration-200"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          border: '1px solid var(--input-border)',
                          color: 'var(--text-primary)',
                        }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Email *</label>
                      <input
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => updateField('email', e.target.value)}
                        className="w-full h-12 px-4 rounded-md font-body text-sm outline-none transition-all duration-200"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          border: '1px solid var(--input-border)',
                          color: 'var(--text-primary)',
                        }}
                      />
                      {errors.email && <p className="text-xs mt-1.5 font-body" style={{ color: 'var(--error-color)' }}>{errors.email}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Phone (optional)</label>
                      <input
                        type="text"
                        placeholder="Phone number"
                        value={formData.phone}
                        onChange={(e) => updateField('phone', e.target.value)}
                        className="w-full h-12 px-4 rounded-md font-body text-sm outline-none transition-all duration-200"
                        style={{
                          backgroundColor: 'var(--input-bg)',
                          border: '1px solid var(--input-border)',
                          color: 'var(--text-primary)',
                        }}
                      />
                      {errors.phone && <p className="text-xs mt-1.5 font-body" style={{ color: 'var(--error-color)' }}>{errors.phone}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Message *</label>
                    <textarea
                      placeholder="Write your message here..."
                      rows={5}
                      value={formData.message}
                      onChange={(e) => updateField('message', e.target.value)}
                      className="w-full p-4 rounded-md font-body text-sm outline-none transition-all duration-200 resize-none"
                      style={{
                        backgroundColor: 'var(--input-bg)',
                        border: '1px solid var(--input-border)',
                        color: 'var(--text-primary)',
                        minHeight: '140px'
                      }}
                    />
                    {errors.message && <p className="text-xs mt-1.5 font-body" style={{ color: 'var(--error-color)' }}>{errors.message}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full h-12 rounded-md font-body text-sm font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
                    style={{
                      background: 'var(--rallyverse-gradient)',
                      color: 'var(--btn-primary-text)',
                      opacity: submitting ? 0.7 : 1,
                    }}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Sending Message...
                      </>
                    ) : (
                      <>
                        <ShinyText text="Send Message" disabled={false} speed={3} className="font-bold" shineColor="rgba(255,255,255,0.6)" />
                        <ArrowRight size={16} />
                      </>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </AnimatedSection>
      </section>

      {/* ── Social Links ──────────────────────────────────── */}
      <AnimatedSection>
        <div className="mt-20 text-center py-14 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              FOLLOW US
            </span>
            <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
          </div>
          <h2 className="font-display text-[24px] uppercase sm:text-[32px] mb-8" style={{ color: 'var(--text-primary)' }}>
            Stay Connected
          </h2>
          <SocialIcons />
        </div>
      </AnimatedSection>

      {/* ── Trust & Privacy ──────────────────────────────── */}
      <AnimatedSection>
        <div className="mt-12 text-center">
          <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--text-faint)' }}>
            RallyVerse is based in {ADDRESS_FULL}.
            <br />
            Your information stays private and will only be used to respond to your inquiry.
          </p>
        </div>
      </AnimatedSection>
    </div>
  )
}
