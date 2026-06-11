import { CURRENT_EVENT, CONTACT, WHATSAPP, ADDRESS_FULL } from '@/lib/config'

export interface FAQItem {
  question: string
  answer: string
}

export const faqs: FAQItem[] = [
  {
    question: 'What is RallyVerse?',
    answer:
      'RallyVerse is a sports growth partner that helps sports communities, organizers, academies, and brands grow through registration infrastructure, community building, communication, and sports marketing. We build the systems that help communities grow.',
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
      `The registration fee is \u20B9${CURRENT_EVENT.registrationFee} per team. This includes participation in the tournament and the registration workflow.`,
  },
  {
    question: 'How do I register?',
    answer:
      'Complete the registration form. Pay \u20B9799 using the QR code provided. Enter your payment details. Submit the form. Send your payment screenshot on WhatsApp for verification. Once verified, you\u2019ll receive a confirmation email.',
  },
  {
    question: 'Why do I need to send a payment screenshot?',
    answer:
      'Payment screenshots help us verify registrations quickly and accurately. After registering, send your screenshot to the official RallyVerse WhatsApp Business account.',
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
]

