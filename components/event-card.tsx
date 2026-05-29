'use client'

import { useEffect, useRef, useState } from 'react'
import { MapPin, Calendar, Zap } from 'lucide-react'
import type { RallyEvent } from '@/lib/events'

const categoryLabels: Record<string, string> = {
  badminton: 'Badminton',
  trek: 'Trek',
  marathon: 'Marathon',
  cycling: 'Cycling',
}

export function EventCard({ event, index }: { event: RallyEvent; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [barWidth, setBarWidth] = useState(0)

  const pct = Math.round((event.registered / event.capacity) * 100)
  const fillingFast = pct >= 80

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          // animate capacity bar after entering
          requestAnimationFrame(() => setTimeout(() => setBarWidth(pct), 100))
          observer.disconnect()
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [pct])

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${(index % 3) * 80}ms` }}
      className={`overflow-hidden rounded-2xl border border-border bg-surface transition-all duration-500 ease-out hover:border-orange/40 hover:shadow-lg hover:shadow-orange-500/10 ${
        visible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
      }`}
    >
      {/* Image */}
      <div className="relative aspect-video">
        <img
          src={event.image || '/placeholder.svg'}
          alt={event.title}
          className="h-full w-full object-cover"
        />
        <span className="absolute left-3 top-3 rounded-full border border-cyan/30 bg-carbon/80 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-cyan backdrop-blur">
          {categoryLabels[event.category]}
        </span>
        {fillingFast && (
          <span className="absolute right-3 top-3 rounded-full bg-orange px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-black">
            Filling Fast
          </span>
        )}
      </div>

      {/* Body */}
      <div className="p-5">
        <h3 className="font-display text-2xl font-bold uppercase text-text">
          {event.title}
        </h3>

        <div className="mt-3 flex flex-col gap-1.5">
          <span className="flex items-center gap-1.5 text-[13px] text-muted">
            <MapPin size={14} className="text-orange" />
            {event.location}
          </span>
          <span className="flex items-center gap-1.5 text-[13px] text-muted">
            <Calendar size={14} className="text-orange" />
            {event.date}
          </span>
        </div>

        <div className="my-3 h-px w-full bg-border" />

        {/* Capacity */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">
            {event.registered} / {event.capacity} spots
          </span>
          <span className="flex items-center gap-1 font-mono text-[13px] text-cyan">
            <Zap size={13} className="fill-cyan" />
            {event.rallyPoints} pts
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-surface2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-orange to-cyan transition-[width] duration-1000 ease-out"
            style={{ width: `${barWidth}%` }}
          />
        </div>

        <button
          type="button"
          className="mt-5 w-full rounded-lg bg-orange py-3 font-bold text-black transition-all duration-200 hover:brightness-110"
        >
          Register
        </button>
      </div>
    </div>
  )
}
