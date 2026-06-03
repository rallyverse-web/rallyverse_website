import { NextRequest, NextResponse } from 'next/server'
import { getEventBySlug } from '@/lib/repositories/events'
import { createRegistration } from '@/lib/repositories/registrations'
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limiter'

const phoneRegex = /^[+]?[0-9\s-]{10,15}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const rateKey = getRateLimitKey(req)
    if (!checkRateLimit(rateKey, 5, 60_000)) {
      return NextResponse.json({ error: 'Too many registration attempts. Please try again later.' }, { status: 429 })
    }

    const { slug } = await params
    const event = await getEventBySlug(slug)
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }
    if (event.status !== 'published') {
      return NextResponse.json({ error: 'Event is not open for registration' }, { status: 400 })
    }

    const body = await req.json()
    const { full_name, phone_number, email, city, gender, format, partner_name, partner_phone } = body

    if (!full_name || !phone_number || !email || !city || !gender || !format) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (!phoneRegex.test(phone_number)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const isDoubles = format.includes('Doubles')
    if (isDoubles && (!partner_name || !partner_phone)) {
      return NextResponse.json({ error: 'Partner details required for doubles format' }, { status: 400 })
    }

    const registration = await createRegistration({
      event_id: event.id,
      full_name,
      phone_number,
      email,
      city,
      gender,
      format,
      partner_name: partner_name || '',
      partner_phone: partner_phone || '',
    })

    return NextResponse.json({
      success: true,
      registration_id: registration.registration_id,
      id: registration.id,
    })
  } catch (error) {
    if (error instanceof Error && error.message === 'DUPLICATE_REGISTRATION') {
      return NextResponse.json({ error: 'You have already registered for this format in this event.' }, { status: 409 })
    }
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
