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
              WHY RALLYVERSE
            </span>
          </div>

          <div className="mt-5 font-display text-[64px] leading-none uppercase text-primary">
            <div>TOURNAMENTS</div>
            <div>THAT ACTUALLY</div>
            <div>FEEL LIKE ONE.</div>
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
              Most local badminton tournaments in Bengaluru are an afterthought - booked last minute, poorly bracketed, no atmosphere.
            </ScrollReveal>

            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseBlur={8}
              containerClassName="text-[#909090] text-base md:text-lg font-body leading-relaxed mb-6"
              textClassName="text-[#909090]"
            >
              RallyVerse is being built differently. Structured formats, verified venues, fair draws, and a community that takes showing up seriously.
            </ScrollReveal>

            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseBlur={8}
              containerClassName="text-[#909090] text-base md:text-lg font-body leading-relaxed mb-6"
              textClassName="text-[#909090]"
            >
              Our first event is coming. And we are doing it right.
            </ScrollReveal>

            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseBlur={8}
              containerClassName="text-base md:text-lg font-body leading-relaxed mb-6"
              textClassName="text-white font-semibold"
            >
              Beginner. Intermediate. Advanced. Singles. Doubles. Mixed. There is a bracket for you.
            </ScrollReveal>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
