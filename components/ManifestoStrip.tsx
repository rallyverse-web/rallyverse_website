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
        </AnimatedSection>
      </div>
    </section>
  )
}
