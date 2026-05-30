'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Navbar() {
  const router = useRouter()

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-[60px] border-b border-subtle bg-carbon/95 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-6 md:px-12">
        <button type="button" onClick={() => router.push('/')} className="flex items-center">
          <Image
            src="/logo_transparent.png"
            alt="RallyVerse logo"
            width={32}
            height={32}
            className="w-auto h-8 object-contain"
            priority
          />
          <span className="ml-2 font-display text-xl text-primary md:text-2xl">
            Rally<span className="text-orange">Verse</span>
          </span>
        </button>

        <button
          type="button"
          onClick={() => router.push('/register')}
          className="shrink-0 whitespace-nowrap rounded-md bg-brand-gradient px-4 py-2 text-sm font-semibold text-carbon transition-all duration-200 hover:scale-105 hover:glow-orange active:scale-95"
        >
          Register Now
        </button>
      </div>
    </header>
  )
}
