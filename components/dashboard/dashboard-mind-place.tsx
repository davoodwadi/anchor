"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { QuizStats } from "@/lib/quiz-stats";
import type { StudySession } from "@/lib/study-sessions";
import { AwTopBar, aw } from "@/components/aw2/shell";
import { AwSide, AwSplit } from "@/components/aw2/collapsible-side";
import { Key } from "@/components/aw2/key";
import { useHotkeys } from "@/components/aw2/use-hotkeys";
import { CopyLinkBox, useShareLink } from "@/components/aw2/copy-link";
import { SignOutButton } from "@/components/aw2/sign-out-button";

export type DashboardQuiz = {
  id: string;
  title: string;
  createdAt: string;
  questionCount: number;
  stats: QuizStats;
  firstQuestion: { text: string; options: string[] } | null;
};

const LETTERS = ["a", "b", "c", "d", "e", "f"];

export function DashboardMindPlace({
  email,
  quizzes,
  recentSessions,
}: {
  email: string;
  quizzes: DashboardQuiz[];
  recentSessions: StudySession[];
}) {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const quiz = quizzes[current];
  const link = useShareLink(quiz?.id ?? "");

  useHotkeys({
    n: () => router.push("/create"),
    s: () => router.push("/generate"),
    enter: (e) => {
      if ((e.target as HTMLElement).closest("button, a")) return;
      if (quiz) router.push(`/quiz/${quiz.id}`);
    },
    c: () => document.querySelector<HTMLButtonElement>("[data-copy-link]")?.click(),
    arrowdown: () => setCurrent((c) => Math.min(quizzes.length - 1, c + 1)),
    arrowup: () => setCurrent((c) => Math.max(0, c - 1)),
  });

  return (
    <div className="min-h-svh grid grid-rows-[auto_1fr_auto]">
      <AwTopBar
        right={
          <>
            <span className="hidden sm:inline font-prose text-[15px] text-aw-text-2 truncate max-w-[240px]">
              {email}
            </span>
            <SignOutButton />
          </>
        }
      />

      <AwSplit
        className="grid gap-8 xl:gap-12 px-4 md:px-10 pt-[1vh] items-start grid-cols-1 md:grid-cols-[minmax(240px,340px)_minmax(0,1fr)] xl:grid-cols-[minmax(260px,360px)_minmax(0,1fr)_minmax(300px,460px)]"
        collapsedClassName="md:grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1fr)_minmax(300px,460px)]"
      >
        <AwSide className={aw.side}>
          <div className={aw.kicker}>Your quizzes</div>
          <h1 className={cn(aw.display, "text-[clamp(54px,5.6vw,84px)] mt-1.5 mb-6")}>
            THE DESK
          </h1>

          <h2 className={aw.groupTitle}>
            Quizzes <span className="tracking-[.04em]">{quizzes.length}</span>
          </h2>
          <ul className="mb-5">
            {quizzes.map((q, i) => (
              <li key={q.id}>
                <button
                  onClick={() => setCurrent(i)}
                  aria-current={i === current ? "true" : undefined}
                  className={cn(aw.item, i === current ? aw.itemOn : aw.itemIdle)}
                >
                  <span className="truncate">{q.title}</span>
                  <span className={aw.itemMeta}>
                    {q.stats.attempts || "—"}
                  </span>
                </button>
              </li>
            ))}
          </ul>

          <h2 className={aw.groupTitle}>Study</h2>
          <Link href="/generate" className={cn(aw.item, aw.itemIdle)}>
            Study session
            <span className={aw.itemMeta}>Explain and practise</span>
          </Link>
          {recentSessions.length > 0 && (
            <ul className="mt-1">
              {recentSessions.map((s) => (
                <li key={s.id}>
                  <Link
                    href={`/generate/${s.id}`}
                    className={cn(aw.item, aw.itemIdle)}
                  >
                    <span className="truncate">{s.title}</span>
                    <span className={aw.itemMeta}>{s.date}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </AwSide>

        <section className={cn(aw.stage, "pt-1 max-w-[58ch]", aw.stageWide)}>
          {quiz ? (
            <>
              <div className={aw.label}>
                Created {format(new Date(quiz.createdAt), "MMM d, yyyy")}
                <span className="ml-5">{quiz.questionCount} questions</span>
              </div>
              <h2 className="font-display font-normal normal-case tracking-normal border-0 pb-0 text-[clamp(30px,2.6vw,40px)] leading-[1.05] text-aw-text mt-2 mb-0">
                {quiz.title}
              </h2>

              <dl className="grid grid-cols-3 gap-px bg-aw-line border border-aw-line my-6">
                <Stat label="Attempts" value={String(quiz.stats.attempts)} />
                <Stat
                  label="Median"
                  value={
                    quiz.stats.median === null
                      ? "—"
                      : `${quiz.stats.median}/${quiz.questionCount}`
                  }
                />
                <Stat
                  label="Most missed"
                  value={quiz.stats.mostMissed ? `Q${quiz.stats.mostMissed}` : "—"}
                />
              </dl>

              <div className={aw.label}>Share link</div>
              <CopyLinkBox link={link} className="mt-2 mb-5" />
              {quiz.stats.attempts === 0 && (
                <p className="font-prose text-[16px] text-aw-text-2 mb-5">
                  No attempts yet. Share the link in class or on your LMS.
                </p>
              )}
              <Link href={`/quiz/${quiz.id}`} className={aw.action + " text-aw-text"}>
                <Key>Enter</Key>Open quiz
              </Link>
            </>
          ) : (
            <div className="pt-2">
              <p className="font-prose text-[18px] text-aw-text mb-2">
                No quizzes yet.
              </p>
              <p className="font-prose text-[16px] text-aw-text-2 mb-6 max-w-[44ch]">
                Upload your slides or readings and Anchor will draft the first
                one.
              </p>
              <Link href="/create" className={aw.button}>
                <Key className="bg-white/[.12] text-inherit">N</Key>New quiz
              </Link>
            </div>
          )}
        </section>

        <section
          aria-hidden="true"
          className="hidden xl:block w-full max-w-[460px] justify-self-center pt-1"
        >
          <div className="rotate-[2deg]">
            <div className="aw-paper aw-typed aspect-[1000/1296] w-full overflow-hidden px-[10%] pt-[11%] pb-[8%] text-[clamp(11px,.95vw,14px)] leading-[2.2]">
              {quiz?.firstQuestion ? (
                <>
                  <p className="font-bold mb-[1.6em]">{quiz.title.toUpperCase()}</p>
                  <p className="mb-[1em]">1. {quiz.firstQuestion.text}</p>
                  {quiz.firstQuestion.options.map((o, i) => (
                    <p key={i} className="pl-[3.6em] -indent-[1.6em]">
                      {LETTERS[i]}) {o}
                    </p>
                  ))}
                </>
              ) : (
                <p className="font-hand text-[1.6em] text-center mt-[40%] opacity-70 -rotate-3">
                  A blank page
                </p>
              )}
              {quiz && (
                <span className="absolute right-[9%] bottom-[8%] -rotate-[6deg] font-hand uppercase text-[1.6em] leading-tight text-right">
                  {quiz.stats.attempts ? (
                    <>
                      {quiz.stats.attempts} attempts
                      <br />
                      median {quiz.stats.median}/{quiz.questionCount}
                    </>
                  ) : (
                    "not shared yet"
                  )}
                </span>
              )}
            </div>
          </div>
        </section>
      </AwSplit>

      <nav className="flex flex-wrap items-center justify-center gap-x-9 gap-y-3 px-4 pt-7 pb-8">
        <Link href="/create" className={aw.action + " text-aw-text"}>
          <Key>N</Key>New quiz
        </Link>
        <Link href="/generate" className={aw.action}>
          <Key>S</Key>Study session
        </Link>
      </nav>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[rgba(14,16,15,.85)] px-4 py-3.5">
      <dt className={aw.label}>{label}</dt>
      <dd className="font-display text-[34px] leading-none text-aw-text mt-1.5">
        {value}
      </dd>
    </div>
  );
}
