import Link from 'next/link'
import AnimatedSection from '@/components/AnimatedSection'

export default function ManifestoStrip() {
  return (
    <section className="bg-orange py-20">
      <div className="mx-auto max-w-[800px] px-6 text-center">
        <AnimatedSection>
          <div className="font-display text-[44px] leading-none uppercase text-carbon md:text-[72px]">
            SHOW UP.
            <br />
            PLAY HARD. BUILD SOMETHING.
          </div>
          <p className="mt-5 font-body text-[15px] text-carbon opacity-60">
            RallyVerse &middot; Bengaluru Badminton Series &middot; 2026 &middot; First event registrations opening soon.
          </p>

          <Link
            href="/register"
            className="mt-8 inline-block rounded-md border-2 border-carbon bg-carbon px-8 py-3 font-body text-sm font-bold text-orange transition-all duration-200 hover:bg-transparent hover:text-carbon"
          >
            Join the Waitlist
          </Link>
        </AnimatedSection>
      </div>
    </section>
  )
}
