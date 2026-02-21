# Implement RLS Policies

This plan outlines the SQL commands required to enable Row Level Security (RLS) and create appropriate policies for all tables in the Supabase database.

## User Review Required

> [!WARNING]
> Because your students do not log in (authentication is only for instructors), some tables must remain partially public so students can take quizzes. Specifically, `attempts` and `quiz_responses` must allow public inserts, and `quizzes`/`questions`/`options` must allow public reads. This means someone could theoretically submit a quiz using another student's ID, but they will **no longer be able to modify or delete** existing attempts or other users' chat messages.

## Proposed Changes

### Supabase SQL Editor

You will need to run the following SQL script in your Supabase SQL Editor to secure your database. This script enables RLS on all tables and sets up the correct permissions.

```sql
-- 1. Enable RLS on all tables
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE options ENABLE ROW LEVEL SECURITY;
ALTER TABLE attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_responses ENABLE ROW LEVEL SECURITY;

-- 2. Policies for chat_messages (Only the user who created them can access them)
CREATE POLICY "Users can insert their own messages" ON chat_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view their own messages" ON chat_messages FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own messages" ON chat_messages FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own messages" ON chat_messages FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- 3. Policies for quizzes
-- Anyone can view a quiz to take it
CREATE POLICY "Anyone can view quizzes" ON quizzes FOR SELECT USING (true);
-- Only the instructor who created it can modify it
CREATE POLICY "Instructors can insert their own quizzes" ON quizzes FOR INSERT TO authenticated WITH CHECK (auth.uid() = instructor_id);
CREATE POLICY "Instructors can update their own quizzes" ON quizzes FOR UPDATE TO authenticated USING (auth.uid() = instructor_id) WITH CHECK (auth.uid() = instructor_id);
CREATE POLICY "Instructors can delete their own quizzes" ON quizzes FOR DELETE TO authenticated USING (auth.uid() = instructor_id);

-- 4. Policies for questions
-- Anyone can read questions for a quiz
CREATE POLICY "Anyone can view questions" ON questions FOR SELECT USING (true);
-- Instructors can only modify questions for their own quizzes
CREATE POLICY "Instructors can insert questions for their quizzes" ON questions FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM quizzes WHERE id = quiz_id AND instructor_id = auth.uid())
);
CREATE POLICY "Instructors can update questions for their quizzes" ON questions FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM quizzes WHERE id = quiz_id AND instructor_id = auth.uid())
);
CREATE POLICY "Instructors can delete questions for their quizzes" ON questions FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM quizzes WHERE id = quiz_id AND instructor_id = auth.uid())
);

-- 5. Policies for options
-- Anyone can read options for a quiz
CREATE POLICY "Anyone can view options" ON options FOR SELECT USING (true);
-- Instructors can only modify options for questions in their own quizzes
CREATE POLICY "Instructors can insert options" ON options FOR INSERT TO authenticated WITH CHECK (
  EXISTS (SELECT 1 FROM questions q JOIN quizzes qu ON q.quiz_id = qu.id WHERE q.id = question_id AND qu.instructor_id = auth.uid())
);
CREATE POLICY "Instructors can update options" ON options FOR UPDATE TO authenticated USING (
  EXISTS (SELECT 1 FROM questions q JOIN quizzes qu ON q.quiz_id = qu.id WHERE q.id = question_id AND qu.instructor_id = auth.uid())
);
CREATE POLICY "Instructors can delete options" ON options FOR DELETE TO authenticated USING (
  EXISTS (SELECT 1 FROM questions q JOIN quizzes qu ON q.quiz_id = qu.id WHERE q.id = question_id AND qu.instructor_id = auth.uid())
);

-- 6. Policies for attempts
-- Anyone can submit an attempt
CREATE POLICY "Anyone can insert attempts" ON attempts FOR INSERT WITH CHECK (true);
-- Anyone can view an attempt (necessary for the results page to work)
CREATE POLICY "Anyone can view attempts" ON attempts FOR SELECT USING (true);
-- No one can update or delete attempts (immutable)

-- 7. Policies for quiz_responses
-- Anyone can submit responses
CREATE POLICY "Anyone can insert quiz_responses" ON quiz_responses FOR INSERT WITH CHECK (true);
-- Anyone can view responses for an attempt
CREATE POLICY "Anyone can view quiz_responses" ON quiz_responses FOR SELECT USING (true);
-- No one can update or delete responses (immutable)
```

## Verification Plan

### Manual Verification
1. I will ask you to run the SQL query above in your Supabase SQL Editor.
2. I will ask you to test the app:
   - Create a new quiz.
   - Take the quiz as a student and view the results.
   - Ensure you can still use the generate/chat feature.
3. If everything works as expected, RLS is successfully enabled and protecting your application from unauthorized data modification!
