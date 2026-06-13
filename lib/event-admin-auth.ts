import type { NextRequest } from 'next/server'
import { getEventAdminFromRequest } from '@/lib/auth'

export async function getAdminFromRequest(req: NextRequest) {
  return getEventAdminFromRequest(req)
}
