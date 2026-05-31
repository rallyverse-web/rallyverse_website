import { Swords, Mountain, Timer, Bike } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'

const categories = [
  {
    icon: Swords,
    name: 'THE COURT',
    desc: 'Where rivals become friends at the net. Competitive brackets, fair draws, verified venues.',
    status: 'Season 01 — Bengaluru',
    statusColor: 'orange',
  },
  {
    icon: Mountain,
    name: 'THE TRAIL',
    desc: 'Some stories are only written on the move. Karnataka\'s best trails, with your people beside you.',
    status: 'Coming to the Verse',
    statusColor: 'gray',
  },
  {
    icon: Timer,
    name: 'THE ROAD',
    desc: 'Every kilometre is a conversation with yourself. Community runs that push you further than you\'d go alone.',
    status: 'Coming to the Verse',
    statusColor: 'gray',
  },
  {
    icon: Bike,
    name: 'THE RIDE',
    desc: 'Open roads. Shared miles. Group rides and timed events across Bengaluru.',
    status: 'Coming to the Verse',
    statusColor: 'gray',
  },
]

export default function EventCategories() {
  return (
    <section id="sports" className="py-20 md:py-28" style={{ backgroundColor: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="mx-auto max-w-[1100px] px-6">
        <AnimatedSection>
          <div className="mb-12 flex flex-col items-center gap-3">
            <div className="h-px w-10" style={{ backgroundColor: 'var(--accent-primary)' }} />
            <span className="font-body text-[11px] uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              WHAT WE CREATE
            </span>
          </div>

          <div className="mb-14 text-center font-display text-[40px] leading-none uppercase md:text-[56px]" style={{ color: 'var(--text-primary)' }}>
            ONE VERSE.
            <br />
            INFINITE WAYS TO RALLY.
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 md:grid-cols-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <AnimatedSection key={cat.name} delay={i * 0.1}>
                <div className="group flex flex-col items-center text-center">
                  <Icon size={32} className="mb-4 transition-all duration-300 group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" style={{ color: 'var(--accent-primary)' }} />
                  <div className="font-display text-[28px] uppercase transition-colors duration-300" style={{ color: 'var(--text-primary)' }}>
                    {cat.name}
                  </div>
                  <p className="mt-2 max-w-[160px] font-body text-[13px] leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                    {cat.desc}
                  </p>
                  <span className="mt-3 inline-block rounded-full px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-wider"
                    style={{
                      backgroundColor: cat.statusColor === 'orange' ? 'var(--pill-active-bg)' : 'var(--pill-inactive-bg)',
                      color: cat.statusColor === 'orange' ? 'var(--pill-active-text)' : 'var(--pill-inactive-text)',
                    }}
                  >
                    {cat.status}
                  </span>
                </div>
              </AnimatedSection>
            )
          })}
        </div>
      </div>
    </section>
  )
}
