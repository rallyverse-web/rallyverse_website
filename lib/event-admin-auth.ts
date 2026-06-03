import { getEventAdminByToken } from '@/lib/repositories/event-admins'
import type { NextRequest } from 'next/server'

export async function getAdminFromRequest(req: NextRequest) {
  const token = req.cookies.get('event_admin_token')?.value
  if (!token) return null
  const admin = await getEventAdminByToken(token)
  if (!admin || !admin.event_id) return null
  return admin
}
