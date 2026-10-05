-- ============================================================
-- Migration: 003_analytics_tables.sql
-- Date: 2026-10-05
-- Target: PostgreSQL / Neon DB
-- Purpose: Add analytics + learning persistence tables
-- ============================================================

BEGIN;

-- ============================================================
-- 1. USERS REGISTRY
--    Central identity table linking roll_number ↔ JWT identity
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id              TEXT PRIMARY KEY,          -- JWT sub / roll_number
    roll_number     TEXT NOT NULL UNIQUE,
    name            TEXT NOT NULL DEFAULT '',
    email           TEXT NOT NULL DEFAULT '',
    role            TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    branch          TEXT DEFAULT '',
    college         TEXT DEFAULT 'HITAM Hyderabad',
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    last_seen_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_roll ON users (UPPER(roll_number));
CREATE INDEX IF NOT EXISTS idx_users_email ON users (LOWER(email));

-- ============================================================
-- 2. TOPIC VIEWS
--    Logs every time a student visits a topic tab
-- ============================================================
CREATE TABLE IF NOT EXISTS topic_views (
    id              BIGSERIAL PRIMARY KEY,
    user_id         TEXT NOT NULL,
    topic_slug      TEXT NOT NULL,
    topic_name      TEXT NOT NULL DEFAULT '',
    tab             TEXT DEFAULT 'overview',   -- overview | chat | mcq | coding
    started_at      TIMESTAMPTZ DEFAULT NOW(),
    duration_seconds INT DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_topic_views_user ON topic_views (user_id);
CREATE INDEX IF NOT EXISTS idx_topic_views_slug ON topic_views (topic_slug);
CREATE INDEX IF NOT EXISTS idx_topic_views_started ON topic_views (started_at DESC);

-- ============================================================
-- 3. CHAT MESSAGES
--    Every message sent/received in any chat mode
-- ============================================================
CREATE TABLE IF NOT EXISTS chat_messages (
    id              BIGSERIAL PRIMARY KEY,
    user_id         TEXT NOT NULL,
    topic_slug      TEXT NOT NULL,
    mode            TEXT NOT NULL DEFAULT 'socratic' CHECK (mode IN ('socratic', 'teacher', 'peer')),
    role            TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
    content         TEXT NOT NULL DEFAULT '',
    ts              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_chat_user ON chat_messages (user_id);
CREATE INDEX IF NOT EXISTS idx_chat_topic ON chat_messages (topic_slug);
CREATE INDEX IF NOT EXISTS idx_chat_ts ON chat_messages (ts DESC);

-- ============================================================
-- 4. MCQ ATTEMPTS
--    One row per question answered (even if retried)
-- ============================================================
CREATE TABLE IF NOT EXISTS mcq_attempts (
    id              BIGSERIAL PRIMARY KEY,
    user_id         TEXT NOT NULL,
    topic_slug      TEXT NOT NULL,
    question_id     TEXT NOT NULL,
    selected_idx    INT DEFAULT -1,           -- 0-based index of chosen option
    correct_idx     INT DEFAULT -1,           -- ground-truth index
    is_correct      BOOLEAN DEFAULT FALSE,
    time_taken_s    INT DEFAULT 0,
    hint_used       BOOLEAN DEFAULT FALSE,
    ts              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_mcq_user ON mcq_attempts (user_id);
CREATE INDEX IF NOT EXISTS idx_mcq_topic ON mcq_attempts (topic_slug);
CREATE INDEX IF NOT EXISTS idx_mcq_question ON mcq_attempts (question_id);

-- ============================================================
-- 5. CODING SUBMISSIONS
--    Every Run or Submit action on a coding problem
-- ============================================================
CREATE TABLE IF NOT EXISTS coding_submissions (
    id              BIGSERIAL PRIMARY KEY,
    user_id         TEXT NOT NULL,
    problem_id      TEXT NOT NULL,
    problem_title   TEXT DEFAULT '',
    topic_slug      TEXT DEFAULT '',
    language        TEXT NOT NULL DEFAULT 'python',
    code            TEXT DEFAULT '',
    action          TEXT DEFAULT 'submit' CHECK (action IN ('run', 'submit')),
    verdict         TEXT DEFAULT 'pending',   -- accepted | wrong_answer | time_limit | runtime_error | compile_error
    passed          INT DEFAULT 0,
    total           INT DEFAULT 0,
    runtime_ms      INT DEFAULT 0,
    memory_kb       INT DEFAULT 0,
    ts              TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coding_user ON coding_submissions (user_id);
CREATE INDEX IF NOT EXISTS idx_coding_problem ON coding_submissions (problem_id);
CREATE INDEX IF NOT EXISTS idx_coding_verdict ON coding_submissions (verdict);
CREATE INDEX IF NOT EXISTS idx_coding_ts ON coding_submissions (ts DESC);

-- ============================================================
-- 6. TOP 100 PROGRESS
--    Best status per user per problem (upserted on submit)
-- ============================================================
CREATE TABLE IF NOT EXISTS top100_progress (
    id              BIGSERIAL PRIMARY KEY,
    user_id         TEXT NOT NULL,
    problem_id      TEXT NOT NULL,
    problem_title   TEXT DEFAULT '',
    difficulty      TEXT DEFAULT 'Easy',
    status          TEXT DEFAULT 'not_attempted' CHECK (status IN ('not_attempted', 'attempted', 'solved')),
    best_verdict    TEXT DEFAULT '',
    attempts        INT DEFAULT 0,
    last_ts         TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (user_id, problem_id)
);

CREATE INDEX IF NOT EXISTS idx_top100_user ON top100_progress (user_id);
CREATE INDEX IF NOT EXISTS idx_top100_status ON top100_progress (user_id, status);

-- ============================================================
-- 7. ANALYTICS HELPER VIEW
--    Used by student dashboard GET /api/analytics/dashboard
-- ============================================================
CREATE OR REPLACE VIEW v_student_dashboard AS
SELECT
    u.id                                                             AS user_id,
    u.roll_number,
    u.name,
    u.branch,
    COUNT(DISTINCT tv.topic_slug)                                    AS topics_viewed,
    COALESCE(SUM(tv.duration_seconds), 0)                           AS total_study_seconds,
    COUNT(DISTINCT ma.topic_slug)
        FILTER (WHERE ma.is_correct IS NOT NULL)                     AS mcq_topics_attempted,
    COALESCE(
        100.0 * SUM(CASE WHEN ma.is_correct THEN 1 ELSE 0 END)
        / NULLIF(COUNT(ma.id), 0), 0
    )::numeric(5,1)                                                  AS mcq_accuracy_pct,
    COUNT(DISTINCT cs.problem_id)
        FILTER (WHERE cs.verdict = 'accepted' AND cs.action = 'submit') AS coding_solved,
    COUNT(DISTINCT cs.id)
        FILTER (WHERE cs.action = 'submit')                          AS coding_submissions,
    COUNT(DISTINCT tp.problem_id)
        FILTER (WHERE tp.status = 'solved')                          AS top100_solved,
    MAX(tv.started_at)                                               AS last_active_at
FROM       users         u
LEFT JOIN  topic_views   tv ON tv.user_id = u.id
LEFT JOIN  mcq_attempts  ma ON ma.user_id = u.id
LEFT JOIN  coding_submissions cs ON cs.user_id = u.id
LEFT JOIN  top100_progress    tp ON tp.user_id = u.id
GROUP BY u.id, u.roll_number, u.name, u.branch;

-- ============================================================
-- 8. PER-TOPIC MCQ ACCURACY VIEW
-- ============================================================
CREATE OR REPLACE VIEW v_mcq_topic_accuracy AS
SELECT
    user_id,
    topic_slug,
    COUNT(*)                                                         AS questions_attempted,
    SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)                     AS correct_count,
    ROUND(100.0 * SUM(CASE WHEN is_correct THEN 1 ELSE 0 END)
        / NULLIF(COUNT(*), 0), 1)                                    AS accuracy_pct,
    MAX(ts)                                                          AS last_attempted
FROM mcq_attempts
GROUP BY user_id, topic_slug;

COMMIT;
