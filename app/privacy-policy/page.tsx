import type { Metadata } from 'next'
import { CONTACT, EMAIL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Privacy Policy — RallyVerse',
  description: 'RallyVerse Privacy Policy. Learn how we collect, use, and protect your personal data.',
}

const sections = [
  {
    title: 'Information We Collect',
    content:
      'When you register for an event on RallyVerse, we collect the following information: your name, email address, phone number, skill level, event category preferences, and team name (if applicable). We also collect payment-related information necessary to process your registration fees.',
  },
  {
    title: 'How We Use Your Information',
    content:
      'We use your information to process your event registration, communicate with you about event updates and schedule changes, send you confirmation and reminder messages, and improve our services. We may also use your email to send you information about future RallyVerse events, but you can opt out at any time.',
  },
  {
    title: 'Registration Data',
    content:
      'Your registration data is stored securely and used solely for the purpose of managing event participation. We retain this data for the duration of the event series and for a reasonable period afterward for record-keeping and analytics purposes.',
  },
  {
    title: 'Email Communication',
    content:
      'We use your email address to send event confirmations, updates, and essential service communications. With your consent, we may also send promotional emails about future events. You can unsubscribe from promotional emails at any time by replying to any email or contacting us directly.',
  },
  {
    title: 'WhatsApp Communication',
    content:
      'By providing your phone number and opting in, you agree to receive WhatsApp messages from RallyVerse regarding event updates, reminders, and community announcements. Your phone number will not be shared with third parties and will only be used for RallyVerse-related communications. You can opt out of WhatsApp communications at any time by messaging us directly.',
  },
  {
    title: 'Payment Information',
    content:
      'Payment transactions are processed through secure third-party payment gateways. RallyVerse does not store complete payment card information on its servers. Payment data is handled in compliance with applicable security standards and is used only for processing your registration fees and handling refunds where applicable.',
  },
  {
    title: 'Data Sharing',
    content:
      'RallyVerse does not sell, trade, or rent your personal information to third parties. We may share necessary data with trusted service providers (such as payment processors and email delivery services) who assist us in operating our platform and events. These providers are bound by confidentiality agreements.',
  },
  {
    title: 'Data Security',
    content:
      'We implement reasonable security measures to protect your personal information from unauthorized access, alteration, disclosure, or destruction. However, no method of electronic storage or transmission is 100% secure, and we cannot guarantee absolute security.',
  },
  {
    title: 'Your Rights',
    content:
      `You have the right to access, update, or delete your personal information held by us at any time. You can request a copy of the data we hold about you, ask us to correct any inaccuracies, or request that we delete your data. To exercise these rights, please contact us at ${CONTACT.email}.`,
  },
  {
    title: 'Changes to This Policy',
    content:
      'We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically.',
  },
  {
    title: 'Contact Us',
    content:
       `If you have any questions about this Privacy Policy or how your data is handled, please contact us at ${EMAIL.supportEmail} or reach out via WhatsApp at ${CONTACT.phone}.`,
  },
]

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-[800px] px-6">
        {/* ── Header ───────────────────────────────────────── */}
        <div className="mb-12">
          <h1 className="font-display text-[32px] leading-none uppercase sm:text-[44px] md:text-[64px]" style={{ color: 'var(--text-primary)' }}>
            PRIVACY POLICY
          </h1>
          <p className="mt-4 font-body text-sm" style={{ color: 'var(--text-muted)' }}>
            Last updated: June 2026
          </p>
          <p className="mt-6 font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            At RallyVerse, we take your privacy seriously. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.
          </p>
        </div>

        {/* ── Sections ──────────────────────────────────────── */}
        <div className="space-y-10">
          {sections.map((section) => (
            <div key={section.title}>
              <h2 className="font-display text-[20px] uppercase sm:text-[24px] mb-3" style={{ color: 'var(--text-primary)' }}>
                {section.title}
              </h2>
              <p className="font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
