'use client'

import { useRouter } from 'next/navigation'
import AnimatedSection from '@/components/AnimatedSection'

export default function CommunityProof() {
  const router = useRouter()

  return (
    <section id="community" className="py-20 md:py-28" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-4xl px-6">
        <AnimatedSection>
          <div className="mb-12 flex flex-col items-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              FOUNDING MEMBERS
            </span>
          </div>

          <div className="text-center font-display text-[44px] leading-none uppercase md:text-[64px]" style={{ color: 'var(--text-primary)' }}>
            THE VERSE IS ALREADY
            <br />
            FILLING UP.
          </div>

          <p className="mx-auto mt-6 max-w-xl text-center font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Every person who registers before our first event becomes a founding member of RallyVerse.
            You are not just registering for a tournament. You are helping define what this universe becomes.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.1}>
          <div className="mb-16 mt-12 flex justify-center">
            <div className="rounded-lg border px-12 py-6 text-center" style={{ borderColor: 'var(--border-default)' }}>
              <p className="font-display text-[72px] leading-none md:text-[96px]" style={{ color: 'var(--accent-primary)' }}>
                247
              </p>
              <p className="mt-2 font-body text-sm uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
                Founding Members
              </p>
            </div>
          </div>
        </AnimatedSection>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          <AnimatedSection delay={0.15}>
            <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <p className="font-body text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                &ldquo;I have been waiting for something like this in Bengaluru.
                Something that actually feels serious and well-run.&rdquo;
              </p>
              <p className="mt-4 font-body text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
                &mdash; Founding Member, HSR Layout
              </p>
            </div>
          </AnimatedSection>

          <AnimatedSection delay={0.2}>
            <div className="rounded-lg p-6" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--card-border)' }}>
              <p className="font-body text-base leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                &ldquo;Registered in two minutes. Already told my doubles partner.
                This is exactly what Bengaluru needs.&rdquo;
              </p>
              <p className="mt-4 font-body text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
                &mdash; Founding Member, Whitefield
              </p>
            </div>
          </AnimatedSection>
        </div>

        <AnimatedSection delay={0.25}>
          <div className="text-center">
            <p className="mb-6 font-body text-sm" style={{ color: 'var(--text-muted)' }}>
              Become a founding member. Shape the Verse from the start.
            </p>
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="inline-block rounded-md px-8 py-3 font-body text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'var(--gradient-brand)',
                color: 'var(--btn-primary-text)',
              }}
            >
              Join the Founding Members &rarr;
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
