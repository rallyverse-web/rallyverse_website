import { NextRequest, NextResponse } from 'next/server'
import { getRegistrationsByEventId, getRegistrationsMetrics, getRegistrationById, deleteRegistration } from '@/lib/repositories/registrations'
import { getAdminFromRequest } from '@/lib/event-admin-auth'

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

    await deleteRegistration(registrationId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Event admin delete registration error:', error)
    return NextResponse.json({ error: 'Failed to delete registration' }, { status: 500 })
  }
}
