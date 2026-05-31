'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Calendar } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'
import Magnet from '@/components/Magnet'
import ShinyText from '@/components/ShinyText'

export default function FirstEvent() {
  const router = useRouter()
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const updateViewportState = () => setIsMobile(window.innerWidth < 768)

    updateViewportState()
    window.addEventListener('resize', updateViewportState)
    return () => window.removeEventListener('resize', updateViewportState)
  }, [])

  return (
    <section id="events" className="bg-carbon py-20 md:py-28">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-16 px-6 md:grid-cols-2 md:items-start">
        <AnimatedSection>
          <p className="mb-5 font-body text-[11px] uppercase tracking-widest text-muted">
            FIRST CHAPTER &mdash; BENGALURU 2026
          </p>

          <div className="font-display text-[64px] leading-none uppercase text-primary md:text-[88px]">
            EVERY UNIVERSE
            <br />
            HAS A BEGINNING.
          </div>
          <div className="mt-2 font-display text-[28px] uppercase text-orange md:text-[36px]">
            RALLY SERIES 01 &mdash; BENGALURU BADMINTON
          </div>

          <div className="mt-7 space-y-5 font-body text-base leading-[1.85] text-muted">
            <p>
              This is where it starts. Not just a tournament &mdash; the first chapter of something that will outlast any single scoreline or bracket result.
            </p>
            <p>
              Rally Series 01 is built for Bengaluru&apos;s most passionate players. Men&apos;s Singles. Women&apos;s Singles. Doubles. Mixed. Beginner through Advanced &mdash; there is a court for you.
            </p>
            <p>
              Spots are deliberately limited &mdash; because every player deserves a well-run, well-felt experience. When you&apos;re here, you&apos;ll feel the difference.
            </p>
          </div>

          <div className="mt-9">
            <Magnet padding={50} disabled={isMobile}>
              <button
                type="button"
                onClick={() => router.push('/register')}
                className="group relative overflow-hidden rounded-md bg-orange px-8 py-3 font-body text-sm font-bold text-carbon transition-all duration-200 hover:glow-orange active:scale-95"
              >
                <span className="relative z-10">
                  <ShinyText
                    text="Claim Your Spot in the First Chapter"
                    disabled={false}
                    speed={3}
                    className="font-semibold"
                    shineColor="rgba(255,255,255,0.6)"
                  />
                </span>
                <span className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: 'linear-gradient(135deg, #FF5E00 0%, #00E5FF 100%)' }} />
              </button>
            </Magnet>

            <p className="mt-4 text-center font-body text-xs text-[#909090]">
              Join the founding community. First registrants shape the Verse.
            </p>
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.15}>
          <div className="group">
            <div className="flex aspect-[3/4] w-full flex-col items-center justify-center gap-6 rounded-xl border border-subtle bg-surface transition-all duration-300 group-hover:border-orange/30 group-hover:glow-orange">
              <div className="font-display text-[80px] leading-none tracking-wide text-subtle transition-colors duration-300 group-hover:text-orange/30">
                RV
              </div>
              <div className="text-center">
                <p className="font-display text-[18px] tracking-wider text-primary">
                  RALLY SERIES 01
                </p>
                <p className="mt-1 font-body text-xs uppercase tracking-widest text-muted">
                  BENGALURU &middot; 2026
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-orange" />
                <span className="font-body text-sm text-muted">Bengaluru, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-orange" />
                <span className="font-body text-sm text-muted">Date TBA</span>
              </div>
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
