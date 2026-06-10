'use client'

import { motion } from 'motion/react'
import { CalendarDays, Users, Handshake, TrendingUp, Cpu, Sparkles, ArrowRight, ArrowDown } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'

const flywheelSteps = [
  {
    icon: CalendarDays,
    num: '01',
    title: 'Events We Run',
    desc: 'We launch and manage premium sporting events, tournaments, and leagues that attract players and spectators.',
  },
  {
    icon: Users,
    num: '02',
    title: 'Owned Community',
    desc: 'Participants join our active WhatsApp community, transforming single-event players into long-term members.',
  },
  {
    icon: Handshake,
    num: '03',
    title: 'Partnerships',
    desc: 'Brands, academies, and venue owners partner with us to reach and activate this highly engaged sports community.',
  },
  {
    icon: TrendingUp,
    num: '04',
    title: 'Reinvested Growth',
    desc: 'Partnership sponsorships and platform fee revenues are fully reinvested back into the sports ecosystem.',
  },
  {
    icon: Cpu,
    num: '05',
    title: 'Better Infrastructure',
    desc: 'We develop custom registration engines, match dashboards, and Operational checklists for premium execution.',
  },
  {
    icon: Sparkles,
    num: '06',
    title: 'Larger Audience',
    desc: 'Premium technology and marketing invite more organizers and players, expanding our active community and event scope.',
  },
]

export default function Flywheel() {
  return (
    <section className="py-20" style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <AnimatedSection>
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
              <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                THE RALLYVERSE FLYWHEEL
              </span>
              <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
            </div>
            <h2 className="font-display text-[28px] uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
              How RallyVerse Grows
            </h2>
            <p className="mt-4 max-w-lg mx-auto font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              We don&apos;t just consult on community. We own and operate one. Our flywheel represents the compounding loop that powers real sports growth.
            </p>
          </div>
        </AnimatedSection>

        {/* Desktop Loop Layout */}
        <div className="relative">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {flywheelSteps.map((step, i) => {
              const Icon = step.icon
              return (
                <AnimatedSection key={step.title} delay={i * 0.1}>
                  <div
                    className="group rounded-xl p-8 transition-all duration-300 h-full flex flex-col justify-between relative"
                    style={{
                      backgroundColor: 'var(--card-bg)',
                      border: '1px solid var(--border-subtle)',
                    }}
                  >
                    <div>
                      {/* Connection Indicators */}
                      <span className="absolute top-4 right-6 font-display text-4xl text-[rgba(255,94,0,0.15)] group-hover:text-[rgba(255,94,0,0.3)] transition-colors duration-200">
                        {step.num}
                      </span>
                      
                      <Icon
                        size={32}
                        className="mb-6 transition-transform duration-300 group-hover:scale-110"
                        style={{ color: 'var(--accent-primary)' }}
                      />
                      <h3 className="font-display text-[22px] uppercase leading-tight font-semibold" style={{ color: 'var(--text-primary)' }}>
                        {step.title}
                      </h3>
                      <p className="mt-4 font-body text-[14px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {step.desc}
                      </p>
                    </div>

                    {/* Step Flow Arrow */}
                    {i < 5 && (
                      <div className="hidden lg:flex absolute -right-6 top-1/2 -translate-y-1/2 z-10 text-[var(--accent-secondary)] opacity-50 group-hover:opacity-100 transition-opacity duration-200">
                        {(i === 2 || i === 5) ? null : <ArrowRight size={16} />}
                      </div>
                    )}
                  </div>
                </AnimatedSection>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
