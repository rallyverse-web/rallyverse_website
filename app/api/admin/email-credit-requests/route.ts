import { NextRequest, NextResponse } from 'next/server'
import { getAllCreditRequests } from '@/lib/repositories/email-credit-requests'

function authorize(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const token = auth?.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!authorize(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  try {
    const requests = await getAllCreditRequests()
    return NextResponse.json({ requests })
  } catch (error) {
    console.error('Admin credit requests error:', error)
    return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 })
  }
}
