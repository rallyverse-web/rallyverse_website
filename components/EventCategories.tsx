'use client'

import { CreditCard, LayoutDashboard, Users, Mail, BarChart3, ShieldCheck } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'

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

export default function EventCategories() {
  return (
    <section id="infrastructure" className="py-20 md:py-28" style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <AnimatedSection>
          <div className="mb-8 flex flex-col items-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              EVENT TECHNOLOGY
            </span>
          </div>

          <div className="mb-16 text-center font-display text-[28px] leading-none uppercase sm:text-[40px] md:text-[56px]" style={{ color: 'var(--text-primary)' }}>
            We Don&apos;t Just Advise on Events.
            <br />
            We Run Them.
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
      </div>
    </section>
  )
}
