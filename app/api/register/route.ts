import { NextRequest, NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/google'
import { formatRegistrationDate, generateRegistrationId } from '@/lib/utils'
import { CONTACT, EMAIL, WHATSAPP, CURRENT_EVENT } from '@/lib/config'
import { registrationReceivedEmail } from '@/lib/email'

const phoneRegex = /^[+]?[0-9\s-]{10,15}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/

function isDoublesCategory(category: string) {
  return category.includes('Doubles')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const {
      category,
      teamName,
      player1Name,
      player1Phone,
      player1Email,
      player1SkillLevel,
      player2Name,
      player2Phone,
      player2Email,
      player2SkillLevel,
      city,
      collegeOrOrg,
      upiId,
      paymentPhone,
    } = body

    if (!player1Name || !player1Phone || !player1Email || !player1SkillLevel || !category || !city || !upiId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!phoneRegex.test(player1Phone)) {
      return NextResponse.json({ error: 'Invalid Player 1 phone number' }, { status: 400 })
    }

    if (!emailRegex.test(player1Email)) {
      return NextResponse.json({ error: 'Invalid Player 1 email' }, { status: 400 })
    }

    if (!upiRegex.test(upiId)) {
      return NextResponse.json({ error: 'Invalid UPI ID' }, { status: 400 })
    }

    if (!paymentPhone || !phoneRegex.test(paymentPhone)) {
      return NextResponse.json({ error: 'Invalid payment phone number' }, { status: 400 })
    }

    if (isDoublesCategory(category)) {
      if (!player2Name || !player2Phone || !player2SkillLevel) {
        return NextResponse.json({ error: 'Missing required Player 2 fields' }, { status: 400 })
      }

      if (!phoneRegex.test(player2Phone)) {
        return NextResponse.json({ error: 'Invalid Player 2 phone number' }, { status: 400 })
      }

      if (!player2Email || !emailRegex.test(player2Email)) {
        return NextResponse.json({ error: 'Invalid Player 2 email' }, { status: 400 })
      }
    }

    const registrationId = generateRegistrationId()
    const registrationDate = formatRegistrationDate()
    const sheets = getSheetsClient()
    const sheetTabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Registrations'

    const entryFee = process.env.NEXT_PUBLIC_ENTRY_FEE || String(CURRENT_EVENT.registrationFee)

    const row = [
      registrationId,
      registrationDate,
      category,
      teamName || '',
      player1Name,
      player1Phone,
      player1Email || '',
      player1SkillLevel,
      player2Name || '',
      player2Phone || '',
      player2Email || '',
      player2SkillLevel || '',
      city,
      collegeOrOrg || '',
      entryFee,
      upiId || '',
      paymentPhone,
      '',
      'Pending',
      'Pending',
      'No',
      'No',
      '',
      '',
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheetTabName}!A:X`,
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: { values: [row] },
    })

    if (process.env.RESEND_API_KEY && player1Email) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        const fee = process.env.NEXT_PUBLIC_ENTRY_FEE || String(CURRENT_EVENT.registrationFee)

        const { subject, html } = registrationReceivedEmail({
          playerName: player1Name,
          registrationId,
          category,
          businessWhatsappLink: WHATSAPP.businessLink,
          communityWhatsappLink: WHATSAPP.communityLink,
          entryFee: fee,
        })

        await resend.emails.send({
          from: EMAIL.from,
          replyTo: EMAIL.replyTo,
          to: player1Email,
          subject,
          html,
        })

        console.log(`[register] Registration received email sent to player 1: ${player1Email} (${registrationId})`)

        // Send to player 2 for doubles categories
        if (isDoublesCategory(category) && player2Email) {
          const { subject: subject2, html: html2 } = registrationReceivedEmail({
            playerName: player2Name || 'Teammate',
            registrationId,
            category,
            businessWhatsappLink: WHATSAPP.businessLink,
            communityWhatsappLink: WHATSAPP.communityLink,
            entryFee: fee,
          })

          await resend.emails.send({
            from: EMAIL.from,
            replyTo: EMAIL.replyTo,
            to: player2Email,
            subject: subject2,
            html: html2,
          })

          console.log(`[register] Registration received email sent to player 2: ${player2Email} (${registrationId})`)
        }
      } catch (emailError) {
        console.error('Email send failed (non-blocking):', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      registrationId,
      message: 'Registration successful',
    })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: 'Registration failed. Please try again.' },
      { status: 500 }
    )
  }
}
