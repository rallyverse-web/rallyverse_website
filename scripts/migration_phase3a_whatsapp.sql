-- RallyVerse Phase 3A Enhancement: Event WhatsApp System
-- Adds WhatsApp contact number and group link to events table

alter table events add column if not exists whatsapp_number text default '';
alter table events add column if not exists whatsapp_group_link text default '';
