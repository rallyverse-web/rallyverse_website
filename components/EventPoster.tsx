'use client'

import Image from 'next/image'
import { useTheme } from '@/lib/theme'
import { CURRENT_EVENT_POSTERS } from '@/lib/config'

type PosterVariant = 'card' | 'full' | 'sidebar'

const variantStyles: Record<PosterVariant, string> = {
  card: 'aspect-[3/4] w-full rounded-xl overflow-hidden',
  full: 'aspect-[3/4] w-full rounded-xl overflow-hidden',
  sidebar: 'aspect-[3/4] w-full max-w-[320px] rounded-xl overflow-hidden',
}

export default function EventPoster({ variant = 'card', priority = false }: { variant?: PosterVariant; priority?: boolean }) {
  const { isColorTheme } = useTheme()
  const src = isColorTheme ? CURRENT_EVENT_POSTERS.color : CURRENT_EVENT_POSTERS.bw

  return (
    <div className={`relative ${variantStyles[variant]} bg-[var(--bg-surface)]`} style={{ border: '1px solid var(--border-subtle)' }}>
      <Image
        src={src}
        alt="Rally Series 01 — Bengaluru Badminton Tournament"
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        loading={priority ? undefined : 'lazy'}
      />
    </div>
  )
}
