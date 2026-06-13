import { getSupabaseAuthClient } from '@/lib/supabase/auth'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { createServerClient } from '@supabase/ssr'
import type { NextRequest, NextResponse } from 'next/server'

export async function requireAdmin() {
  const authClient = await getSupabaseAuthClient()
  const { data: { user }, error } = await authClient.auth.getUser()
  if (error || !user) return null

  const dbClient = await getSupabaseServerClient()
  const { data: adminUser } = await dbClient
    .from('admin_users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!adminUser) return null

  return { id: user.id, email: user.email!, role: adminUser.role }
}

export async function requireEventAdmin(eventId?: string) {
  const authClient = await getSupabaseAuthClient()
  const { data: { user }, error } = await authClient.auth.getUser()
  if (error || !user) return null

  const dbClient = await getSupabaseServerClient()
  let query = dbClient
    .from('event_admins')
    .select('id, event_id, name, email')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  const { data: admin } = await query
  if (!admin || !admin.event_id) return null
  if (eventId && admin.event_id !== eventId) return null

  return { id: admin.id, event_id: admin.event_id, name: admin.name, email: admin.email }
}

export function createAuthClientFromRequest(req: NextRequest, res?: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            req.cookies.set(name, value)
          })
        },
      },
    }
  )
}

export async function getEventAdminFromRequest(req: NextRequest) {
  const supabase = createAuthClientFromRequest(req)
  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) return null

  const dbClient = await getSupabaseServerClient()
  const { data: admin } = await dbClient
    .from('event_admins')
    .select('id, event_id, name, email')
    .eq('auth_user_id', user.id)
    .maybeSingle()

  if (!admin || !admin.event_id) return null
  return { id: admin.id, event_id: admin.event_id, name: admin.name, email: admin.email }
}
