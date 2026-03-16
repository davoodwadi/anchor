# Anchor

An AI-powered quiz creation platform for instructors. Upload course content, refine it into a quiz through a Gemini conversation, then share a link for students to take anonymously.

## Stack

- **Next.js 15** — App Router, React Server Components, Server Actions
- **Supabase** — PostgreSQL database + GoTrue cookie-based auth
- **Google Gemini** (`gemini-3-flash-preview`) — structured quiz generation via `@google/genai`
- **Zod 4** — runtime validation + Gemini structured output schemas
- **shadcn/ui** (New York) + **Tailwind CSS** — Alan Wake 2 brutalist theme

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm
- A [Supabase project](https://database.new)
- A Google AI API key

### Setup

1. Clone the repo and install dependencies:

   ```bash
   pnpm install
   ```

2. Copy the environment template and fill in your values:

   ```bash
   cp .env.example .env.local
   ```

   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-publishable-key
   GEMINI_API_KEY=your-google-ai-api-key
   ```

   > **Note:** Supabase uses a newer **publishable key** format (`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`). Your dashboard may show `ANON_KEY` — the value is interchangeable during the transition period.

3. Apply the database schema and RLS policies. See [docs/rls-implementation.md](docs/rls-implementation.md) for the full migration SQL.

4. Start the dev server:

   ```bash
   pnpm dev
   ```

   The app runs at [localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
|---|---|
| `pnpm dev` | Start development server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

## Architecture

### Routes

| Route | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/dashboard` | Instructor | Quiz list and attempt overview |
| `/create` | Instructor | Upload content to start a quiz session |
| `/generate/[id]` | Instructor | Gemini conversation to refine the quiz |
| `/quiz/[id]` | Instructor | View quiz, copy share link |
| `/take/[id]` | Public | Anonymous student quiz-taking |
| `/auth/*` | Public | Login, sign-up, password reset |

### Key Directories

```
actions/          # Server Actions ("use server") — quiz submission, AI generation
app/              # Next.js App Router pages and layouts
components/
  ui/             # shadcn/ui primitives (do not modify directly)
  shared/         # Design-system components (WakeButton, ProgressBar, etc.)
  quiz/           # Quiz feature components
  dashboard/      # Dashboard feature components
  auth/           # Auth form components
docs/             # RLS policy documentation
lib/supabase/     # Supabase client helpers (server + browser)
types/            # Zod schemas and inferred TypeScript types
```

### Database Schema

```
quizzes          — id, title, instructor_id, is_active
questions        — id, quiz_id, question_text
options          — id, question_id, option_text, is_correct
attempts         — id, quiz_id, student_number, score, total, submitted_at
quiz_responses   — id, attempt_id, question_id, selected_option_id
chat_messages    — id, session_id, user_id, role, type, content, extracted_text
```

RLS is fully enabled on all tables. See [docs/rls-implementation.md](docs/rls-implementation.md) for policies and [docs/rls-walkthrough.md](docs/rls-walkthrough.md) for rationale.

## Development Notes

- **Params pattern:** Page components never `await params` directly. The `Promise<{id}>` is passed into a `<Suspense>`-wrapped child component that resolves it. See `app/take/[id]/page.tsx`.
- **Server Actions:** Always call `createClient()` from `lib/supabase/server.ts` fresh per invocation (required for Fluid compute). Auth checks happen inline.
- **Forms:** Use `useActionState`, not the deprecated `useFormState`.
- **Gemini schemas:** Strip the `$schema` key from any Zod-derived JSON schema before passing it to the Gemini API — it will reject the request otherwise. Force `mimeType: "application/pdf"` explicitly for PDF uploads.
- **Buttons:** Use `components/shared/wake-button.tsx` for all styled buttons and link-buttons. It renders `<Link>` or `<button>` based on whether `href` is provided.

## Feedback and issues

Please file feedback and issues over on the [Supabase GitHub org](https://github.com/supabase/supabase/issues/new/choose).

## More Supabase examples

- [Next.js Subscription Payments Starter](https://github.com/vercel/nextjs-subscription-payments)
- [Cookie-based Auth and the Next.js 13 App Router (free course)](https://youtube.com/playlist?list=PL5S4mPUpp4OtMhpnp93EFSo42iQ40XjbF)
- [Supabase Auth and the Next.js App Router](https://github.com/supabase/supabase/tree/master/examples/auth/nextjs)
