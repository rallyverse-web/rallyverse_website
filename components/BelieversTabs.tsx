'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ExternalLink, User } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import { Believer } from '@/data/believers'

interface BelieversTabsProps {
  initialBelievers: Believer[]
}

const CATEGORIES = [
  { id: 'early-supporters', label: 'Early Supporters' },
  { id: 'partner-feedback', label: 'Partner Feedback' },
  { id: 'community-feedback', label: 'Community Feedback' },
  { id: 'organizer-feedback', label: 'Organizer Feedback' },
  { id: 'success-stories', label: 'Success Stories' }
]

export default function BelieversTabs({ initialBelievers }: BelieversTabsProps) {
  const [activeCategory, setActiveCategory] = useState<string>('early-supporters')

  const filteredBelievers = initialBelievers.filter(
    (b) => b.category === activeCategory
  )

  // Helper to generate initials for avatar placeholder
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <div className="w-full">
      {/* ── Category Tabs ─────────────────────────────────── */}
      <div className="mt-12 flex flex-wrap gap-3 border-b pb-6" style={{ borderColor: 'var(--border-subtle)' }}>
        {CATEGORIES.map((cat) => {
          const isActive = activeCategory === cat.id
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="font-body text-xs font-semibold uppercase tracking-wider px-5 py-3 rounded-lg border transition-all duration-200"
              style={{
                backgroundColor: isActive
                  ? 'var(--accent-primary)'
                  : 'var(--bg-surface)',
                borderColor: isActive ? 'var(--accent-primary)' : 'var(--border-subtle)',
                color: isActive ? 'var(--bg-primary)' : 'var(--text-primary)',
              }}
            >
              {cat.label}
            </button>
          )
        })}
      </div>

      {/* ── Testimonials Grid ────────────────────────────── */}
      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {filteredBelievers.map((person, i) => {
          const hasImage = person.image && person.image.trim() !== ''
          return (
            <AnimatedSection key={person.name + '-' + activeCategory} delay={i * 0.05}>
              <div
                className="flex flex-col items-center text-center rounded-xl p-8 transition-all duration-300 h-full hover:translate-y-[-4px]"
                style={{
                  backgroundColor: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                {/* ── Avatar / Initials ────────────────────────── */}
                <div className="mb-4">
                  {hasImage ? (
                    <div
                      className="relative mx-auto h-24 w-24 overflow-hidden rounded-full"
                      style={{ border: '2px solid var(--border-subtle)' }}
                    >
                      <Image
                        src={person.image}
                        alt={person.name}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  ) : (
                    <div
                      className="mx-auto h-24 w-24 rounded-full flex items-center justify-center font-display text-[24px] tracking-wider uppercase font-bold"
                      style={{
                        background: 'var(--rallyverse-gradient)',
                        color: 'var(--bg-primary)',
                        border: '2px solid var(--accent-primary)',
                      }}
                    >
                      {getInitials(person.name)}
                    </div>
                  )}
                </div>

                {/* ── Category Tag ──────────────────────────────── */}
                <div
                  className="mx-auto mb-4 inline-flex items-center justify-center rounded-xl px-4 py-1.5"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--accent-primary) 6%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--accent-primary) 30%, transparent)',
                  }}
                >
                  <span className="font-body text-[9px] font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-primary)' }}>
                    {CATEGORIES.find((c) => c.id === person.category)?.label || 'Believer'}
                  </span>
                </div>

                {/* ── Name & Headline ───────────────────────────── */}
                <h2 className="font-display text-[22px] uppercase leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                  {person.name}
                </h2>
                <p className="font-body text-[13px] font-medium tracking-wide mb-1" style={{ color: 'var(--accent-primary)' }}>
                  {person.headline}
                </p>
                <p className="font-body text-[11px] leading-relaxed mb-5" style={{ color: 'var(--text-faint)' }}>
                  {person.context}
                </p>

                {/* ── Quote Box ─────────────────────────────────── */}
                <div
                  className="w-full rounded-lg px-5 py-4 mb-5"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--accent-primary) 5%, transparent)',
                    borderLeft: '3px solid var(--accent-primary)',
                  }}
                >
                  <p
                    className="font-body text-xs leading-relaxed italic"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {person.quote}
                  </p>
                </div>

                {/* ── Description ───────────────────────────────── */}
                <p className="font-body text-xs leading-relaxed mb-6" style={{ color: 'var(--text-muted)' }}>
                  {person.description}
                </p>

                {/* ── LinkedIn Link ────────────────────────────── */}
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-2 rounded-md px-5 py-2.5 font-body text-xs font-semibold transition-all duration-200 hover:scale-105"
                  style={{
                    background: 'var(--rallyverse-gradient)',
                    color: 'var(--btn-primary-text)',
                  }}
                >
                  View LinkedIn
                  <ExternalLink size={12} />
                </a>
              </div>
            </AnimatedSection>
          )
        })}

        {filteredBelievers.length === 0 && (
          <div className="col-span-full text-center py-16 rounded-xl border" style={{ backgroundColor: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
            <p className="font-body text-sm" style={{ color: 'var(--text-faint)' }}>
              No feedback available for this category yet. Check back soon!
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
