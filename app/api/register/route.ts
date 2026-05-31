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
      paymentPhone,
    } = body

    if (!player1Name || !player1Phone || !player1Email || !player1SkillLevel || !category || !city || !utrNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!phoneRegex.test(player1Phone)) {
      return NextResponse.json({ error: 'Invalid Player 1 phone number' }, { status: 400 })
    }

    if (!emailRegex.test(player1Email)) {
      return NextResponse.json({ error: 'Invalid Player 1 email' }, { status: 400 })
    }

    if (!utrRegex.test(utrNumber)) {
      return NextResponse.json({ error: 'Invalid UTR number' }, { status: 400 })
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

    const entryFee = process.env.NEXT_PUBLIC_ENTRY_FEE || '800'

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
      utrNumber || '',
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
        const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+91 98765 43210'
        const whatsappGroupLink = process.env.NEXT_PUBLIC_WHATSAPP_GROUP_LINK || 'https://chat.whatsapp.com/REPLACE_WITH_ACTUAL_LINK'

        await resend.emails.send({
          from: 'RallyVerse <onboarding@resend.dev>',
          to: player1Email,
          subject: 'Registration Received \u2013 RallyVerse Badminton Tournament',
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 24px;">
              <p>Hi ${player1Name},</p>
              <p>Thank you for registering for the RallyVerse Badminton Tournament.</p>
              <p>We have successfully received your registration details.</p>
              <p><strong>Registration ID:</strong> ${registrationId}</p>
              <p>Our team will now verify your payment and confirm your registration shortly.</p>
              <p>Please send your payment screenshot on WhatsApp:</p>
              <p style="font-size: 18px; font-weight: bold; color: #FF5E00;">
                <a href="https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}" style="color: #FF5E00; text-decoration: none;">${whatsappNumber}</a>
              </p>
              <p>Join the official tournament WhatsApp group:</p>
              <p style="text-align: center; margin: 28px 0;">
                <a href="${whatsappGroupLink}" style="display: inline-block; background: linear-gradient(135deg, #FF5E00, #FF8C00); color: #FFFFFF; font-weight: bold; padding: 14px 32px; border-radius: 6px; text-decoration: none; font-size: 16px;">Join WhatsApp Group</a>
              </p>
              <p>We'll share match schedules, announcements, and event updates there.</p>
              <p>Thank you for being a part of RallyVerse.</p>
              <p>Regards,<br/>Team RallyVerse</p>
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
