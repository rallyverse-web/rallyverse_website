import type { Metadata } from 'next'
import { Swords, Timer, Bike, Target, Heart, Globe, Shield, Activity, Users, Cpu, Briefcase } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import Flywheel from '@/components/Flywheel'

export const metadata: Metadata = {
  title: 'About — RallyVerse | Sports Growth Partner',
  description: 'Learn about RallyVerse, our vision, values, and how we serve as a sports growth partner building active communities and powering real events in Bengaluru.',
  openGraph: {
    title: 'About — RallyVerse | Sports Growth Partner',
    description: 'Learn about RallyVerse, our vision, values, and how we serve as a sports growth partner building active communities and powering real events in Bengaluru.',
    url: 'https://rallyverse.social/about',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: 'RallyVerse — Rallying Communities Through Sports',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — RallyVerse | Sports Growth Partner',
    description: 'Learn about RallyVerse, our vision, values, and how we serve as a sports growth partner building active communities and powering real events in Bengaluru.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/about',
  },
}

const differentiators = [
  {
    icon: Users,
    title: 'Active Community',
    desc: "We own and operate our active sports community rather than simply advising on one.",
  },
  {
    icon: Cpu,
    title: 'Event Infrastructure',
    desc: 'Proprietary check-in tools, registration databases, templates, and analytics pipelines.',
  },
  {
    icon: Activity,
    title: 'Sports Expertise',
    desc: 'Deep operational insight running everything from regional badminton brackets to league series.',
  },
  {
    icon: Briefcase,
    title: 'Partnership Network',
    desc: 'Direct channels connecting corporate sports programs, brands, players, and venue owners.',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-[1100px] px-6">
        {/* ── Header ───────────────────────────────────────── */}
        <AnimatedSection>
          <div className="flex items-center gap-3 mb-5">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              ABOUT US
            </span>
          </div>

          <h1 className="font-display text-[36px] leading-none uppercase sm:text-[48px] md:text-[80px]" style={{ color: 'var(--text-primary)' }}>
            RALLYVERSE
          </h1>
          <p className="font-display text-[20px] uppercase sm:text-[28px] md:text-[40px] mt-1" style={{ color: 'var(--accent-primary)' }}>
            Rallying Communities Through Sports
          </p>
        </AnimatedSection>

        {/* ── Our Story ────────────────────────────────────── */}
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start">
          <AnimatedSection>
            <h2 className="font-display text-[24px] uppercase sm:text-[32px]" style={{ color: 'var(--text-primary)' }}>
              Our Story
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="space-y-5 font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <p>
                RallyVerse began with a simple observation: running sports events is hard, and building active, recurring sports communities is even harder. What started as organizing local badminton tournaments in Bengaluru quickly evolved. We realized that organizers, academies, and brands did not just need generic marketing; they needed a partner that understood operational logistics and community dynamics.
              </p>
              <p>
                Today, RallyVerse has grown from a single event management service into a comprehensive Sports Growth Partner. We have developed custom event registration software, built a vibrant player network, and connected brands with active communities to scale sports participation.
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* ── Mission & Vision ──────────────────────────────── */}
        <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-2">
          <AnimatedSection>
            <div className="py-10 px-8 rounded-xl h-full flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
                  <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    MISSION
                  </span>
                </div>
                <h3 className="font-display text-[28px] uppercase sm:text-[36px]" style={{ color: 'var(--text-primary)' }}>
                  Our Mission
                </h3>
                <p className="mt-4 font-body text-[15px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  To grow India&apos;s sports ecosystem by building communities, amplifying sports brands, and making great sports events happen. We empower organizers with technology and support.
                </p>
              </div>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <div className="py-10 px-8 rounded-xl h-full flex flex-col justify-between" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
                  <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                    VISION
                  </span>
                </div>
                <h3 className="font-display text-[28px] uppercase sm:text-[36px]" style={{ color: 'var(--text-primary)' }}>
                  Our Vision
                </h3>
                <p className="mt-4 font-body text-[15px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  To become India&apos;s most trusted community-driven sports growth platform, uniting venue owners, brands, clubs, and players in a cohesive, sustainable sports network.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* ── What Makes Us Different ─────────────────────────── */}
        <div className="mt-24">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  OUR EDGE
                </span>
                <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
              </div>
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                What Makes Us Different
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {differentiators.map((diff, i) => {
              const Icon = diff.icon
              return (
                <AnimatedSection key={diff.title} delay={i * 0.1}>
                  <div className="rounded-xl p-8 h-full flex flex-col justify-between transition-all duration-300" style={{ backgroundColor: 'var(--card-bg)', borderLeft: '3px solid var(--accent-primary)' }}>
                    <div>
                      <Icon size={28} className="mb-4" style={{ color: 'var(--accent-primary)' }} />
                      <h3 className="font-display text-[22px] uppercase mb-3 font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {diff.title}
                      </h3>
                      <p className="font-body text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {diff.desc}
                      </p>
                    </div>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>

        {/* ── Sports Core ────────────────────────────────────── */}
        <div className="mt-28">
          <AnimatedSection>
            <div className="text-center mb-16">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  SPORTS CORE
                </span>
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
              </div>
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                One Verse. Multiple Ways to Rally.
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3">
            {[
              { icon: Swords, name: 'The Court', desc: 'Badminton tournaments and leagues with competitive brackets for all skill levels.' },
              { icon: Timer, name: 'The Road', desc: 'Community runs and marathons that push you further.' },
              { icon: Bike, name: 'The Ride', desc: 'Group rides and cycling events across Bengaluru.' },
            ].map((pillar, i) => {
              const Icon = pillar.icon
              return (
                <AnimatedSection key={pillar.name} delay={i * 0.1}>
                  <div className="flex flex-col items-center text-center p-6 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                    <Icon size={28} className="mb-3" style={{ color: 'var(--accent-primary)' }} />
                    <h3 className="font-display text-[20px] uppercase mb-2" style={{ color: 'var(--text-primary)' }}>
                      {pillar.name}
                    </h3>
                    <p className="font-body text-[13px] leading-relaxed max-w-[180px]" style={{ color: 'var(--text-muted)' }}>
                      {pillar.desc}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </div>

      {/* Flywheel section */}
      <div className="mt-28">
        <Flywheel />
      </div>
    </div>
  )
}
