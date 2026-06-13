import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/event-admin-auth'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { eventId } = await params
    if (admin.event_id !== eventId) {
      return NextResponse.json({ error: 'Unauthorized: cannot access this event' }, { status: 403 })
    }

    const supabase = await getSupabaseServerClient()
    const { data: event, error } = await supabase
      .from('events')
      .select('email_limit, emails_sent, additional_email_credits')
      .eq('id', eventId)
      .single()

    if (error) throw error
    if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })

    const emailLimit = event.email_limit ?? 50
    const emailsSent = event.emails_sent ?? 0
    const additionalCredits = event.additional_email_credits ?? 0
    const effectiveLimit = emailLimit + additionalCredits
    const remaining = Math.max(0, effectiveLimit - emailsSent)
    const percentageUsed = effectiveLimit > 0 ? Math.round((emailsSent / effectiveLimit) * 100) : 0

    return NextResponse.json({
      email_limit: emailLimit,
      emails_sent: emailsSent,
      additional_email_credits: additionalCredits,
      effective_limit: effectiveLimit,
      remaining,
      percentage_used: percentageUsed,
    })
  } catch (error) {
    console.error('Email quota error:', error)
    return NextResponse.json({ error: 'Failed to fetch email quota' }, { status: 500 })
  }
}


