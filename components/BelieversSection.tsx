'use client'

import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ArrowRight, ExternalLink } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import { believers } from '@/data/believers'

export default function BelieversSection() {
  const router = useRouter()

  if (believers.length === 0) return null

  return (
    <section id="believers" className="py-20 md:py-28" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="text-center">
          <AnimatedSection>
            <div className="mb-5 flex items-center justify-center gap-3">
              <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
              <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                BELIEVERS
              </span>
              <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.05}>
            <h2 className="font-display text-[28px] leading-none uppercase sm:text-[36px] md:text-[48px]" style={{ color: 'var(--text-primary)' }}>
              Believers
            </h2>
          </AnimatedSection>

          <AnimatedSection delay={0.1}>
            <p className="mx-auto mt-4 max-w-xl font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              The people who believe in the RallyVerse vision and help bring it to life.
            </p>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.15}>
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {believers.slice(0, 3).map((person, i) => (
              <div
                key={person.name}
                className="flex flex-col items-center text-center rounded-xl p-6 transition-all duration-200"
                style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}
              >
                <div className="mb-2">
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
                </div>

                <div
                  className="mx-auto mb-3 inline-flex items-center justify-center rounded-xl px-5 py-1"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--accent-primary) 6%, transparent)',
                    border: '1px solid color-mix(in srgb, var(--accent-primary) 40%, transparent)',
                    boxShadow: '0 0 14px color-mix(in srgb, var(--accent-primary) 10%, transparent)',
                  }}
                >
                  <span className="font-body text-[9px] font-semibold uppercase tracking-widest" style={{ color: 'var(--accent-primary)' }}>
                    Early Supporter
                  </span>
                </div>

                <h3 className="font-display text-[16px] uppercase leading-tight mb-1" style={{ color: 'var(--text-primary)' }}>
                  {person.name}
                </h3>
                <p className="font-body text-[12px] font-medium tracking-wide mb-1" style={{ color: 'var(--accent-primary)' }}>
                  {person.headline}
                </p>

                <div
                  className="w-full rounded-lg px-4 py-3 mb-4"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--accent-primary) 8%, transparent)',
                    borderLeft: '3px solid var(--accent-primary)',
                  }}
                >
                  <p
                    className="font-body text-[12px] leading-relaxed italic"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {person.quote}
                  </p>
                </div>

                <p className="font-body text-[13px] leading-relaxed mb-4 line-clamp-3" style={{ color: 'var(--text-muted)' }}>
                  {person.description}
                </p>

                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md px-4 py-2 font-body text-xs font-semibold transition-all duration-200"
                  style={{
                    background: 'var(--rallyverse-gradient)',
                    color: 'var(--btn-primary-text)',
                  }}
                >
                  View LinkedIn
                  <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.2}>
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => router.push('/believers')}
              className="inline-flex items-center gap-2 rounded-lg px-8 py-4 text-base font-semibold transition-all duration-200 active:scale-95"
              style={{
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-primary)'
                e.currentTarget.style.color = 'var(--accent-primary)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)'
                e.currentTarget.style.color = 'var(--text-primary)'
              }}
            >
              Meet Our Believers
              <ArrowRight size={16} />
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
