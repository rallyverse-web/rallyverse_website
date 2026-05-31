import Image from 'next/image'
import Link from 'next/link'
import GradientText from '@/components/GradientText'

export default function Footer() {
  return (
    <footer id="contact" className="border-t border-subtle bg-carbon py-12">
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="flex flex-col items-center gap-8 text-center lg:flex-row lg:justify-between lg:text-left">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo/only_logo_white.png"
              alt="RallyVerse logo"
              width={40}
              height={40}
              className="w-auto h-10 object-contain"
            />
            <span className="font-display text-[22px] leading-none">
              <span className="font-display tracking-tight text-white">RALLY</span>
              <GradientText
                colors={['#FF5E00', '#FF8C00', '#00C9A7', '#00E5FF', '#FF5E00']}
                animationSpeed={6}
                showBorder={false}
                className="font-display tracking-tight"
              >
                VERSE
              </GradientText>
            </span>
          </Link>

          <p className="font-body text-xs text-muted/60">
            A universe for people who still believe the best things in life happen when you move.
          </p>

          <p className="text-center font-body text-sm text-muted">
            The Court &middot; The Trail &middot; The Road &middot; The Ride
          </p>

          <p className="font-body text-sm text-muted">Bengaluru, Karnataka, India</p>
        </div>

        <div className="mt-8 border-t border-subtle pt-6 text-center">
          <p className="font-body text-xs text-muted">
            &copy; 2026 RallyVerse. All rights reserved.
          </p>
          <p className="mt-[6px] font-body text-xs text-orange opacity-70">
            The Court was just the beginning. The Trail, The Road, and The Ride are coming.
          </p>
        </div>
      </div>
    </footer>
  )
}
