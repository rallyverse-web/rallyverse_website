'use client'

import { useState } from 'react'
import { Users, Trophy, Megaphone, Handshake, CreditCard, LayoutDashboard, Mail, BarChart3, ShieldCheck, UserCheck, Clock, Check, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection'
import TrackPageView from '@/components/TrackPageView'
import ShinyText from '@/components/ShinyText'

const services = [
  {
    icon: Users,
    title: 'Community Building',
    desc: 'Build engaged sports communities that participate, return, and grow.',
  },
  {
    icon: Trophy,
    title: 'Registration Management',
    desc: 'Registrations, participant management, payment verification, attendance tracking, communication, and event visibility support.',
  },
  {
    icon: Megaphone,
    title: 'Sports Marketing',
    desc: 'Promotion strategies designed to increase visibility and participation.',
  },
  {
    icon: Handshake,
    title: 'Partnerships & Outreach',
    desc: 'Connect with communities, brands, academies, and organizers.',
  },
]

const pricingPlans = [
  {
    name: 'Starter',
    price: '₹0',
    desc: 'For organizers who already manage registrations independently.',
    features: [
      'Tournament listing on RallyVerse',
      'Dedicated event page',
      'Event visibility',
      'Shareable event link',
      'Basic support',
    ],
    footerInfo: 'Registration handled by organizer. Requirement: RallyVerse logo must appear on promotional creatives.',
    ctaText: 'List Your Event',
    ctaHref: '/partners?interest=Event Promotion',
    recommended: false,
  },
  {
    name: 'Organizer Pro',
    headline: 'Professional Event Infrastructure',
    price: '₹2,499',
    desc: 'Everything required to professionally manage registrations, payments, participant communication, and attendance from a single dashboard.',
    features: [
      'RallyVerse Registration System',
      'Dedicated Event Page',
      'Event Admin Dashboard',
      'Online Registration Management',
      'Registration Approval Workflow',
      'Participant Management',
      'Participant Editing',
      'UPI & QR Payment Collection',
      'Payment Screenshot Uploads',
      'Payment Verification Workflow',
      'Attendance Check-In System',
      'Time Slot Registrations',
      'Registration Analytics',
      'Attendance Insights',
      'CSV Export Tools',
      'Featured Event Promotion on RallyVerse',
      '50 Communication Emails Included',
      'Unlimited System Emails Included',
      'Dedicated Organizer Support',
    ],
    footerInfo: 'Billed per event. Fully managed registration cycle.',
    ctaText: 'Get Started',
    ctaHref: '/partners?interest=Registration Management',
    recommended: true,
  },
  {
    name: 'Growth Partner',
    headline: 'Technology + Growth Support',
    price: '₹5,999',
    desc: 'Everything in Organizer Pro plus visibility, promotion, and community-driven participant growth support.',
    features: [
      'Everything in Organizer Pro',
      'Community Marketing Support',
      'Promotion Across RallyVerse Channels',
      'Priority Homepage Visibility',
      'Priority Featured Event Placement',
      'Additional Event Creatives',
      'Marketing Content Assistance',
      'Dedicated Growth Support',
      '100 Communication Emails Included',
      'Unlimited System Emails Included',
      'Priority Support',
    ],
    footerInfo: 'Custom service plans tailored to your community size.',
    ctaText: 'Book a Consultation',
    ctaHref: '/partners?interest=Partnerships',
    recommended: false,
  },
]

const infrastructureFeatures = [
  {
    icon: CreditCard,
    name: 'Registration Management',
    desc: 'Online registrations, approval workflows, participant management, and editing from one dashboard.',
  },
  {
    icon: ShieldCheck,
    name: 'Payment Verification',
    desc: 'Collect payments through UPI and QR codes, verify screenshots, and manage payment approvals from a centralized dashboard.',
  },
  {
    icon: UserCheck,
    name: 'Attendance Tracking',
    desc: 'Track participant arrivals and manage event-day check-ins through the Event Admin Dashboard.',
  },
  {
    icon: Clock,
    name: 'Time Slot Registrations',
    desc: 'Slot-based registrations with controlled participant allocation.',
  },
  {
    icon: LayoutDashboard,
    name: 'Organizer Dashboard',
    desc: 'Manage event pages, registrations, approvals, and communication workflows in one place.',
  },
  {
    icon: Users,
    name: 'Participant Management',
    desc: 'Review participant records, update category details, and keep registration data in sync.',
  },
  {
    icon: Mail,
    name: 'Participant Communication',
    desc: 'Send participant updates and manage event communication through integrated email tools.',
  },
  {
    icon: BarChart3,
    name: 'Event Analytics',
    desc: 'Registration insights, attendance insights, communication analytics, and CSV exports.',
  },
]

export default function ServicesClient() {
  const scrollToPricing = () => {
    const el = document.getElementById('pricing')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <TrackPageView pageType="services" />
      
      <div className="mx-auto max-w-[1100px] px-6">
        {/* ── Hero ─────────────────────────────────────────── */}
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              SOLUTIONS & SERVICES
            </span>
          </div>

          <h1 className="font-display text-[36px] leading-none uppercase sm:text-[48px] md:text-[80px]" style={{ color: 'var(--text-primary)' }}>
            Solutions for Sports
            <br />
            Organizers & Communities
          </h1>
          
          <p className="mt-6 max-w-2xl font-body text-base md:text-lg leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Whether you&apos;re organizing your first tournament or growing a large sports initiative, RallyVerse provides the technology, visibility, and support needed to scale.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 items-center">
            <button
              onClick={scrollToPricing}
              className="group relative overflow-hidden rounded-md px-10 py-4 font-body text-base font-semibold transition-all duration-200 active:scale-95"
              style={{
                backgroundColor: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
                minWidth: '200px'
              }}
            >
              <span className="relative z-10">Get Started</span>
              <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'var(--rallyverse-gradient)' }} />
            </button>

            <Link
              href="/partners"
              className="group relative overflow-hidden rounded-md border px-10 py-4 font-body text-base font-semibold transition-all duration-200 active:scale-95 text-center"
              style={{
                borderColor: 'var(--btn-outline-border)',
                backgroundColor: 'transparent',
                color: 'var(--btn-outline-text)',
                minWidth: '200px'
              }}
            >
              <span className="relative z-10 transition-colors duration-200">
                Partner With Us
              </span>
              <span className="absolute inset-0 -translate-x-full transition-transform duration-300 group-hover:translate-x-0" style={{ background: 'var(--rallyverse-gradient)' }} />
            </Link>
          </div>
        </AnimatedSection>

        {/* ── Services Overview ──────────────────────────────── */}
        <section className="mt-24">
          <AnimatedSection>
            <div className="text-center mb-16">
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                Services Overview
              </h2>
              <p className="mt-4 max-w-lg mx-auto font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                We build the registration infrastructure, communication tools, and growth systems that help sports communities scale.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((item, i) => {
              const Icon = item.icon
              return (
                <AnimatedSection key={item.title} delay={i * 0.1}>
                  <div
                    className="group rounded-xl p-8 transition-all duration-300 h-full flex flex-col justify-between"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      borderLeft: '3px solid var(--accent-primary)',
                      boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    }}
                  >
                    <div>
                      <Icon
                        size={36}
                        className="mb-6 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: 'var(--accent-primary)' }}
                      />
                      <h3 className="font-display text-[24px] uppercase leading-tight font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {item.title}
                      </h3>
                      <p className="mt-4 font-body text-[14px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </section>

        {/* ── Pricing Section ────────────────────────────────── */}
        <section id="pricing" className="mt-28 scroll-mt-24">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  PRICING PLANS
                </span>
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
              </div>
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                Professional Event Infrastructure
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {pricingPlans.map((plan, i) => {
              return (
                <AnimatedSection key={plan.name} delay={i * 0.1}>
                  <div
                    className="rounded-xl p-8 flex flex-col h-full justify-between transition-all duration-300 relative"
                    style={{
                      backgroundColor: 'var(--bg-surface)',
                      border: plan.recommended ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                      boxShadow: plan.recommended ? '0 0 30px color-mix(in srgb, var(--accent-primary) 15%, transparent)' : 'none',
                    }}
                  >
                    {plan.recommended && (
                      <span
                        className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 text-[11px] font-bold uppercase tracking-wider rounded-full"
                        style={{
                          background: 'var(--rallyverse-gradient)',
                          color: 'var(--btn-primary-text)',
                        }}
                      >
                        Recommended
                      </span>
                    )}

                    <div>
                      <h3 className="font-display text-[28px] uppercase" style={{ color: 'var(--text-primary)' }}>
                        {plan.name}
                      </h3>
                      {plan.headline && (
                        <p className="font-body text-[11px] uppercase tracking-widest mt-1" style={{ color: 'var(--accent-primary)' }}>
                          {plan.headline}
                        </p>
                      )}
                      
                      <div className="my-5 flex items-baseline gap-1">
                        <span className="font-display text-[48px] leading-none" style={{ color: 'var(--text-primary)' }}>
                          {plan.price}
                        </span>
                        {plan.price !== '₹0' && (
                          <span className="font-body text-xs" style={{ color: 'var(--text-muted)' }}>/ event</span>
                        )}
                      </div>

                      <p className="font-body text-[13px] leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                        {plan.desc}
                      </p>

                      <hr style={{ border: 0, borderTop: '1px solid var(--border-subtle)', marginBottom: 24 }} />

                      <ul className="space-y-3 mb-8">
                        {plan.features.map((feat) => (
                          <li key={feat} className="flex items-start gap-2 text-[13px]">
                            <Check size={16} className="mt-0.5 shrink-0" style={{ color: 'var(--success-color)' }} />
                            <span style={{ color: 'var(--text-primary)' }}>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <Link
                        href={plan.ctaHref}
                        className="group w-full py-3.5 rounded-md font-body text-sm font-bold transition-all duration-200 active:scale-95 inline-flex items-center justify-center gap-2"
                        style={{
                          background: plan.recommended ? 'var(--rallyverse-gradient)' : 'transparent',
                          color: plan.recommended ? 'var(--btn-primary-text)' : 'var(--text-primary)',
                          border: plan.recommended ? 'none' : '1px solid var(--border-default)',
                        }}
                      >
                        {plan.ctaText}
                        <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                      
                      <p className="mt-4 font-body text-[11px] leading-relaxed text-center" style={{ color: 'var(--text-faint)' }}>
                        {plan.footerInfo}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </section>

        {/* ── Email Usage Clarification ──────────────────────── */}
        <section className="mt-20">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  EMAIL USAGE
                </span>
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
              </div>
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                Email Quota & Credits
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <AnimatedSection>
              <div className="rounded-xl p-8 h-full flex flex-col" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-subtle)' }}>
                <div className="font-display text-[18px] uppercase text-green-400 mb-2">System Emails</div>
                <div className="font-body text-[12px] uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Unlimited — Included</div>
                <p className="font-body text-[13px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  These automated emails are free and do not count toward your package limit.
                </p>
                <ul className="space-y-2 text-[12px]">
                  {['Registration Confirmation', 'Registration Approval', 'Registration Rejection', 'Payment Verification Updates', 'Payment Rejection Updates'].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <Check size={12} className="mt-0.5 shrink-0" style={{ color: 'var(--success-color)' }} />
                      <span style={{ color: 'var(--text-primary)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.08}>
              <div className="rounded-xl p-8 h-full flex flex-col" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-subtle)' }}>
                <div className="font-display text-[18px] uppercase text-orange-400 mb-2">Communication Emails</div>
                <div className="font-body text-[12px] uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Counts Toward Package Limit</div>
                <p className="font-body text-[13px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  These emails consume your package quota. Limits vary by plan.
                </p>
                <ul className="space-y-2 text-[12px]">
                  {['Event Announcements', 'Event Reminders', 'Schedule Updates', 'Results Announcements', 'Organizer Broadcasts'].map(item => (
                    <li key={item} className="flex items-start gap-2">
                      <Check size={12} className="mt-0.5 shrink-0" style={{ color: 'var(--success-color)' }} />
                      <span style={{ color: 'var(--text-primary)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-4 space-y-1">
                  <div className="flex justify-between text-[12px]">
                    <span style={{ color: 'var(--text-muted)' }}>Organizer Pro</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>50 Included</span>
                  </div>
                  <div className="flex justify-between text-[12px]">
                    <span style={{ color: 'var(--text-muted)' }}>Growth Partner</span>
                    <span className="font-bold" style={{ color: 'var(--text-primary)' }}>100 Included</span>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.15}>
              <div className="rounded-xl p-8 h-full flex flex-col" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-subtle)' }}>
                <div className="font-display text-[18px] uppercase text-blue-400 mb-2">Additional Credits</div>
                <div className="font-body text-[12px] uppercase tracking-wider mb-4" style={{ color: 'var(--text-muted)' }}>Purchase When Needed</div>
                <p className="font-body text-[13px] leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>
                  Additional communication email credits can be purchased when required.
                </p>
                <p className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--text-faint)' }}>
                  Credit requests are reviewed and approved through the RallyVerse platform.
                </p>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* ── Brand Solutions Section ────────────────────────── */}
        <AnimatedSection>
          <section className="mt-16 rounded-xl p-8 sm:p-12 transition-all duration-300 relative overflow-hidden"
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
              <div className="max-w-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-6" style={{ backgroundColor: 'var(--accent-primary)' }} />
                  <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--accent-primary)' }}>
                    Enterprise & Brands
                  </span>
                </div>
                <h2 className="font-display text-[28px] uppercase sm:text-[36px] mb-4" style={{ color: 'var(--text-primary)' }}>
                  Solutions for Brands & Larger Organizations
                </h2>
                <p className="font-body text-sm leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                  For sports brands, academies, leagues, corporates, and ecosystem initiatives requiring custom support.
                </p>

                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    'Brand Activations',
                    'Community Building',
                    'Sports Marketing Campaigns',
                    'Sponsorship Support',
                    'Event Partnerships'
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[13px]">
                      <Check size={14} style={{ color: 'var(--accent-primary)' }} />
                      <span style={{ color: 'var(--text-primary)' }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col items-center md:items-end gap-4 shrink-0 w-full md:w-auto p-6 sm:p-8 rounded-xl border border-dashed"
                style={{
                  borderColor: 'var(--border-subtle)',
                  backgroundColor: 'rgba(255, 94, 0, 0.02)',
                }}
              >
                <div className="text-center md:text-right">
                  <div className="font-display text-lg uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Custom Solutions</div>
                  <div className="font-display text-2xl uppercase font-bold text-[var(--accent-primary)] mt-1">Custom Pricing</div>
                </div>
                <Link
                  href="/partners?interest=Partnerships"
                  className="group px-8 py-3.5 rounded-md font-body text-sm font-bold transition-all duration-200 active:scale-95 inline-flex items-center justify-center gap-2 w-full md:w-auto text-center"
                  style={{
                    background: 'var(--rallyverse-gradient)',
                    color: 'var(--btn-primary-text)',
                  }}
                >
                  Talk to Us
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* ── Event Infrastructure ───────────────────────────── */}
        <section className="mt-28">
          <AnimatedSection>
            <div className="mb-12 flex flex-col items-center gap-3">
              <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
              <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                EVENT INFRASTRUCTURE
              </span>
            </div>

            <div className="mb-16 text-center font-display text-[28px] leading-none uppercase sm:text-[40px] md:text-[56px]" style={{ color: 'var(--text-primary)' }}>
              Built for Real Sports Events
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {infrastructureFeatures.map((feat, i) => {
              const Icon = feat.icon
              return (
                <AnimatedSection key={feat.name} delay={i * 0.08}>
                  <div className="group flex flex-col items-start p-8 rounded-xl h-full transition-all duration-300"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <Icon size={32} className="mb-5 transition-transform duration-300 group-hover:scale-110" style={{ color: 'var(--accent-primary)' }} />
                    <div className="font-display text-[22px] uppercase mb-3 transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>
                      {feat.name}
                    </div>
                    <p className="font-body text-4[14px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {feat.desc}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </section>

        {/* ── See RallyVerse In Action (Interactive Mockups) ─── */}
        <section className="mt-28">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  PRODUCT PREVIEW
                </span>
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
              </div>
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                See RallyVerse In Action
              </h2>
              <p className="mt-4 max-w-lg mx-auto font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Explore the administrative software that processes registrations, verifies payments, tracks attendance, manages communication, and powers active sports communities.
              </p>
            </div>
          </AnimatedSection>

          <MockupExplorer />

          <AnimatedSection>
            <div className="mt-16 text-center">
              <Link
                href="/partners"
                className="group relative overflow-hidden rounded-md px-10 py-4 font-body text-base font-semibold transition-all duration-200 active:scale-95 inline-flex items-center gap-2"
                style={{
                  backgroundColor: 'var(--btn-primary-bg)',
                  color: 'var(--btn-primary-text)',
                }}
              >
                <ShinyText
                  text="Grow Your Event"
                  disabled={false}
                  speed={3}
                  className="font-semibold"
                  shineColor="rgba(255,255,255,0.6)"
                />
                <ArrowRight size={16} />
              </Link>
            </div>
          </AnimatedSection>
        </section>
      </div>
    </div>
  )
}

// ── Mockup Explorer Sub-component ────────────────────────────
function MockupExplorer() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { label: 'Registration Dashboard', desc: 'Registrations, approvals, and metrics' },
    { label: 'Payment Verification', desc: 'UPI payments and screenshot review' },
    { label: 'Attendance Check-In', desc: 'Event-day check-in and tracking' },
    { label: 'Participant Management', desc: 'Edit contact and category details' },
    { label: 'Analytics', desc: 'Registration, attendance, and email insights' },
    { label: 'Email Communication', desc: 'Automated emails and logs' },
  ]

  return (
    <AnimatedSection>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch mt-10">
        {/* Left tabs selector */}
        <div className="lg:col-span-4 flex flex-row lg:flex-col gap-3 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0">
          {tabs.map((tab, idx) => {
            const isSelected = activeTab === idx
            return (
              <button
                key={tab.label}
                onClick={() => setActiveTab(idx)}
                className="shrink-0 text-left px-6 py-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-center min-w-[240px] lg:min-w-0"
                style={{
                  borderColor: isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)',
                  backgroundColor: isSelected ? 'rgba(255, 94, 0, 0.04)' : 'var(--bg-surface)',
                  boxShadow: isSelected ? '0 4px 20px rgba(255, 94, 0, 0.05)' : 'none',
                }}
              >
                <span className="font-display text-[15px] uppercase font-bold" style={{ color: isSelected ? 'var(--text-primary)' : 'var(--text-muted)' }}>
                  {tab.label}
                </span>
                <span className="font-body text-[11px] mt-1" style={{ color: 'var(--text-faint)' }}>
                  {tab.desc}
                </span>
              </button>
            )
          })}
        </div>

        {/* Right mockup view container */}
        <div className="lg:col-span-8 rounded-xl border overflow-hidden flex flex-col min-h-[420px]"
          style={{
            borderColor: 'var(--border-subtle)',
            backgroundColor: '#0F0F11',
          }}
        >
          {/* Mock Window Header bar */}
          <div className="px-6 py-4 flex items-center justify-between border-b" style={{ borderColor: '#222', backgroundColor: '#16161A' }}>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="font-body text-xs text-neutral-500 font-mono tracking-wider">
              {activeTab === 0 && 'dashboard.rallyverse.social'}
              {activeTab === 1 && 'payments.rallyverse.social'}
              {activeTab === 2 && 'check-in.rallyverse.social'}
              {activeTab === 3 && 'participants.rallyverse.social'}
              {activeTab === 4 && 'analytics.rallyverse.social'}
              {activeTab === 5 && 'mail-system.rallyverse.social'}
            </div>
            <div className="w-12 h-2" />
          </div>

          {/* Dynamic Mock Screen Rendering */}
          <div className="p-6 flex-1 flex flex-col font-mono text-xs text-neutral-300">
            {activeTab === 0 && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                  <div>
                    <span className="text-neutral-500">SYSTEM:</span> <span className="text-green-500 font-bold">RALLY-SERIES-01</span>
                    <h4 className="text-sm uppercase font-bold text-white mt-1">Event Dashboard</h4>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] bg-green-500/10 text-green-400 border border-green-500/20 rounded-full font-bold">LIVE STATUS</span>
                </div>
                
                {/* Stats cards inside dashboard */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-neutral-500 text-[10px] uppercase">Registrations</span>
                    <div className="text-lg font-bold text-white mt-1">154 / 160</div>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-neutral-500 text-[10px] uppercase">Payments Verified</span>
                    <div className="text-lg font-bold text-white mt-1">142 / 154</div>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-neutral-500 text-[10px] uppercase">Checked In</span>
                    <div className="text-lg font-bold text-white mt-1">98 / 154</div>
                  </div>
                </div>

                {/* Recent registrations */}
                <div className="space-y-3">
                  <div className="text-[10px] uppercase text-neutral-500 tracking-wider">Recent Registrations</div>
                  
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-white">S. Kumar</span>
                      <span className="text-neutral-400 text-[10px]">Men's Doubles</span>
                    </div>
                    <div className="text-right">
                      <span className="text-green-500 font-bold text-[10px]">PAID &check;</span>
                      <div className="text-[10px] text-neutral-500">Checked in</div>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-white">N. Jain</span>
                      <span className="text-neutral-400 text-[10px]">Mixed Doubles</span>
                    </div>
                    <div className="text-right">
                      <span className="text-yellow-500 font-bold text-[10px]">PENDING</span>
                      <div className="text-[10px] text-neutral-500">Awaiting verification</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                  <div>
                    <span className="text-neutral-500">PAYMENTS:</span> <span className="text-white">VERIFICATION QUEUE</span>
                    <h4 className="text-sm uppercase font-bold text-white mt-1">Payment Verification</h4>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 rounded-full font-bold">12 PENDING</span>
                </div>

                {/* Payment verification list */}
                <div className="space-y-4">
                  <div className="text-[10px] uppercase text-neutral-500 tracking-wider">Pending Verifications</div>
                  
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="text-white font-bold">S. Kumar — Men's Doubles</div>
                      <div className="text-neutral-500 text-[10px] mt-1">UPI Ref: rallysports@upi · ₹1,499</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 rounded font-bold cursor-pointer">VERIFY</span>
                      <span className="px-2 py-0.5 text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 rounded font-bold cursor-pointer">REJECT</span>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="text-white font-bold">N. Jain — Mixed Doubles</div>
                      <div className="text-neutral-500 text-[10px] mt-1">UPI Ref: njain@upi · ₹1,499</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 rounded font-bold cursor-pointer">VERIFY</span>
                      <span className="px-2 py-0.5 text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 rounded font-bold cursor-pointer">REJECT</span>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="text-white font-bold">R. Sharma — Men's Doubles</div>
                      <div className="text-neutral-500 text-[10px] mt-1">UPI Ref: rsharma@upi · ₹1,499</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-2 py-0.5 text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 rounded font-bold cursor-pointer">VERIFY</span>
                      <span className="px-2 py-0.5 text-[9px] bg-red-500/10 text-red-400 border border-red-500/20 rounded font-bold cursor-pointer">REJECT</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-neutral-900/50 border border-dashed border-neutral-800 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-neutral-400 text-[10px]">Screenshot uploaded for all pending</span>
                  </div>
                  <div className="text-white font-bold text-[10px]">QR: UPI ID — rallysports@upi</div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                  <div>
                    <span className="text-neutral-500">CHECK-IN:</span> <span className="text-white">EVENT DAY</span>
                    <h4 className="text-sm uppercase font-bold text-white mt-1">Attendance Check-In</h4>
                  </div>
                  <span className="px-2 py-1 text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-full font-bold">98 CHECKED IN</span>
                </div>

                {/* Check-in stats */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-neutral-500 text-[10px] uppercase">Total Registered</span>
                    <div className="text-lg font-bold text-white mt-1">154</div>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-neutral-500 text-[10px] uppercase">Checked In</span>
                    <div className="text-lg font-bold text-green-400 mt-1">98</div>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-neutral-500 text-[10px] uppercase">Not Yet Arrived</span>
                    <div className="text-lg font-bold text-yellow-400 mt-1">56</div>
                  </div>
                </div>

                {/* Check-in roster */}
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-800 text-[10px] text-neutral-500">
                        <th className="pb-2">PARTICIPANT</th>
                        <th className="pb-2">CATEGORY</th>
                        <th className="pb-2">PAYMENT</th>
                        <th className="pb-2 text-right">CHECK-IN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900 text-neutral-300">
                      <tr>
                        <td className="py-2.5 font-bold text-white">S. Kumar</td>
                        <td className="py-2.5 text-neutral-400">Men's Doubles</td>
                        <td className="py-2.5"><span className="text-green-500 font-bold">● VERIFIED</span></td>
                        <td className="py-2.5 text-right"><span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[9px] font-bold">IN</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-white">Nirmal Jain</td>
                        <td className="py-2.5 text-neutral-400">Mixed Doubles</td>
                        <td className="py-2.5"><span className="text-green-500 font-bold">● VERIFIED</span></td>
                        <td className="py-2.5 text-right"><span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[9px] font-bold">IN</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-white">Rohan Sharma</td>
                        <td className="py-2.5 text-neutral-400">Men's Doubles</td>
                        <td className="py-2.5"><span className="text-green-500 font-bold">● VERIFIED</span></td>
                        <td className="py-2.5 text-right"><span className="px-2 py-0.5 bg-neutral-800 text-neutral-500 border border-neutral-700/50 rounded text-[9px]">PENDING</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="text-[10px] text-neutral-500 flex justify-between">
                  <span>Check-in opens: 07:00 AM</span>
                  <span>Last check-in: 2 min ago</span>
                </div>
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                  <div>
                    <span className="text-neutral-500">ROSTER:</span> <span className="text-white">PARTICIPANTS</span>
                    <h4 className="text-sm uppercase font-bold text-white mt-1">Participant Management</h4>
                  </div>
                  <div className="p-2 bg-neutral-900 border border-neutral-800 rounded flex items-center gap-2">
                    <span className="text-neutral-500">Search:</span>
                    <span className="text-neutral-300">S. Kumar</span>
                  </div>
                </div>

                {/* Simulated Roster Table */}
                <div className="flex-1 overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-neutral-800 text-[10px] text-neutral-500">
                        <th className="pb-2">ID</th>
                        <th className="pb-2">PARTICIPANT</th>
                        <th className="pb-2">CATEGORY</th>
                        <th className="pb-2">PAYMENT</th>
                        <th className="pb-2 text-right">CHECK-IN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-900 text-neutral-300">
                      <tr>
                        <td className="py-2.5 font-mono text-neutral-500">RV-01-A</td>
                        <td className="py-2.5 font-bold text-white">S. Kumar</td>
                        <td className="py-2.5 text-neutral-400">Men's Doubles</td>
                        <td className="py-2.5"><span className="text-green-500 font-bold">● VERIFIED</span></td>
                        <td className="py-2.5 text-right"><span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[9px] font-bold">IN</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-mono text-neutral-500">RV-02-B</td>
                        <td className="py-2.5 font-bold text-white">Nirmal Jain</td>
                        <td className="py-2.5 text-neutral-400">Mixed Doubles</td>
                        <td className="py-2.5"><span className="text-green-500 font-bold">● VERIFIED</span></td>
                        <td className="py-2.5 text-right"><span className="px-2 py-0.5 bg-green-500/10 text-green-400 border border-green-500/20 rounded text-[9px] font-bold">IN</span></td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-mono text-neutral-500">RV-03-A</td>
                        <td className="py-2.5 font-bold text-white">Rohan Sharma</td>
                        <td className="py-2.5 text-neutral-400 font-bold">Men's Doubles</td>
                        <td className="py-2.5"><span className="text-green-500 font-bold">● VERIFIED</span></td>
                        <td className="py-2.5 text-right"><span className="px-2 py-0.5 bg-neutral-800 text-neutral-500 border border-neutral-700/50 rounded text-[9px]">PENDING</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-between text-[10px] text-neutral-500">
                  <span>Export CSV available</span>
                  <span>154 total participants</span>
                </div>
              </div>
            )}

            {activeTab === 4 && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                  <div>
                    <span className="text-neutral-500">METRICS:</span> <span className="text-white">INSIGHTS</span>
                    <h4 className="text-sm uppercase font-bold text-white mt-1">Analytics Dashboard</h4>
                  </div>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-neutral-500 text-[10px] uppercase">Registrations</span>
                    <div className="text-xl font-bold text-white mt-1">154 / 160</div>
                  </div>
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-neutral-500 text-[10px] uppercase">Attendance Rate</span>
                    <div className="text-xl font-bold text-white mt-1">63.6%</div>
                  </div>
                </div>

                {/* Registration progress */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase text-neutral-500 tracking-wider">Registration Fill Rate</div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-[9px] text-neutral-500">WEEK 1</span>
                      <div className="flex-1 h-3 bg-neutral-900 rounded overflow-hidden">
                        <div className="h-full bg-orange-600 rounded" style={{ width: '25%' }} />
                      </div>
                      <span className="w-8 text-[10px] text-white">25%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-[9px] text-neutral-500">WEEK 2</span>
                      <div className="flex-1 h-3 bg-neutral-900 rounded overflow-hidden">
                        <div className="h-full bg-orange-500 rounded" style={{ width: '60%' }} />
                      </div>
                      <span className="w-8 text-[10px] text-white">60%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="w-12 text-[9px] text-neutral-500">WEEK 3</span>
                      <div className="flex-1 h-3 bg-neutral-900 rounded overflow-hidden">
                        <div className="h-full bg-orange-400 rounded" style={{ width: '96%' }} />
                      </div>
                      <span className="w-8 text-[10px] text-white">96%</span>
                    </div>
                  </div>
                </div>

                {/* Source breakdown */}
                <div className="text-[10px] text-neutral-500 flex justify-between font-mono">
                  <span>Email Sent: 124</span>
                  <span>Opened: 89 (71.7%)</span>
                  <span>CSV Export Available</span>
                </div>
              </div>
            )}

            {activeTab === 5 && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                  <div>
                    <span className="text-neutral-500">MAIL SYSTEM:</span> <span className="text-white">COMMUNICATION LOG</span>
                    <h4 className="text-sm uppercase font-bold text-white mt-1">Email Communication</h4>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded font-bold font-mono">AUTO-TRIGGER</span>
                </div>

                {/* Email types */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-center">
                    <div className="text-green-400 font-bold text-lg">124</div>
                    <div className="text-[9px] text-neutral-500">Registration Emails</div>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-center">
                    <div className="text-green-400 font-bold text-lg">98</div>
                    <div className="text-[9px] text-neutral-500">Approval Notifications</div>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg text-center">
                    <div className="text-yellow-400 font-bold text-lg">3</div>
                    <div className="text-[9px] text-neutral-500">Rejection Notifications</div>
                  </div>
                </div>

                {/* Mock email preview */}
                <div className="flex-1 p-4 bg-[#16161A] border border-neutral-800 rounded-lg flex flex-col gap-3 font-sans text-neutral-300">
                  <div className="text-[11px] font-mono space-y-1 pb-3 border-b border-neutral-800/60">
                    <div><span className="text-neutral-500">From:</span> RallyVerse &lt;registrations@rallyverse.social&gt;</div>
                    <div><span className="text-neutral-500">To:</span> player@email.com</div>
                    <div><span className="text-neutral-500">Subject:</span> Rally Series 01 — Registration Confirmed</div>
                  </div>

                  <div className="text-[12px] space-y-3 font-sans leading-relaxed">
                    <p className="font-bold text-white">Hi Player,</p>
                    <p>
                      Your registration and payment for <strong className="text-orange-400">Rally Series 01</strong> has been approved and verified.
                    </p>
                    <div className="p-3 bg-neutral-900 border border-neutral-800 rounded font-mono text-[11px] space-y-1">
                      <div>Event: Rally Series 01 — Bengaluru</div>
                      <div>Venue: Sports Arena, Bengaluru</div>
                      <div>Date & Time: 5 July 2026, 11:00 AM</div>
                      <div className="text-green-400">Pass Code: RV-8951-XM</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AnimatedSection>
  )
}
