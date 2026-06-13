import type { Metadata } from 'next'
import { Bebas_Neue, Inter } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/react'
import Navbar from '@/components/navbar'
import Footer from '@/components/Footer'
import { ThemeProvider } from '@/lib/theme'
import { SITE, ADDRESS, SOCIAL, CONTACT, COMPANY } from '@/lib/config'
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
  title: 'RallyVerse — Rallying Communities Through Sports | Sports Growth Partner',
  description: 'RallyVerse is a sports growth partner that helps sports communities, organizers, academies, and brands grow through registration infrastructure, payment management, attendance tracking, communication, analytics, and community building.',
  twitter: {
    card: 'summary_large_image',
    title: 'RallyVerse — Rallying Communities Through Sports | Sports Growth Partner',
    description: 'RallyVerse is a sports growth partner that helps sports communities, organizers, academies, and brands grow through registration infrastructure, payment management, attendance tracking, communication, analytics, and community building.',
    images: ['/og'],
  },
  openGraph: {
    title: 'RallyVerse — Rallying Communities Through Sports | Sports Growth Partner',
    description: 'RallyVerse is a sports growth partner that helps sports communities, organizers, academies, and brands grow through registration infrastructure, payment management, attendance tracking, communication, analytics, and community building.',
    url: 'https://rallyverse.social',
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
              "@type": "SportsOrganization",
              "@id": `${SITE.domain}#sportsorganization`,
              "name": SITE.name,
              "url": SITE.domain,
              "logo": `${SITE.domain}/logo_transparent.png`,
              "description": `RallyVerse is a sports growth partner helping sports communities, organizers, academies, and brands grow.`,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": ADDRESS.city,
                "addressRegion": ADDRESS.state,
                "postalCode": ADDRESS.postalCode,
                "addressCountry": "IN"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "telephone": CONTACT.phone,
                "contactType": "customer service",
                "availableLanguage": ["English", "Hindi", "Kannada"]
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
              "@type": ["LocalBusiness", "SportsActivityLocation"],
              "@id": `${SITE.domain}#localbusiness`,
              "name": SITE.name,
              "description": COMPANY.shortDescription,
              "url": SITE.domain,
              "telephone": CONTACT.phone,
              "image": `${SITE.domain}/logo_transparent.png`,
              "address": {
                "@type": "PostalAddress",
                "addressLocality": ADDRESS.city,
                "addressRegion": ADDRESS.state,
                "postalCode": ADDRESS.postalCode,
                "addressCountry": "IN",
              },
              "priceRange": "\u20B9\u20B9",
              "areaServed": {
                "@type": "City",
                "name": ADDRESS.city,
              },
              "sameAs": [
                SOCIAL.instagram,
                SOCIAL.linkedin,
              ],
              "parentOrganization": {
                "@id": `${SITE.domain}#sportsorganization`,
              },
            }),
          }}
        />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-MHFCSTPCV5"
          strategy="afterInteractive"
        />
        {process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID && (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
