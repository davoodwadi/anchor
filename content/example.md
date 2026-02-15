
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
