export default function Footer() {
  return (
    <footer className="border-t border-subtle bg-carbon py-12">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="flex flex-wrap items-center justify-center gap-6 md:justify-between">
          <p className="font-display text-[22px]">
            <span className="text-primary">Rally</span>
            <span className="text-orange">Verse</span>
          </p>

          <p className="text-center font-body text-sm text-muted">
            Badminton &middot; Treks &middot; Marathons &middot; Cycling
          </p>

          <p className="font-body text-sm text-muted">Bengaluru, India</p>
        </div>

        <div className="mt-8 border-t border-subtle pt-6 text-center">
          <p className="font-body text-xs text-muted">
            &copy; 2025 RallyVerse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
