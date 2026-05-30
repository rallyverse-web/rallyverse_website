import type { Metadata } from 'next'
import RegistrationForm from '@/components/RegistrationForm'

export const metadata: Metadata = {
  title: 'Register Your Interest — RallyVerse Bengaluru',
}

export default function RegisterPage() {
  return <RegistrationForm />
}
