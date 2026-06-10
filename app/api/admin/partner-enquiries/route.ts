import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseServerClient } from '@/lib/supabase/server'

// Authorize admin request
function authorize(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const token = auth?.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

// GET: List partner enquiries with filters & metrics
export async function GET(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const orgType = searchParams.get('organization_type')
    const service = searchParams.get('service')
    const search = searchParams.get('search')
    const dateStart = searchParams.get('date_start')
    const dateEnd = searchParams.get('date_end')
    const showDeleted = searchParams.get('show_deleted') === 'true'

    const supabase = await getSupabaseServerClient()

    // 1. Fetch raw data for metrics (over all non-deleted enquiries)
    const { data: allMetricsData, error: metricsError } = await supabase
      .from('partner_enquiries')
      .select('status, is_deleted')
      .eq('is_deleted', false)

    if (metricsError) throw metricsError

    const activeEnquiries = allMetricsData ?? []
    const totalCount = activeEnquiries.length
    const newCount = activeEnquiries.filter((e) => e.status === 'New').length
    const contactedCount = activeEnquiries.filter((e) => e.status === 'Contacted').length
    const qualifiedCount = activeEnquiries.filter((e) => e.status === 'Qualified').length
    const proposalSentCount = activeEnquiries.filter((e) => e.status === 'Proposal Sent').length
    const wonCount = activeEnquiries.filter((e) => e.status === 'Won').length
    const lostCount = activeEnquiries.filter((e) => e.status === 'Lost').length
    const conversionRate = totalCount > 0 ? Math.round((wonCount / totalCount) * 100) : 0

    const metrics = {
      total: totalCount,
      new: newCount,
      contacted: contactedCount,
      qualified: qualifiedCount,
      proposal_sent: proposalSentCount,
      won: wonCount,
      lost: lostCount,
      conversion_rate: conversionRate,
    }

    // 2. Fetch filtered records
    let query = supabase
      .from('partner_enquiries')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply soft delete filter
    if (!showDeleted) {
      query = query.eq('is_deleted', false)
    }

    // Apply other filters
    if (status) {
      query = query.eq('status', status)
    }
    if (orgType) {
      query = query.eq('organization_type', orgType)
    }
    if (service) {
      query = query.contains('services_interested', [service])
    }
    if (dateStart) {
      query = query.gte('created_at', dateStart)
    }
    if (dateEnd) {
      query = query.lte('created_at', dateEnd)
    }
    if (search && search.trim()) {
      const cleanSearch = search.trim()
      query = query.or(
        `name.ilike.%${cleanSearch}%,email.ilike.%${cleanSearch}%,organization.ilike.%${cleanSearch}%,phone.ilike.%${cleanSearch}%`
      )
    }

    const { data: enquiries, error: fetchError } = await query

    if (fetchError) throw fetchError

    return NextResponse.json({
      enquiries: enquiries ?? [],
      metrics,
    })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Failed to fetch partner enquiries:', message)
    return NextResponse.json({ error: 'Failed to fetch partner enquiries' }, { status: 500 })
  }
}

// PUT: Update partner enquiry details / status / notes / is_deleted
export async function PUT(req: NextRequest) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: 'Enquiry ID is required' }, { status: 400 })
    }

    const supabase = await getSupabaseServerClient()

    // Perform update
    const { data, error } = await supabase
      .from('partner_enquiries')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, enquiry: data })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Failed to update partner enquiry:', message)
    return NextResponse.json({ error: 'Failed to update partner enquiry' }, { status: 500 })
  }
}
