'use client'

import { ChevronDown } from 'lucide-react'

export default function Hero() {
  const scrollToEvent = () => {
    document.querySelector('#first-event')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-carbon px-6 text-center">
      <p className="mb-6 font-body text-xs uppercase tracking-widest text-muted">
        Bengaluru &middot; Est. 2025
      </p>

      <div className="mb-8 flex flex-col items-center gap-0">
        <div className="font-display text-[64px] uppercase leading-none text-primary md:text-[120px]">
          EVERY EVENT
        </div>
        <div className="font-display text-[64px] uppercase leading-none text-primary md:text-[120px]">
          IS A NEW
        </div>
        <div className="font-display text-[64px] uppercase leading-none text-orange md:text-[120px]">
          VERSE.
        </div>
      </div>

      <p className="mb-10 max-w-[480px] text-center font-body text-base leading-relaxed text-muted">
        RallyVerse organizes badminton tournaments, treks, marathons, and community sport events across India. We are just getting started.
      </p>

      <button
        type="button"
        onClick={scrollToEvent}
        className="rounded-md border border-orange bg-transparent px-8 py-3 font-body text-sm font-semibold text-orange transition-colors duration-200 hover:bg-orange hover:text-carbon"
      >
        See Our First Event
      </button>

      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-1">
        <div className="mx-auto h-10 w-px bg-subtle" />
        <ChevronDown size={16} color="#6B6B6B" />
      </div>
    </section>
  )
}
