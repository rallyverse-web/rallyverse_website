import { NextRequest, NextResponse } from 'next/server'
import { upsertPaymentConfig, getPaymentConfig } from '@/lib/repositories/payment-config'
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
    const config = await getPaymentConfig(eventId)
    return NextResponse.json({ config })
  } catch (error) {
    console.error('Failed to fetch payment config:', error)
    return NextResponse.json({ error: 'Failed to fetch payment config' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  if (!await authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { eventId } = await params
    const body = await req.json()
    const config = await upsertPaymentConfig(eventId, body)
    return NextResponse.json({ success: true, config })
  } catch (error) {
    console.error('Failed to save payment config:', error)
    return NextResponse.json({ error: 'Failed to save payment config' }, { status: 500 })
  }
}
