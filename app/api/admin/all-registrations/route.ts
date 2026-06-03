import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

function authorize(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const token = auth?.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const supabase = await getSupabaseServerClient()
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('id, name, slug, status')
      .order('created_at', { ascending: false })
    if (eventsError) throw eventsError

    const result = []
    for (const event of events ?? []) {
      const { data: registrations, error: regError } = await supabase
        .from('registrations')
        .select('*')
        .eq('event_id', event.id)
        .order('created_at', { ascending: false })
      if (regError) throw regError
      const regs = registrations ?? []
      result.push({
        event,
        registrations: regs,
        metrics: {
          total: regs.length,
          pending: regs.filter((r) => r.status === 'Pending').length,
          approved: regs.filter((r) => r.status === 'Approved').length,
          rejected: regs.filter((r) => r.status === 'Rejected').length,
        },
      })
    }

    return NextResponse.json({ events: result })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('Failed to fetch all registrations:', msg)
    return NextResponse.json({ error: 'Failed to fetch registrations' }, { status: 500 })
  }
}
