-- 006_user_activities.sql
-- Konu platformu — kullanıcı aktiviteleri ve oturum takibi

CREATE TABLE IF NOT EXISTS user_activity_log (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  activity_type   VARCHAR(50) NOT NULL, -- 'login', 'logout', 'topic_create', 'comment_create', 'vote', 'save'
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_activity_log_user ON user_activity_log (user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_log_created_at ON user_activity_log (created_at DESC);
