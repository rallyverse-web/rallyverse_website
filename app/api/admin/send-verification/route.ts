import { NextRequest, NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/google'
import { EMAIL, WHATSAPP } from '@/lib/config'
import { verificationCompleteEmail, getColorPosterAttachment } from '@/lib/email'

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
    const sheetRow = rowIndex + 2
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetTabName}!A${sheetRow}:X${sheetRow}`,
    })

    const row = response.data.values?.[0]
    if (!row) {
      return NextResponse.json({ error: 'Registration not found' }, { status: 404 })
    }

    const player1Name = row[4] || ''
    const player1Email = row[6] || ''
    const player2Name = row[8] || ''
    const player2Email = row[10] || ''
    const registrationId = row[0] || ''
    const category = row[2] || ''
    const isDoubles = category.includes('Doubles')

    if (!player1Email) {
      return NextResponse.json({ error: 'No email address for this registration' }, { status: 400 })
    }

    const { Resend } = await import('resend')
    const resend = new Resend(process.env.RESEND_API_KEY)

    const posterAttachment = getColorPosterAttachment()

    const { subject, html } = verificationCompleteEmail({
      playerName: player1Name,
      registrationId,
      category,
      communityWhatsappLink: WHATSAPP.communityLink,
      businessWhatsappLink: WHATSAPP.businessLink,
    })

    const emailResult = await resend.emails.send({
      from: EMAIL.from,
      replyTo: EMAIL.replyTo,
      to: player1Email,
      subject,
      html,
      attachments: [posterAttachment],
    })

    console.log(`[send-verification] Email sent to ${player1Email} (${registrationId}):`, JSON.stringify(emailResult))

    // Send to player 2 for doubles categories
    if (isDoubles && player2Email) {
      const { subject: subject2, html: html2 } = verificationCompleteEmail({
        playerName: player2Name || 'Teammate',
        registrationId,
        category,
        communityWhatsappLink: WHATSAPP.communityLink,
        businessWhatsappLink: WHATSAPP.businessLink,
      })

      await resend.emails.send({
        from: EMAIL.from,
        replyTo: EMAIL.replyTo,
        to: player2Email,
        subject: subject2,
        html: html2,
        attachments: [posterAttachment],
      })

      console.log(`[send-verification] Email sent to player 2 ${player2Email} (${registrationId})`)
    }

    return NextResponse.json({
      success: true,
      message: `Verification email sent to ${player1Email}${isDoubles && player2Email ? ` and ${player2Email}` : ''}`,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[send-verification] Error:', msg)
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }
}
