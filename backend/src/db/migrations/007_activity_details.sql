-- 007_activity_details.sql
-- Aktivite logu için hedef detayları (target_id, target_title) ekleme

ALTER TABLE user_activity_log
ADD COLUMN IF NOT EXISTS target_id UUID,
ADD COLUMN IF NOT EXISTS target_title TEXT;
