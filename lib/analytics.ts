const MEASUREMENT_ID = typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID : undefined

declare global {
  interface Window { gtag?: (...args: unknown[]) => void; dataLayer?: unknown[] }
}

function gtag(...args: unknown[]) {
  if (typeof window === 'undefined') return
  if (typeof window.gtag === 'function') {
    window.gtag(...args)
  }
}

const PAGE_VIEW_MAP: Record<string, string> = {
  homepage: 'homepage_view',
  event_listing: 'event_listing_view',
  event_detail: 'event_detail_view',
  registration: 'registration_page_view',
  registration_success: 'registration_success_view',
}

export function trackPageView(pageType: string, eventId?: string, slug?: string) {
  const eventName = PAGE_VIEW_MAP[pageType] || `${pageType}_view`
  gtag('event', eventName, { event_id: eventId, slug })

  fetch('/api/track/page-view', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ page_type: pageType, event_id: eventId, slug }),
  }).catch(() => {})
}

export function trackEvent(eventName: string, properties?: Record<string, unknown>) {
  gtag('event', eventName, properties)
}

export function trackWhatsappClick(eventId: string, clickType: 'contact' | 'group') {
  const eventName = clickType === 'contact' ? 'whatsapp_contact_click' : 'whatsapp_group_click'
  gtag('event', eventName, { event_id: eventId })

  fetch('/api/track/whatsapp-click', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event_id: eventId, click_type: clickType }),
  }).catch(() => {})
}
