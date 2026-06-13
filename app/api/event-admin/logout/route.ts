import { NextRequest, NextResponse } from 'next/server'
import { createAuthClientFromRequest } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const supabase = createAuthClientFromRequest(req)
  await supabase.auth.signOut()
  return NextResponse.json({ success: true })
}
