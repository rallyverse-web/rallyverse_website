import { NextRequest, NextResponse } from 'next/server'
import { getRegistrationsByEventId } from '@/lib/repositories/registrations'
import { getEventAdminByToken } from '@/lib/repositories/event-admins'

async function authorize(req: NextRequest, eventId: string) {
  const auth = req.headers.get('authorization')
  const token = auth?.replace('Bearer ', '')
  if (!token) return null
  const admin = await getEventAdminByToken(token)
  if (!admin || admin.event_id !== eventId) return null
  return admin
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ eventId: string }> }) {
  try {
    const { eventId } = await params
    const admin = await authorize(req, eventId)
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const registrations = await getRegistrationsByEventId(eventId)
    const headers = [
      'Registration ID', 'Full Name', 'Phone', 'Email', 'City', 'Gender',
      'Format', 'Time Slot', 'Partner Name', 'Partner Phone', 'Payment Status',
      'UPI ID Used', 'Transaction Name', 'Transaction Reference',
      'Payment Screenshot URL', 'Payment Verified At', 'Status',
      'Checked In', 'Checked In At', 'Checked In By',
      'Notes', 'Created At',
    ]

    const rows = registrations.map((r) => [
      r.registration_id,
      r.full_name,
      r.phone_number,
      r.email,
      r.city,
      r.gender,
      r.format,
      r.time_slot || '',
      r.partner_name || '',
      r.partner_phone || '',
      r.payment_status || '',
      r.payment_upi_id || '',
      r.transaction_name || '',
      r.transaction_reference || '',
      r.payment_screenshot_url || '',
      r.payment_verified_at ? new Date(r.payment_verified_at).toISOString() : '',
      r.status,
      r.checked_in ? 'Yes' : 'No',
      r.checked_in_at ? new Date(r.checked_in_at).toISOString() : '',
      r.checked_in_by || '',
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
