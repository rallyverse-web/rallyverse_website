import type { Metadata } from 'next'
import { Swords, Mountain, Timer, Bike, Target, Heart, Globe } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: 'About — RallyVerse | Rally Beyond Routine — Bengaluru Sports Community',
  description: 'RallyVerse is a community-first universe built for people who move, compete, explore, and connect. Learn about our mission, vision, and why we exist.',
  openGraph: {
    title: 'About — RallyVerse | Rally Beyond Routine — Bengaluru Sports Community',
    description: 'RallyVerse is a community-first universe built for people who move, compete, explore, and connect. Learn about our mission, vision, and why we exist.',
    url: 'https://rallyverse.social/about',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: 'RallyVerse — Rally Beyond Routine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About — RallyVerse | Rally Beyond Routine — Bengaluru Sports Community',
    description: 'RallyVerse is a community-first universe built for people who move, compete, explore, and connect. Learn about our mission, vision, and why we exist.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/about',
  },
}

const values = [
  {
    icon: Heart,
    title: 'Community First',
    desc: 'Everything we build starts with people. The Verse thrives when every player, explorer, and volunteer feels they belong to something bigger than themselves.',
  },
  {
    icon: Target,
    title: 'Inclusive Competition',
    desc: 'From beginners to advanced athletes, there is a place for every skill level. We believe the best rivalries and friendships are formed when everyone shows up.',
  },
  {
    icon: Globe,
    title: 'Beyond the Scoreboard',
    desc: 'A tournament is just the beginning. We are building experiences that carry beyond the court, trail, road, and ride — into how we live and connect every day.',
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
            Rally Beyond Routine
          </p>
        </AnimatedSection>

        {/* ── What is RallyVerse ─────────────────────────────── */}
        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start">
          <AnimatedSection>
            <h2 className="font-display text-[24px] uppercase sm:text-[32px]" style={{ color: 'var(--text-primary)' }}>
              What is RallyVerse?
            </h2>
          </AnimatedSection>
          <AnimatedSection delay={0.1}>
            <div className="space-y-5 font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              <p>
                RallyVerse is not an event company. It is a universe built for people who still believe the best moments happen when you move, compete, and show up for each other.
              </p>
              <p>
                We are a community-driven platform that brings together badminton tournaments, treks, marathons, cycling events, and more — all under one roof. Every tournament, every trek, every ride, every race is the same thing: a reason to be fully alive.
              </p>
              <p>
                The Court. The Trail. The Road. The Ride. One Verse.
              </p>
            </div>
          </AnimatedSection>
        </div>

        {/* ── Mission ──────────────────────────────────────── */}
        <div className="mt-20 py-14 px-8 rounded-xl" style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  MISSION
                </span>
              </div>
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                Why We Exist
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <p className="font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Somewhere between the morning alarm and the weekend scroll, life started feeling smaller than it should. RallyVerse exists to reverse that. Our mission is to build a universe where movement, competition, and community converge — creating experiences that push people beyond routine and into something extraordinary.
              </p>
            </AnimatedSection>
          </div>
        </div>

        {/* ── Vision ────────────────────────────────────────── */}
        <div className="mt-14">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start">
            <AnimatedSection>
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  VISION
                </span>
              </div>
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                Where We Are Headed
              </h2>
            </AnimatedSection>
            <AnimatedSection delay={0.1}>
              <p className="font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                We envision a world where every city has its own Verse — a connected ecosystem of sports and adventure communities. Starting with Bengaluru, we are building a blueprint for how people can rally through life together. A future where RallyVerse is synonymous with the joy of showing up, playing hard, and belonging.
              </p>
            </AnimatedSection>
          </div>
        </div>

        {/* ── Community-First ───────────────────────────────── */}
        <div className="mt-20">
          <AnimatedSection>
            <div className="text-center mb-14">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  COMMUNITY-FIRST PHILOSOPHY
                </span>
                <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
              </div>
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[56px]" style={{ color: 'var(--text-primary)' }}>
                Built by the Community,
                <br />
                for the Community
              </h2>
              <p className="mt-6 max-w-2xl mx-auto font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Every decision we make starts with the people who show up. RallyVerse is shaped by players, explorers, and community builders who believe that shared experiences make life richer.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {values.map((val, i) => {
              const Icon = val.icon
              return (
                <AnimatedSection key={val.title} delay={i * 0.1}>
                  <div className="rounded-xl p-8 h-full" style={{ backgroundColor: 'var(--card-bg)', borderLeft: '3px solid var(--accent-primary)' }}>
                    <Icon size={28} className="mb-4" style={{ color: 'var(--accent-primary)' }} />
                    <h3 className="font-display text-[22px] uppercase mb-3" style={{ color: 'var(--text-primary)' }}>
                      {val.title}
                    </h3>
                    <p className="font-body text-[15px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                      {val.desc}
                    </p>
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>

        {/* ── Categories ────────────────────────────────────── */}
        <div className="mt-20">
          <AnimatedSection>
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
                <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                  THE FOUR PILLARS
                </span>
                <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
              </div>
              <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
                One Verse. Four Ways to Rally.
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-4">
            {[
              { icon: Swords, name: 'The Court', desc: 'Badminton tournaments with competitive brackets for all skill levels.' },
              { icon: Mountain, name: 'The Trail', desc: 'Group treks through Karnataka\'s best trails and landscapes.' },
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
    </div>
  )
}
