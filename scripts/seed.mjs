/**
 * Seed script — run with: node scripts/seed.mjs
 *
 * Seeds only badminton events into Supabase.
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '..', '.env')
const envContent = readFileSync(envPath, 'utf-8')
const env = Object.fromEntries(
  envContent
    .split('\n')
    .filter(l => l.trim() && !l.startsWith('#'))
    .map(l => l.split('=', 2).map(s => s.trim()))
    .filter(([k]) => k)
)

const supabaseUrl = env.NEXT_PUBLIC_SUPABASE_URL?.trim()
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY?.trim()

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const seedEvents = [
  {
    slug: 'rally-series-01-bengaluru-badminton-tournament-2026',
    name: 'Rally Series 01 — Bengaluru Badminton',
    category: 'badminton',
    description: [
      "Rally Series 01 marks the beginning of RallyVerse.",
      "Taking place on 5 July 2026 at A2V Badminton Academy in Bengaluru.",
      "The tournament features Mixed Doubles and Men's Doubles categories.",
    ].join('\n'),
    venue: 'A2V Badminton Academy',
    event_date: '2026-07-05T11:00:00+05:30',
    date_label: '5 July 2026',
    time_label: '11:00 AM – 7:00 PM',
    is_date_confirmed: true,
    registration_fee: 799,
    capacity: 64,
    rally_points: 180,
    status: 'published',
    formats: ["Mixed Doubles", "Men's Doubles"],
  },
  {
    slug: 'smash-cup-badminton-open',
    name: 'Smash Cup Badminton Open',
    category: 'badminton',
    description: 'An open badminton tournament at Indiranagar featuring singles and doubles categories.',
    venue: 'Indiranagar, Bengaluru',
    event_date: '2026-07-12T09:00:00+05:30',
    date_label: '12 July 2026',
    time_label: '9:00 AM start',
    is_date_confirmed: true,
    registration_fee: 0,
    capacity: 64,
    rally_points: 180,
    status: 'published',
    formats: ["Men's Singles", "Women's Singles", "Men's Doubles", "Women's Doubles", "Mixed Doubles"],
  },
  {
    slug: 'rally-shuttle-doubles',
    name: 'Rally Shuttle Doubles',
    category: 'badminton',
    description: 'A doubles-only badminton tournament in Koramangala.',
    venue: 'Koramangala, Bengaluru',
    event_date: '2026-08-16T09:00:00+05:30',
    date_label: '16 August 2026',
    time_label: '9:00 AM start',
    is_date_confirmed: true,
    registration_fee: 0,
    capacity: 48,
    rally_points: 170,
    status: 'published',
    formats: ["Men's Doubles", "Women's Doubles", "Mixed Doubles"],
  },
]

async function seed() {
  console.log('Seeding badminton events into Supabase...\n')

  let created = 0
  let skipped = 0

  for (const ev of seedEvents) {
    const { data: existing } = await supabase
      .from('events')
      .select('id')
      .eq('slug', ev.slug)
      .maybeSingle()

    if (existing) {
      console.log(`  \u23ED Skipped "${ev.name}" (already exists)`)
      skipped++
      continue
    }

    const { formats, ...eventData } = ev

    const { data: event, error } = await supabase
      .from('events')
      .insert(eventData)
      .select()
      .single()

    if (error) {
      console.error(`  \u2717 Failed to create "${ev.name}": ${error.message}`)
      continue
    }

    if (formats.length > 0) {
      const formatRows = formats.map((name) => ({
        event_id: event.id,
        format_name: name,
      }))
      const { error: fmtError } = await supabase
        .from('event_formats')
        .insert(formatRows)

      if (fmtError) {
        console.error(`  \u2717 Failed to insert formats for "${ev.name}": ${fmtError.message}`)
      } else {
        console.log(`  \u2713 Created "${ev.name}" with ${formatRows.length} format(s)`)
      }
    } else {
      console.log(`  \u2713 Created "${ev.name}"`)
    }

    created++
  }

  console.log(`\nDone. ${created} created, ${skipped} skipped.`)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
