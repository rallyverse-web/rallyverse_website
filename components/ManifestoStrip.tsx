'use client'

import { useRouter } from 'next/navigation'
import AnimatedSection from '@/components/AnimatedSection'

export default function ManifestoStrip() {
  const router = useRouter()

  return (
    <section id="partner-with-us" className="py-20" style={{ backgroundColor: 'var(--manifesto-bg)' }}>
      <div className="mx-auto max-w-[800px] px-6 text-center">
        <AnimatedSection>
          <div className="font-display text-[28px] leading-[1.1] uppercase sm:text-[44px] md:text-[60px]" style={{ color: 'var(--manifesto-text)' }}>
            LET&apos;S BUILD SOMETHING
            <br />
            WORTHWHILE.
          </div>
          <p className="mt-6 font-body text-base md:text-lg leading-relaxed" style={{ color: 'var(--manifesto-muted)' }}>
            Whether you&apos;re a sports brand, academy, club, event organizer, or corporate sports initiative, RallyVerse can help you reach and engage the right audience.
          </p>

          <button
            type="button"
            onClick={() => router.push('/contact')}
            className="mt-8 inline-block rounded-md border-2 px-10 py-4 font-display text-xl tracking-wider transition-all duration-200"
            style={{
              borderColor: 'var(--manifesto-btn-border)',
              backgroundColor: 'var(--manifesto-btn-bg)',
              color: 'var(--manifesto-btn-text)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.color = 'var(--manifesto-text)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--manifesto-btn-bg)'
              e.currentTarget.style.color = 'var(--manifesto-btn-text)'
            }}
          >
            Partner With Us &rarr;
          </button>
        </AnimatedSection>
      </div>
    </section>
  )
}
