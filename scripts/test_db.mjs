import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const envPath = resolve(__dirname, '..', '.env.local')
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

const supabase = createClient(supabaseUrl, supabaseKey)

async function test() {
  console.log('Checking if partner_enquiries table exists...')
  const { data, error } = await supabase
    .from('partner_enquiries')
    .select('*')
    .limit(1)

  if (error) {
    console.error('Error querying table:', error.message, error.code)
  } else {
    console.log('Success! Table exists. Data:', data)
  }
}

test()
