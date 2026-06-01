import { NextRequest, NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/google'
import { EMAIL } from '@/lib/config'
import { verificationCompleteEmail } from '@/lib/email'

async function authorize(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json(
      { error: 'Email service is not configured (RESEND_API_KEY missing)' },
      { status: 500 }
    )
  }

  try {
    const { rowIndex } = await req.json()
    if (typeof rowIndex !== 'number') {
      return NextResponse.json({ error: 'rowIndex must be a number' }, { status: 400 })
    }

    const sheets = getSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const sheetTabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Sheet1'
    const whatsappGroupLink = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/REPLACE_WITH_ACTUAL_LINK'

    const sheetRow = rowIndex + 2
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetTabName}!A${sheetRow}:X${sheetRow}`,
    })

    const row = response.data.values?.[0]
    if (!row) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    const playerName = row[4] || ''
    const playerEmail = row[6] || ''
    const registrationId = row[0] || ''
    const category = row[2] || ''

    if (!playerEmail) {
      return NextResponse.json({ error: 'No email address for this registration' }, { status: 400 })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const { subject, html } = verificationCompleteEmail({
      playerName,
      registrationId,
      category,
      whatsappGroupLink,
    })

    const emailResult = await resend.emails.send({
      from: EMAIL.from,
      replyTo: EMAIL.replyTo,
      to: playerEmail,
      subject,
      html,
    })

    console.log(`[send-verification] Email sent to ${playerEmail} (${registrationId}):`, JSON.stringify(emailResult))

    return NextResponse.json({
      success: true,
      message: `Verification email sent to ${playerEmail}`,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[send-verification] Error:', msg)
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }
}
