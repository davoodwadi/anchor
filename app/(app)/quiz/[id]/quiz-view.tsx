"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import QRCode from "react-qr-code";
import { cn } from "@/lib/utils";
import type { QuizStats } from "@/lib/quiz-stats";
import { AwTopBar, aw } from "@/components/aw2/shell";
import { Key } from "@/components/aw2/key";
import { useHotkeys } from "@/components/aw2/use-hotkeys";
import { CopyLinkBox, useShareLink } from "@/components/aw2/copy-link";

export type QuizViewQuestion = {
  id: string;
  text: string;
  options: { id: string; text: string; correct: boolean }[];
};

export type QuizViewAttempt = {
  id: string;
  student_number: string;
  score: number;
  total: number;
  submitted_at: string;
  quiz_responses: {
    question_id: string;
    selected_option_id: string;
    option: { is_correct: boolean } | null;
  }[];
};

export function QuizViewMindPlace({
  quiz,
  questions,
  attempts,
  stats,
}: {
  quiz: { id: string; title: string; createdAt: string };
  questions: QuizViewQuestion[];
  attempts: QuizViewAttempt[];
  stats: QuizStats;
}) {
  const router = useRouter();
  // -1 is the class overview; otherwise an index into attempts
  const [current, setCurrent] = useState(-1);
  const link = useShareLink(quiz.id);
  const attempt = current >= 0 ? attempts[current] : null;

  useHotkeys({
    escape: () => router.push("/dashboard"),
    p: () => router.push(`/quiz/${quiz.id}/preview`),
    c: () => document.querySelector<HTMLButtonElement>("[data-copy-link]")?.click(),
    arrowdown: () => setCurrent((c) => Math.min(attempts.length - 1, c + 1)),
    arrowup: () => setCurrent((c) => Math.max(-1, c - 1)),
  });

  return (
    <div className="min-h-svh grid grid-rows-[auto_1fr]">
      <AwTopBar
        left={
          <Link href="/dashboard" className={aw.chip}>
            <Key>Esc</Key>Dashboard
          </Link>
        }
        right={
          <Link href={`/quiz/${quiz.id}/preview`} className={aw.action}>
            <Key>P</Key>Preview
          </Link>
        }
      />

      <main className="grid gap-8 xl:gap-12 px-4 md:px-10 pt-[1vh] pb-16 items-start grid-cols-1 md:grid-cols-[minmax(220px,300px)_minmax(0,1fr)] xl:grid-cols-[minmax(240px,320px)_minmax(0,1fr)_minmax(280px,380px)]">
        <section>
          <div className={aw.kicker}>Quiz</div>
          <h1
            className={cn(
              aw.display,
              "uppercase mt-1.5 mb-2 [text-wrap:balance]",
              quiz.title.length > 24
                ? "text-[clamp(38px,3.6vw,56px)]"
                : "text-[clamp(44px,4.4vw,68px)]",
            )}
          >
            {quiz.title}
          </h1>
          <p className="flex flex-wrap gap-x-5 font-ui text-[15px] tracking-[.06em] text-aw-text-3 mb-6">
            <span>{questions.length} questions</span>
            <span>Created {format(new Date(quiz.createdAt), "MMM d, yyyy")}</span>
          </p>

          <button
            onClick={() => setCurrent(-1)}
            aria-current={current === -1 ? "true" : undefined}
            className={cn(aw.item, current === -1 ? aw.itemOn : aw.itemIdle)}
          >
            Overview
            <span className={aw.itemMeta}>All students</span>
          </button>

          <h2 className={cn(aw.groupTitle, "mt-4")}>
            Attempts <span className="tracking-[.04em]">{attempts.length}</span>
          </h2>
          {attempts.length === 0 ? (
            <p className="pl-4 font-prose text-[15px] text-aw-text-3">None yet</p>
          ) : (
            <ul>
              {attempts.map((a, i) => (
                <li key={a.id}>
                  <button
                    onClick={() => setCurrent(i)}
                    aria-current={i === current ? "true" : undefined}
                    className={cn(aw.item, i === current ? aw.itemOn : aw.itemIdle)}
                  >
                    <span className="truncate">{a.student_number}</span>
                    <span className={aw.itemMeta}>
                      {a.score}/{a.total}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section aria-live="polite" className={cn(aw.stage, "pt-1 max-w-[64ch]")}>
          {attempt ? (
            <AttemptDetail attempt={attempt} questions={questions} />
          ) : (
            <Overview stats={stats} questions={questions} />
          )}
        </section>

        <section className="md:col-span-2 xl:col-span-1 w-full max-w-[400px] justify-self-center xl:sticky xl:top-6">
          <div className="aw-paper aw-typed xl:rotate-[1.2deg] px-[10%] pt-[9%] pb-[8%] text-[14px] leading-[2]">
            <p className="font-bold tracking-[.14em] mb-[1em]">SHARE WITH STUDENTS</p>
            <div className="w-[62%] mx-auto mt-[.6em] mb-[1.2em] bg-white p-2 shadow-[0_2px_6px_rgba(0,0,0,.25)] -rotate-1">
              {link ? (
                <QRCode value={link} size={256} style={{ width: "100%", height: "auto" }} />
              ) : (
                <div className="aspect-square" />
              )}
            </div>
            <CopyLinkBox
              link={link}
              className="bg-transparent border-0 border-b border-dashed border-aw-ink/40 px-0 text-aw-ink [&_button]:text-aw-ink/70 [&_button:hover]:text-aw-ink"
            />
            <p className="font-hand uppercase text-[1.35em] leading-tight mt-[1em] -rotate-2">
              Students scan, enter a
              <br />
              student number, begin.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}

function Overview({
  stats,
  questions,
}: {
  stats: QuizStats;
  questions: QuizViewQuestion[];
}) {
  return (
    <>
      <div className={aw.label}>Overview</div>
      <dl className="grid grid-cols-3 gap-px bg-aw-line border border-aw-line mt-2.5 mb-6">
        <Stat label="Attempts" value={String(stats.attempts)} />
        <Stat
          label="Median"
          value={stats.median === null ? "—" : `${stats.median}/${questions.length}`}
        />
        <Stat label="Most missed" value={stats.mostMissed ? `Q${stats.mostMissed}` : "—"} />
      </dl>
      {stats.attempts === 0 ? (
        <p className="font-prose text-[16px] text-aw-text-2">
          No attempts yet. Share the link or QR code with your class.
        </p>
      ) : (
        <>
          <div className={cn(aw.label, "mb-1.5")}>Missed by</div>
          <ol>
            {questions.map((q, i) => {
              const rate = stats.missRate[i] ?? 0;
              const hot = stats.mostMissed === i + 1;
              return (
                <li
                  key={q.id}
                  className="grid grid-cols-[34px_1fr_56px] gap-x-3 gap-y-1.5 items-center py-2.5 border-t border-aw-line"
                >
                  <span className="font-display text-[20px] text-aw-text-3">{i + 1}</span>
                  <span className="font-prose text-[16px] leading-snug text-aw-text-2">
                    {q.text}
                  </span>
                  <span className="text-right font-ui font-medium text-[16px] text-aw-text">
                    {Math.round(rate * 100)}%
                  </span>
                  <span className="col-start-2 h-[5px] bg-[#2b2f2d]">
                    <i
                      className={cn("block h-full", hot ? "bg-aw-red" : "bg-aw-sage-dim")}
                      style={{ width: `${rate * 100}%` }}
                    />
                  </span>
                </li>
              );
            })}
          </ol>
        </>
      )}
    </>
  );
}

function AttemptDetail({
  attempt,
  questions,
}: {
  attempt: QuizViewAttempt;
  questions: QuizViewQuestion[];
}) {
  const byQuestion = new Map(attempt.quiz_responses.map((r) => [r.question_id, r]));
  return (
    <>
      <div className={aw.label}>
        Student {attempt.student_number}
        <span className="ml-5">
          {format(new Date(attempt.submitted_at), "MMM d, HH:mm")}
        </span>
      </div>
      <dl className="grid grid-cols-2 gap-px bg-aw-line border border-aw-line mt-2.5 mb-6">
        <Stat label="Score" value={`${attempt.score} / ${attempt.total}`} />
        <Stat label="Missed" value={String(attempt.total - attempt.score)} />
      </dl>
      <ol>
        {questions.map((q, i) => {
          const r = byQuestion.get(q.id);
          const chosen = q.options.find((o) => o.id === r?.selected_option_id);
          const correct = q.options.find((o) => o.correct);
          const ok = !!chosen?.correct;
          return (
            <li key={q.id} className="py-3 border-t border-aw-line">
              <p className="font-prose text-[16px] leading-snug text-aw-text-2 mb-1">
                {i + 1}. {q.text}
              </p>
              <p
                className={cn(
                  "font-prose text-[17px] leading-snug",
                  ok ? "text-aw-sage" : "text-[#d59591]",
                )}
              >
                {ok ? "✓" : "✗"} {chosen?.text ?? "No answer"}
              </p>
              {!ok && correct && (
                <p className="font-prose text-[15px] text-aw-text-3 mt-0.5">
                  Correct: {correct.text}
                </p>
              )}
            </li>
          );
        })}
      </ol>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-[rgba(14,16,15,.85)] px-4 py-3.5">
      <dt className={aw.label}>{label}</dt>
      <dd className="font-display text-[34px] leading-none text-aw-text mt-1.5">{value}</dd>
    </div>
  );
}
