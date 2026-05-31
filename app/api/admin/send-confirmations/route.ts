import { NextRequest, NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/google'

async function authorize(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.replace('Bearer ', '')
  return token === process.env.ADMIN_PASSWORD
}

export async function POST(req: NextRequest) {
  if (!(await authorize(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const sheets = getSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const sheetTabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Sheet1'
    const whatsappGroupLink = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/REPLACE_WITH_ACTUAL_LINK'

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetTabName}!A:X`,
    })

    const rows = response.data.values || []
    const dataRows = rows.slice(1)

    const toSend: Array<{ index: number; row: string[] }> = []
    dataRows.forEach((row, i) => {
      if ((row[19] || '') === 'Verified' && (row[20] || '') === 'No') {
        toSend.push({ index: i, row })
      }
    })

    if (toSend.length === 0) {
      return NextResponse.json({ sent: 0, failed: 0, message: 'No pending confirmations to send.' })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const confirmationDate = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    let sent = 0
    let failed = 0

    for (const { index, row } of toSend) {
      const playerName = row[4] || ''
      const playerEmail = row[6] || ''

      if (!playerEmail) {
        failed++
        continue
      }

      try {
        await resend.emails.send({
          from: 'RallyVerse <onboarding@resend.dev>',
          to: playerEmail,
          subject: 'Registration Confirmed \u2013 RallyVerse Badminton Tournament',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
              <p>Hi ${playerName},</p>
              <p>Your registration for the RallyVerse Badminton Tournament has been successfully verified and confirmed.</p>
              <p>We look forward to seeing you on the court.</p>
              <p>Please ensure you have joined the official WhatsApp group for schedules, announcements, and event updates.</p>
              <p style="text-align: center; margin: 28px 0;">
                <a href="${whatsappGroupLink}" style="display: inline-block; background: linear-gradient(135deg, #FF5E00, #FF8C00); color: #FFFFFF; font-weight: bold; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-size: 16px;">Join WhatsApp Group</a>
              </p>
              <p>Thank you for being part of RallyVerse.</p>
              <p>Regards,<br/>Team RallyVerse</p>
            </div>
          `,
        })

        const sheetRow = index + 2
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetTabName}!U${sheetRow}:W${sheetRow}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [['Yes', row[21] || 'No', confirmationDate]],
          },
        })

        sent++
      } catch (emailError) {
        console.error(`Failed to send confirmation for row ${index + 2}:`, emailError)
        failed++
      }
    }

    return NextResponse.json({
      sent,
      failed,
      message: `Confirmation emails sent: ${sent}, failed: ${failed}`,
    })
  } catch (error) {
    console.error('Send confirmations error:', error)
    return NextResponse.json(
      { error: 'Failed to send confirmation emails' },
      { status: 500 }
    )
  }
}
