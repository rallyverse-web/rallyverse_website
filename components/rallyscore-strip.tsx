'use client'

import {
  Activity,
  Mountain,
  Timer,
  Bike,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react'
import { leaderboard } from '@/lib/events'

const sportIcon: Record<string, LucideIcon> = {
  badminton: Activity,
  trek: Mountain,
  marathon: Timer,
  cycling: Bike,
}

const rankColor = (rank: number) => {
  if (rank === 1) return 'text-orange'
  if (rank === 2) return 'text-[#C0C0C0]'
  if (rank === 3) return 'text-[#CD7F32]'
  return 'text-muted'
}

export function RallyScoreStrip() {
  return (
    <div className="relative bg-surface">
      <div className="relative -my-10 -skew-y-2 bg-surface py-24">
        <div className="mx-auto grid max-w-7xl skew-y-2 grid-cols-1 gap-12 px-5 lg:grid-cols-2 lg:items-center">
          {/* Left */}
          <div id="rallyscore">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan">
              RallyScore
            </p>
            <h2 className="mt-3 font-display text-4xl font-extrabold uppercase text-text sm:text-5xl">
              Every Event Earns You Points.
            </h2>
            <p className="mt-5 max-w-[440px] text-base leading-relaxed text-muted">
              Compete across badminton, treks, marathons, and cycling events. Your
              RallyScore follows you everywhere. Rise through the community
              leaderboard. Every finish line is a new verse.
            </p>
            <a
              href="#"
              className="group mt-7 inline-flex items-center gap-2 font-semibold text-orange"
            >
              See the Leaderboard
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1.5"
              />
            </a>
          </div>

          {/* Right — leaderboard */}
          <div className="rounded-2xl border border-border bg-carbon p-6">
            <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted">
              Top RallyVerse Athletes
            </h3>
            <div className="mt-4">
              {leaderboard.map((row, i) => (
                <div
                  key={row.rank}
                  className={`relative flex items-center gap-4 overflow-hidden py-3 ${
                    i !== leaderboard.length - 1 ? 'border-b border-border' : ''
                  } ${row.rank === 1 ? 'bg-orange/5' : ''}`}
                >
                  {row.rank === 1 && (
                    <span
                      className="animate-shimmer pointer-events-none absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-orange/10 to-transparent"
                      aria-hidden="true"
                    />
                  )}
                  <span
                    className={`w-6 shrink-0 font-mono text-lg font-semibold ${rankColor(
                      row.rank,
                    )}`}
                  >
                    {row.rank}
                  </span>
                  <span className="h-8 w-8 shrink-0 rounded-full bg-surface2" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">
                      {row.name}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      {row.sports.map((s) => {
                        const Icon = sportIcon[s]
                        return <Icon key={s} size={14} className="text-muted" />
                      })}
                    </div>
                  </div>
                  <span className="shrink-0 font-mono text-sm text-cyan">
                    {row.score} pts
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
