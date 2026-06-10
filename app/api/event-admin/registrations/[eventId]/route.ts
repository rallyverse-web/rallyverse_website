import { NextRequest, NextResponse } from 'next/server'
import { getRegistrationsByEventId, getRegistrationsMetrics, getRegistrationById, deleteRegistration, updateRegistrationDetails } from '@/lib/repositories/registrations'
import { getAdminFromRequest } from '@/lib/event-admin-auth'

const phoneRegex = /^[+]?[0-9\s-]{10,15}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const allowedFormats = ["Men's Singles", "Women's Singles", "Men's Doubles", "Women's Doubles", "Mixed Doubles"]

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params
    const admin = await getAdminFromRequest(req)
    if (!admin || admin.event_id !== eventId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const registrations = await getRegistrationsByEventId(eventId)
    const metrics = await getRegistrationsMetrics(eventId)
    return NextResponse.json({ registrations, metrics })
  } catch (error) {
    console.error('Failed to fetch registrations:', error)
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params
    const admin = await getAdminFromRequest(req)
    if (!admin || admin.event_id !== eventId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const registrationId = req.nextUrl.searchParams.get('registrationId')
    if (!registrationId) {
      return NextResponse.json({ error: 'registrationId is required' }, { status: 400 })
    }

    const registration = await getRegistrationById(registrationId)
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }
    if (registration.event_id !== eventId) {
      return NextResponse.json({ error: 'Unauthorized: cannot access this registration' }, { status: 403 })
    }

    await deleteRegistration(registrationId, admin.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Event admin delete registration error:', error)
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params
    const admin = await getAdminFromRequest(req)
    if (!admin || admin.event_id !== eventId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { registrationId, updates } = body || {}
    if (!registrationId || !updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'registrationId and updates are required' }, { status: 400 })
    }

    const { full_name, email, phone_number, format, partner_name, partner_phone } = updates as Record<string, string | null | undefined>
    if (full_name !== undefined && !String(full_name).trim()) {
      return NextResponse.json({ error: 'Name cannot be empty' }, { status: 400 })
    }
    if (email !== undefined && !emailRegex.test(String(email))) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
    }
    if (phone_number !== undefined && !phoneRegex.test(String(phone_number))) {
      return NextResponse.json({ error: 'Invalid phone number' }, { status: 400 })
    }
    if (format !== undefined && !allowedFormats.includes(String(format))) {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
    }
    if (format && String(format).includes('Doubles')) {
      if (partner_name !== undefined && !String(partner_name || '').trim()) {
        return NextResponse.json({ error: 'Partner name is required for doubles' }, { status: 400 })
      }
      if (partner_phone !== undefined && !phoneRegex.test(String(partner_phone))) {
        return NextResponse.json({ error: 'Invalid partner phone number' }, { status: 400 })
      }
    }

    const registration = await getRegistrationById(registrationId)
    if (!registration) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }
    if (registration.event_id !== eventId) {
      return NextResponse.json({ error: 'Unauthorized: cannot access this registration' }, { status: 403 })
    }

    const updated = await updateRegistrationDetails(registrationId, updates, admin.id)
    return NextResponse.json({ success: true, registration: updated })
  } catch (error) {
    console.error('Event admin update registration error:', error)
    return NextResponse.json({ error: 'Failed to update registration' }, { status: 500 })
  }
}
