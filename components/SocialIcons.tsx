'use client'

import { Mail, Instagram, Linkedin } from 'lucide-react'
import WhatsAppIcon from '@/components/WhatsAppIcon'
import { SOCIAL, WHATSAPP } from '@/lib/config'

const socialLinks = [
  { icon: Instagram, label: 'Instagram', href: SOCIAL.instagram },
  { icon: Linkedin, label: 'LinkedIn', href: SOCIAL.linkedin },
  { icon: WhatsAppIcon, label: 'WhatsApp Community', href: WHATSAPP.communityLink },
  { icon: Mail, label: 'Email', href: SOCIAL.email },
]

export default function SocialIcons() {
  return (
    <div className="flex justify-center gap-4">
      {socialLinks.map((s) => {
        const Icon = s.icon
        return (
          <a
            key={s.label}
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
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
