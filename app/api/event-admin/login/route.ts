import { NextRequest, NextResponse } from 'next/server'
import { createAuthClientFromRequest } from '@/lib/auth'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    const supabase = createAuthClientFromRequest(req)
    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    })

    if (signInError || !user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const dbClient = await getSupabaseServerClient()
    const { data: admin } = await dbClient
      .from('event_admins')
      .select('id, name, event_id')
      .eq('auth_user_id', user.id)
      .maybeSingle()

    if (!admin || !admin.event_id) {
      await supabase.auth.signOut()
      return NextResponse.json({ error: 'No event admin access found for this account' }, { status: 403 })
    }

    const response = NextResponse.json({
      success: true,
      admin: { id: admin.id, name: admin.name, event_id: admin.event_id },
    })

    return response
  } catch (error) {
    console.error('Event admin login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
