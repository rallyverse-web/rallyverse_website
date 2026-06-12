import type { EventWithFormats } from '@/lib/types/supabase'

export function getEventPosterPath(slug: string): string {
  return `/posters/${slug}-poster.png`
}

export function getEventPosterBwPath(slug: string): string {
  return `/posters/${slug}-poster-bw.png`
}

export function getEventBannerPath(slug: string): string {
  return `/posters/${slug}-banner.png`
}

export const PLACEHOLDER_POSTER = '/posters/poster-coming-soon.png'
export const PLACEHOLDER_BANNER = '/posters/banner-coming-soon.png'

/**
 * Returns the poster URL for an event, prioritizing the Supabase-stored poster_url
 * and falling back to the legacy local file path.
 */
export function getEffectivePosterUrl(slug: string, posterUrl: string | null): string {
  if (posterUrl) return posterUrl
  return getEventPosterPath(slug)
}

/**
 * Returns the QR code image URL from payment config.
 */
export function getQrCodeUrl(qrCodeUrl: string | null): string | null {
  return qrCodeUrl || null
}
