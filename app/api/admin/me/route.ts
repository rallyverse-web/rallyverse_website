import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'

export async function GET() {
  try {
    const admin = await requireAdmin()
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return NextResponse.json({ admin: { id: admin.id, email: admin.email, role: admin.role } })
  } catch (error) {
    console.error('Failed to get admin:', error)
    return NextResponse.json({ error: 'Failed to get admin info' }, { status: 500 })
  }
}
