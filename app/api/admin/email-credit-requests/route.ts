import { NextRequest, NextResponse } from 'next/server'
import { getAllCreditRequests } from '@/lib/repositories/email-credit-requests'
import { requireAdmin } from '@/lib/auth'

async function authorize(req: NextRequest) {
  const admin = await requireAdmin()
  return admin !== null
}

export async function GET(req: NextRequest) {
  if (!await authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const requests = await getAllCreditRequests()
    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Admin credit requests error:', error)
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
  }
}
