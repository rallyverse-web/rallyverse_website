'use client'

import { useRouter } from 'next/navigation'
import AnimatedSection from '@/components/AnimatedSection'

export default function ManifestoStrip() {
  const router = useRouter()

  return (
    <section className="bg-orange py-20">
      <div className="mx-auto max-w-[800px] px-6 text-center">
        <AnimatedSection>
          <div className="font-display text-[44px] leading-none uppercase text-carbon md:text-[72px]">
            THE ROUTINE ENDS HERE.
            <br />
            YOUR VERSE BEGINS NOW.
          </div>
          <p className="mt-5 font-body text-[15px] text-carbon opacity-60">
            RallyVerse &middot; Bengaluru &middot; Season 01 &middot; 2026
          </p>

          <button
            type="button"
            onClick={() => router.push('/register')}
            className="mt-8 inline-block rounded-md border-2 border-carbon bg-carbon px-8 py-3 font-display text-lg tracking-wider text-white transition-all duration-200 hover:bg-transparent hover:text-carbon"
          >
            Enter the Verse &rarr;
          </button>
        </AnimatedSection>
      </div>
    </section>
  )
}
