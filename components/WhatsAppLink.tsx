'use client'

import { trackWhatsappClick } from '@/lib/analytics'

export function WhatsAppContactLink({ eventId, href, children }: { eventId: string; href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsappClick(eventId, 'contact')}
      className="inline-flex items-center gap-1.5 mt-2 font-body text-sm font-semibold transition-colors duration-200"
      style={{ color: 'var(--accent-primary)' }}
    >
      {children}
    </a>
  )
}

export function WhatsAppGroupLink({ eventId, href, children }: { eventId: string; href: string; children: React.ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" onClick={() => trackWhatsappClick(eventId, 'group')}
      className="inline-flex items-center gap-1.5 mt-2 font-body text-sm font-semibold transition-colors duration-200"
      style={{ color: 'var(--accent-primary)' }}
    >
      {children}
    </a>
  )
}
