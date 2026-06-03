import { NextRequest, NextResponse } from 'next/server'
import { backfillAllEvents } from '@/lib/seed-defaults'

function authorize(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const token = auth?.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const result = await backfillAllEvents()
    return NextResponse.json({ success: true, ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Backfill failed:', message)
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
