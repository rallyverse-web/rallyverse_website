import { NextRequest, NextResponse } from 'next/server'
import { getEventAdmins, createEventAdmin, removeEventAdmin } from '@/lib/repositories/event-admins'
import { requireAdmin } from '@/lib/auth'

async function authorize(req: NextRequest) {
  const admin = await requireAdmin()
  return admin !== null
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  if (!await authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { eventId } = await params
    const admins = await getEventAdmins(eventId)
    return NextResponse.json({ admins })
  } catch (error) {
    console.error('Failed to fetch event admins:', error)
    return NextResponse.json({ error: 'Failed to fetch event admins' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  if (!await authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { eventId } = await params
    const body = await req.json()
    const result = await createEventAdmin(eventId, { name: body.name, email: body.email })
    return NextResponse.json({ success: true, admin: result.admin, access_token: result.access_token })
  } catch (error) {
    console.error('Failed to create event admin:', error)
    return NextResponse.json({ error: 'Failed to create event admin' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!await authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const adminId = searchParams.get('adminId')
    if (!adminId) {
      return NextResponse.json({ error: 'adminId is required' }, { status: 400 })
    }
    await removeEventAdmin(adminId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to remove event admin:', error)
    return NextResponse.json({ error: 'Failed to remove event admin' }, { status: 500 })
  }
}
