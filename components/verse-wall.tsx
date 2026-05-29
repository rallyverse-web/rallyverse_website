import { quotes } from '@/lib/events'

const accentBorder: Record<string, string> = {
  orange: 'border-orange',
  cyan: 'border-cyan',
  violet: 'border-violet',
}

export function VerseWall() {
  return (
    <section id="verse-wall" className="bg-carbon py-20">
      <div className="mx-auto max-w-7xl px-5">
        <p className="text-center text-[11px] font-semibold uppercase tracking-[0.2em] text-orange">
          The Verse Wall
        </p>
        <h2 className="mt-2 text-center font-display text-4xl font-extrabold uppercase text-text sm:text-5xl">
          In Their Own Words.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-center text-base text-muted">
          One sentence from every finisher. This is what RallyVerse sounds like.
        </p>

        <div className="mt-12 columns-1 gap-6 sm:columns-2 lg:columns-3 [&>*]:mb-6">
          {quotes.map((q) => (
            <figure
              key={q.name}
              className={`break-inside-avoid rounded-xl border-l-4 bg-surface p-5 ${accentBorder[q.accent]}`}
            >
              <blockquote className="text-[15px] italic leading-relaxed text-text">
                &ldquo;{q.text}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-xs text-muted">
                {q.name} · {q.event}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
