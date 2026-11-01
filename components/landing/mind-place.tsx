"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Key } from "@/components/aw2/key";
import { useHotkeys } from "@/components/aw2/use-hotkeys";
import { QuizLinkForm } from "./quiz-link-form";

type Step = {
  label: string;
  group: "instructors" | "students";
  icon: React.ReactNode;
  text: string[];
  sheet: React.ReactNode;
};

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  className: "size-[22px]",
} as const;

const STEPS: Step[] = [
  {
    label: "The source",
    group: "instructors",
    icon: (
      <svg {...iconProps}>
        <path d="M6 3h8l4 4v14H6z" />
        <path d="M14 3v4h4M9 12h6M9 16h6" />
      </svg>
    ),
    text: [
      "Start with what you already want to learn. Lecture slides, PDFs, assigned readings, your own notes.",
      "Anchor reads them and drafts questions grounded only in those files.",
    ],
    sheet: (
      <>
        <p className="indent-[2.6em]">Week 7. Memory and encoding.</p>
        <div className="h-[2.25em]" />
        <p className="indent-[2.6em]">
          Retrieval is not a neutral readout of what was stored. Each act of
          recall changes the memory, making it more durable and easier to reach
          again.
        </p>
        <div className="h-[2.25em]" />
        <p className="indent-[2.6em]">
          In Roediger and Karpicke&apos;s 2006 study, students who were tested
          on a passage remembered more of it a week later than students who
          reread it.
        </p>
        <span className="absolute right-[7%] bottom-[9%] -rotate-[4deg] font-hand uppercase text-[1.35em] leading-tight">
          → Good quiz material
        </span>
      </>
    ),
  },
  {
    label: "The draft",
    group: "instructors",
    icon: (
      <svg {...iconProps}>
        <path d="M4 20l4-1 11-11-3-3L5 16z" />
        <path d="M14 6l3 3" />
      </svg>
    ),
    text: [
      "Anchor writes the first draft. You revise it the way you'd mark up a TA's work: in plain language, in conversation.",
      "Harder distractors. Fewer definitions. One more question on the reading. Keep going until every question is one you'd sign.",
    ],
    sheet: (
      <>
        <p>3. What is the testing effect?</p>
        <p className="pl-[2.4em]">
          a){" "}
          <span className="aw-scribble">Studying is better than testing</span>
        </p>
        <p className="pl-[2.4em]">
          <span className="aw-scribble">
            b) Testing is better than studying
          </span>
        </p>
        <div className="font-hand uppercase text-[1.35em] leading-tight my-[.4em] mb-[1.1em] ml-[1.6em] -rotate-[2.5deg] origin-left">
          ↳ Too easy. Make all four plausible.
        </div>
        <p className="pl-[2.4em]">a) Rereading improves recall at all delays</p>
        <p className="pl-[2.4em]">b) Retrieval improves long-term retention</p>
        <p className="pl-[2.4em]">
          c) Testing helps only immediately after study
        </p>
        <p className="pl-[2.4em]">d) Spaced reading outperforms testing</p>
        <span className="absolute right-[8%] bottom-[12%] -rotate-[4deg] font-hand uppercase text-[1.35em] leading-tight">
          ✓ Add 2 on retrieval
          <br />
          practice
        </span>
      </>
    ),
  },
  {
    label: "The link",
    group: "instructors",
    icon: (
      <svg {...iconProps}>
        <path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" />
        <path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" />
      </svg>
    ),
    text: [
      "Share one link in class or on your LMS. Students don't make accounts. They enter a student number and begin.",
      "Every attempt lands on your dashboard: scores, and the questions the room got wrong.",
    ],
    sheet: (
      <>
        <p>WEEK 7. RETRIEVAL. 12 QUESTIONS.</p>
        <div className="h-[2.25em]" />
        <p>anchor.app/take/7f3c-retrieval</p>
        <div className="h-[2.25em]" />
        <p>Attempts ........... 64</p>
        <p>Median ........... 9/12</p>
        <p>Most missed ........ Q5</p>
        <span className="absolute left-[14%] bottom-[16%] -rotate-[4deg] font-hand uppercase text-[1.35em] leading-tight">
          Review Q5 on Thursday
        </span>
      </>
    ),
  },
  {
    label: "The results",
    group: "students",
    icon: (
      <svg {...iconProps}>
        <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />
      </svg>
    ),
    text: [
      "Rereading feels like studying. A quiz shows you whether it was.",
      "When you finish, you see each answer you got wrong next to the correct one and the passage it came from.",
    ],
    sheet: (
      <>
        <p>5. When was the testing advantage largest?</p>
        <p className="pl-[2.4em]">
          <span className="font-hand text-[1.4em]">✗</span> Two days
        </p>
        <p className="pl-[2.4em]">
          <span className="aw-ringed">One week</span>
        </p>
        <div className="h-[2.25em]" />
        <p className="indent-[2.6em]">
          &ldquo;Testing produced better retention after one week than
          restudying the material.&rdquo; Week 7 reading, p. 4.
        </p>
        <span className="absolute right-[10%] bottom-[12%] -rotate-[4deg] font-hand uppercase text-[2.2em] leading-tight">
          9 / 12
        </span>
      </>
    ),
  },
];

const GROUPS = [
  { id: "instructors", label: "For instructors" },
  { id: "students", label: "For students" },
] as const;

export function MindPlace({ auth }: { auth: React.ReactNode }) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [seen, setSeen] = useState<Set<number>>(() => new Set([0]));
  const [linkOpen, setLinkOpen] = useState(false);

  const show = (i: number) => {
    const next = (i + STEPS.length) % STEPS.length;
    setCurrent(next);
    setSeen((s) => new Set(s).add(next));
  };

  useHotkeys({
    arrowdown: () => show(current + 1),
    arrowup: () => show(current - 1),
    c: () => router.push("/create"),
    l: (e) => {
      e.preventDefault();
      setLinkOpen(true);
    },
  });

  const step = STEPS[current];
  const unseen = STEPS.length - seen.size;

  return (
    <div className="relative z-10 min-h-svh grid grid-rows-[auto_1fr_auto]">
      <header className="grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:px-10 py-5">
        <Link
          href="/"
          className="justify-self-start font-display text-[22px] tracking-[.14em] text-aw-text"
        >
          ANCHOR
        </Link>
        <nav
          aria-label="How it works"
          className="hidden md:flex items-center gap-1.5"
        >
          {STEPS.map((s, i) => (
            <button
              key={s.label}
              onClick={() => show(i)}
              title={s.label}
              aria-label={s.label}
              aria-current={i === current ? "step" : undefined}
              className={cn(
                "relative grid place-items-center w-[46px] h-11 text-aw-text-2 hover:text-aw-text",
                i === current &&
                  "text-aw-text bg-white/[.06] shadow-[inset_0_-2px_0_#e4e8e5]",
              )}
            >
              {!seen.has(i) && (
                <span className="aw-unread absolute -top-1.5 left-1/2 -translate-x-1/2" />
              )}
              {s.icon}
            </button>
          ))}
        </nav>
        <div className="justify-self-end">{auth}</div>
      </header>

      <main className="grid gap-8 lg:gap-12 px-4 md:px-10 pt-[2vh] items-start grid-cols-1 md:grid-cols-[minmax(240px,320px)_minmax(0,1fr)] xl:grid-cols-[minmax(260px,360px)_minmax(0,1fr)_minmax(320px,520px)]">
        <section>
          <div className="aw-kicker !text-[14px] text-aw-text-3">
            Quizzes from your course material
          </div>
          <h1 className="font-display font-normal normal-case tracking-normal text-aw-sage text-[clamp(54px,6.4vw,92px)] leading-[.9] mt-2 mb-5">
            READ IT.
            <br />
            THEN PROVE IT.
          </h1>
          <p className="font-prose text-[17px] leading-relaxed text-aw-text-2 max-w-[34ch] mb-7">
            Anchor turns your slides and readings into a quiz, lets you revise
            it in conversation, and shares it with one link.
          </p>

          <div className="flex gap-5 font-ui text-[19px] uppercase tracking-[.06em] mb-4">
            <span className="text-aw-text border-b-2 border-aw-text pb-1">
              All
            </span>
            <span className="text-aw-text-2 inline-flex items-center gap-2">
              Unread {unseen > 0 && <span className="aw-unread" />}
            </span>
          </div>

          {GROUPS.map((g) => {
            const items = STEPS.map((s, i) => ({ s, i })).filter(
              ({ s }) => s.group === g.id,
            );
            return (
              <div key={g.id} className="mb-4">
                <h3 className="font-ui font-medium text-[17px] tracking-[.16em] uppercase text-aw-text-2 mb-1.5 flex gap-3.5">
                  {g.label}
                  <span className="tracking-[.04em]">
                    {items.filter(({ i }) => seen.has(i)).length}/{items.length}
                  </span>
                </h3>
                {items.map(({ s, i }) => (
                  <button
                    key={s.label}
                    onClick={() => show(i)}
                    aria-current={i === current ? "step" : undefined}
                    className={cn(
                      "relative flex items-center gap-2 w-full text-left py-1 pl-4 font-ui font-medium text-[19px] leading-snug tracking-[.02em] uppercase",
                      i === current
                        ? "text-aw-text before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-aw-text"
                        : "text-aw-text-2 hover:text-aw-text",
                    )}
                  >
                    {s.label}
                    {!seen.has(i) && <span className="aw-unread" />}
                  </button>
                ))}
              </div>
            );
          })}
        </section>

        <section
          aria-live="polite"
          className="md:border-l md:border-white/20 md:pl-9 pt-3 max-w-[52ch] min-h-[300px]"
        >
          <div>
            <div className="aw-kicker !text-[14px] !tracking-[.16em] text-aw-text-3 mb-3.5">
              {step.label}
            </div>
            {step.text.map((t) => (
              <p
                key={t}
                className="font-prose text-[18px] leading-[1.65] text-aw-text mb-4 [text-shadow:0_1px_8px_rgba(0,0,0,.8)]"
              >
                {t}
              </p>
            ))}
          </div>
        </section>

        <section
          aria-hidden="true"
          className="md:col-span-2 xl:col-span-1 w-full max-w-[520px] justify-self-center pt-1"
        >
          <div className="rotate-[2.4deg]">
            <div
              className="aw-paper aw-typed aspect-[1000/1296] w-full overflow-hidden px-[10%] pt-[11%] pb-[8%] text-[clamp(11px,1.02vw,14.5px)] leading-[2.25]"
            >
              {step.sheet}
            </div>
          </div>
        </section>
      </main>

      <nav
        aria-label="Get started"
        className="flex flex-wrap items-center justify-center gap-x-9 gap-y-3 px-4 pt-7 pb-8 font-ui text-[20px] uppercase tracking-[.05em]"
      >
        <Link
          href="/create"
          className="inline-flex items-center gap-2.5 text-aw-text"
        >
          <Key>C</Key>Create a quiz
        </Link>
        {linkOpen ? (
          <QuizLinkForm onClose={() => setLinkOpen(false)} />
        ) : (
          <button
            onClick={() => setLinkOpen(true)}
            className="inline-flex items-center gap-2.5 text-aw-text-2 hover:text-aw-text font-medium"
          >
            <Key>L</Key>I have a quiz link
          </button>
        )}
      </nav>
    </div>
  );
}
