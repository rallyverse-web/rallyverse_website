import type { Metadata } from 'next'
import { EMAIL } from '@/lib/config'

export const metadata: Metadata = {
  title: 'Terms & Conditions — RallyVerse',
  description: 'RallyVerse Terms & Conditions. Understand the rules for registration, event participation, payments, refunds, and code of conduct.',
}

const sections = [
  {
    title: 'Registration Terms',
    content:
      'By registering for a RallyVerse event, you confirm that all information provided is accurate and complete. Registration is personal and non-transferable unless explicitly stated otherwise. RallyVerse reserves the right to cancel or modify registrations at its discretion. Participants must be of appropriate age and fitness level for the event they register for.',
  },
  {
    title: 'Event Participation',
    content:
      'Participation in all RallyVerse events is voluntary and at your own risk. You agree to follow all instructions provided by event organizers, staff, and volunteers. RallyVerse reserves the right to refuse participation or remove any participant who violates event rules, displays unsportsmanlike conduct, or poses a safety risk to themselves or others.',
  },
  {
    title: 'Payment Terms',
    content:
      'All registration fees must be paid in full at the time of registration unless otherwise specified. Fees are quoted in Indian Rupees (INR) and are inclusive of applicable taxes. Payment must be completed through the specified payment methods to confirm your spot. Unpaid registrations will not be processed.',
  },
  {
    title: 'Refund Policy',
    content:
      'Registration fees are non-refundable unless the event is cancelled by RallyVerse. In the event of a cancellation by RallyVerse, registered participants will be offered a full refund or the option to transfer their registration to a future event. If you are unable to attend after registering, you may request to transfer your spot to a future RallyVerse event, subject to availability and at RallyVerse\'s discretion.',
  },
  {
    title: 'Liability Disclaimer',
    content:
      'RallyVerse events involve physical activity and inherent risks including but not limited to injury, property damage, or other losses. By participating, you acknowledge these risks and agree that RallyVerse, its organizers, volunteers, sponsors, and affiliates are not liable for any injury, loss, or damage sustained during or in connection with any event. Participants are strongly encouraged to carry their own personal accident and health insurance.',
  },
  {
    title: 'Code of Conduct',
    content:
      'All participants are expected to conduct themselves with respect, integrity, and sportsmanship. Harassment, discrimination, abuse (verbal or physical), unsportsmanlike behaviour, or any action that disrupts the event experience for others will not be tolerated. RallyVerse is committed to creating a safe, inclusive, and welcoming environment for everyone.',
  },
  {
    title: 'Media and Photography',
    content:
      'RallyVerse may capture photographs and videos during events for promotional and archival purposes. By participating, you grant RallyVerse a non-exclusive, royalty-free license to use your likeness in such media. If you do not wish to be photographed or recorded, please inform event staff before the event begins.',
  },
  {
    title: 'Changes to Events',
    content:
      'RallyVerse reserves the right to modify event dates, venues, schedules, formats, or any other aspect of an event as necessary. In such cases, registered participants will be notified as early as possible via email or WhatsApp.',
  },
  {
    title: 'Intellectual Property',
    content:
      'The RallyVerse name, logo, branding, and all related content are the intellectual property of RallyVerse. You may not use, reproduce, or distribute any RallyVerse intellectual property without prior written consent.',
  },
  {
    title: 'Governing Law',
    content:
      'These terms and conditions are governed by and construed in accordance with the laws of India. Any disputes arising from these terms or from participation in RallyVerse events shall be subject to the exclusive jurisdiction of the courts in Bengaluru, Karnataka.',
  },
  {
    title: 'Changes to Terms',
    content:
      'RallyVerse reserves the right to update or modify these Terms & Conditions at any time without prior notice. Continued participation in events or use of our services after any changes constitutes acceptance of the new terms.',
  },
  {
    title: 'Contact',
    content:
      `If you have any questions about these Terms & Conditions, please contact us at ${EMAIL.supportEmail}.`,
  },
]

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-28 pb-20" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="mx-auto max-w-[800px] px-6">
        {/* ── Header ───────────────────────────────────────── */}
        <div className="mb-12">
          <h1 className="font-display text-[32px] leading-none uppercase sm:text-[44px] md:text-[64px]" style={{ color: 'var(--text-primary)' }}>
            TERMS &amp; CONDITIONS
          </h1>
          <p className="mt-4 font-body text-sm" style={{ color: 'var(--text-muted)' }}>
            Last updated: June 2026
          </p>
          <p className="mt-6 font-body text-base leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            Please read these Terms &amp; Conditions carefully before registering for any RallyVerse event or using our website. By registering or participating, you agree to be bound by these terms.
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
