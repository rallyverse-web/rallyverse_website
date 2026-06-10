export interface Believer {
  name: string
  headline: string
  quote: string
  description: string
  context: string
  image: string
  linkedin: string
  category: 'early-supporters' | 'partner-feedback' | 'community-feedback' | 'organizer-feedback' | 'success-stories'
}

export const believers: Believer[] = [
  {
    name: 'Nirmal M. Jain',
    headline: 'Co-founder, HappyWise Financial Services',
    quote: '"We rise by lifting others."',
    description:
      'Nirmal believes in the power of communities and meaningful experiences. His encouragement and support align closely with RallyVerse\'s mission of bringing people together through sport and shared experiences.',
    context: 'Supporting the RallyVerse vision from the early stages.',
    image: '/profile_pics/nirmal_jian.png',
    linkedin: 'https://www.linkedin.com/in/nirmalmjain/',
    category: 'early-supporters'
  }
]
