-- ============================================
-- QUIZ ANALYTICS TABLES
-- Supabase SQL Migration Script
-- ============================================

-- Table 1: quiz_sessions
-- Stores each unique quiz session with metadata
CREATE TABLE IF NOT EXISTS quiz_sessions (
  session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- User identification (when captured)
  email TEXT,

  -- Session metadata
  user_agent TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,

  -- Session status
  status TEXT DEFAULT 'in_progress',
  completed_at TIMESTAMP WITH TIME ZONE,
  abandoned_at TIMESTAMP WITH TIME ZONE,

  -- Final scores (calculated at completion)
  score_circadiano INTEGER DEFAULT 0,
  score_inflamacion INTEGER DEFAULT 0,
  score_estructura INTEGER DEFAULT 0,
  dominant_profile TEXT,

  -- Device info
  device_type TEXT,
  browser TEXT,
  os TEXT,

  -- Time tracking
  time_spent_seconds INTEGER,

  CONSTRAINT valid_status CHECK (status IN ('in_progress', 'completed', 'abandoned'))
);

-- Indexes for quiz_sessions
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_email ON quiz_sessions(email);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_status ON quiz_sessions(status);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_created_at ON quiz_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_sessions_completed_at ON quiz_sessions(completed_at DESC);

-- RLS Policy for quiz_sessions - allow anonymous users to insert
ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous INSERT" ON quiz_sessions;
CREATE POLICY "Allow anonymous INSERT" ON quiz_sessions
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public READ" ON quiz_sessions;
CREATE POLICY "Allow public READ" ON quiz_sessions
  FOR SELECT USING (true);


-- ============================================
-- Table 2: quiz_events
-- Tracks every interaction in the quiz
CREATE TABLE IF NOT EXISTS quiz_events (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES quiz_sessions(session_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Event classification
  event_type TEXT NOT NULL,
  step_id TEXT NOT NULL,
  step_number INTEGER,

  -- Answer data (when applicable)
  question_id TEXT,
  answer_value TEXT,
  answer_text TEXT,
  block_type TEXT,

  -- Multi-select answers
  multi_answers JSONB,

  -- Time tracking
  time_on_step_seconds INTEGER,

  -- Navigation
  navigation_direction TEXT DEFAULT 'forward',

  -- Additional context
  metadata JSONB
);

-- Indexes for quiz_events
CREATE INDEX IF NOT EXISTS idx_quiz_events_session_id ON quiz_events(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_events_event_type ON quiz_events(event_type);
CREATE INDEX IF NOT EXISTS idx_quiz_events_step_id ON quiz_events(step_id);
CREATE INDEX IF NOT EXISTS idx_quiz_events_created_at ON quiz_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quiz_events_step_number ON quiz_events(step_number);

-- RLS Policy for quiz_events
ALTER TABLE quiz_events ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous INSERT" ON quiz_events;
CREATE POLICY "Allow anonymous INSERT" ON quiz_events
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public READ" ON quiz_events;
CREATE POLICY "Allow public READ" ON quiz_events
  FOR SELECT USING (true);


-- ============================================
-- Table 3: quiz_checkouts
-- Tracks checkout button clicks and plan selections
CREATE TABLE IF NOT EXISTS quiz_checkouts (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES quiz_sessions(session_id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Checkout details
  plan_selected TEXT NOT NULL,
  plan_price DECIMAL(10, 2),
  checkout_location TEXT,

  -- User info at checkout
  email TEXT,

  -- Metadata
  metadata JSONB
);

-- Indexes for quiz_checkouts
CREATE INDEX IF NOT EXISTS idx_quiz_checkouts_session_id ON quiz_checkouts(session_id);
CREATE INDEX IF NOT EXISTS idx_quiz_checkouts_email ON quiz_checkouts(email);
CREATE INDEX IF NOT EXISTS idx_quiz_checkouts_created_at ON quiz_checkouts(created_at DESC);

-- RLS Policy for quiz_checkouts
ALTER TABLE quiz_checkouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Allow anonymous INSERT" ON quiz_checkouts;
CREATE POLICY "Allow anonymous INSERT" ON quiz_checkouts
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public READ" ON quiz_checkouts;
CREATE POLICY "Allow public READ" ON quiz_checkouts
  FOR SELECT USING (true);


-- ============================================
-- Table 4: Enhance existing purchases table
-- Add columns for linking quiz sessions to purchases
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS quiz_session_id UUID REFERENCES quiz_sessions(session_id);
ALTER TABLE purchases ADD COLUMN IF NOT EXISTS time_from_quiz_to_purchase INTERVAL;

-- Indexes for purchases
CREATE INDEX IF NOT EXISTS idx_purchases_quiz_session_id ON purchases(quiz_session_id);
CREATE INDEX IF NOT EXISTS idx_purchases_email ON purchases(email) WHERE email IS NOT NULL;


-- ============================================
-- VERIFY TABLES CREATED
-- ============================================
SELECT
  tablename,
  (SELECT count(*) FROM information_schema.columns WHERE table_name=tablename) as columns_count
FROM pg_tables
WHERE tablename IN ('quiz_sessions', 'quiz_events', 'quiz_checkouts', 'purchases')
ORDER BY tablename;
