import { NextRequest, NextResponse } from 'next/server'
import { getEmailSettings, upsertEmailSettings } from '@/lib/repositories/email-settings'

function authorize(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const token = auth?.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  if (!authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { eventId } = await params
    const settings = await getEmailSettings(eventId)
    return NextResponse.json({ settings })
  } catch (error) {
    console.error('Failed to fetch email settings:', error)
    return NextResponse.json({ error: 'Failed to fetch email settings' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  if (!authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const { eventId } = await params
    const body = await req.json()
    const settings = await upsertEmailSettings(eventId, body)
    return NextResponse.json({ success: true, settings })
  } catch (error) {
    console.error('Failed to save email settings:', error)
    return NextResponse.json({ error: 'Failed to save email settings' }, { status: 500 })
  }
}
