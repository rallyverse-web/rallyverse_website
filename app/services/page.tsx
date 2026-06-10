'use client'

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
      'Add/Edit/Remove Participants',
      'Registration & Payment Confirmation Emails',
      'Up to 300 Emails',
      'Featured Tournament Listing',
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
    desc: 'Seamless ticketing, automated waiver collection, secure payments, and instant confirmation for participants.',
  },
  {
    icon: LayoutDashboard,
    name: 'Organizer Dashboard',
    desc: 'Configure draws, brackets, scheduling, and match results dynamically using our bespoke tournament tool.',
  },
  {
    icon: Users,
    name: 'Participant Management',
    desc: 'Real-time entry lists, digital check-ins, seedings, and division groupings without spreadsheet overhead.',
  },
  {
    icon: Mail,
    name: 'Email Communication',
    desc: 'Automated custom-branded email confirmations, schedule updates, and post-event match details.',
  },
  {
    icon: BarChart3,
    name: 'Event Analytics',
    desc: 'Track registration pacing, participant demographics, revenue metrics, and engagement trends.',
  },
  {
    icon: ShieldCheck,
    name: 'Operational Support',
    desc: 'On-the-ground support, logistics checklists, digital scheduling tools, and operations consulting.',
  },
]

export default function ServicesPage() {
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
                    <p className="font-body text-[14px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {feat.desc}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>

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
