import { NextRequest, NextResponse } from 'next/server'
import { getAdminFromRequest } from '@/lib/event-admin-auth'
import { createEmailCreditRequest } from '@/lib/repositories/email-credit-requests'

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromRequest(req)
    if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { package_type, transaction_name, transaction_reference, payment_screenshot_url } = body

    if (!package_type || !['50', '100'].includes(package_type)) {
      return NextResponse.json({ error: 'Invalid package type' }, { status: 400 })
    }
    if (!transaction_name?.trim()) {
      return NextResponse.json({ error: 'Transaction name is required' }, { status: 400 })
    }
    if (!transaction_reference?.trim()) {
      return NextResponse.json({ error: 'Transaction reference is required' }, { status: 400 })
    }

    const credits = package_type === '50' ? 50 : 100
    const amount = package_type === '50' ? 250 : 500

    const request = await createEmailCreditRequest({
      event_id: admin.event_id!,
      event_admin_id: admin.id,
      package_type: package_type as '50' | '100',
      email_credits: credits,
      amount,
      transaction_name: transaction_name.trim(),
      transaction_reference: transaction_reference.trim(),
      payment_screenshot_url: payment_screenshot_url || null,
    })

    return NextResponse.json({ success: true, request })
  } catch (error) {
    console.error('Email credit request error:', error)
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
  }
}
