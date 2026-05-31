import type { Metadata } from 'next'
import RegistrationForm from '@/components/RegistrationForm'

export const metadata: Metadata = {
  title: 'Your Verse Starts Here — RallyVerse Registration',
}

export default function RegisterPage() {
  return <RegistrationForm />
}
