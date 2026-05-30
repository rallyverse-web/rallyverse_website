import Image from 'next/image'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-subtle bg-carbon py-12">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo_transparent.png"
              alt="RallyVerse logo"
              width={28}
              height={28}
              className="w-auto h-8 object-contain"
            />
            <span className="font-display text-[22px]">
              <span className="text-primary">Rally</span>
              <span className="text-orange">Verse</span>
            </span>
          </Link>

          <p className="font-body text-xs text-muted/60">
            Organizing competitive sports and community events across Bengaluru since 2026.
          </p>

          <p className="text-center font-body text-sm text-muted">
            Badminton &middot; Treks &middot; Marathons &middot; Cycling
          </p>

          <p className="font-body text-sm text-muted">Bengaluru, Karnataka, India</p>
        </div>

        <div className="mt-8 border-t border-subtle pt-6 text-center">
          <p className="font-body text-xs text-muted">
            &copy; 2026 RallyVerse. All rights reserved.
          </p>
          <p className="mt-[6px] font-body text-xs text-orange opacity-70">
            Badminton is just the beginning. Treks, marathons, and cycling rallies are coming.
          </p>
        </div>
      </div>
    </footer>
  )
}
