-- Database Schema for Placement Assessment Platform
-- Target: PostgreSQL (Neon DB)
-- ============================================================
-- FIXED VERSION — Replace your existing db_setup.sql
-- ============================================================
-- Fixes applied:
--   H-2: Added performance indexes
--   L-3: Uses IF NOT EXISTS (safe for production re-runs)
-- ============================================================

-- 1. Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Drop existing tables (DEVELOPMENT ONLY — comment out for production!)
-- WARNING: Uncomment these lines ONLY when you need to reset the database.
-- DROP TABLE IF EXISTS violations CASCADE;
-- DROP TABLE IF EXISTS attempts CASCADE;
-- DROP TABLE IF EXISTS questions CASCADE;

-- 3. Create Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(50) PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- 'Aptitude', 'Verbal', 'Computer Fundamentals', 'Coding'
    topic VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL, -- 'Easy', 'Medium', 'Hard'
    question TEXT NOT NULL,
    options JSONB, -- MCQ options array: ["Option A", "Option B", ...]
    correct_option CHAR(1), -- 'A', 'B', 'C', 'D' (for MCQs)
    answer TEXT,
    explanation TEXT,
    marks INT DEFAULT 1,
    negative_marks DECIMAL(3, 2) DEFAULT 0.25,
    time_limit INT, -- in seconds
    examples JSONB -- Array of example objects: [{"input": "...", "output": "..."}]
);

-- 4. Create Attempts Table
CREATE TABLE IF NOT EXISTS attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'started', -- 'started', 'completed', 'auto_submitted', 'disqualified', 'late_submit'
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INT,
    global_timer_remaining INT,
    questions JSONB, -- Array of selected question IDs
    answers JSONB DEFAULT '{}'::jsonb, -- Map of { question_id: selection_or_code }
    coding_submissions JSONB DEFAULT '{}'::jsonb, -- Map of { coding_question_id: run_results_metadata }
    violation_count INT DEFAULT 0,
    score_aptitude DECIMAL(5, 2) DEFAULT 0.00,
    score_verbal DECIMAL(5, 2) DEFAULT 0.00,
    score_coding DECIMAL(5, 2) DEFAULT 0.00,
    score_total DECIMAL(5, 2) DEFAULT 0.00,
    browser_info JSONB -- { user_agent, platform, resolution }
);

-- 5. Create Violations Table
CREATE TABLE IF NOT EXISTS violations (
    id SERIAL PRIMARY KEY,
    attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'tab_switch', 'fullscreen_exit', 'window_blur', 'forbidden_shortcut'
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

-- 6. [FIX H-2] Performance Indexes
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_cat_diff ON questions(category, difficulty);
CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_status ON attempts(status);
CREATE INDEX IF NOT EXISTS idx_attempts_user_status ON attempts(user_id, status);
CREATE INDEX IF NOT EXISTS idx_violations_attempt_id ON violations(attempt_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_attempt ON attempts(user_id) WHERE status = 'started';
