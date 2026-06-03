import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/event-admin-auth'
import { getRegistrationsByEventId } from '@/lib/repositories/registrations'
import { getEventById } from '@/lib/repositories/events'
import { sendBulkTemplatedEmails } from '@/lib/send-email-service'
import type { EmailTemplateType, Registration } from '@/lib/types/supabase'

type Audience = 'all' | 'approved' | 'pending' | 'rejected'

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { template_type, audience, format, include_whatsapp } = await req.json()
    if (!template_type || !audience) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const validAudiences: Audience[] = ['all', 'approved', 'pending', 'rejected']
    if (!validAudiences.includes(audience)) {
      return NextResponse.json({ error: 'Invalid audience' }, { status: 400 })
    }

    const event = await getEventById(admin.event_id)
    if (!event) {
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const allRegistrations = await getRegistrationsByEventId(admin.event_id)

    let filtered = allRegistrations
    if (audience === 'approved') filtered = filtered.filter(r => r.status === 'Approved')
    else if (audience === 'pending') filtered = filtered.filter(r => r.status === 'Pending')
    else if (audience === 'rejected') filtered = filtered.filter(r => r.status === 'Rejected')

    if (format) {
      filtered = filtered.filter(r => r.format === format)
    }

    if (filtered.length === 0) {
      return NextResponse.json({ error: 'No registrations match the selected criteria' }, { status: 400 })
    }

    const recipients = filtered.map(registration => ({ registration, event }))

    const result = await sendBulkTemplatedEmails(
      admin.event_id,
      template_type as EmailTemplateType,
      recipients,
      admin.id,
      { includeWhatsapp: include_whatsapp }
    )

    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    console.error('Send email error:', error)
    return NextResponse.json({ error: 'Failed to send emails' }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const audience = req.nextUrl.searchParams.get('audience') || 'all'
    const format = req.nextUrl.searchParams.get('format') || ''
    const validAudiences: Audience[] = ['all', 'approved', 'pending', 'rejected']
    if (!validAudiences.includes(audience as Audience)) {
      return NextResponse.json({ error: 'Invalid audience' }, { status: 400 })
    }

    const allRegistrations = await getRegistrationsByEventId(admin.event_id)

    let filtered = allRegistrations
    if (audience === 'approved') filtered = filtered.filter(r => r.status === 'Approved')
    else if (audience === 'pending') filtered = filtered.filter(r => r.status === 'Pending')
    else if (audience === 'rejected') filtered = filtered.filter(r => r.status === 'Rejected')

    if (format) {
      filtered = filtered.filter(r => r.format === format)
    }

    return NextResponse.json({ count: filtered.length, registrations: filtered.map(r => ({ id: r.id, full_name: r.full_name, email: r.email, format: r.format, status: r.status })) })
  } catch (error) {
    console.error('Count recipients error:', error)
    return NextResponse.json({ error: 'Failed to count recipients' }, { status: 500 })
  }
}
