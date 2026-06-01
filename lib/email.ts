import { SITE, CONTACT, EMAIL } from './config'

const LOGO_URL = `${SITE.domain}/logo/logo_transparent.png`

// ─── Brand colors ─────────────────────────────────────────────
const COLORS = {
  bg: '#0B0D10',
  surface: '#12151A',
  border: 'rgba(255,255,255,0.08)',
  text: '#FFFFFF',
  textMuted: '#A0A0A0',
  accent: '#FF5E00',
  accentGradient: 'linear-gradient(135deg, #FF5E00, #FF8C00)',
}

// ─── Shared inline styles ────────────────────────────────────
const STYLES = {
  body: `font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:${COLORS.bg};color:${COLORS.text};margin:0;padding:0;`,
  container: `max-width:560px;margin:0 auto;padding:32px 24px;`,
  header: `text-align:center;padding:32px 0 24px;border-bottom:1px solid ${COLORS.border};`,
  content: `padding:32px 0;line-height:1.7;font-size:15px;color:${COLORS.textMuted};`,
  heading: `font-size:22px;font-weight:700;color:${COLORS.text};margin:0 0 8px;`,
  label: `font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:1px;color:${COLORS.textMuted};margin:0 0 4px;`,
  value: `font-size:16px;font-weight:600;color:${COLORS.text};margin:0 0 16px;`,
  button: `display:inline-block;background:${COLORS.accentGradient};color:#FFFFFF;font-weight:700;padding:14px 32px;border-radius:6px;text-decoration:none;font-size:15px;`,
  divider: `height:1px;background:${COLORS.border};border:none;margin:24px 0;`,
  footer: `text-align:center;padding:24px 0;border-top:1px solid ${COLORS.border};`,
  footerText: `font-size:13px;color:${COLORS.textMuted};margin:4px 0;`,
  footerLink: `color:${COLORS.accent};text-decoration:none;`,
}

// ─── Email footer (appended to every email) ────────────────────
function emailFooter(): string {
  return `
    <div style="${STYLES.footer}">
      <p style="${STYLES.footerText}"><strong style="color:${COLORS.text};">${SITE.name}</strong></p>
      <p style="${STYLES.footerText}">
        <a href="${SITE.domain}" style="${STYLES.footerLink}">${SITE.domain}</a>
      </p>
      <p style="${STYLES.footerText}">
        Phone: <a href="${CONTACT.whatsappUrl}" style="${STYLES.footerLink}">${CONTACT.phone}</a>
      </p>
      <p style="${STYLES.footerText}">
        Email: <a href="mailto:${EMAIL.supportEmail}" style="${STYLES.footerLink}">${EMAIL.supportEmail}</a>
      </p>
      <p style="font-size:11px;color:${COLORS.textMuted};margin-top:12px;">
        &copy; ${new Date().getFullYear()} ${SITE.name}. All rights reserved.
      </p>
    </div>`
}

// ─── Base HTML wrapper ────────────────────────────────────────
function baseHtml(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="${STYLES.body}">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${COLORS.bg};">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="${STYLES.container}">

        <!-- Header -->
        <tr><td style="${STYLES.header}">
          <img src="${LOGO_URL}" alt="RallyVerse" width="200" height="54" style="display:block;max-width:200px;height:auto;margin:0 auto;outline:none;border:none;" />
          <p style="font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${COLORS.textMuted};margin:6px 0 0;">
            Rally Beyond Routine
          </p>
        </td></tr>

        <!-- Content -->
        <tr><td style="${STYLES.content}">
          ${content}
        </td></tr>

        <!-- Footer -->
        <tr><td>${emailFooter()}</td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`
}

// ─── Registration Received ────────────────────────────────────
export function registrationReceivedEmail(params: {
  playerName: string
  registrationId: string
  category: string
  whatsappNumber: string
  whatsappGroupLink: string
  entryFee: string
}): { subject: string; html: string } {
  const { playerName, registrationId, category, whatsappNumber, whatsappGroupLink, entryFee } = params

  const content = `
    <h1 style="${STYLES.heading}">Registration Received</h1>
    <p>Hi ${playerName},</p>
    <p>Thank you for registering for the RallyVerse Badminton Tournament. We have successfully received your registration details.</p>

    <hr style="${STYLES.divider}" />

    <p style="${STYLES.label}">Registration ID</p>
    <p style="${STYLES.value}">${registrationId}</p>

    <p style="${STYLES.label}">Event</p>
    <p style="${STYLES.value}">Rally Series 01 — Badminton Tournament</p>

    <p style="${STYLES.label}">Category</p>
    <p style="${STYLES.value}">${category}</p>

    <p style="${STYLES.label}">Entry Fee</p>
    <p style="${STYLES.value}">&#8377;${entryFee}</p>

    <p style="${STYLES.label}">Status</p>
    <p style="${STYLES.value}">Pending Verification</p>

    <hr style="${STYLES.divider}" />

    <p>Our team will verify your payment and confirm your registration shortly.</p>

    <p><strong>Send your payment screenshot on WhatsApp:</strong></p>
    <p style="text-align:center;margin:24px 0;">
      <a href="https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}" style="${STYLES.button}">
        Send Payment Screenshot
      </a>
    </p>

    <p>Join the official tournament WhatsApp group for schedules, announcements, and event updates:</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${whatsappGroupLink}" style="${STYLES.button}">
        Join WhatsApp Group
      </a>
    </p>

    <p>If you have any questions, reply to this email or reach out to us at <a href="mailto:${EMAIL.supportEmail}" style="${STYLES.footerLink}">${EMAIL.supportEmail}</a>.</p>

    <p>Thank you for being part of RallyVerse.</p>
    <p style="margin-top:16px;">Regards,<br/><strong style="color:${COLORS.text};">Team RallyVerse</strong></p>
  `

  return {
    subject: `Registration Received — RallyVerse Badminton Tournament (${registrationId})`,
    html: baseHtml(content),
  }
}

// ─── Registration Confirmed ─────────────────────────────────
export function registrationConfirmedEmail(params: {
  playerName: string
  registrationId: string
  category: string
  whatsappGroupLink: string
}): { subject: string; html: string } {
  const { playerName, registrationId, category, whatsappGroupLink } = params

  const content = `
    <h1 style="${STYLES.heading}">Registration Confirmed</h1>
    <p>Hi ${playerName},</p>
    <p>Great news! Your registration for the <strong style="color:${COLORS.text};">Rally Series 01 — Badminton Tournament</strong> has been <strong style="color:${COLORS.accent};">verified and confirmed</strong>.</p>

    <hr style="${STYLES.divider}" />

    <p style="${STYLES.label}">Registration ID</p>
    <p style="${STYLES.value}">${registrationId}</p>

    <p style="${STYLES.label}">Category</p>
    <p style="${STYLES.value}">${category}</p>

    <p style="${STYLES.label}">Status</p>
    <p style="${STYLES.value}" style="color:${COLORS.accent};">Confirmed</p>

    <hr style="${STYLES.divider}" />

    <p><strong>What's next?</strong></p>
    <p>Please join the official WhatsApp group for match schedules, announcements, and event updates:</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${whatsappGroupLink}" style="${STYLES.button}">
        Join WhatsApp Group
      </a>
    </p>

    <p><strong>On event day:</strong></p>
    <p style="margin:0;">• Report to the venue 30 minutes before your scheduled match.</p>
    <p style="margin:0;">• Carry a valid ID proof for verification.</p>
    <p style="margin:0;">• Bring your own racket and water bottle.</p>

    <hr style="${STYLES.divider}" />

    <p>Need help? Email <a href="mailto:${EMAIL.supportEmail}" style="${STYLES.footerLink}">${EMAIL.supportEmail}</a>.</p>
    <p>We look forward to seeing you on the court.</p>
    <p style="margin-top:16px;">Regards,<br/><strong style="color:${COLORS.text};">Team RallyVerse</strong></p>
  `

  return {
    subject: `Registration Confirmed — RallyVerse Badminton Tournament (${registrationId})`,
    html: baseHtml(content),
  }
}

// ─── Verification Complete (payment verified, awaiting confirmation) ─
export function verificationCompleteEmail(params: {
  playerName: string
  registrationId: string
  category: string
  whatsappGroupLink: string
}): { subject: string; html: string } {
  const { playerName, registrationId, category, whatsappGroupLink } = params

  const content = `
    <h1 style="${STYLES.heading}">Payment Verified</h1>
    <p>Hi ${playerName},</p>
    <p>Your payment for <strong style="color:${COLORS.text};">Rally Series 01 — Badminton Tournament</strong> has been <strong style="color:${COLORS.accent};">verified successfully</strong>.</p>

    <hr style="${STYLES.divider}" />

    <p style="${STYLES.label}">Registration ID</p>
    <p style="${STYLES.value}">${registrationId}</p>

    <p style="${STYLES.label}">Category</p>
    <p style="${STYLES.value}">${category}</p>

    <p style="${STYLES.label}">Payment Status</p>
    <p style="${STYLES.value}">Paid ✓</p>

    <hr style="${STYLES.divider}" />

    <p>You will receive a confirmation email shortly once your registration is fully approved.</p>
    <p>Meanwhile, join the official WhatsApp group for match schedules and updates:</p>
    <p style="text-align:center;margin:24px 0;">
      <a href="${whatsappGroupLink}" style="${STYLES.button}">
        Join WhatsApp Group
      </a>
    </p>

    <hr style="${STYLES.divider}" />

    <p>Need help? Email <a href="mailto:${EMAIL.supportEmail}" style="${STYLES.footerLink}">${EMAIL.supportEmail}</a>.</p>
    <p style="margin-top:16px;">Regards,<br/><strong style="color:${COLORS.text};">Team RallyVerse</strong></p>
  `

  return {
    subject: `Payment Verified — RallyVerse Badminton Tournament (${registrationId})`,
    html: baseHtml(content),
  }
}

// ─── Action Required / Rejection ──────────────────────────────
export function actionRequiredEmail(params: {
  playerName: string
  registrationId: string
  reason: string
  nextSteps: string
}): { subject: string; html: string } {
  const { playerName, registrationId, reason, nextSteps } = params

  const content = `
    <h1 style="${STYLES.heading}">Action Required</h1>
    <p>Hi ${playerName},</p>
    <p>There is an issue with your registration for the <strong style="color:${COLORS.text};">Rally Series 01 — Badminton Tournament</strong> that needs your attention.</p>

    <hr style="${STYLES.divider}" />

    <p style="${STYLES.label}">Registration ID</p>
    <p style="${STYLES.value}">${registrationId}</p>

    <p style="${STYLES.label}">Reason</p>
    <p style="color:${COLORS.text};font-size:15px;margin:0 0 16px;">${reason}</p>

    <hr style="${STYLES.divider}" />

    <p><strong>Next Steps:</strong></p>
    <p>${nextSteps}</p>

    <p style="text-align:center;margin:24px 0;">
      <a href="${SITE.domain}/register" style="${STYLES.button}">
        Register Again
      </a>
    </p>

    <hr style="${STYLES.divider}" />

    <p>If you have any questions, reply to this email or reach out to us at <a href="mailto:${EMAIL.supportEmail}" style="${STYLES.footerLink}">${EMAIL.supportEmail}</a>.</p>
    <p style="margin-top:16px;">Regards,<br/><strong style="color:${COLORS.text};">Team RallyVerse</strong></p>
  `

  return {
    subject: `Action Required — RallyVerse Registration (${registrationId})`,
    html: baseHtml(content),
  }
}
