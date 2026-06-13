import { NextRequest, NextResponse } from 'next/server'
import { backfillAllEvents } from '@/lib/seed-defaults'
import { requireAdmin } from '@/lib/auth'

async function authorize(req: NextRequest) {
  const admin = await requireAdmin()
  return admin !== null
}

export async function POST(req: NextRequest) {
  if (!await authorize(req)) {
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
