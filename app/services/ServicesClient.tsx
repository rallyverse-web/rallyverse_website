'use client'

import { useState } from 'react'
import { Users, Trophy, Megaphone, Handshake, CreditCard, LayoutDashboard, Mail, BarChart3, ShieldCheck, Check, ArrowRight } from 'lucide-react'
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
    title: 'Event Management',
    desc: 'Registrations, participant management, communication, and execution support.',
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
    price: '₹1,499',
    desc: 'For organizers who want professional registration management.',
    features: [
      'Registrations through RallyVerse',
      'Organizer Dashboard',
      'Registration Analytics',
      'Review, approve/reject, and manage registrations',
      'Participant Email Communication & Updates',
      'Enhanced Event Visibility',
      'One Custom Tournament Poster',
    ],
    footerInfo: 'Billed per event. Fully managed registration cycle.',
    ctaText: 'Get Started',
    ctaHref: '/partners?interest=Event Management',
    recommended: true,
  },
  {
    name: 'Growth Partner',
    price: '₹4,999+',
    desc: 'For organizers who want RallyVerse to help grow registrations and visibility.',
    features: [
      'RallyVerse Managed Marketing',
      'Registration Acquisition Support',
      'WhatsApp Promotions',
      'Community Promotions',
      'Unlimited Emails',
      'Multiple Promotional Creatives',
      'Advanced Content Creation',
      'Dedicated Support',
      'Priority Visibility',
    ],
    footerInfo: 'Custom execution plans tailored to your community size.',
    ctaText: 'Book a Consultation',
    ctaHref: '/partners?interest=Partnerships',
    recommended: false,
  },
]

const infrastructureFeatures = [
  {
    icon: CreditCard,
    name: 'Registration Management',
    desc: 'Review registrations, manage approval status, and export participant data from one dashboard.',
  },
  {
    icon: LayoutDashboard,
    name: 'Organizer Dashboard',
    desc: 'Manage events, registrations, payment settings, and communication workflows in one place.',
  },
  {
    icon: Users,
    name: 'Participant Management',
    desc: 'Review participant records, update doubles details, and keep registration data in sync.',
  },
  {
    icon: Mail,
    name: 'Email Communication',
    desc: 'Send templated participant emails, broadcasts, and updates with sent/failed logging.',
  },
  {
    icon: BarChart3,
    name: 'Event Analytics',
    desc: 'Track views, registrations, approval rates, email activity, and WhatsApp engagement.',
  },
  {
    icon: ShieldCheck,
    name: 'Operational Support',
    desc: 'On-the-ground support, logistics checklists, digital scheduling tools, and operations consulting.',
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
                We don&apos;t just consult on community. We own and operate one. Here is how we help you succeed.
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
                Professional Event Scaling
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
                Explore the administrative software that coordinates matches, processes entries, and manages our active sports communities.
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
    { label: 'Event Admin Dashboard', desc: 'Registrations and approvals' },
    { label: 'Registration Management', desc: 'Search, export, and status tools' },
    { label: 'Participant Management', desc: 'Edit contact and category details' },
    { label: 'Analytics', desc: 'Views, approvals, and email performance' },
    { label: 'Email Communication', desc: 'Templates, preview, and logs' },
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
              {activeTab === 0 && 'organizer-dash.rallyverse.social'}
              {activeTab === 1 && 'registrations.rallyverse.social'}
              {activeTab === 2 && 'participants.rallyverse.social'}
              {activeTab === 3 && 'analytics.rallyverse.social'}
              {activeTab === 4 && 'mail-system.rallyverse.social'}
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
                    <h4 className="text-sm uppercase font-bold text-white mt-1">Organizer Dashboard</h4>
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
                    <span className="text-neutral-500 text-[10px] uppercase">Active Courts</span>
                    <div className="text-lg font-bold text-white mt-1">8 Courts</div>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-neutral-500 text-[10px] uppercase">Verification Rate</span>
                    <div className="text-lg font-bold text-white mt-1">100%</div>
                  </div>
                </div>

                {/* Brackets preview */}
                <div className="space-y-3">
                  <div className="text-[10px] uppercase text-neutral-500 tracking-wider">Active Match Brackets (Men's Doubles)</div>
                  
                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-white">Court 1: S. Kumar / A. Sharma</span>
                      <span className="text-neutral-400">Court 1: M. Reddy / V. Rao</span>
                    </div>
                    <div className="text-right">
                      <span className="text-orange-500 font-bold">2nd Set (14-11)</span>
                      <div className="text-[10px] text-neutral-500">1st Set: 21-18</div>
                    </div>
                  </div>

                  <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-lg flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <span className="text-white">Court 2: N. Jain / R. Sharma</span>
                      <span className="text-neutral-400">Court 2: D. Sen / K. Verma</span>
                    </div>
                    <div className="text-right">
                      <span className="text-yellow-500 font-bold">Warm-up</span>
                      <div className="text-[10px] text-neutral-500">Scheduled: 11:30 AM</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 1 && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                  <div>
                    <span className="text-neutral-500">SETTINGS:</span> <span className="text-white">TICKET CONFIGURATION</span>
                    <h4 className="text-sm uppercase font-bold text-white mt-1">Registration Settings</h4>
                  </div>
                </div>

                {/* Ticket pass layout */}
                <div className="space-y-4">
                  <div className="text-[10px] uppercase text-neutral-500 tracking-wider">Configured Pass Categories</div>
                  
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="text-white font-bold">Men's Doubles — Standard Entry</div>
                      <div className="text-neutral-500 text-[10px] mt-1">Cap: 50 teams · Includes Custom Creatives</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white">₹1,499</span>
                      <span className="px-2 py-0.5 text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 rounded font-bold">48/50 SOLD</span>
                    </div>
                  </div>

                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg flex flex-wrap justify-between items-center gap-4">
                    <div>
                      <div className="text-white font-bold">Mixed Doubles — Standard Entry</div>
                      <div className="text-neutral-500 text-[10px] mt-1">Cap: 50 teams · Includes Custom Creatives</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white">₹1,499</span>
                      <span className="px-2 py-0.5 text-[9px] bg-green-500/10 text-green-400 border border-green-500/20 rounded font-bold">32/50 SOLD</span>
                    </div>
                  </div>
                </div>

                {/* Discount Code */}
                <div className="p-3 bg-neutral-900/50 border border-dashed border-neutral-800 rounded-lg flex justify-between items-center">
                  <div>
                    <span className="text-orange-500 font-bold">RALLYSMASH</span>
                    <span className="text-neutral-500 text-[10px] ml-2">(15% Promotional Discount)</span>
                  </div>
                  <div className="text-white font-bold">Used: 42 times</div>
                </div>
              </div>
            )}

            {activeTab === 2 && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                  <div>
                    <span className="text-neutral-500">ROSTER:</span> <span className="text-white">LIVE ATHLETES REGISTRY</span>
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
              </div>
            )}

            {activeTab === 3 && (
              <div className="space-y-6 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center pb-4 border-b border-neutral-800">
                  <div>
                    <span className="text-neutral-500">METRICS:</span> <span className="text-white">CONVERSIONS & REGISTRATIONS</span>
                    <h4 className="text-sm uppercase font-bold text-white mt-1">Analytics Dashboard</h4>
                  </div>
                </div>

                {/* Conversion metrics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-neutral-500 text-[10px] uppercase">Event Revenue</span>
                    <div className="text-xl font-bold text-white mt-1">₹1,19,920</div>
                  </div>
                  <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-lg">
                    <span className="text-neutral-500 text-[10px] uppercase">Sign-up Velocity</span>
                    <div className="text-xl font-bold text-white mt-1">8.2 / day</div>
                  </div>
                </div>

                {/* CSS progress chart */}
                <div className="space-y-2">
                  <div className="text-[10px] uppercase text-neutral-500 tracking-wider">Registration Ramp-up Timeline</div>
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

                {/* Referral listing */}
                <div className="text-[10px] text-neutral-500 flex justify-between font-mono">
                  <span>Source: WhatsApp (64%)</span>
                  <span>Instagram (22%)</span>
                  <span>Direct/Organic (14%)</span>
                </div>
              </div>
            )}

            {activeTab === 4 && (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                <div className="flex justify-between items-center pb-3 border-b border-neutral-800">
                  <div>
                    <span className="text-neutral-500">PREVIEW:</span> <span className="text-white">TRANSACTIONAL CONFIRMATION MAIL</span>
                    <h4 className="text-sm uppercase font-bold text-white mt-1">Email Communication</h4>
                  </div>
                  <span className="px-2 py-0.5 text-[9px] bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded font-bold font-mono">AUTO-TRIGGER</span>
                </div>

                {/* Mock email container */}
                <div className="flex-1 p-4 bg-[#16161A] border border-neutral-800 rounded-lg flex flex-col gap-3 font-sans text-neutral-300">
                  <div className="text-[11px] font-mono space-y-1 pb-3 border-b border-neutral-800/60">
                    <div><span className="text-neutral-500">From:</span> RallyVerse &lt;registrations@rallyverse.social&gt;</div>
                    <div><span className="text-neutral-500">To:</span> player@email.com</div>
                    <div><span className="text-neutral-500">Subject:</span> Rally Series 01 — Registration Confirmed! 🏸</div>
                  </div>

                  <div className="text-[12px] space-y-3 font-sans leading-relaxed">
                    <p className="font-bold text-white">Hi Player,</p>
                    <p>
                      Your registration and payment for <strong className="text-orange-400">Rally Series 01 — Bengaluru Badminton</strong> has been successfully approved and verified!
                    </p>
                    <div className="p-3 bg-neutral-900 border border-neutral-800 rounded font-mono text-[11px] space-y-1">
                      <div>Event: Rally Series 01 — Badminton</div>
                      <div>Venue: A2V Badminton Academy, Rajajinagar</div>
                      <div>Date & Time: 5 July 2026, 11:00 AM</div>
                      <div className="text-green-400">Pass Code: RV-8951-XM</div>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Show your Pass Code at the check-in desk on game day. Brackets will be updated live.
                    </p>
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
