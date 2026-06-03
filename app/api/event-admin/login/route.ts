import { NextRequest, NextResponse } from 'next/server'
import { getEventAdminByToken } from '@/lib/repositories/event-admins'

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json()
    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }
    const admin = await getEventAdminByToken(token)
    if (!admin) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }

    const response = NextResponse.json({
      success: true,
      admin: { id: admin.id, name: admin.name, event_id: admin.event_id },
    })

    response.cookies.set('event_admin_token', token, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24,
    })

    return response
  } catch (error) {
    console.error('Event admin login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
