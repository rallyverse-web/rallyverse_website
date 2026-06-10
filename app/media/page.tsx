import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Image as ImageIcon } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'

export const metadata: Metadata = {
  title: 'Media & Press Hub — RallyVerse',
  description: 'Read press releases, download brand assets, and view event coverage reports documenting the growth of community sports with RallyVerse.',
}

export default function MediaPage() {
  return (
    <div className="min-h-screen pt-36 pb-20 flex flex-col justify-center" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-[800px] px-6 text-center">
        <AnimatedSection>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: 'color-mix(in srgb, var(--accent-primary) 10%, transparent)', border: '1px solid var(--accent-primary)' }}>
            <ImageIcon size={32} style={{ color: 'var(--accent-primary)' }} />
          </div>
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              MEDIA HUB
            </span>
            <div className="h-px w-8" style={{ backgroundColor: 'var(--accent-primary)' }} />
          </div>

          <h1 className="font-display text-[40px] leading-none uppercase sm:text-[64px]" style={{ color: 'var(--text-primary)' }}>
            MEDIA & PRESS
          </h1>
          
          <p className="mt-6 font-body text-base leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Welcome to the RallyVerse Media Hub. We are documenting the growth of community sports in India through high-definition event coverage, match photography highlights, community member stories, and data-driven insights reports.
          </p>

          <p className="mt-4 font-body text-sm leading-relaxed max-w-xl mx-auto" style={{ color: 'var(--text-faint)' }}>
            Our press kit, brand logos, event pictures, and brand guidelines will be available here soon. For urgent press requests or media credentials, please contact us.
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
              Contact Media Relations
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/insights"
              className="inline-flex items-center justify-center gap-2 rounded-lg px-8 py-4 text-sm font-semibold transition-all duration-200 border"
              style={{
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
                backgroundColor: 'var(--bg-surface)'
              }}
            >
              Read Our Insights
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </div>
  )
}
