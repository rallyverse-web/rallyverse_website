'use client'

import { useState } from 'react'
import { MapPin, Calendar } from 'lucide-react'

export default function FirstEvent() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <section id="first-event" className="bg-carbon py-32">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-16 px-6 md:grid-cols-2 md:items-start">
        <div>
          <p className="mb-5 font-body text-[11px] uppercase tracking-widest text-muted">
            COMING SOON &middot; BENGALURU &middot; 2025
          </p>

          <div className="font-display text-[88px] leading-none uppercase text-primary md:text-[100px]">
            RALLY #01
          </div>
          <div className="mt-1 font-display text-[36px] uppercase text-orange">
            BADMINTON TOURNAMENT
          </div>

          <div className="mt-7 space-y-5 font-body text-base leading-[1.85] text-muted">
            <p>
              Our very first event. A competitive badminton tournament open to all skill levels &mdash; from beginner singles to advanced doubles.
            </p>
            <p>
              More details on format, venue, and registration dropping very soon. Drop your email below and you will be the first to know.
            </p>
          </div>

          <div className="mt-9">
            {submitted ? (
              <p className="mt-2 font-body text-base font-semibold text-orange">
                You are on the list. We will be in touch.
              </p>
            ) : (
              <>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-[280px] rounded-l-md border border-subtle bg-surface px-4 py-3 font-body text-sm text-primary placeholder:text-muted focus:border-orange focus:outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => { if (email) setSubmitted(true) }}
                    className="whitespace-nowrap rounded-r-md bg-orange px-6 py-3 text-sm font-bold text-carbon transition-all hover:brightness-110"
                  >
                    NOTIFY ME
                  </button>
                </div>
                <p className="mt-3 font-body text-xs text-muted">
                  No spam. Just the event details when they drop.
                </p>
              </>
            )}
          </div>
        </div>

        <div>
          <div className="flex aspect-[3/4] w-full items-center justify-center rounded-xl border border-subtle bg-surface">
            <span className="font-display text-lg tracking-wider text-subtle">
              EVENT PHOTO COMING SOON
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin size={14} color="#F97316" />
              <span className="font-body text-sm text-muted">Bengaluru, India</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={14} color="#F97316" />
              <span className="font-body text-sm text-muted">Date TBA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
