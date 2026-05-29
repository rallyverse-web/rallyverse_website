'use client'

import { useMemo, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { events, type RallyEvent } from '@/lib/events'
import { EventCard } from './event-card'

type Sort = 'date' | 'popularity' | 'spots'

const sortLabels: Record<Sort, string> = {
  date: 'Date',
  popularity: 'Popularity',
  spots: 'Spots Left',
}

const categoryLabels: Record<string, string> = {
  all: 'All Events',
  badminton: 'Badminton',
  trek: 'Treks',
  marathon: 'Marathons',
  cycling: 'Cycling',
}

export function EventGrid({ active }: { active: string }) {
  const [sort, setSort] = useState<Sort>('date')
  const [open, setOpen] = useState(false)

  const visible = useMemo(() => {
    const filtered: RallyEvent[] =
      active === 'all' ? events : events.filter((e) => e.category === active)

    const sorted = [...filtered]
    if (sort === 'popularity') {
      sorted.sort((a, b) => b.registered - a.registered)
    } else if (sort === 'spots') {
      sorted.sort(
        (a, b) => a.capacity - a.registered - (b.capacity - b.registered),
      )
    }
    return sorted
  }, [active, sort])

  return (
    <section id="events" className="bg-carbon py-20">
      <div className="mx-auto max-w-7xl px-5">
        {/* Filter bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <span className="rounded-full bg-orange px-4 py-1.5 text-sm font-bold text-black">
            {categoryLabels[active]}
          </span>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm text-text"
            >
              Sort by: <span className="text-muted">{sortLabels[sort]}</span>
              <ChevronDown size={16} className="text-muted" />
            </button>
            {open && (
              <div className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-lg border border-border bg-surface shadow-lg">
                {(Object.keys(sortLabels) as Sort[]).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setSort(key)
                      setOpen(false)
                    }}
                    className={`block w-full px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface2 ${
                      sort === key ? 'text-orange' : 'text-text'
                    }`}
                  >
                    {sortLabels[key]}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>

        {visible.length === 0 && (
          <p className="py-16 text-center text-muted">No events in this category yet.</p>
        )}
      </div>
    </section>
  )
}
