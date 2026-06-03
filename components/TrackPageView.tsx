'use client'

import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

export default function TrackPageView({ pageType, eventId, slug }: { pageType: string; eventId?: string; slug?: string }) {
  useEffect(() => {
    trackPageView(pageType, eventId, slug)
  }, [pageType, eventId, slug])

  return null
}
