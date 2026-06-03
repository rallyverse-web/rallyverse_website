import type { MetadataRoute } from 'next'

const baseUrl = 'https://rallyverse.social'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '', '/about', '/events', '/contact', '/believers',
    '/privacy-policy', '/terms-and-conditions',
  ]

  const staticEntries = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'weekly' : 'monthly') as 'weekly' | 'monthly',
    priority: route === '' ? 1 : 0.8,
  })) as MetadataRoute.Sitemap

  // Add dynamic event slugs
  try {
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
    const { data: events } = await supabase
      .from('events')
      .select('slug, updated_at')
      .eq('status', 'published')

    if (events) {
      const eventEntries = events.map((event) => ({
        url: `${baseUrl}/events/${event.slug}`,
        lastModified: new Date(event.updated_at ?? Date.now()),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
      }))
      return [...staticEntries, ...eventEntries]
    }
  } catch {
    // If DB is not available, just return static routes
  }

  return staticEntries
}
