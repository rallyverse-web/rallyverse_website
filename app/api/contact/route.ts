import { NextRequest, NextResponse } from 'next/server'
import { sendEmail } from '@/lib/resend-service'
import { EMAIL, CONTACT } from '@/lib/config'
import { getSupabaseServerClient } from '@/lib/supabase/server'
import { checkRateLimit, getRateLimitKey } from '@/lib/rate-limiter'

export async function POST(req: NextRequest) {
  try {
    const rateKey = getRateLimitKey(req)
    if (!checkRateLimit(rateKey, 3, 60_000)) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      )
    }

    const body = await req.json()
    const { name, organization, email, phone, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Insert into Supabase contact_submissions table
    const supabase = await getSupabaseServerClient()
    const { error: dbError } = await supabase.from('contact_submissions').insert({
      name,
      organization: organization || null,
      email,
      phone: phone || null,
      message,
    })

    if (dbError) {
      console.error('Failed to save contact submission to database:', dbError.message)
      return NextResponse.json(
        { error: 'Failed to submit message. Please try again or contact us directly.' },
        { status: 500 }
      )
    }

    // Compose HTML email for notification
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #FF5E00; margin-top: 0;">New Contact Form Message</h2>
        <p>A visitor has submitted the contact form on RallyVerse.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 150px;">Name:</td>
            <td style="padding: 8px 0;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Organization:</td>
            <td style="padding: 8px 0;">${organization || 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Email:</td>
            <td style="padding: 8px 0;"><a href="mailto:${email}">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Phone:</td>
            <td style="padding: 8px 0;">${phone ? `<a href="tel:${phone}">${phone}</a>` : 'N/A'}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message:</td>
            <td style="padding: 8px 0; white-space: pre-wrap;">${message}</td>
          </tr>
        </table>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">This email was automatically generated from the RallyVerse Website.</p>
      </div>
    `

    // Send email to admin
    const emailResult = await sendEmail({
      from: EMAIL.secondaryFrom || 'RallyVerse <hello@rallyverse.social>',
      to: CONTACT.email || 'hello@rallyverse.social',
      subject: `New Contact Submission - ${name}`,
      html: emailHtml,
      replyTo: email,
    })

    if (!emailResult.success) {
      console.error('Failed to send contact notification email:', emailResult.error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact submission error:', error)
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 })
  }
}
