import { NextRequest, NextResponse } from 'next/server'
import { getSheetsClient } from '@/lib/google'
import { formatRegistrationDate, generateRegistrationId } from '@/lib/utils'

const phoneRegex = /^[+]?[0-9\s-]{10,15}$/
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const utrRegex = /^[a-zA-Z0-9]{8,}$/

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
      utrNumber,
      screenshotUrl,
    } = body

    if (!player1Name || !player1Phone || !player1SkillLevel || !category || !city || !utrNumber || !screenshotUrl) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!phoneRegex.test(player1Phone)) {
      return NextResponse.json({ error: 'Invalid Player 1 phone number' }, { status: 400 })
    }

    if (player1Email && !emailRegex.test(player1Email)) {
      return NextResponse.json({ error: 'Invalid Player 1 email' }, { status: 400 })
    }

    if (!utrRegex.test(utrNumber)) {
      return NextResponse.json({ error: 'Invalid UTR number' }, { status: 400 })
    }

    if (isDoublesCategory(category)) {
      if (!player2Name || !player2Phone || !player2SkillLevel) {
        return NextResponse.json({ error: 'Missing required Player 2 fields' }, { status: 400 })
      }

      if (!phoneRegex.test(player2Phone)) {
        return NextResponse.json({ error: 'Invalid Player 2 phone number' }, { status: 400 })
      }

      if (player2Email && !emailRegex.test(player2Email)) {
        return NextResponse.json({ error: 'Invalid Player 2 email' }, { status: 400 })
      }
    }

    const registrationId = generateRegistrationId()
    const registrationDate = formatRegistrationDate()
    const sheets = getSheetsClient()
    const sheetTabName = process.env.GOOGLE_SHEET_TAB_NAME || 'Registrations'

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
      'Pending Verification',
      '',
      utrNumber || '',
      screenshotUrl || '',
      'Unverified',
      '',
    ]

    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: `${sheetTabName}!A:T`,
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [row] },
    })

    if (process.env.RESEND_API_KEY && player1Email) {
      try {
        const { Resend } = await import('resend')
        const resend = new Resend(process.env.RESEND_API_KEY)

        await resend.emails.send({
          from: 'RallyVerse <onboarding@resend.dev>',
          to: player1Email,
          subject: `Registration Confirmed - ${registrationId}`,
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #FF5E00;">You're registered!</h1>
              <p>Hi ${player1Name},</p>
              <p>Your registration for RallyVerse Rally Series #01 has been received.</p>
              <p><strong>Registration ID:</strong> ${registrationId}</p>
              <p><strong>Category:</strong> ${category}</p>
              <p><strong>Payment Status:</strong> Pending Verification</p>
              <p>We'll reach out on WhatsApp within 24 hours with confirmation and next steps.</p>
              <p style="color: #FF5E00; font-weight: bold;">Show up. Play hard. Build something.</p>
              <p>- RallyVerse Team</p>
            </div>
          `,
        })
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
