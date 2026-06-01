import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import Script from 'next/script'
import Navbar from '@/components/navbar'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/lib/theme'
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
  title: 'RallyVerse — Rally Beyond Routine | Sports, Adventure & Community in Bengaluru',
  description: 'RallyVerse is a universe built for people who move, compete, explore, and connect. Badminton tournaments, treks, marathons, and cycling events in Bengaluru. Rally Beyond Routine.',
  keywords: [
    'RallyVerse Bengaluru',
    'badminton tournaments Bengaluru 2026',
    'sports community Bengaluru',
    'Rally Beyond Routine',
    'competitive badminton Bangalore',
    'community sports events Bangalore',
    'treks near Bangalore',
    'cycling events Bengaluru',
    'marathons Bangalore 2026',
    'sports universe Bengaluru'
  ],
  openGraph: {
    title: 'RallyVerse — Rally Beyond Routine',
    description: 'A universe built for people who move, compete, explore, and connect. Bengaluru\'s home for sports, adventure, and community.',
    url: 'https://www.rallyverse.in',
    siteName: 'RallyVerse',
    locale: 'en_IN',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
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
    <html lang="en" data-theme="color" suppressHydrationWarning className={`${bebasNeue.variable} ${inter.variable}`}>
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
              "name": "Rally Series 01 — Badminton Tournament Bengaluru",
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
