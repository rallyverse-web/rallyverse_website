import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Trophy } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: 'Athletes Program — RallyVerse | Supporting Grassroots Talent',
  description: 'Learn about the upcoming RallyVerse Athletes Program, designed to support grassroots athletes, academy talent, and community leaders.',
}

export default function AthletesPage() {
  return (
    <div className="min-h-screen pt-36 pb-20 flex flex-col justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-[800px] px-6 text-center">
        <AnimatedSection>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-primary) 10%, transparent)', border: '1px solid var(--accent-primary)' }}>
            <Trophy size={32} style={{ color: 'var(--accent-primary)' }} />
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              FUTURE INITIATIVE
            </span>
            <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
          </div>

          <h1 className="font-display text-[40px] leading-none uppercase sm:text-[64px]" style={{ color: 'var(--text-primary)' }}>
            RALLYVERSE ATHLETES
          </h1>
          
          <p className="mt-6 font-body text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            We are building a platform to support grassroots athletes, local heroes, and community sports leaders. From access to structured events, academy training resources, to brand sponsorship pipelines, the RallyVerse Athlete network is designed to elevate talent and empower players to rally beyond routine.
          </p>

          <p className="mt-4 font-body text-sm leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--text-faint)' }}>
            This program is under active development as part of our Phase 3 expansion. If you are a competitive player, coach, or academy lead looking to collaborate, let&apos;s connect.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/partners"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-sm font-semibold transition-all duration-200 active:scale-95"
              style={{
                background: 'var(--rallyverse-gradient)',
                color: 'var(--btn-primary-text)',
              }}
            >
              Express Interest / Partner
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/community"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-sm font-semibold transition-all duration-200 border"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              Join Our Community
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
