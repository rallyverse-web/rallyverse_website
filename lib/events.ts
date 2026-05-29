export type Category = 'badminton' | 'trek' | 'marathon' | 'cycling'

export interface RallyEvent {
  id: number
  title: string
  category: Category
  location: string
  date: string
  registered: number
  capacity: number
  rallyPoints: number
  image: string
}

export const events: RallyEvent[] = [
  {
    id: 1,
    title: 'Nandi Hills Sunrise Trek',
    category: 'trek',
    location: 'Nandi Hills, Karnataka',
    date: 'Jun 14, 2026',
    registered: 47,
    capacity: 60,
    rallyPoints: 150,
    image: 'https://picsum.photos/seed/nandihills/640/360',
  },
  {
    id: 2,
    title: 'Bengaluru Half Marathon',
    category: 'marathon',
    location: 'Cubbon Park, Bengaluru',
    date: 'Jun 28, 2026',
    registered: 512,
    capacity: 600,
    rallyPoints: 300,
    image: 'https://picsum.photos/seed/blrmarathon/640/360',
  },
  {
    id: 3,
    title: 'Western Ghats Cycle Rally',
    category: 'cycling',
    location: 'Coorg, Karnataka',
    date: 'Jul 05, 2026',
    registered: 88,
    capacity: 120,
    rallyPoints: 220,
    image: 'https://picsum.photos/seed/coorgcycle/640/360',
  },
  {
    id: 4,
    title: 'Smash Cup Badminton Open',
    category: 'badminton',
    location: 'Indiranagar, Bengaluru',
    date: 'Jul 12, 2026',
    registered: 58,
    capacity: 64,
    rallyPoints: 180,
    image: 'https://picsum.photos/seed/smashcup/640/360',
  },
  {
    id: 5,
    title: 'Sahyadri Monsoon Trek',
    category: 'trek',
    location: 'Lonavala, Maharashtra',
    date: 'Jul 19, 2026',
    registered: 33,
    capacity: 50,
    rallyPoints: 160,
    image: 'https://picsum.photos/seed/sahyadri/640/360',
  },
  {
    id: 6,
    title: 'Mumbai Coastal 10K',
    category: 'marathon',
    location: 'Marine Drive, Mumbai',
    date: 'Aug 02, 2026',
    registered: 240,
    capacity: 400,
    rallyPoints: 200,
    image: 'https://picsum.photos/seed/mumbai10k/640/360',
  },
  {
    id: 7,
    title: 'Hyderabad Night Ride',
    category: 'cycling',
    location: 'Hussain Sagar, Hyderabad',
    date: 'Aug 09, 2026',
    registered: 145,
    capacity: 150,
    rallyPoints: 190,
    image: 'https://picsum.photos/seed/hydnight/640/360',
  },
  {
    id: 8,
    title: 'Rally Shuttle Doubles',
    category: 'badminton',
    location: 'Koramangala, Bengaluru',
    date: 'Aug 16, 2026',
    registered: 41,
    capacity: 48,
    rallyPoints: 170,
    image: 'https://picsum.photos/seed/shuttle/640/360',
  },
  {
    id: 9,
    title: 'Kumara Parvatha Summit',
    category: 'trek',
    location: 'Kukke, Karnataka',
    date: 'Aug 23, 2026',
    registered: 22,
    capacity: 40,
    rallyPoints: 260,
    image: 'https://picsum.photos/seed/kumara/640/360',
  },
]

export const categories = [
  { id: 'all', label: 'All', count: events.length },
  {
    id: 'badminton',
    label: 'Badminton',
    count: events.filter((e) => e.category === 'badminton').length,
  },
  {
    id: 'trek',
    label: 'Treks',
    count: events.filter((e) => e.category === 'trek').length,
  },
  {
    id: 'marathon',
    label: 'Marathons',
    count: events.filter((e) => e.category === 'marathon').length,
  },
  {
    id: 'cycling',
    label: 'Cycling',
    count: events.filter((e) => e.category === 'cycling').length,
  },
] as const

export const leaderboard = [
  { rank: 1, name: 'Aditya Verma', score: '14,820', sports: ['marathon', 'cycling', 'trek'] },
  { rank: 2, name: 'Sneha Kulkarni', score: '13,410', sports: ['trek', 'badminton'] },
  { rank: 3, name: 'Rohan Iyer', score: '12,450', sports: ['cycling', 'marathon'] },
  { rank: 4, name: 'Meera Nair', score: '11,090', sports: ['badminton', 'trek'] },
  { rank: 5, name: 'Karan Singh', score: '10,330', sports: ['marathon'] },
]

export const quotes = [
  {
    text: 'Reached the summit at 6am. Cried. Worth every step.',
    name: 'Priya R.',
    event: 'Nandi Hills Trek',
    accent: 'orange',
  },
  {
    text: 'PR by 4 minutes. The crowd carried me the whole way.',
    name: 'Arjun M.',
    event: 'Bengaluru Half Marathon',
    accent: 'cyan',
  },
  {
    text: 'My legs hated me. My heart has never been happier.',
    name: 'Fatima K.',
    event: 'Western Ghats Cycle Rally',
    accent: 'violet',
  },
  {
    text: 'Lost the final 21-19. Made a friend for life though.',
    name: 'Dev P.',
    event: 'Smash Cup Badminton Open',
    accent: 'cyan',
  },
  {
    text: 'Rain, mud, and the best 14 kilometres of my year.',
    name: 'Ananya S.',
    event: 'Sahyadri Monsoon Trek',
    accent: 'orange',
  },
  {
    text: 'Started as a stranger. Finished as part of the verse.',
    name: 'Vikram T.',
    event: 'Mumbai Coastal 10K',
    accent: 'violet',
  },
]
