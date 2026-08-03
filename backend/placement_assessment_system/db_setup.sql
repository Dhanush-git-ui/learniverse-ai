-- Database Schema for Learniverse AI Placement Assessment Platform
-- Target: PostgreSQL (Neon DB)
-- ============================================================
-- Relational Session-Based Architecture (Production Grade)
-- ============================================================

-- 1. Enable UUID Extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enriched Questions Table
CREATE TABLE IF NOT EXISTS questions (
    id VARCHAR(100) PRIMARY KEY,
    category VARCHAR(50) NOT NULL, -- 'Aptitude', 'Logical', 'Verbal', 'Computer_Fundamentals', 'Programming', 'DSA', 'Frontend', 'Backend', 'SQL', 'Coding'
    question_type VARCHAR(50) DEFAULT 'mcq', -- 'mcq', 'reading_comprehension', 'code_prediction', 'coding'
    topic VARCHAR(100) NOT NULL,
    subtopic VARCHAR(100),
    difficulty VARCHAR(20) NOT NULL, -- 'Easy', 'Medium', 'Hard'
    question TEXT NOT NULL,
    options JSONB, -- MCQ options array: ["Option A", "Option B", "Option C", "Option D"]
    correct_option CHAR(1), -- 'A', 'B', 'C', 'D'
    answer TEXT,
    explanation TEXT,
    marks INT DEFAULT 1,
    negative_marks DECIMAL(3, 2) DEFAULT 0.25,
    time_limit INT DEFAULT 120, -- in seconds
    estimated_time INT DEFAULT 90, -- in seconds
    blooms_level VARCHAR(50) DEFAULT 'Understand', -- 'Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'
    tags JSONB DEFAULT '[]'::jsonb,
    language VARCHAR(30) DEFAULT 'general',
    generator_version VARCHAR(20) DEFAULT 'v2.0',
    examples JSONB -- Array of example objects for coding questions
);

-- 3. Create Relational Test Sessions Table (Table 1)
CREATE TABLE IF NOT EXISTS test_sessions (
    session_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    test_id VARCHAR(100) DEFAULT 'placement_assessment_v1',
    student_roll_number VARCHAR(50) NOT NULL,
    student_name VARCHAR(100) DEFAULT 'Student',
    branch VARCHAR(50) DEFAULT 'CSE',
    year VARCHAR(20) DEFAULT '4th Year',
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    status VARCHAR(20) DEFAULT 'started', -- 'started', 'completed', 'auto_submitted', 'disqualified'
    total_questions INT DEFAULT 62,
    attempted INT DEFAULT 0,
    correct INT DEFAULT 0,
    wrong INT DEFAULT 0,
    unanswered INT DEFAULT 62,
    total_marks DECIMAL(7, 2) DEFAULT 0.00,
    percentage DECIMAL(5, 2) DEFAULT 0.00,
    time_taken INT DEFAULT 0,
    tab_switch_count INT DEFAULT 0,
    fullscreen_exit_count INT DEFAULT 0,
    copy_attempts INT DEFAULT 0,
    suspicious_events JSONB DEFAULT '[]'::jsonb,
    suspicion_score DECIMAL(5, 2) DEFAULT 0.00,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    browser VARCHAR(100) DEFAULT 'Web Browser',
    device VARCHAR(100) DEFAULT 'Desktop',
    questions JSONB DEFAULT '[]'::jsonb,
    answers JSONB DEFAULT '{}'::jsonb,
    coding_submissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Question Responses Table (Table 2)
CREATE TABLE IF NOT EXISTS question_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    session_id UUID REFERENCES test_sessions(session_id) ON DELETE CASCADE,
    section VARCHAR(50) NOT NULL,
    question_id VARCHAR(100) NOT NULL,
    question_text TEXT,
    option_a TEXT,
    option_b TEXT,
    option_c TEXT,
    option_d TEXT,
    selected_option VARCHAR(10),
    correct_option VARCHAR(10),
    is_correct BOOLEAN DEFAULT FALSE,
    marks_awarded DECIMAL(5, 2) DEFAULT 0.00,
    time_spent INT DEFAULT 0,
    difficulty VARCHAR(20),
    topic VARCHAR(100),
    subtopic VARCHAR(100),
    explanation TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Section Results Table (Table 3)
CREATE TABLE IF NOT EXISTS section_results (
    id SERIAL PRIMARY KEY,
    session_id UUID REFERENCES test_sessions(session_id) ON DELETE CASCADE,
    section_name VARCHAR(50) NOT NULL,
    questions INT DEFAULT 0,
    attempted INT DEFAULT 0,
    correct INT DEFAULT 0,
    wrong INT DEFAULT 0,
    unanswered INT DEFAULT 0,
    marks DECIMAL(7, 2) DEFAULT 0.00,
    percentage DECIMAL(5, 2) DEFAULT 0.00,
    average_time DECIMAL(7, 2) DEFAULT 0.00
);

-- 6. Backward Compatibility Attempts & Violations Tables
CREATE TABLE IF NOT EXISTS attempts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id VARCHAR(100) NOT NULL,
    roll_number VARCHAR(50),
    status VARCHAR(20) DEFAULT 'started',
    start_time TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    end_time TIMESTAMP WITH TIME ZONE,
    duration_seconds INT DEFAULT 7200,
    global_timer_remaining INT DEFAULT 7200,
    questions JSONB DEFAULT '[]'::jsonb,
    answers JSONB DEFAULT '{}'::jsonb,
    coding_submissions JSONB DEFAULT '{}'::jsonb,
    violation_count INT DEFAULT 0,
    score_aptitude DECIMAL(5, 2) DEFAULT 0.00,
    score_verbal DECIMAL(5, 2) DEFAULT 0.00,
    score_coding DECIMAL(5, 2) DEFAULT 0.00,
    score_total DECIMAL(5, 2) DEFAULT 0.00,
    browser_info JSONB DEFAULT '{}'::jsonb
);

CREATE TABLE IF NOT EXISTS violations (
    id SERIAL PRIMARY KEY,
    attempt_id UUID REFERENCES attempts(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    details TEXT
);

-- 7. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_questions_category ON questions(category);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_questions_cat_diff ON questions(category, difficulty);

CREATE INDEX IF NOT EXISTS idx_test_sessions_roll ON test_sessions(student_roll_number);
CREATE INDEX IF NOT EXISTS idx_test_sessions_status ON test_sessions(status);
CREATE INDEX IF NOT EXISTS idx_test_sessions_roll_status ON test_sessions(student_roll_number, status);
CREATE INDEX IF NOT EXISTS idx_test_sessions_created ON test_sessions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_question_responses_session ON question_responses(session_id);
CREATE INDEX IF NOT EXISTS idx_question_responses_section ON question_responses(section);

CREATE INDEX IF NOT EXISTS idx_section_results_session ON section_results(session_id);

CREATE INDEX IF NOT EXISTS idx_attempts_user_id ON attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_attempts_user_status ON attempts(user_id, status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_session ON test_sessions(student_roll_number) WHERE status = 'started';

