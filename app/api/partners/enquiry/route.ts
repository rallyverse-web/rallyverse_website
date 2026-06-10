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
    const { name, organization, email, phone, organization_type, services_interested, message } = body

    if (!name || !email || !phone || !organization_type || !services_interested || services_interested.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Try inserting into Supabase (fallback gracefully if table doesn't exist)
    try {
      const supabase = await getSupabaseServerClient()
      const { error } = await supabase.from('partner_enquiries').insert({
        name,
        organization: organization || null,
        email,
        phone,
        organization_type,
        services_interested,
        message: message || null,
      })
      if (error) {
        console.warn('Could not insert to partner_enquiries table (table might not exist):', error.message)
      }
    } catch (dbErr) {
      console.warn('Database error while saving partner enquiry:', dbErr)
    }

    // Compose HTML email
    const servicesList = services_interested.join(', ')
    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #FF5E00; margin-top: 0;">New Partnership Enquiry</h2>
        <p>A new B2B partnership form has been submitted on RallyVerse.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0; font-weight: bold; width: 180px;">Name:</td>
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
            <td style="padding: 8px 0;"><a href="tel:${phone}">${phone}</a></td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Organization Type:</td>
            <td style="padding: 8px 0;">${organization_type}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold;">Services Interested In:</td>
            <td style="padding: 8px 0;">${servicesList}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message:</td>
            <td style="padding: 8px 0; white-space: pre-wrap;">${message || 'No message provided.'}</td>
          </tr>
        </table>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #888; text-align: center;">This email was automatically generated from the RallyVerse Website.</p>
      </div>
    `

    // Send email to admin
    const emailResult = await sendEmail({
      from: EMAIL.secondaryFrom || 'RallyVerse <hello@rallyverse.social>',
      to: CONTACT.email || 'rallyverseofficial@gmail.com',
      subject: `New Partnership Enquiry - ${organization || name}`,
      html: emailHtml,
      replyTo: email,
    })

    if (!emailResult.success) {
      console.error('Failed to send partnership enquiry email:', emailResult.error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Partner enquiry error:', error)
    return NextResponse.json({ error: 'Failed to process enquiry' }, { status: 500 })
  }
}
