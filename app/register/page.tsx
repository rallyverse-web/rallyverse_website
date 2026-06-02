import type { Metadata } from 'next'
import RegistrationForm from '@/components/RegistrationForm'

export const metadata: Metadata = {
  title: 'Register — RallyVerse | Badminton Tournament Bengaluru 2026',
  description: 'Register for RallyVerse events. Join badminton tournaments, treks, marathons, and cycling adventures in Bengaluru. Your verse starts here.',
  openGraph: {
    title: 'Register — RallyVerse | Badminton Tournament Bengaluru 2026',
    description: 'Register for RallyVerse events. Join badminton tournaments, treks, marathons, and cycling adventures in Bengaluru. Your verse starts here.',
    url: 'https://rallyverse.social/register',
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
  twitter: {
    card: 'summary_large_image',
    title: 'Register — RallyVerse | Badminton Tournament Bengaluru 2026',
    description: 'Register for RallyVerse events. Join badminton tournaments, treks, marathons, and cycling adventures in Bengaluru. Your verse starts here.',
    images: ['/og'],
  },
  alternates: {
    canonical: '/register',
  },
}

export default function RegisterPage() {
  return <RegistrationForm />
}
