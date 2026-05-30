import { Swords, Mountain, Timer, Bike } from 'lucide-react'
import AnimatedSection from '@/components/AnimatedSection'

const categories = [
  {
    icon: Swords,
    name: 'BADMINTON',
    desc: 'Launching 2026. Bengaluru\'s first structured amateur tournament series.',
    status: 'Launching 2026',
    statusColor: 'orange',
  },
  {
    icon: Mountain,
    name: 'TREKS',
    desc: 'Curated trail experiences around Karnataka.',
    status: 'Coming Soon',
    statusColor: 'gray',
  },
  {
    icon: Timer,
    name: 'MARATHONS',
    desc: '5K to half marathon community runs.',
    status: 'Coming Soon',
    statusColor: 'gray',
  },
  {
    icon: Bike,
    name: 'CYCLING',
    desc: 'Group rides and timed events across Bangalore.',
    status: 'Coming Soon',
    statusColor: 'gray',
  },
]

export default function EventCategories() {
  return (
    <section className="border-y border-subtle bg-surface py-24">
      <div className="mx-auto max-w-[1100px] px-6">
        <AnimatedSection>
          <div className="mb-12 flex flex-col items-center gap-3">
            <div className="h-px w-10 bg-orange" />
            <span className="font-body text-[11px] uppercase tracking-widest text-muted">
              WHAT WE ORGANIZE
            </span>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-12 md:grid-cols-4">
          {categories.map((cat, i) => {
            const Icon = cat.icon
            return (
              <AnimatedSection key={cat.name} delay={i * 0.1}>
                <div className="group flex flex-col items-center text-center">
                  <Icon size={32} className="mb-4 text-orange transition-all duration-300 group-hover:text-cyan group-hover:drop-shadow-[0_0_8px_rgba(0,229,255,0.5)]" />
                  <div className="font-display text-[28px] uppercase text-primary transition-colors duration-300 group-hover:text-orange">
                    {cat.name}
                  </div>
                  <p className="mt-2 max-w-[160px] font-body text-[13px] leading-relaxed text-muted">
                    {cat.desc}
                  </p>
                  <span className={`mt-3 inline-block rounded-full px-3 py-1 font-body text-[11px] font-semibold uppercase tracking-wider ${
                    cat.statusColor === 'orange'
                      ? 'bg-orange/15 text-orange'
                      : 'bg-white/10 text-muted'
                  }`}>
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
