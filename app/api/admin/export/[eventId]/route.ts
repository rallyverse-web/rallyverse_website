import { NextRequest, NextResponse } from 'next/server'
import { getRegistrationsByEventId } from '@/lib/repositories/registrations'

function authorize(req: NextRequest) {
  const auth = req.headers.get('authorization')
  const token = auth?.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  try {
    const { eventId } = await params
    const registrations = await getRegistrationsByEventId(eventId)
    const headers = [
      'Registration ID', 'Full Name', 'Phone', 'Email', 'City', 'Gender',
      'Format', 'Partner Name', 'Partner Phone', 'Status', 'Notes', 'Created At',
    ]

    const rows = registrations.map((r) => [
      r.registration_id,
      r.full_name,
      r.phone_number,
      r.email,
      r.city,
      r.gender,
      r.format,
      r.partner_name || '',
      r.partner_phone || '',
      r.status,
      r.notes || '',
      r.created_at,
    ])

    const csv = [headers.join(','), ...rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))].join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="registrations-${eventId}.csv"`,
      },
    })
  } catch (error) {
    console.error('Export error:', error)
    return NextResponse.json({ error: 'Failed to export' }, { status: 500 })
  }
}
