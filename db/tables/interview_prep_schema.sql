-- ========== INTERVIEW PREP MODULE FULL SQL SCHEMA ==========

-- 1. Subjects
CREATE TABLE subjects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  modified_at TIMESTAMP DEFAULT now()
);

-- 2. Topics
CREATE TABLE topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  modified_at TIMESTAMP DEFAULT now()
);

-- 3. Sub-Topics
CREATE TABLE sub_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  modified_at TIMESTAMP DEFAULT now()
);

-- 4. Interview Questions
CREATE TABLE interview_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sub_topic_id UUID REFERENCES sub_topics(id) ON DELETE CASCADE,
  question_title TEXT NOT NULL,
  difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  tags TEXT[],
  gist_id TEXT NOT NULL,
  question_file TEXT DEFAULT 'question.md',
  is_active BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_by UUID,
  created_at TIMESTAMP DEFAULT now(),
  modified_at TIMESTAMP DEFAULT now()
);

-- 5. Optional: Multiple Answers Table
CREATE TABLE interview_question_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
  answer_text TEXT,
  gist_id TEXT,
  file_names TEXT[],
  is_best BOOLEAN DEFAULT FALSE,
  created_by UUID,
  is_active BOOLEAN DEFAULT TRUE,
  is_deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now(),
  modified_at TIMESTAMP DEFAULT now()
);

-- 6. Question Audit Logs
CREATE TABLE question_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
  event TEXT NOT NULL,
  note TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- 7. Per-User Flags per Question
CREATE TABLE question_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
  is_read BOOLEAN DEFAULT FALSE,
  is_understood BOOLEAN DEFAULT FALSE,
  is_confident BOOLEAN DEFAULT FALSE,
  is_important BOOLEAN DEFAULT FALSE,
  priority INTEGER DEFAULT 0,
  snoozed_until DATE,
  top_order INTEGER,
  created_at TIMESTAMP DEFAULT now(),
  modified_at TIMESTAMP DEFAULT now(),
  UNIQUE (user_id, question_id)
);

-- 8. Question Comments
CREATE TABLE question_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  comment_text TEXT NOT NULL,
  is_additional_answer BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

-- 9. Question Sandbox URLs
CREATE TABLE question_sandbox_urls (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  url TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- 10. Question Types
CREATE TABLE question_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('conceptual', 'theory', 'practical', 'coding', 'scenario'))
);

-- 11. Question Tags
CREATE TABLE question_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID REFERENCES interview_questions(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  is_system_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

-- 12. Topic Keywords
CREATE TABLE topic_keywords (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  definition TEXT,
  created_at TIMESTAMP DEFAULT now()
);
