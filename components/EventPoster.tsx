'use client'

import Image from 'next/image'
import { useTheme } from '@/lib/theme'
import { getEventPosterPath, getEventPosterBwPath, PLACEHOLDER_POSTER } from '@/lib/assets'
import type { EventWithFormats } from '@/lib/types/supabase'

type PosterVariant = 'card' | 'full' | 'sidebar'

const variantStyles: Record<PosterVariant, string> = {
  card: 'aspect-[3/4] w-full rounded-xl overflow-hidden',
  full: 'aspect-[3/4] w-full rounded-xl overflow-hidden',
  sidebar: 'aspect-[3/4] w-full max-w-[320px] rounded-xl overflow-hidden',
}

export default function EventPoster({ event, variant = 'card', priority = false }: { event?: EventWithFormats; variant?: PosterVariant; priority?: boolean }) {
  const { isColorTheme } = useTheme()

  const slug = event?.slug
  const slugPoster = slug ? getEventPosterPath(slug) : null
  const slugBwPoster = slug ? getEventPosterBwPath(slug) : null

  let src: string
  if (slugPoster) {
    src = isColorTheme ? slugPoster : (slugBwPoster ?? slugPoster)
  } else if (event?.poster_url) {
    src = isColorTheme ? event.poster_url : event.poster_url.replace('color_poster', 'bw_poster')
  } else {
    src = PLACEHOLDER_POSTER
  }

  return (
    <div className={`relative ${variantStyles[variant]} bg-[var(--bg-surface)]`} style={{ border: '1px solid var(--border-subtle)' }}>
      <Image
        src={src}
        alt={event?.name || 'RallyVerse Event'}
        fill
        className="object-contain"
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        priority={priority}
        loading={priority ? undefined : 'lazy'}
      />
    </div>
  )
}
