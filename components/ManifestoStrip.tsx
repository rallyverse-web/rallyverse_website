'use client'

import { useRouter } from 'next/navigation'
import AnimatedSection from '@/components/AnimatedSection'

export default function ManifestoStrip() {
  const router = useRouter()

  return (
    <section className="py-20" style={{ backgroundColor: 'var(--manifesto-bg)' }}>
      <div className="mx-auto max-w-[800px] px-6 text-center">
        <AnimatedSection>
          <div className="font-display text-[28px] leading-none uppercase sm:text-[44px] md:text-[72px]" style={{ color: 'var(--manifesto-text)' }}>
            THE ROUTINE ENDS HERE.
            <br />
            YOUR VERSE BEGINS NOW.
          </div>
          <p className="mt-5 font-body text-[15px]" style={{ color: 'var(--manifesto-muted)' }}>
            RallyVerse &middot; Bengaluru &middot; Season 01 &middot; 2026
          </p>

          <button
            type="button"
            onClick={() => router.push('/register')}
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
            Register Now &rarr;
          </button>
        </AnimatedSection>
      </div>
    </section>
  )
}
