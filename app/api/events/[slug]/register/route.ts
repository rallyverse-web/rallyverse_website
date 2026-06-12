import { NextRequest, NextResponse } from 'next/server'
import { getEventBySlug, getEventWithPaymentConfig } from '@/lib/repositories/events'
import { createRegistration } from '@/lib/repositories/registrations'
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limiter'
import { sendRegistrationReceivedEmail } from '@/lib/send-email-service'

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
    const { full_name, phone_number, email, city, gender, format, partner_name, partner_phone, payment_upi_id, transaction_name, transaction_reference, payment_screenshot_url } = body

    if (!full_name || !phone_number || !email || !city || !gender || !format) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }
    if (full_name.length > 100) {
      return NextResponse.json({ error: 'Name too long (max 100 characters)' }, { status: 400 })
    }
    if (!phoneRegex.test(phone_number)) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }
    if (phone_number.length > 20) {
      return NextResponse.json({ error: 'Phone number too long' }, { status: 400 })
    }
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }
    if (email.length > 254) {
      return NextResponse.json({ error: 'Email too long' }, { status: 400 })
    }
    if (city.length > 100) {
      return NextResponse.json({ error: 'City name too long' }, { status: 400 })
    }

    const isDoubles = format.includes('Doubles')
    if (isDoubles && (!partner_name || !partner_phone)) {
      return NextResponse.json({ error: 'Partner details required for doubles format' }, { status: 400 })
    }

    const eventWithConfig = await getEventWithPaymentConfig(slug)
    const paymentConfig = eventWithConfig?.payment_config

    if (event.payment_enabled || paymentConfig?.payment_enabled) {
      if (!payment_upi_id || !transaction_name) {
        return NextResponse.json({ error: 'UPI ID and transaction name are required when payment is enabled' }, { status: 400 })
      }
    }

    if (payment_upi_id && !transaction_name) {
      return NextResponse.json({ error: 'Transaction name is required when providing UPI ID' }, { status: 400 })
    }

    if (payment_upi_id && paymentConfig?.transaction_ref_required && !transaction_reference) {
      return NextResponse.json({ error: 'Transaction reference ID is required' }, { status: 400 })
    }

    if (payment_upi_id && payment_upi_id.length > 100) {
      return NextResponse.json({ error: 'UPI ID too long' }, { status: 400 })
    }
    if (transaction_name && transaction_name.length > 200) {
      return NextResponse.json({ error: 'Transaction name too long' }, { status: 400 })
    }
    if (transaction_reference && transaction_reference.length > 200) {
      return NextResponse.json({ error: 'Transaction reference too long' }, { status: 400 })
    }
    if (payment_screenshot_url && !payment_screenshot_url.startsWith('https://')) {
      return NextResponse.json({ error: 'Invalid payment screenshot URL' }, { status: 400 })
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
      payment_upi_id: payment_upi_id || '',
      transaction_name: transaction_name || '',
      transaction_reference: transaction_reference || '',
      payment_screenshot_url: payment_screenshot_url || null,
    })

    try {
      await sendRegistrationReceivedEmail(event.id, registration, event)
    } catch (emailError) {
      console.error('Registration email failed:', emailError)
    }

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
