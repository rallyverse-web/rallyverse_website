import AnimatedSection from '@/components/AnimatedSection'

export default function WhatWeDo() {
  return (
    <section id="about" className="py-20 md:py-28" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-20 px-6 md:grid-cols-2 md:items-start">
        <AnimatedSection>
          <div className="flex items-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              WHY WE EXIST
            </span>
          </div>

          <div className="mt-5 font-display text-[24px] leading-none uppercase sm:text-[36px] md:text-[48px] lg:text-[56px]" style={{ color: 'var(--text-primary)' }}>
            SOME PEOPLE WATCH LIFE HAPPEN.
            <br />
            WE RALLY THROUGH IT.
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div>
            <div style={{ color: 'var(--text-muted)' }}>
              <AnimatedSection delay={0}>
                <p className="text-base md:text-lg font-body leading-relaxed mb-6">
                  Somewhere between the morning alarm and the weekend scroll, life started feeling smaller than it should.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.1}>
                <p className="text-base md:text-lg font-body leading-relaxed mb-6">
                  RallyVerse exists to reverse that. We are not an event company. We are a universe built for people who still believe the best moments happen when you move, compete, and show up for each other.
                </p>
              </AnimatedSection>
              <AnimatedSection delay={0.2}>
                <p className="text-base md:text-lg font-body leading-relaxed mb-6">
                  Every tournament. Every trek. Every ride. Every race. It is all the same thing: a reason to be fully alive.
                </p>
              </AnimatedSection>
            </div>

            <div style={{ color: 'var(--text-primary)' }}>
              <AnimatedSection delay={0.3}>
                <p className="text-base md:text-lg font-body leading-relaxed mb-6 font-semibold">
                  The Court. The Trail. The Road. The Ride. One Verse. Welcome.
                </p>
              </AnimatedSection>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
