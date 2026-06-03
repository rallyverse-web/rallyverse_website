import { NextRequest, NextResponse } from 'next/server'
import { getAllEvents, createEvent, updateEvent, deleteEvent, publishEvent, getAdminEventMetrics } from '@/lib/repositories/events'

function authorize(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const token = auth?.replace('Bearer ', '')
  if (token !== process.env.ADMIN_PASSWORD) {
    return false
  }
  return true
}

export async function GET(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const events = await getAllEvents()
    const metrics = await getAdminEventMetrics()
    return NextResponse.json({ events, metrics })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Failed to fetch events:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const event = await createEvent(body)
    return NextResponse.json({ success: true, event })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Failed to create event:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const body = await req.json()
    const { id, ...updates } = body
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }
    const event = await updateEvent(id, updates)
    return NextResponse.json({ success: true, event })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Failed to update event:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }
    await deleteEvent(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Failed to delete event:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { id, action } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'Event ID is required' }, { status: 400 })
    }
    if (action === 'publish') {
      await publishEvent(id)
      return NextResponse.json({ success: true, message: 'Event published' })
    }
    return NextResponse.json({ error: 'Unknown action' }, { status: 400 })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Failed to perform action:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
