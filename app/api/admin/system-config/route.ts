import { NextRequest, NextResponse } from 'next/server'
import { getSystemConfig, updateSystemConfig } from '@/lib/repositories/email-credit-requests'
import { requireAdmin } from '@/lib/auth'

async function authorize(req: NextRequest) {
  const admin = await requireAdmin()
  return admin !== null
}

export async function GET(req: NextRequest) {
  if (!await authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const config = await getSystemConfig()
    return NextResponse.json({ config })
  } catch (error) {
    console.error('System config error:', error)
    return NextResponse.json({ error: 'Failed to fetch config' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest) {
  if (!await authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const body = await req.json()
    if (body.payment_instructions !== undefined && typeof body.payment_instructions !== 'string') {
      return NextResponse.json({ error: 'payment_instructions must be a string' }, { status: 400 })
    }
    const config = await updateSystemConfig(body)
    return NextResponse.json({ success: true, config })
  } catch (error) {
    console.error('System config update error:', error)
    return NextResponse.json({ error: 'Failed to update config' }, { status: 500 })
  }
}
