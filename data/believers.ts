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
  },
  {
    name: 'Dr. Anirudh Sen',
    headline: 'Sports Scientist & Consultant',
    quote: '"Community-led sports programs create generational impact."',
    description:
      'Anirudh advises RallyVerse on developing community athlete engagement frameworks, ensuring our tournaments and leagues are physically accessible, competitive, and operationally sound.',
    context: 'Advising on tournament formats and player well-being.',
    image: '',
    linkedin: 'https://www.linkedin.com/',
    category: 'early-supporters'
  },
  {
    name: 'Vikram Malhotra',
    headline: 'Director of Brand Marketing, Peak Performance Gear',
    quote: '"RallyVerse connects brands to high-intent, active communities directly."',
    description:
      'Partnering with RallyVerse allowed us to reach over 1,500 active runners and badminton players during their weekend leagues. Their community-first activation delivered a 4x engagement rate compared to standard channels.',
    context: 'Sponsorship and Brand Activation Partner',
    image: '',
    linkedin: 'https://www.linkedin.com/',
    category: 'partner-feedback'
  },
  {
    name: 'Sneha Reddy',
    headline: 'HR Lead, Apex Technologies',
    quote: '"Corporate wellness redefined through structured leagues."',
    description:
      'RallyVerse managed our annual corporate games, organizing brackets across multiple campuses. The team handled everything from live scoreboards to scheduling, boosting employee participation by 65%.',
    context: 'Corporate Wellness Partner',
    image: '',
    linkedin: 'https://www.linkedin.com/',
    category: 'partner-feedback'
  },
  {
    name: 'Rahul Nair',
    headline: 'Club Captain, Smashers Badminton Club',
    quote: '"Real-time updates, solid matches, and an incredible community."',
    description:
      'I\'ve participated in three Rally Series tournaments. The match sequencing, tournament organization, and post-match analytics are unlike anything else in local amateur sports. You feel like a pro.',
    context: 'Active Club Member and Competitive Player',
    image: '',
    linkedin: 'https://www.linkedin.com/',
    category: 'community-feedback'
  },
  {
    name: 'Priya Rao',
    headline: 'Volunteer Lead & Amateur Runner',
    quote: '"RallyVerse builds spaces where everyone belongs."',
    description:
      'Volunteering with RallyVerse for the Bengaluru Midnight Run opened up networking opportunities and gave me operational experience. The team makes sure volunteers and players are treated like family.',
    context: 'Volunteer Coordinator and Runner',
    image: '',
    linkedin: 'https://www.linkedin.com/',
    category: 'community-feedback'
  },
  {
    name: 'Karan Sharma',
    headline: 'Founder, Ace Badminton Academy',
    quote: '"Operational logistics and registrations handled flawlessly."',
    description:
      'Running an academy means focusing on coaching, not ticketing or scheduling. RallyVerse took over our event management, bringing in 200+ registrations and managing tournament operations end-to-end.',
    context: 'Academy Owner and Event Organizer',
    image: '',
    linkedin: 'https://www.linkedin.com/',
    category: 'organizer-feedback'
  },
  {
    name: 'Meera Deshmukh',
    headline: 'Secretary, Green Glen Sports Club',
    quote: '"Reduced tournament check-in queues by 80%."',
    description:
      'Their digital check-in tools and bracket generation saved our volunteers hours of manual coordination. We received rave reviews from participants about the tournament\'s speed and professionalism.',
    context: 'Community Venue Owner',
    image: '',
    linkedin: 'https://www.linkedin.com/',
    category: 'organizer-feedback'
  },
  {
    name: 'Bengaluru Badminton League',
    headline: 'Regional League Series (2025)',
    quote: '"From 40 players to a city-wide competitive circuit."',
    description:
      'By partnering with local academies and utilizing RallyVerse\'s growth engine, the Bengaluru Badminton League expanded to 4 zones, secured corporate sponsorships, and reached over 800 active members.',
    context: 'League Scale-up Highlight',
    image: '',
    linkedin: 'https://www.linkedin.com/',
    category: 'success-stories'
  },
  {
    name: 'Tech Corridor Run',
    headline: 'Charity Community Marathon (2025)',
    quote: '"Mobilizing communities for a cause."',
    description:
      'A localized running event that leveraged RallyVerse\'s outreach channels to coordinate 500+ participants, raising funds for municipal park rejuvenation while establishing a monthly running club.',
    context: 'Community Impact Event',
    image: '',
    linkedin: 'https://www.linkedin.com/',
    category: 'success-stories'
  }
]
