'use client'

import { Users, Trophy, Megaphone, Handshake } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'

const services = [
  {
    icon: Users,
    title: 'Community Building',
    desc: 'Build engaged sports communities that participate, return, and grow.',
  },
  {
    icon: Trophy,
    title: 'Event Infrastructure',
    desc: 'Power event pages, registration flows, participant management, and communication with RallyVerse infrastructure.',
  },
  {
    icon: Megaphone,
    title: 'Sports Marketing',
    desc: 'Reach the right audience and grow participation.',
  },
  {
    icon: Handshake,
    title: 'Partnerships & Outreach',
    desc: 'Connect with communities, brands, academies, and organizers.',
  },
]

export default function WhatWeDo() {
  return (
    <section id="services" className="py-20 md:py-28" style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <AnimatedSection>
          <div className="mb-5 flex items-center justify-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              WHAT WE DO
            </span>
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.05}>
          <h2 className="text-center font-display text-[32px] leading-none uppercase sm:text-[44px] md:text-[56px] mb-16" style={{ color: 'var(--text-primary)' }}>
            Building Sports Communities That Grow
          </h2>
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
      </div>
    </section>
  )
}
