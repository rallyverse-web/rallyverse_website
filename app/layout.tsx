import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import Script from 'next/script'
import Navbar from '@/components/navbar'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/lib/theme'
import { SITE, ADDRESS, ADDRESS_FULL, CATEGORIES, CURRENT_EVENT, SOCIAL } from '@/lib/config'
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
  metadataBase: new URL('https://rallyverse.social'),
  title: 'RallyVerse — Rally Beyond Routine | Sports & Community in Bengaluru',
  description: 'RallyVerse is a universe built for people who move, compete, explore, and connect. Badminton tournaments, treks, marathons, and cycling events in Bengaluru. Rally Beyond Routine.',
  twitter: {
    card: 'summary_large_image',
    title: 'RallyVerse — Rally Beyond Routine | Sports & Community in Bengaluru',
    description: 'RallyVerse is a universe built for people who move, compete, explore, and connect. Badminton tournaments, treks, marathons, and cycling events in Bengaluru. Rally Beyond Routine.',
    images: ['/og'],
  },
  openGraph: {
    title: 'RallyVerse — Rally Beyond Routine | Sports & Community in Bengaluru',
    description: 'RallyVerse is a universe built for people who move, compete, explore, and connect. Badminton tournaments, treks, marathons, and cycling events in Bengaluru. Rally Beyond Routine.',
    url: 'https://rallyverse.social',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/og',
        width: 1200,
        height: 630,
        alt: 'RallyVerse — Rally Beyond Routine',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: [
      { url: '/favicon.svg', sizes: 'any', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en-IN" data-theme="color" suppressHydrationWarning className={`${bebasNeue.variable} ${inter.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('rallyverse-theme');
                  if (t === 'bw' || t === 'color') {
                    document.documentElement.setAttribute('data-theme', t);
                  }
                } catch(e) {}
              })();
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": SITE.name,
              "url": SITE.domain,
              "logo": `${SITE.domain}/logo_transparent.png`,
              "description": `Competitive badminton tournaments, community treks, marathons and cycling events in ${ADDRESS.city}.`,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": ADDRESS.city,
                "addressRegion": ADDRESS.state,
                "addressCountry": "IN"
              },
              "sameAs": [
                SOCIAL.instagram,
                SOCIAL.linkedin
              ]
            })
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SportsEvent",
              "name": CURRENT_EVENT.name,
              "description": `${CURRENT_EVENT.name} is a competitive badminton tournament in ${ADDRESS.city} featuring ${CATEGORIES.join(' and ')} categories. Players compete in a professionally organized one-day event designed to bring together badminton enthusiasts and foster a strong sporting community.`,
              "image": `${SITE.domain}/og`,
              "startDate": "2026-07-05T11:00:00+05:30",
              "endDate": "2026-07-05T19:00:00+05:30",
              "location": {
                "@type": "Place",
                "name": CURRENT_EVENT.venue,
                "address": {
                  "@type": "PostalAddress",
                  "streetAddress": `${CURRENT_EVENT.venue}, ${ADDRESS.area}`,
                  "addressLocality": ADDRESS.city,
                  "addressRegion": ADDRESS.state,
                  "postalCode": ADDRESS.postalCode,
                  "addressCountry": "IN"
                }
              },
              "offers": {
                "@type": "Offer",
                "price": String(CURRENT_EVENT.registrationFee),
                "priceCurrency": "INR",
                "url": `${SITE.domain}/register`,
                "availability": "https://schema.org/LimitedAvailability",
                "validFrom": "2026-06-01T00:00:00+05:30"
              },
              "organizer": {
                "@type": "Organization",
                "name": SITE.name,
                "url": SITE.domain
              },
              "sport": "Badminton",
              "eventStatus": "https://schema.org/EventScheduled",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode"
            })
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MHFCSTPCV5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-MHFCSTPCV5');
          `}
        </Script>
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
