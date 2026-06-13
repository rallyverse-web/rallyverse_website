import { CURRENT_EVENT, CONTACT, WHATSAPP, ADDRESS_FULL } from '@/lib/config'

export interface FAQItem {
  question: string
  answer: string
}

export const faqs: FAQItem[] = [
  {
    question: 'What is RallyVerse?',
    answer:
      'RallyVerse is a sports growth partner that helps sports communities, organizers, academies, and brands grow through registration infrastructure, payment management, attendance tracking, communication, and community building. We build the systems that help communities grow.',
  },
  {
    question: 'When and where is Rally Series 01 happening?',
    answer:
      `Rally Series 01 will take place on ${CURRENT_EVENT.date} from ${CURRENT_EVENT.time} at ${CURRENT_EVENT.venue}, Bengaluru.`,
  },
  {
    question: 'What categories are available?',
    answer:
      `For Rally Series 01, registrations are open for ${CURRENT_EVENT.categories.join(' and ')}. Only these categories are available for the first event.`,
  },
  {
    question: 'What is the registration fee?',
    answer:
      `The registration fee is \u20B9${CURRENT_EVENT.registrationFee} per team. This includes participation in the tournament, registration handling, payment verification, and participant communication.`,
  },
  {
    question: 'How do I register?',
    answer:
      'Complete the registration form, pay using the QR code or UPI ID provided, upload your payment screenshot, and submit. Once your payment is verified by the organizer, you\u2019ll receive a confirmation email.',
  },
  {
    question: 'Why do I need to send a payment screenshot?',
    answer:
      'Payment screenshots help organizers verify registrations quickly and accurately. Upload your screenshot during registration and the organizer will verify it through the admin dashboard.',
  },
  {
    question: 'Will both players receive confirmation emails?',
    answer:
      'Yes. For doubles registrations, confirmation emails are sent to both players using the email addresses provided during registration.',
  },
  {
    question: 'How will I receive tournament updates?',
    answer:
      'All updates will be shared through the official RallyVerse WhatsApp Community. This includes match schedules, event announcements, important updates, and future RallyVerse events.',
  },
  {
    question: 'Do I need to join the WhatsApp Community?',
    answer:
      'Yes, we strongly recommend joining. The WhatsApp Community is the primary channel for tournament communication and announcements.',
  },
  {
    question: 'What skill levels can participate?',
    answer:
      'Players of all skill levels are welcome. Whether you\u2019re a recreational player or a competitive player, RallyVerse is designed to create a great experience for everyone.',
  },
  {
    question: 'Can I edit my registration after submitting it?',
    answer:
      'If you need to make changes to your registration, contact the RallyVerse team on WhatsApp and we\u2019ll assist you.',
  },
  {
    question: 'How can I contact RallyVerse?',
    answer:
      `Email: ${CONTACT.email}  |  WhatsApp: ${WHATSAPP.businessNumber}  |  Location: ${ADDRESS_FULL}`,
  },
  {
    question: 'How can sports event marketing help increase tournament participation?',
    answer:
      'Sports event marketing helps tournament organisers reach the right participants through community-driven promotion, targeted outreach, and visibility across relevant channels. RallyVerse combines registration infrastructure with sports event marketing support to help organizers attract more players and fill event capacity.',
  },
  {
    question: 'What does a sports marketing partner do for tournaments?',
    answer:
      'A sports marketing partner helps tournament organisers with participant outreach, event visibility, and community engagement. RallyVerse acts as a sports marketing partner by promoting events through its active player community, WhatsApp network, and digital channels — alongside providing the registration and payment infrastructure needed to manage participation.',
  },
  {
    question: 'How does RallyVerse support badminton tournament organisers?',
    answer:
      'RallyVerse supports badminton tournament organisers with online registration systems, UPI and QR code payment collection, payment screenshot verification, attendance check-in, and participant communication tools. We also provide sports event marketing support to help badminton tournament organisers reach players through community channels and event promotion.',
  },
  {
    question: 'What tools do sports event organisers need to manage registrations and payments?',
    answer:
      'Sports event organisers need online registration forms, approval workflows, payment collection via UPI or QR codes, payment verification, participant management, and communication tools. RallyVerse provides all of these through a single Event Admin Dashboard, along with attendance tracking and registration analytics.',
  },
]

