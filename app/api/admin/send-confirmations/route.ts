import { NextRequest, NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/google'
import { EMAIL, WHATSAPP } from '@/lib/config'
import { registrationConfirmedEmail, getColorPosterAttachment } from '@/lib/email'

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
    console.error('[send-confirmations] RESEND_API_KEY is not set')
    return NextResponse.json(
      { error: 'Email service is not configured (RESEND_API_KEY missing)' },
      { status: 500 }
    )
  }

  try {
    const sheets = getSheetsClient()
    const spreadsheetId = process.env.GOOGLE_SHEET_ID
    const sheetTabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Sheet1'

    console.log('[send-confirmations] Reading sheet:', sheetTabName)

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${sheetTabName}!A:X`,
    })

    const rows = response.data.values || []
    const dataRows = rows.slice(1)

    console.log(`[send-confirmations] Found ${dataRows.length} registration rows`)

    const toSend: Array<{ index: number; row: string[] }> = []
    dataRows.forEach((row, i) => {
      const verificationStatus = (row[19] || '').trim()
      const confirmationSent = (row[20] || '').trim()
      if (verificationStatus === 'Verified' && confirmationSent === 'No') {
        toSend.push({ index: i, row })
      }
    })

    console.log(`[send-confirmations] Registrations ready to confirm: ${toSend.length}`)

    if (toSend.length === 0) {
      console.log('[send-confirmations] No pending confirmations to send')
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
    const details: string[] = []

    for (const { index, row } of toSend) {
      const sheetRowNum = index + 2
      const player1Name = row[4] || ''
      const player1Email = row[6] || ''
      const player2Name = row[8] || ''
      const player2Email = row[10] || ''
      const category = row[2] || ''
      const registrationId = row[0] || ''

      if (!player1Email) {
        console.warn(`[send-confirmations] Row ${sheetRowNum}: No email for ${player1Name}, skipping`)
        details.push(`Row ${sheetRowNum}: ${player1Name} — no email`)
        failed++
        continue
      }

      const isDoubles = category.includes('Doubles')

      try {
        console.log(`[send-confirmations] Sending to ${player1Email} (${player1Name}) row ${sheetRowNum}`)

        const posterAttachment = getColorPosterAttachment()

        const { subject, html } = registrationConfirmedEmail({
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

        console.log(`[send-confirmations] Email sent to ${player1Email}:`, JSON.stringify(emailResult))

        // Send to player 2 for doubles categories
        if (isDoubles && player2Email) {
          const { subject: subject2, html: html2 } = registrationConfirmedEmail({
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

          console.log(`[send-confirmations] Email sent to player 2 ${player2Email}:`, JSON.stringify(emailResult))
        }

        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `${sheetTabName}!U${sheetRowNum}:W${sheetRowNum}`,
          valueInputOption: 'USER_ENTERED',
          requestBody: {
            values: [['Yes', row[21] || 'No', confirmationDate]],
          },
        })

        console.log(`[send-confirmations] Sheet row ${sheetRowNum} updated (U=Yes, V=${row[21] || 'No'}, W=${confirmationDate})`)
        details.push(`Row ${sheetRowNum}: ${player1Name} ✓`)
        sent++
      } catch (emailError) {
        const errMsg = emailError instanceof Error ? emailError.message : String(emailError)
        console.error(`[send-confirmations] FAILED row ${sheetRowNum} (${player1Email}): ${errMsg}`)
        details.push(`Row ${sheetRowNum}: ${player1Name} ✗ ${errMsg}`)
        failed++
      }
    }

    console.log(`[send-confirmations] Done — sent: ${sent}, failed: ${failed}`)
    return NextResponse.json({
      sent,
      failed,
      message: `Confirmation emails sent: ${sent}, failed: ${failed}`,
      details,
    })
  } catch (error) {
    const errMsg = error instanceof Error ? error.message : String(error)
    console.error('[send-confirmations] Fatal error:', errMsg)
    return NextResponse.json(
      { error: 'Failed to send confirmation emails' },
      { status: 500 }
    )
  }
}
