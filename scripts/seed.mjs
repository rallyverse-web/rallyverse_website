/**
 * Seed script — run with: node scripts/seed.mjs
 *
 * Inserts hardcoded events from lib/events.ts + lib/config.ts into Supabase.
 * Run AFTER running migration.sql in Supabase SQL Editor for full column support.
 *
 * NOTE: If migration.sql hasn't been run yet, only existing columns are populated.
 *       Re-run this script after migration to add full data.
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

// Only insert columns known to exist in the events table
// Run migration.sql first to add: category, capacity, rally_points, image_url,
// date_label, time_label, is_date_confirmed, updated_at
const seedEvents = [
  {
    slug: 'rally-series-01-bengaluru-badminton-tournament-2026',
    name: 'Rally Series 01 — Bengaluru Badminton',
    description: [
      "Rally Series 01 marks the beginning of RallyVerse.",
      "Taking place on 5 July 2026 at A2V Badminton Academy in Rajajinagar, Bengaluru.",
      "The tournament features Mixed Doubles and Men's Doubles categories."
    ].join('\n'),
    venue: 'A2V Badminton Academy',
    event_date: '2026-07-05T11:00:00+05:30',
    registration_fee: 799,
    poster_url: '/posters/color_poster.png',
    status: 'published',
  },
  {
    slug: 'nandi-hills-sunrise-trek',
    name: 'Nandi Hills Sunrise Trek',
    description: 'Experience the breathtaking sunrise from the summit of Nandi Hills.',
    venue: 'Nandi Hills, Karnataka',
    event_date: '2026-06-14T04:00:00+05:30',
    registration_fee: null,
    poster_url: null,
    status: 'published',
  },
  {
    slug: 'bengaluru-half-marathon',
    name: 'Bengaluru Half Marathon',
    description: 'Run through the heart of Bengaluru in this community half marathon.',
    venue: 'Cubbon Park, Bengaluru',
    event_date: '2026-06-28T05:00:00+05:30',
    registration_fee: null,
    poster_url: null,
    status: 'published',
  },
  {
    slug: 'western-ghats-cycle-rally',
    name: 'Western Ghats Cycle Rally',
    description: 'A scenic group cycle through the lush Western Ghats near Coorg.',
    venue: 'Coorg, Karnataka',
    event_date: '2026-07-05T06:00:00+05:30',
    registration_fee: null,
    poster_url: null,
    status: 'published',
  },
  {
    slug: 'smash-cup-badminton-open',
    name: 'Smash Cup Badminton Open',
    description: 'An open badminton tournament at Indiranagar featuring singles and doubles.',
    venue: 'Indiranagar, Bengaluru',
    event_date: '2026-07-12T09:00:00+05:30',
    registration_fee: null,
    poster_url: '/posters/color_poster.png',
    status: 'published',
  },
  {
    slug: 'sahyadri-monsoon-trek',
    name: 'Sahyadri Monsoon Trek',
    description: 'Trek through the misty Sahyadri range during the monsoon season.',
    venue: 'Lonavala, Maharashtra',
    event_date: '2026-07-19T06:00:00+05:30',
    registration_fee: null,
    poster_url: null,
    status: 'published',
  },
  {
    slug: 'mumbai-coastal-10k',
    name: 'Mumbai Coastal 10K',
    description: 'A scenic 10K run along Marine Drive in Mumbai.',
    venue: 'Marine Drive, Mumbai',
    event_date: '2026-08-02T05:30:00+05:30',
    registration_fee: null,
    poster_url: null,
    status: 'published',
  },
  {
    slug: 'hyderabad-night-ride',
    name: 'Hyderabad Night Ride',
    description: 'A night cycling ride around Hussain Sagar Lake in Hyderabad.',
    venue: 'Hussain Sagar, Hyderabad',
    event_date: '2026-08-09T20:00:00+05:30',
    registration_fee: null,
    poster_url: null,
    status: 'published',
  },
  {
    slug: 'rally-shuttle-doubles',
    name: 'Rally Shuttle Doubles',
    description: 'A doubles-only badminton tournament in Koramangala.',
    venue: 'Koramangala, Bengaluru',
    event_date: '2026-08-16T09:00:00+05:30',
    registration_fee: null,
    poster_url: '/posters/color_poster.png',
    status: 'published',
  },
  {
    slug: 'kumara-parvatha-summit',
    name: 'Kumara Parvatha Summit',
    description: 'Trek to the summit of Kumara Parvatha, one of Karnataka\'s most challenging treks.',
    venue: 'Kukke, Karnataka',
    event_date: '2026-08-23T04:00:00+05:30',
    registration_fee: null,
    poster_url: null,
    status: 'published',
  },
]

// Format inserts per-event (only for Rally Series 01 and Smash Cup)
const formatInserts = [
  { slug: 'rally-series-01-bengaluru-badminton-tournament-2026', formats: ["Mixed Doubles", "Men's Doubles"] },
  { slug: 'smash-cup-badminton-open', formats: ["Men's Singles", "Women's Singles", "Men's Doubles", "Women's Doubles", "Mixed Doubles"] },
  { slug: 'rally-shuttle-doubles', formats: ["Men's Doubles", "Women's Doubles", "Mixed Doubles"] },
]

async function seed() {
  console.log('Seeding events into Supabase...\n')

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

    const { data: event, error } = await supabase
      .from('events')
      .insert(ev)
      .select()
      .single()

    if (error) {
      console.error(`  \u2717 Failed to create "${ev.name}": ${error.message}`)
      continue
    }

    // Insert formats for this event
    const formatEntry = formatInserts.find(f => f.slug === ev.slug)
    if (formatEntry && formatEntry.formats.length > 0) {
      const formatRows = formatEntry.formats.map((name) => ({
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
  console.log('\nReminder: Run migration.sql in Supabase SQL Editor to add:')
  console.log('  category, capacity, rally_points, image_url, date_label,')
  console.log('  time_label, is_date_confirmed, updated_at columns.')
  console.log('  Then re-run this script to populate those fields.')
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
