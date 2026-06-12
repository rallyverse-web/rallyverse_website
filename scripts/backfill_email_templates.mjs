/**
 * Backfill email templates for events created before Phase 9.
 *
 * For each existing event:
 *   1. Update `registration_received` content to include `{{payment_status}}` if missing
 *   2. Insert `payment_verified` and `payment_rejected` templates if missing
 *
 * Run: node scripts/backfill_email_templates.mjs
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync, existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

// Load .env.local (preferred) or .env as fallback
const __dirname = dirname(fileURLToPath(import.meta.url))
const envPaths = [
  resolve(__dirname, '..', '.env.local'),
  resolve(__dirname, '..', '.env'),
]

for (const envPath of envPaths) {
  if (existsSync(envPath)) {
    const content = readFileSync(envPath, 'utf-8')
    for (const line of content.split('\n')) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith('#')) continue
      const eqIdx = trimmed.indexOf('=')
      if (eqIdx === -1) continue
      const key = trimmed.slice(0, eqIdx).trim()
      let value = trimmed.slice(eqIdx + 1).trim()
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
    break
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
})

const NEW_TEMPLATES = [
  {
    template_type: 'payment_verified',
    subject: 'Payment Verified — {{event_name}}',
    content: `Hi {{participant_name}},

<p>Your payment for <strong>{{event_name}}</strong> has been successfully verified.</p>

<p><strong>Registration ID:</strong> {{registration_id}}<br />
<strong>Payment Status:</strong> Verified</p>

<p>Your registration is currently under review. We will notify you once it has been approved.</p>

<p>If you need help, contact <a href="mailto:{{support_email}}">{{support_email}}</a>.</p>

<p>Regards,<br />RallyVerse</p>`,
  },
  {
    template_type: 'payment_rejected',
    subject: 'Payment Verification Failed — {{event_name}}',
    content: `Hi {{participant_name}},

<p>We were unable to verify your payment for <strong>{{event_name}}</strong>.</p>

<p><strong>Registration ID:</strong> {{registration_id}}<br />
<strong>Reason:</strong> {{rejection_reason}}</p>

<p>Please contact the organizer or submit updated payment information.</p>

<p>If you need help, contact <a href="mailto:{{support_email}}">{{support_email}}</a>.</p>

<p>Regards,<br />RallyVerse</p>`,
  },
]

// Regex to find the marker in old registration_received templates
// Handles both \r\n (Windows) and \n (Unix) line endings
const AFTER_RE = /(<strong>Current Status:<\/strong> \{\{registration_status\}\}<br \/>\r?\n)/

async function backfillTemplates() {
  console.log('Fetching all events...')
  const { data: events, error: eventsError } = await supabase
    .from('events')
    .select('id, name')

  if (eventsError) {
    console.error('Failed to fetch events:', eventsError.message)
    process.exit(1)
  }

  if (!events || events.length === 0) {
    console.log('No events found. Nothing to backfill.')
    return
  }

  console.log(`Found ${events.length} events.\n`)

  let updatedReceived = 0
  let insertedVerified = 0
  let insertedRejected = 0
  let errors = 0

  for (const event of events) {
    console.log(`  Processing "${event.name}" (${event.id})...`)

    // Get all existing template types for this event
    const { data: existingTemplates, error: fetchError } = await supabase
      .from('email_templates')
      .select('id, template_type, content')
      .eq('event_id', event.id)

    if (fetchError) {
      console.error(`    ✗ Failed to fetch templates: ${fetchError.message}`)
      errors++
      continue
    }

    const existingMap = new Map((existingTemplates ?? []).map(t => [t.template_type, t]))

    // ── 1. Update registration_received if missing {{payment_status}} ──
    const received = existingMap.get('registration_received')
    if (received && !received.content.includes('{{payment_status}}')) {
      const updatedContent = received.content.replace(
        AFTER_RE,
        '$1<strong>Payment Status:</strong> {{payment_status}}<br />\n'
      )
      const { error: updateError } = await supabase
        .from('email_templates')
        .update({ content: updatedContent })
        .eq('id', received.id)

      if (updateError) {
        console.error(`    ✗ Failed to update registration_received: ${updateError.message}`)
        errors++
      } else {
        console.log(`    ✓ Updated registration_received with payment_status`)
        updatedReceived++
      }
    } else if (received) {
      console.log(`    - registration_received already has payment_status`)
    } else {
      console.log(`    - registration_received not found for this event (skipping update)`)
    }

    // ── 2. Insert payment_verified if missing ──
    if (!existingMap.has('payment_verified')) {
      const { error: insertError } = await supabase
        .from('email_templates')
        .insert({
          event_id: event.id,
          template_type: 'payment_verified',
          subject: NEW_TEMPLATES[0].subject,
          content: NEW_TEMPLATES[0].content,
        })

      if (insertError) {
        console.error(`    ✗ Failed to insert payment_verified: ${insertError.message}`)
        errors++
      } else {
        console.log(`    ✓ Inserted payment_verified`)
        insertedVerified++
      }
    } else {
      console.log(`    - payment_verified already exists`)
    }

    // ── 3. Insert payment_rejected if missing ──
    if (!existingMap.has('payment_rejected')) {
      const { error: insertError } = await supabase
        .from('email_templates')
        .insert({
          event_id: event.id,
          template_type: 'payment_rejected',
          subject: NEW_TEMPLATES[1].subject,
          content: NEW_TEMPLATES[1].content,
        })

      if (insertError) {
        console.error(`    ✗ Failed to insert payment_rejected: ${insertError.message}`)
        errors++
      } else {
        console.log(`    ✓ Inserted payment_rejected`)
        insertedRejected++
      }
    } else {
      console.log(`    - payment_rejected already exists`)
    }
  }

  console.log(`\n── Summary ──`)
  console.log(`  Events processed:   ${events.length}`)
  console.log(`  registration_received updated: ${updatedReceived}`)
  console.log(`  payment_verified inserted:     ${insertedVerified}`)
  console.log(`  payment_rejected inserted:     ${insertedRejected}`)
  console.log(`  Errors:                         ${errors}`)

  if (errors > 0) {
    console.log('\nDone with errors. Check logs above.')
    process.exit(1)
  }

  console.log('\nBackfill complete.')
}

backfillTemplates().catch((err) => {
  console.error('Unhandled error:', err)
  process.exit(1)
})
