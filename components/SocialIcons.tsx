'use client'

import { Mail, Instagram, Linkedin } from 'lucide-react'
import WhatsAppIcon from '@/components/WhatsAppIcon'
import { SOCIAL_LINKS } from '@/lib/config'

const socialIconMap: Record<string, React.ComponentType<{ size?: number }>> = {
  Instagram,
  LinkedIn: Linkedin,
  WhatsApp: WhatsAppIcon,
  'WhatsApp Community': WhatsAppIcon,
  Email: Mail,
}

export default function SocialIcons() {
  return (
    <div className="flex justify-center gap-4">
      {SOCIAL_LINKS.map((s) => {
        const Icon = socialIconMap[s.label]
        if (!Icon) return null
        return (
          <a
            key={s.label}
            href={s.href}
            target={s.external ? '_blank' : undefined}
            rel={s.external ? 'noopener noreferrer' : undefined}
            className="flex items-center justify-center h-12 w-12 rounded-lg transition-all duration-200"
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-muted)',
              border: '1px solid var(--border-subtle)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--accent-primary)'
              e.currentTarget.style.color = 'var(--btn-primary-text)'
              e.currentTarget.style.borderColor = 'var(--accent-primary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'var(--bg-primary)'
              e.currentTarget.style.color = 'var(--text-muted)'
              e.currentTarget.style.borderColor = 'var(--border-subtle)'
            }}
            aria-label={`RallyVerse on ${s.label}`}
          >
            <Icon size={20} />
          </a>
        )
      })}
    </div>
  )
}
