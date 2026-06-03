import { NextRequest, NextResponse } from 'next/server'
import { getEmailSettings, upsertEmailSettings } from '@/lib/repositories/email-settings'
import { getAdminFromRequest } from '@/lib/event-admin-auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params
    const admin = await getAdminFromRequest(req)
    if (!admin || admin.event_id !== eventId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const settings = await getEmailSettings(eventId)
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Failed to fetch email settings:', error)
    return NextResponse.json({ error: 'Failed to fetch email settings' }, { status: 500 })
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
    const settings = await upsertEmailSettings(eventId, body)
    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Failed to save email settings:', error)
    return NextResponse.json({ error: 'Failed to save email settings' }, { status: 500 })
  }
}
