-- Persistent admin question bank metadata and trainer-created assessment data.
-- Additive only: existing questions and placement sessions remain intact.

ALTER TABLE questions ALTER COLUMN category TYPE TEXT;
ALTER TABLE questions ALTER COLUMN generator_version TYPE TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS option_explanations TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS provenance VARCHAR(50);
ALTER TABLE questions ADD COLUMN IF NOT EXISTS verification_status TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS review_status VARCHAR(32) NOT NULL DEFAULT 'Approved';
ALTER TABLE questions ADD COLUMN IF NOT EXISTS input_format TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS output_format TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS constraints_text TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS sample_explanation TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS test_cases TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS reference_solution TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS time_complexity VARCHAR(100);
ALTER TABLE questions ADD COLUMN IF NOT EXISTS space_complexity VARCHAR(100);
ALTER TABLE questions ADD COLUMN IF NOT EXISTS supported_languages TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS structural_status VARCHAR(40) NOT NULL DEFAULT 'Not Checked';
ALTER TABLE questions ADD COLUMN IF NOT EXISTS answer_status VARCHAR(40) NOT NULL DEFAULT 'Unverified';
ALTER TABLE questions ADD COLUMN IF NOT EXISTS source_status VARCHAR(40) NOT NULL DEFAULT 'Unverified';
ALTER TABLE questions ADD COLUMN IF NOT EXISTS expert_review_status VARCHAR(40) NOT NULL DEFAULT 'Pending';
ALTER TABLE questions ADD COLUMN IF NOT EXISTS verification_evidence TEXT;

CREATE TABLE IF NOT EXISTS question_categories (
    name TEXT PRIMARY KEY,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_topics (
    category TEXT NOT NULL,
    topic TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (category, topic)
);

CREATE TABLE IF NOT EXISTS question_import_batches (
    batch_id TEXT PRIMARY KEY,
    source TEXT NOT NULL,
    attempted_count INTEGER NOT NULL,
    upserted_count INTEGER NOT NULL,
    review_status VARCHAR(32) NOT NULL,
    imported_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_companies (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS question_roles (
    slug TEXT PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS question_role_links (
    question_id VARCHAR(100) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    role_slug TEXT NOT NULL REFERENCES question_roles(slug),
    provenance VARCHAR(50) NOT NULL DEFAULT 'Source-Verified Practice Question',
    source TEXT,
    PRIMARY KEY (question_id, role_slug)
);

CREATE TABLE IF NOT EXISTS question_company_roles (
    question_id VARCHAR(100) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    company_slug TEXT NOT NULL REFERENCES question_companies(slug),
    role_slug TEXT NOT NULL REFERENCES question_roles(slug),
    recruitment_stage TEXT NOT NULL DEFAULT 'General Practice',
    provenance VARCHAR(50) NOT NULL DEFAULT 'AI-Generated Practice Question',
    source TEXT,
    PRIMARY KEY (question_id, company_slug, role_slug, recruitment_stage)
);

CREATE TABLE IF NOT EXISTS question_review_events (
    review_id TEXT PRIMARY KEY,
    question_id VARCHAR(100) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    status VARCHAR(32) NOT NULL,
    reviewer_id TEXT NOT NULL,
    note TEXT NOT NULL,
    structural_status VARCHAR(40),
    answer_status VARCHAR(40),
    source_status VARCHAR(40),
    expert_review_status VARCHAR(40),
    evidence TEXT,
    reviewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS question_collections (
    collection_id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (owner_id, name)
);

CREATE TABLE IF NOT EXISTS question_collection_items (
    collection_id TEXT NOT NULL REFERENCES question_collections(collection_id) ON DELETE CASCADE,
    question_id VARCHAR(100) NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    position INTEGER NOT NULL DEFAULT 0,
    PRIMARY KEY (collection_id, question_id)
);

CREATE TABLE IF NOT EXISTS trainer_tests (
    test_id TEXT PRIMARY KEY,
    owner_id TEXT NOT NULL,
    title TEXT NOT NULL,
    role_name TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'Draft',
    total_time INTEGER NOT NULL DEFAULT 0,
    total_score NUMERIC(10,2) NOT NULL DEFAULT 0,
    test_data TEXT NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trainer_test_sections (
    section_id TEXT PRIMARY KEY,
    test_id TEXT NOT NULL REFERENCES trainer_tests(test_id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    section_type TEXT NOT NULL,
    time_limit INTEGER NOT NULL DEFAULT 0,
    questions_count INTEGER NOT NULL DEFAULT 0,
    score NUMERIC(10,2) NOT NULL DEFAULT 0,
    position INTEGER NOT NULL DEFAULT 0,
    section_data TEXT NOT NULL DEFAULT '{}'
);

ALTER TABLE trainer_test_sections ADD COLUMN IF NOT EXISTS section_data TEXT NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS trainer_test_questions (
    test_id TEXT NOT NULL REFERENCES trainer_tests(test_id) ON DELETE CASCADE,
    section_id TEXT NOT NULL REFERENCES trainer_test_sections(section_id) ON DELETE CASCADE,
    question_id VARCHAR(100) NOT NULL REFERENCES questions(id),
    position INTEGER NOT NULL DEFAULT 0,
    marks NUMERIC(10,2) NOT NULL DEFAULT 1,
    PRIMARY KEY (test_id, section_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_questions_review_category_topic
    ON questions(review_status, category, topic);
CREATE INDEX IF NOT EXISTS idx_questions_type_difficulty
    ON questions(question_type, difficulty);
CREATE INDEX IF NOT EXISTS idx_question_company_roles_company_role
    ON question_company_roles(company_slug, role_slug, question_id);
CREATE INDEX IF NOT EXISTS idx_question_role_links_role_question
    ON question_role_links(role_slug, question_id);
CREATE INDEX IF NOT EXISTS idx_question_review_events_question_date
    ON question_review_events(question_id, reviewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_question_collections_owner
    ON question_collections(owner_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_trainer_tests_owner
    ON trainer_tests(owner_id, updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_trainer_test_questions_question
    ON trainer_test_questions(question_id);
