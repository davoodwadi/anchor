# Anchor — Project Guidelines

Anchor is an AI-powered quiz creation platform for instructors. Instructors upload content (PDF/text), a Gemini conversation refines it into a quiz, and students take the quiz anonymously via a share link.

## Tech Stack

- **Next.js 15** — App Router, React Server Components, Server Actions
- **Supabase** — PostgreSQL + GoTrue auth (cookie-based SSR sessions)
- **Google Gemini** (`gemini-3-flash-preview`) — structured quiz generation via `@google/genai`
- **Zod 4** — runtime validation; schemas in `types/QuizTypes.ts` double as Gemini structured output schemas
- **shadcn/ui** (New York style) + **Tailwind CSS** — see [Styling](#styling)

## Build & Dev

```bash
pnpm dev       # start dev server (localhost:3000)
pnpm build     # production build
pnpm lint      # ESLint
```

No test runner is configured.

## MCP Tools

- Use `shadcn` MCP tool for components.
- Use `supabase` MCP tool for database documentation and schema.
- Use `io.github.vercel/next-devtools-mcp` tool for the latest Next.js docs and best practices.
  ⚠️ IMPORTANT: Start every Next.js session by calling the init tool to set up proper context:
  Use the init tool to set up Next.js DevTools context

## Architecture

### Route Groups

| Group       | Path                                                    | Auth                        |
| ----------- | ------------------------------------------------------- | --------------------------- |
| `(general)` | `/`                                                     | Public — landing page       |
| `(app)`     | `/dashboard`, `/create`, `/generate/[id]`, `/quiz/[id]` | Authenticated instructors   |
| `take/[id]` | `/take/[id]`                                            | Public — anonymous students |
| `auth/`     | `/auth/*`                                               | Unauthenticated             |

### Data Flow

- **Server Actions** live in `actions/` with `"use server"`. Always call `createClient()` from `lib/supabase/server.ts` (fresh per invocation — required for Fluid compute) and perform auth checks inline.
- **Page components never await params directly.** Pass `params: Promise<{id}>` down to a `<Suspense>`-wrapped child that resolves them. See `app/take/[id]/page.tsx` as the canonical example.
- **Forms** use `useActionState` (not `useFormState`).

### Supabase

- Server-side: `createClient()` from `lib/supabase/server.ts` — cookie-based, RSC / Server Action safe.
- Client-side: `createBrowserClient()` from `lib/supabase/client.ts`.
- Env vars: `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` (newer publishable key format, not `ANON_KEY`).
- RLS is fully enabled. See [docs/rls-implementation.md](../docs/rls-implementation.md) for policies.

### Gemini Integration

- Remove the `$schema` key before passing a Zod-derived JSON schema to Gemini — it causes the API to reject the request.
- For uploaded PDFs, force `mimeType: "application/pdf"` explicitly; don't rely on detection.
- Generation logic and chat history: `actions/generate-actions.ts`.

## Conventions

### TypeScript

- Strict mode. Path alias `@/*` → project root.
- Types and Zod schemas live in `types/QuizTypes.ts`; use `z.infer<typeof Schema>` for derived types.

### Component Organization

```
components/ui/         # shadcn primitives (don't modify directly)
components/shared/     # design-system components (WakeButton, ProgressBar, etc.)
components/{domain}/   # feature components (quiz/, dashboard/, auth/)
```

- Use `components/shared/wake-button.tsx` for all styled buttons and button-like links — it renders either `<Link>` or `<button>` based on whether `href` is passed.

### Naming

- Files: kebab-case for most; PascalCase is acceptable for component files in `components/`.
- Server actions: camelCase with `Action` suffix (e.g., `generateQuizAction`).

## Styling

Theme: **Alan Wake 2** — brutalist, cinematic, high-contrast. See the `style-rules` skill for full guidelines when generating or editing UI.

Key rules:

- Border radius is `0px` everywhere — no rounded corners.
- Heading font: **Oswald** (`font-heading`). Body font: **Lora** (`font-body`).
- Dark mode is primary. Use `neon-red` (`#F51A28`) sparingly for primary actions and focus states. Never use default Tailwind reds.
- Light mode ("Saga's Reality"): bone white `#EFECE6`, forest green primary.
- No gradients. Shadows are deep and directional.

## Known Issues

- Sign-up incorrectly redirects to the success page when the user already exists. See `TODO.md`.
