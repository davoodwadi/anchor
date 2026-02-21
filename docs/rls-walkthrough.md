# RLS Security Audit & Implementation

## Overview

The user requested an audit of their application to understand whether disabling Supabase Row Level Security (RLS) is safe. Our analysis discovered that **disabling RLS would be highly unsafe** because the Supabase `Anon` key is shipped to the frontend client to initialize the Supabase client interface for normal queries. Because the application uses this public key, anyone with basic knowledge could spoof requests to the database via REST and manipulate data for *other* users in tables like `quizzes`, `attempts`, and `chat_messages`.

We successfully analyzed all queries in the repository to determine what policies each SQL table required and wrote a migration script that successfully locked down the data model.

## Implemented Policies

Row Level Security is enabled on six critical tables. 

### `chat_messages`
Chat messages are tied directly to an authenticated instructor user.
* **Selection/Updates/Deletes**: Restricted to `auth.uid() = user_id`.
* **Inserts**: Authenticated users can insert messages into their own sessions.

### `quizzes`, `questions`, & `options`
Quizzes hold the structure created by instructors that students must take.
* **Selection**: Because students are not authenticated, `quizzes`, `questions`, and `options` must be publicly readable.
* **Updates/Deletes/Inserts**: Only the `instructor_id` matching `auth.uid()` can modify quizzes. Because `questions` and `options` do not have an `instructor_id` directly, we use a join check `EXISTS (SELECT 1 FROM quizzes WHERE id = quiz_id AND instructor_id = auth.uid())` to cascade the permissions down.

### `attempts` & `quiz_responses`
When students submit their answers, an entry is added to `attempts` and `quiz_responses`.
* **Selection/Inserts**: Students only take the quiz using the provided `student_number` and are never authenticated via Supabase. Therefore, these tables must allow global selection and global inserts.
* **Updates/Deletes**: Once submitted, these records are purposefully immutable; no one (not even the instructor) can modify or delete attempts inside the client.
