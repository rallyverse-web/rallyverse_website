/**
 * Script to create required Supabase storage buckets for event assets.
 * Run: node scripts/setup_storage_buckets.mjs
 *
 * Requires env vars:
 *   NEXT_PUBLIC_SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
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
      // Strip surrounding quotes if present
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

if (!supabaseUrl) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL in environment. Check that .env.local or .env exists with NEXT_PUBLIC_SUPABASE_URL set.')
  process.exit(1)
}
if (!serviceKey) {
  console.error('Missing SUPABASE_SERVICE_ROLE_KEY in environment. Check that .env.local or .env exists with SUPABASE_SERVICE_ROLE_KEY set.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
})

const buckets = [
  {
    name: 'event-assets',
    public: true,
    description: 'Event posters, QR codes, and other public assets',
    allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    fileSizeLimit: 10485760, // 10MB
  },
]

async function setupBuckets() {
  console.log('Setting up Supabase storage buckets...\n')

  for (const bucket of buckets) {
    // Check if bucket exists
    const { data: existing } = await supabase.storage.getBucket(bucket.name)

    if (existing) {
      console.log(`  ✓ Bucket "${bucket.name}" already exists — updating...`)
      const { error: updateError } = await supabase.storage.updateBucket(bucket.name, {
        public: bucket.public,
        allowed_mime_types: bucket.allowedMimeTypes,
        file_size_limit: bucket.fileSizeLimit,
      })
      if (updateError) {
        console.error(`  ✗ Failed to update bucket "${bucket.name}":`, updateError.message)
      } else {
        console.log(`  ✓ Bucket "${bucket.name}" updated successfully`)
      }
    } else {
      console.log(`  Creating bucket "${bucket.name}"...`)
      const { error: createError } = await supabase.storage.createBucket(bucket.name, {
        public: bucket.public,
        allowed_mime_types: bucket.allowedMimeTypes,
        file_size_limit: bucket.fileSizeLimit,
      })
      if (createError) {
        console.error(`  ✗ Failed to create bucket "${bucket.name}":`, createError.message)
      } else {
        console.log(`  ✓ Bucket "${bucket.name}" created successfully`)
      }
    }

    // Set CORS policy for the bucket (needed for browser uploads)
    const { error: corsError } = await supabase.storage.setBucketCors(bucket.name, {
      allowed_origins: ['*'],
      allowed_methods: ['GET', 'HEAD', 'PUT', 'POST', 'DELETE'],
      allowed_headers: ['*'],
      expose_headers: ['Content-Range', 'X-Request-ID'],
      max_age_seconds: 3600,
    })
    if (corsError && !corsError.message.includes('already exists')) {
      console.log(`  Note: CORS for "${bucket.name}": ${corsError.message}`)
    }
  }

  // Verify
  console.log('\nVerifying buckets...')
  const { data: allBuckets, error: listError } = await supabase.storage.listBuckets()
  if (listError) {
    console.error('Failed to list buckets:', listError.message)
  } else {
    for (const b of allBuckets) {
      console.log(`  ${b.id}: ${b.name} (public: ${b.public})`)
    }
  }

  console.log('\nDone! Storage buckets are ready.')
}

setupBuckets().catch(console.error)
