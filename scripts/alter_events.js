const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(
  'https://upbgyijcrekpedyqyods.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVwYmd5aWpjcmVrcGVkeXF5b2RzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDQ5MDM2MiwiZXhwIjoyMDk2MDY2MzYyfQ.EKX_KGuMRnuD4yjHv2h4HHNSyB6CPu6HcmBEHW88UGA'
);

async function main() {
  const { data, error } = await supabase.rpc('exec_sql', {
    query: `
      alter table events add column if not exists category text;
      alter table events add column if not exists capacity integer;
      alter table events add column if not exists rally_points integer default 0;
      alter table events add column if not exists image_url text;
      alter table events add column if not exists updated_at timestamptz default now();
      alter table events add column if not exists date_label text;
      alter table events add column if not exists time_label text;
      alter table events add column if not exists is_date_confirmed boolean default true;
    `
  });
  if (error) {
    console.log('RPC error:', error.message);
    process.exit(1);
  }
  console.log('Columns added successfully');
}
main();
