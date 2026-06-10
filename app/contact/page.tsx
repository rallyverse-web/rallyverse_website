import type { Metadata } from 'next'
import ContactClient from './ContactClient'
import { SITE, CONTACT } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Contact — RallyVerse | Sports Growth Partner',
  description: 'Get in touch with RallyVerse, your sports growth partner. Send a direct message or connect with our support team in Bengaluru.',
  openGraph: {
    title: 'Contact — RallyVerse | Sports Growth Partner',
    description: 'Get in touch with RallyVerse, your sports growth partner. Send a direct message or connect with our support team in Bengaluru.',
    url: 'https://rallyverse.social/contact',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: 'RallyVerse — Rallying Communities Through Sports',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact — RallyVerse | Sports Growth Partner',
    description: 'Get in touch with RallyVerse, your sports growth partner. Send a direct message or connect with our support team in Bengaluru.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/contact',
  },
}

export default function ContactPage() {
  const domain = SITE.domain
  const contactUrl = `${domain}/contact`

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "@id": `${domain}#organization`,
            "url": domain,
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": CONTACT.phone,
              "contactType": "customer service",
              "availableLanguage": ["English", "Hindi", "Kannada"],
              "areaServed": "IN",
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": contactUrl,
            },
          })
        }}
      />
      <ContactClient />
    </div>
  )
}
