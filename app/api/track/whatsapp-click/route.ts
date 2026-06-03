import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { event_id, click_type } = await req.json()
    if (!event_id || !click_type) {
      return NextResponse.json({ error: 'event_id and click_type are required' }, { status: 400 })
    }
    if (!['contact', 'group'].includes(click_type)) {
      return NextResponse.json({ error: 'Invalid click_type' }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.from('whatsapp_clicks').insert({
      event_id,
      click_type,
    })

    if (error) {
      console.error('WhatsApp click track error:', error)
      return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
