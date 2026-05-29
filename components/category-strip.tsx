'use client'

import { Activity, Mountain, Timer, Bike, LayoutGrid, type LucideIcon } from 'lucide-react'
import { categories } from '@/lib/events'

const iconMap: Record<string, LucideIcon> = {
  all: LayoutGrid,
  badminton: Activity,
  trek: Mountain,
  marathon: Timer,
  cycling: Bike,
}

export function CategoryStrip({
  active,
  onSelect,
}: {
  active: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="relative bg-surface">
      {/* Diagonal top edge */}
      <div className="relative -mt-10 origin-top-left -skew-y-2 bg-surface py-16">
        <div className="mx-auto max-w-7xl skew-y-2 px-5">
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-orange">
            Find Your Event
          </p>
          <h2 className="mt-2 text-center font-display text-4xl font-extrabold uppercase text-text sm:text-5xl">
            Every Event. A New Verse.
          </h2>

          <div className="mx-auto mt-10 flex snap-x gap-4 overflow-x-auto pb-4 lg:justify-center">
            {categories.map((cat) => {
              const Icon = iconMap[cat.id]
              const isActive = active === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => onSelect(cat.id)}
                  className={`group w-[200px] shrink-0 snap-start cursor-pointer rounded-xl border-l-4 border-orange p-6 text-left transition-all duration-300 ${
                    isActive
                      ? 'bg-orange/10 shadow-[0_0_20px_rgba(255,107,0,0.15)]'
                      : 'bg-surface2 hover:bg-orange/10 hover:shadow-[0_0_20px_rgba(255,107,0,0.15)]'
                  }`}
                >
                  <Icon size={28} className="text-orange" />
                  <h3 className="mt-4 font-display text-[22px] font-bold uppercase text-text">
                    {cat.label}
                  </h3>
                  <p className="mt-1 text-[13px] text-muted">{cat.count} Events</p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
