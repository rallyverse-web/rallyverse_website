import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://rallyverse.social'

  const routes = [
    '',
    '/about',
    '/events',
    '/register',
    '/contact',
    '/believers',
    '/privacy-policy',
    '/terms-and-conditions',
  ]

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : 0.8,
  }))
}
