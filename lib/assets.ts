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
