export default function WhatWeDo() {
  return (
    <section className="bg-carbon py-32">
      <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-20 px-6 md:grid-cols-2 md:items-start">
        <div>
          <div className="flex items-center gap-3">
            <div className="h-px w-10 bg-orange" />
            <span className="font-body text-[11px] uppercase tracking-widest text-muted">
              WHAT WE DO
            </span>
          </div>

          <div className="mt-5 font-display text-[64px] leading-none uppercase text-primary">
            <div>WE CREATE</div>
            <div>THE STAGE.</div>
            <div>YOU SHOW UP.</div>
          </div>
        </div>

        <div className="font-body text-[17px] leading-[1.85] text-muted">
          <p className="mb-5">
            RallyVerse is not a sports brand. We do not sell jerseys or equipment.
          </p>
          <p className="mb-5">
            We are the people who find the trail, book the courts, plan the route, and fire the starting gun.
          </p>
          <p className="mb-5">
            We organize the moments that become the stories you tell for years.
          </p>
          <p className="font-medium text-primary">
            Badminton. Treks. Marathons. Cycling. Whatever gets your community moving &mdash; that is our event to plan.
          </p>
        </div>
      </div>
    </section>
  )
}
