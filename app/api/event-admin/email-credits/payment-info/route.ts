import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/event-admin-auth'
import { getSystemConfig } from '@/lib/repositories/email-credit-requests'

export async function GET(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const config = await getSystemConfig()
    return NextResponse.json({ config })
  } catch (error) {
    console.error('Payment info error:', error)
    return NextResponse.json({ error: 'Failed to fetch payment info' }, { status: 500 })
  }
}
