import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { EventWithPaymentConfig } from '@/lib/types/supabase'
import { getEventBySlug } from '@/lib/repositories/events'
import { getPaymentConfig } from '@/lib/repositories/payment-config'
import EventRegistrationClient from './EventRegistrationClient'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return {}
  return {
    title: `Register for ${event.name} | RallyVerse`,
    description: `Register for ${event.name}. ${event.description ?? ''}`,
  }
}

export default async function EventRegisterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()
  if (event.status !== 'published') notFound()

  const paymentConfig = await getPaymentConfig(event.id)

  return <EventRegistrationClient event={{ ...event, payment_config: paymentConfig } as EventWithPaymentConfig} paymentConfig={paymentConfig} />
}
