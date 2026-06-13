'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Award, GraduationCap, Users, CalendarDays, Briefcase, Cpu, Activity, Send, Network, Globe, Check, Loader2, CheckCircle, ArrowRight } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import TrackPageView from '@/components/TrackPageView'
import ShinyText from '@/components/ShinyText'
import { trackEvent } from '@/lib/analytics'

const targets = [
  {
    icon: Award,
    title: 'Sports Brands',
    desc: 'Community-first sports marketing and activations.',
  },
  {
    icon: GraduationCap,
    title: 'Academies',
    desc: 'Membership growth and engagement.',
  },
  {
    icon: Users,
    title: 'Sports Clubs',
    desc: 'Community expansion and event support.',
  },
  {
    icon: CalendarDays,
    title: 'Event Organizers',
    desc: 'Registrations, payment verification, attendance tracking, promotions, and organizer tools.',
  },
  {
    icon: Briefcase,
    title: 'Corporate Sports Programs',
    desc: 'Employee engagement and sports initiatives.',
  },
]

const differentiators = [
  {
    icon: Users,
    title: 'Active Sports Community',
    desc: "We own and operate an active player base. We have direct, daily contact with participants.",
  },
  {
    icon: Cpu,
    title: 'Event Infrastructure',
    desc: 'Bespoke registration infrastructure, payment management, attendance check-in, email automations, and administrative dashboards.',
  },
  {
    icon: Activity,
    title: 'Sports-Specific Expertise',
    desc: 'We understand registration workflows, communication needs, and athlete expectations.',
  },
  {
    icon: Send,
    title: 'Marketing & Outreach Capability',
    desc: 'Targeted channels, local WhatsApp networks, and sports-focused promotional strategies.',
  },
  {
    icon: Network,
    title: 'Organizer Network',
    desc: 'Collaborations with venues, coaches, tournament directors, and academies.',
  },
  {
    icon: Globe,
    title: 'Community Reach',
    desc: 'Connecting brands, corporate clients, and venue owners with local players.',
  },
]

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

const phoneRegex = /^[+]?[0-9\s-]{10,15}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function PartnersPageClient() {
  const searchParams = useSearchParams()
  const defaultInterest = searchParams.get('interest')

  const [formData, setFormData] = useState({
    name: '',
    organization: '',
    email: '',
    phone: '',
    organization_type: '',
    services_interested: [] as string[],
    message: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (defaultInterest) {
      setFormData(prev => ({
        ...prev,
        services_interested: prev.services_interested.includes(defaultInterest)
          ? prev.services_interested
          : [...prev.services_interested, defaultInterest]
      }))
    }
  }, [defaultInterest])

  const updateField = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: '' }))
  }

  const handleCheckboxChange = (service: string) => {
    setFormData((prev) => {
      const list = prev.services_interested.includes(service)
        ? prev.services_interested.filter((s) => s !== service)
        : [...prev.services_interested, service]
      return { ...prev, services_interested: list }
    })
    setErrors((prev) => ({ ...prev, services_interested: '' }))
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!formData.name.trim()) e.name = 'Name is required'
    if (!formData.email.trim()) e.email = 'Email is required'
    else if (!emailRegex.test(formData.email)) e.email = 'Invalid email address'
    if (!formData.phone.trim()) e.phone = 'Phone number is required'
    else if (!phoneRegex.test(formData.phone)) e.phone = 'Invalid phone number'
    if (!formData.organization_type) e.organization_type = 'Select an organization type'
    if (formData.services_interested.length === 0) e.services_interested = 'Select at least one service'

    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const res = await fetch('/api/partners/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit form')

      setSuccess(true)
      trackEvent('partner_enquiry_submitted', {
        organization_type: formData.organization_type,
        services_count: formData.services_interested.length,
      })
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSubmitting(false)
    }
  }

  const scrollToForm = () => {
    const el = document.getElementById('enquiry-form')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center pt-28 pb-20">
        <div className="max-w-md w-full px-6 text-center">
          <AnimatedSection>
            <div className="mx-auto w-16 h-16 rounded-full border border-green-500/30 bg-green-500/10 flex items-center justify-center mb-6">
              <CheckCircle size={32} className="text-[var(--success-color)]" />
            </div>
            <h1 className="font-display text-[32px] uppercase mb-4" style={{ color: 'var(--text-primary)' }}>
              Conversation Started
            </h1>
            <p className="font-body text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
              Thank you for reaching out. A partner representative from RallyVerse will contact you shortly to discuss how we can grow sports together.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/services"
                className="px-6 py-3 rounded-md font-body text-sm font-semibold transition-all duration-200"
                style={{ border: '1px solid var(--border-default)', color: 'var(--text-muted)' }}
              >
                View Services
              </Link>
              <Link
                href="/"
                className="px-6 py-3 rounded-md font-body text-sm font-semibold transition-all duration-200"
                style={{ background: 'var(--rallyverse-gradient)', color: 'var(--btn-primary-text)' }}
              >
                Go to Home
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TrackPageView pageType="partners" />

      <div className="mx-auto max-w-[1100px] px-6">
        {/* ── Hero ─────────────────────────────────────────── */}
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              SPORTS GROWTH PARTNER
            </span>
          </div>

          <h1 className="font-display text-[36px] leading-none uppercase sm:text-[48px] md:text-[80px]" style={{ color: 'var(--text-primary)' }}>
            Partner With RallyVerse
          </h1>

          <p className="mt-6 max-w-xl font-body text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Let&apos;s grow sports communities, events, and brands together. Join the ecosystem and elevate participation.
          </p>

          <button
            onClick={scrollToForm}
            className="mt-8 group relative overflow-hidden rounded-md px-10 py-4 font-body text-base font-semibold transition-all duration-200 active:scale-95 inline-flex items-center gap-2"
            style={{
              backgroundColor: 'var(--btn-primary-bg)',
              color: 'var(--btn-primary-text)',
            }}
          >
            <span className="relative z-10">Start a Conversation</span>
            <ArrowRight size={16} />
          </button>
        </AnimatedSection>

        {/* ── Who We Work With ──────────────────────────────── */}
        <section className="mt-24">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                Who We Work With
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {targets.map((target, i) => {
              const Icon = target.icon
              return (
                <AnimatedSection key={target.title} delay={i * 0.08}>
                  <div
                    className="group rounded-xl p-6 transition-all duration-300 h-full flex flex-col items-center text-center"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <Icon
                      size={28}
                      className="mb-4 transition-transform duration-300 group-hover:scale-110"
                      style={{ color: 'var(--accent-primary)' }}
                    />
                    <h3 className="font-display text-[18px] uppercase mb-2 font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {target.title}
                    </h3>
                    <p className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {target.desc}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </section>

        {/* ── Why Partner ───────────────────────────────────── */}
        <section className="mt-28">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                Why Partner With RallyVerse
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {differentiators.map((diff, i) => {
              const Icon = diff.icon
              return (
                <AnimatedSection key={diff.title} delay={i * 0.08}>
                  <div
                    className="flex flex-col items-start p-8 rounded-xl h-full transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderLeft: '3px solid var(--accent-primary)',
                    }}
                  >
                    <Icon size={28} className="mb-5" style={{ color: 'var(--accent-primary)' }} />
                    <h3 className="font-display text-[22px] uppercase mb-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {diff.title}
                    </h3>
                    <p className="font-body text-[14px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {diff.desc}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </section>

        {/* ── Form Section ─────────────────────────────────── */}
        <section id="enquiry-form" className="mt-28 scroll-mt-24 max-w-[720px] mx-auto">
          <AnimatedSection>
            <div
              className="rounded-xl p-8 sm:p-10 transition-all duration-300"
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
              }}
            >
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] mb-2" style={{ color: 'var(--text-primary)' }}>
                Partnership Enquiry
              </h2>
              <p className="font-body text-sm leading-relaxed mb-8" style={{ color: 'var(--text-muted)' }}>
                Tell us about your organization and how we can support your growth objectives. We typically get back within a business day.
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
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Organization</label>
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
                    <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Phone Number *</label>
                    <input
                      type="text"
                      placeholder="WhatsApp number"
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
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Organization Type *</label>
                  <select
                    value={formData.organization_type}
                    onChange={(e) => updateField('organization_type', e.target.value)}
                    className="w-full h-12 px-4 rounded-md font-body text-sm outline-none cursor-pointer transition-all duration-200"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      color: 'var(--text-primary)',
                    }}
                  >
                    <option value="">Select type</option>
                    {organizationTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                  {errors.organization_type && <p className="text-xs mt-1.5 font-body" style={{ color: 'var(--error-color)' }}>{errors.organization_type}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>Services Interested In *</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {servicesList.map((service) => {
                      const isChecked = formData.services_interested.includes(service)
                      return (
                        <label
                          key={service}
                          className="flex items-center gap-3 p-3 rounded-md cursor-pointer transition-all duration-200 border"
                          style={{
                            backgroundColor: isChecked ? 'rgba(255, 94, 0, 0.04)' : 'transparent',
                            borderColor: isChecked ? 'var(--accent-primary)' : 'var(--border-subtle)',
                          }}
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleCheckboxChange(service)}
                            className="sr-only"
                          />
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center transition-all duration-200 border"
                            style={{
                              backgroundColor: isChecked ? 'var(--accent-primary)' : 'transparent',
                              borderColor: isChecked ? 'var(--accent-primary)' : 'var(--text-faint)',
                            }}
                          >
                            {isChecked && <Check size={14} className="text-black stroke-[3px]" />}
                          </div>
                          <span className="font-body text-sm" style={{ color: 'var(--text-primary)' }}>{service}</span>
                        </label>
                      )
                    })}
                  </div>
                  {errors.services_interested && <p className="text-xs mt-2.5 font-body" style={{ color: 'var(--error-color)' }}>{errors.services_interested}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Message</label>
                  <textarea
                    placeholder="Tell us about your event, academy size, or promotional goals..."
                    rows={4}
                    value={formData.message}
                    onChange={(e) => updateField('message', e.target.value)}
                    className="w-full p-4 rounded-md font-body text-sm outline-none transition-all duration-200 resize-none"
                    style={{
                      backgroundColor: 'var(--input-bg)',
                      border: '1px solid var(--input-border)',
                      color: 'var(--text-primary)',
                      minHeight: '120px'
                    }}
                  />
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
                      Submitting...
                    </>
                  ) : (
                    <>
                      <ShinyText text="Start a Conversation" disabled={false} speed={3} className="font-bold" shineColor="rgba(255,255,255,0.6)" />
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </AnimatedSection>
        </section>
      </div>
    </div>
  )
}

export default function PartnersClient() {
  return (
    <Suspense fallback={<div className="min-h-screen pt-28 pb-20 text-center font-body" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-muted)' }}>Loading...</div>}>
      <PartnersPageClient />
    </Suspense>
  )
}
