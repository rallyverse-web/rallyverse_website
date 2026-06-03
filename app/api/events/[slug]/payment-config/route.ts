import { NextRequest, NextResponse } from 'next/server'
import { getEventBySlug } from '@/lib/repositories/events'
import { getPaymentConfig } from '@/lib/repositories/payment-config'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    const event = await getEventBySlug(slug)
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    const config = await getPaymentConfig(event.id)
    return NextResponse.json({ config })
  } catch (error) {
    console.error('Failed to fetch payment config:', error)
    return NextResponse.json({ error: 'Failed to fetch payment config' }, { status: 500 })
  }
}
