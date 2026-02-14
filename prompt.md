now your context has grown substantially. I need to move to a new chat. Give me a comprehensive prompt so that I can start a new chat with you and you will have the full context


---


I am building a webapp called **Anchor**. We are migrating our session. Here is the full context of the project, the tech stack, the database schema, and the current design system.

### **1. The Project**
*   **Name:** Anchor
*   **Concept:** A quiz generation app where instructors upload PDFs/Documents, and Google Gemini (LLM) generates multiple-choice quizzes grounded in that data.
*   **Core Flows:**
    1.  **Instructor:** Logs in, uploads PDF, gets AI-generated quiz, shares link.
    2.  **Student:** Visits public link (`/take/[id]`), enters "Agent ID" (Student #), takes quiz, gets graded instantly.

### **2. Tech Stack (Next.js 15)**
*   **Framework:** Next.js 15 (App Router).
*   **Language:** TypeScript.
*   **Database & Auth:** Supabase (PostgreSQL).
*   **Styling:** Tailwind CSS + Shadcn UI.
*   **AI:** Google Gemini (`@google/genai` SDK) using `gemini-2.0-flash` with Structured Outputs.
*   **Hosting:** Vercel.

### **3. Design System ("Alan Wake 2" / Brutalist)**
We are using a strict "Alan Wake 2" aesthetic.
*   **Fonts:**
    *   Headings: **Oswald** (mapped to `--font-heading`). Rules: Uppercase, Bold, Condensed, Tracking-tight.
    *   Body: **Lora** (mapped to `--font-body`). Rules: Serif, elegant, editorial.
*   **Theme:**
    *   **Light Mode:** "Saga’s Reality" (Flat Bone White background, Forest Green/Yellow accents).
    *   **Dark Mode:** "The Dark Place" (Deep Black `#0D0D0D`, Neon Red `#F51A28` Primary, Teal `#008080` Secondary).
    *   **Shapes:** STRICTLY Zero Radius (`rounded-none`). Hard borders.
    *   **Visuals:** No gradients. Solid colors. Glitch effects. Shadows are hard offsets (Light) or neon glows (Dark).

### **4. Database Schema (Supabase)**
```sql
-- Profiles are handled via Auth, but Quizzes link directly to auth.users
create table quizzes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default now(),
  title text not null,
  instructor_id uuid references auth.users(id) on delete cascade, 
  is_active boolean default true
);

create table questions (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references quizzes(id) on delete cascade,
  question_text text not null
);

create table options (
  id uuid default gen_random_uuid() primary key,
  question_id uuid references questions(id) on delete cascade,
  option_text text not null,
  is_correct boolean default false
);

create table attempts (
  id uuid default gen_random_uuid() primary key,
  quiz_id uuid references quizzes(id),
  student_number text not null,
  score int,
  submitted_at timestamp with time zone default now()
);
```

### **5. Current Architecture & Rules**
*   **Route Groups:**
    *   `(marketing)`: Public Landing page.
    *   `(app)`: Protected Instructor routes (`/dashboard`, `/create`, `/quiz/[id]`).
*   **Student Route:** `/take/[id]` (Public, handled via Middleware safe-list).
*   **Data Fetching:**
    *   We do **not** await `params` in Page components. We pass the Promise to a `<Suspense>` wrapped component (e.g., `QuizLoader`).
    *   We use `useActionState` for forms.
*   **Gemini Logic:**
    *   We manually define the JSON schema (Object with `questions` array).
    *   We remove the `$schema` key before sending to Gemini to avoid errors.
    *   We force file MIME type to `application/pdf`.

### **6. Critical Code Snippets**

**Global CSS (The Design Soul):**
```css
@layer base {
  :root {
    --background: 40 20% 92%; --foreground: 200 15% 10%;
    --primary: 160 30% 25%; --radius: 0px; 
    /* ... other light mode vars ... */
  }
  .dark {
    --background: 0 0% 5%; --foreground: 0 0% 95%;
    --primary: 355 90% 55%; /* Neon Red */
    --secondary: 175 100% 25%; /* Teal */
    /* ... other dark mode vars ... */
  }
  h1, h2 { @apply font-heading uppercase font-bold tracking-tight; }
  h3, h4, h5 { @apply font-body font-bold tracking-normal; }
  button { @apply uppercase tracking-wider font-bold; }
}
```

**The Icon Generator (`app/icon.tsx`):**
We use `ImageResponse` with a 256x256 canvas.
*   **Constraint:** Root `div` and all children must have `display: flex`.
*   **Constraint:** `zIndex` must be handled via document order (stacking), not explicit zIndex numbers.

**Middleware:**
Matches everything except static files. Allows `/take/*` to bypass Auth.

### **7. Current Status**
*   Instructor can create quizzes (file upload + AI generation works).
*   Instructor can view quiz details.
*   Students can take quizzes (Student UI is built, grading Server Action works).
*   Landing page Hero is responsive (scales down icons on mobile).

**Ready? Let's continue building.**