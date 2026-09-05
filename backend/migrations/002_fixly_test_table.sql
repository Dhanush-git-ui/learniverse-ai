-- Migration: 002_fixly_test_table.sql
-- Description: Create dedicated fixly_test_submissions table to store student assessment results, answers, and violation telemetry

CREATE TABLE IF NOT EXISTS fixly_test_submissions (
    id SERIAL PRIMARY KEY,
    session_id VARCHAR(100),
    student_name VARCHAR(100) NOT NULL,
    roll_number VARCHAR(50) NOT NULL,
    role VARCHAR(100) DEFAULT 'Mobile App Developer Intern',
    branch VARCHAR(50) DEFAULT 'CSE',
    total_marks DECIMAL(7, 2) DEFAULT 0.00,
    max_marks DECIMAL(7, 2) DEFAULT 20.00,
    percentage DECIMAL(5, 2) DEFAULT 0.00,
    total_questions INT DEFAULT 20,
    attempted INT DEFAULT 0,
    correct_count INT DEFAULT 0,
    wrong_count INT DEFAULT 0,
    unanswered_count INT DEFAULT 0,
    question_answers JSONB DEFAULT '[]'::jsonb,
    violations_count INT DEFAULT 0,
    violations_log JSONB DEFAULT '[]'::jsonb,
    status VARCHAR(30) DEFAULT 'completed',
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indices for rapid querying
CREATE INDEX IF NOT EXISTS idx_fixly_roll_number ON fixly_test_submissions(roll_number);
CREATE INDEX IF NOT EXISTS idx_fixly_role ON fixly_test_submissions(role);
CREATE INDEX IF NOT EXISTS idx_fixly_submitted_at ON fixly_test_submissions(submitted_at DESC);
