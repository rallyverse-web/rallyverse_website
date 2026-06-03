import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    const { page_type, event_id, slug } = await req.json()
    if (!page_type) {
      return NextResponse.json({ error: 'page_type is required' }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()
    const { error } = await supabase.from('page_views').insert({
      page_type,
      event_id: event_id || null,
      slug: slug || null,
    })

    if (error) {
      console.error('Page view track error:', error)
      return NextResponse.json({ error: 'Failed to track' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}
