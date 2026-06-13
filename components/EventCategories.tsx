'use client'

import { CreditCard, LayoutDashboard, Users, Mail, BarChart3, ShieldCheck, UserCheck, Clock } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'

const infrastructureFeatures = [
  {
    icon: CreditCard,
    name: 'Registration Management',
    desc: 'Online registrations, approval workflows, participant management, and editing from one dashboard.',
  },
  {
    icon: ShieldCheck,
    name: 'Payment Management',
    desc: 'UPI payments, QR code payments, payment verification workflow, and payment screenshot verification.',
  },
  {
    icon: UserCheck,
    name: 'Attendance Tracking',
    desc: 'Event-day participant check-in, attendance tracking, and arrival monitoring.',
  },
  {
    icon: Clock,
    name: 'Time Slot Registrations',
    desc: 'Slot-based registrations with controlled participant allocation.',
  },
  {
    icon: LayoutDashboard,
    name: 'Organizer Dashboard',
    desc: 'Configure event pages, manage registrations, oversee communication, and control visibility.',
  },
  {
    icon: Users,
    name: 'Participant Management',
    desc: 'Review participant records, update category details, and keep registration data in sync.',
  },
  {
    icon: Mail,
    name: 'Email Communication',
    desc: 'Automated registration emails, approval notifications, rejection notifications, and organizer communication tools.',
  },
  {
    icon: BarChart3,
    name: 'Event Analytics',
    desc: 'Registration insights, attendance insights, communication analytics, and CSV exports.',
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
              EVENT INFRASTRUCTURE
            </span>
          </div>

          <div className="mb-16 text-center font-display text-[28px] leading-none uppercase sm:text-[40px] md:text-[56px]" style={{ color: 'var(--text-primary)' }}>
            We Don&apos;t Just Advise on Events.
            <br />
            We Build the Systems Behind Them.
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
