import type { Metadata } from 'next'
import Script from 'next/script'
import { Bebas_Neue, Inter } from 'next/font/google'
import Navbar from '@/components/navbar'
import Footer from '@/components/Footer'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
})

const inter = Inter({
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'RallyVerse — Badminton Tournaments & Community Sports Events in Bengaluru',
  description: 'Competitive badminton tournaments, community treks, marathons and cycling events in Bengaluru. RallyVerse is building Bangalore\'s best amateur sports tournament series. Register your interest for 2026.',
  keywords: [
    'badminton tournaments in Bengaluru',
    'competitive badminton Bangalore',
    'amateur badminton league Bangalore',
    'badminton doubles tournament Bengaluru',
    'badminton tournaments happening in Bangalore',
    'best badminton tournaments Bangalore 2026',
    'community sports events Bangalore',
    'treks near Bangalore',
    'cycling events Bangalore 2026',
    'marathons Bangalore 2026'
  ],
  openGraph: {
    title: 'RallyVerse — Bengaluru\'s Home for Competitive Sports',
    description: 'Badminton tournaments, treks, marathons and cycling events. Built for players who show up.',
    url: 'https://www.rallyverse.in',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${bebasNeue.variable} ${inter.variable}`}>
      <head>
        <Script id="disable-scroll-restoration" strategy="beforeInteractive">
          {`
            if ('scrollRestoration' in window.history) {
              window.history.scrollRestoration = 'manual';
            }
            if (window.location.pathname === '/' && window.location.hash) {
              window.history.replaceState(null, '', window.location.pathname + window.location.search);
            }
          `}
        </Script>
        <link rel="canonical" href="https://www.rallyverse.in" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "RallyVerse",
              "url": "https://www.rallyverse.in",
              "logo": "https://www.rallyverse.in/logo/logo_transparent.png",
              "description": "Competitive badminton tournaments, community treks, marathons and cycling events in Bengaluru.",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Bengaluru",
                "addressRegion": "Karnataka",
                "addressCountry": "IN"
              },
              "sameAs": []
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsEvent",
              "name": "Rally Series #01 — Badminton Tournament Bengaluru",
              "description": "Competitive badminton tournament in Bengaluru with brackets for all skill levels. Men's Singles, Women's Singles, Doubles, Mixed.",
              "location": {
                "@type": "Place",
                "name": "Bengaluru, Karnataka, India"
              },
              "organizer": {
                "@type": "Organization",
                "name": "RallyVerse",
                "url": "https://www.rallyverse.in"
              },
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
            })
          }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
