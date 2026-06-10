-- RallyVerse CRM Migration - Partner Enquiries Schema Updates
-- Run this in the Supabase SQL Editor (https://supabase.com/dashboard/project/upbgyijcrekpedyqyods/sql/new)

-- 1. Alter table to add columns with default values
ALTER TABLE partner_enquiries ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();
ALTER TABLE partner_enquiries ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'New';
ALTER TABLE partner_enquiries ADD COLUMN IF NOT EXISTS internal_notes jsonb DEFAULT '[]'::jsonb;
ALTER TABLE partner_enquiries ADD COLUMN IF NOT EXISTS assigned_to text;
ALTER TABLE partner_enquiries ADD COLUMN IF NOT EXISTS is_deleted boolean NOT NULL DEFAULT false;

-- 2. Add status constraint (drop first to prevent duplicate errors)
ALTER TABLE partner_enquiries DROP CONSTRAINT IF EXISTS check_partner_enquiry_status;
ALTER TABLE partner_enquiries ADD CONSTRAINT check_partner_enquiry_status CHECK (status IN ('New', 'Contacted', 'Qualified', 'Proposal Sent', 'Won', 'Lost'));

-- 3. Setup index optimization for filters & sorting
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_status ON partner_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_is_deleted ON partner_enquiries(is_deleted);
CREATE INDEX IF NOT EXISTS idx_partner_enquiries_created_at ON partner_enquiries(created_at);
