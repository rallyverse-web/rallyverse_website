import AnimatedSection from '@/components/AnimatedSection'
import ScrollReveal from '@/components/ScrollReveal'

export default function WhatWeDo() {
  return (
    <section id="about" className="bg-carbon py-20 md:py-28">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-20 px-6 md:grid-cols-2 md:items-start">
        <AnimatedSection>
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-orange" />
            <span className="font-body text-[11px] uppercase tracking-widest text-muted">
              WHY WE EXIST
            </span>
          </div>

          <div className="mt-5 font-display text-[36px] leading-none uppercase text-primary md:text-[48px] lg:text-[56px]">
            SOME PEOPLE WATCH LIFE HAPPEN.
            <br />
            WE RALLY THROUGH IT.
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div>
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseBlur={8}
              containerClassName="text-[#909090] text-base md:text-lg font-body leading-relaxed mb-6"
              textClassName="text-[#909090]"
            >
              Somewhere between the morning alarm and the weekend scroll, life started feeling smaller than it should.
            </ScrollReveal>

            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseBlur={8}
              containerClassName="text-[#909090] text-base md:text-lg font-body leading-relaxed mb-6"
              textClassName="text-[#909090]"
            >
              RallyVerse exists to reverse that. We are not an event company. We are a universe — built for people who still believe the best moments happen when you move, compete, and show up for each other.
            </ScrollReveal>

            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseBlur={8}
              containerClassName="text-[#909090] text-base md:text-lg font-body leading-relaxed mb-6"
              textClassName="text-[#909090]"
            >
              Every tournament. Every trek. Every ride. Every race. It is all the same thing: a reason to be fully alive.
            </ScrollReveal>

            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseBlur={8}
              containerClassName="text-base md:text-lg font-body leading-relaxed mb-6"
              textClassName="text-white font-semibold"
            >
              The Court. The Trail. The Road. The Ride. One Verse. Welcome.
            </ScrollReveal>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
