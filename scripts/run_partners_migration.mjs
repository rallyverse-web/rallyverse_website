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

async function run() {
  console.log('Reading migration_phase3_partners.sql...')
  const sqlPath = resolve(__dirname, 'migration_phase3_partners.sql')
  const sql = readFileSync(sqlPath, 'utf-8')
  
  console.log('Running migration on Supabase...')
  const { data, error } = await supabase.rpc('exec_sql', {
    query: sql
  })

  if (error) {
    console.error('Migration failed:', error.message)
    process.exit(1)
  }

  console.log('Migration completed successfully!')
}

run()
