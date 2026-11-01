"use client";

import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Key } from "@/components/aw2/key";
import { aw } from "@/components/aw2/shell";
import { useHotkeys } from "@/components/aw2/use-hotkeys";
import type { Question } from "./quiz-taker";

interface QuizPaperProps {
  quizTitle: string;
  studentId: string;
  questions: Question[];
  isPending: boolean;
  error: string | null;
  onSubmit: (answers: Record<string, string>) => void;
}

const LETTERS = ["a", "b", "c", "d", "e", "f"];
const PLAIN_KEY = "anchor:plain-text";

function readPlainPref() {
  try {
    return localStorage.getItem(PLAIN_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * One typed sheet per question on a lamp-lit desk. Students circle answers
 * directly on the paper; the question list on the left tracks progress.
 */
export function QuizPaper({
  quizTitle,
  studentId,
  questions,
  isPending,
  error,
  onSubmit,
}: QuizPaperProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [hintsOpen, setHintsOpen] = useState<Record<string, boolean>>({});
  const [plain, setPlain] = useState(readPlainPref);
  const currentRef = useRef(0);

  const total = questions.length;
  const answered = Object.keys(answers).length;
  const allAnswered = answered === total;
  const q = questions[current];
  const hintOpen = !!hintsOpen[q.id];

  const go = (i: number) => {
    if (i < 0 || i >= total || i === currentRef.current) return;
    currentRef.current = i;
    setCurrent(i);
  };

  const pick = (optionIndex: number) => {
    const at = currentRef.current;
    const question = questions[at];
    const option = question.options[optionIndex];
    if (!option || isPending) return;
    const next = { ...answers, [question.id]: option.id };
    setAnswers(next);
    // Turn to the next unanswered page after a beat, so the circle is seen
    setTimeout(() => {
      if (currentRef.current !== at) return;
      for (let k = 1; k < total; k++) {
        const j = (at + k) % total;
        if (!next[questions[j].id]) return go(j);
      }
    }, 450);
  };

  const toggleHint = () => {
    if (!q.hint) return;
    setHintsOpen((h) => ({ ...h, [q.id]: !h[q.id] }));
  };

  const togglePlain = () => {
    setPlain((p) => {
      try {
        localStorage.setItem(PLAIN_KEY, p ? "0" : "1");
      } catch {
        // Preference just won't persist
      }
      return !p;
    });
  };

  const submit = () => {
    if (allAnswered && !isPending) onSubmit(answers);
  };

  useHotkeys({
    "1": () => pick(0),
    "2": () => pick(1),
    "3": () => pick(2),
    "4": () => pick(3),
    q: () => go(currentRef.current - 1),
    arrowleft: () => go(currentRef.current - 1),
    e: () => go(currentRef.current + 1),
    arrowright: () => go(currentRef.current + 1),
    h: toggleHint,
    t: togglePlain,
    enter: (e) => {
      // Let Enter activate whatever button has focus instead
      if ((e.target as HTMLElement).closest("button, a")) return;
      submit();
    },
  });

  const footerNote = !answers[q.id]
    ? "Circle one answer."
    : current < total - 1
      ? "Turn the page →"
      : "Last page.";

  return (
    <div className="relative z-10 min-h-svh grid grid-rows-[auto_1fr_auto]">
      <header className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 md:px-10 py-5">
        <span className="font-display text-[20px] tracking-[.14em] text-aw-text">
          ANCHOR
        </span>
        <div className="hidden md:block aw-kicker !text-[14px] text-aw-text-2 text-center truncate max-w-[50vw]">
          {quizTitle}
        </div>
        <button
          onClick={togglePlain}
          aria-pressed={plain}
          title="Switch between typewriter and plain text"
          className="justify-self-end inline-flex items-center gap-2.5 bg-[rgba(30,32,31,.7)] px-3 py-2 font-ui font-medium text-[17px] uppercase tracking-[.06em] text-aw-text hover:bg-[rgba(46,49,47,.8)]"
        >
          <Key>T</Key>
          {plain ? "Typewriter" : "Plain text"}
        </button>
      </header>

      <main className="grid gap-3.5 md:gap-10 px-4 md:px-10 pt-[1vh] items-start grid-cols-1 md:grid-cols-[minmax(180px,240px)_minmax(0,1fr)] xl:grid-cols-[minmax(200px,280px)_minmax(0,1fr)_minmax(0,200px)]">
        {/* Question list */}
        <nav aria-label="Questions" className={aw.side}>
          <h3 className="hidden md:flex gap-3.5 font-ui font-medium text-[17px] tracking-[.16em] uppercase text-aw-text-2 mb-2">
            Questions{" "}
            <span className="tracking-[.04em]">
              {answered}/{total}
            </span>
          </h3>
          <ol className="flex md:block gap-1.5 overflow-x-auto pb-1.5 md:pb-0">
            {questions.map((question, i) => {
              const chosen = question.options.findIndex(
                (o) => o.id === answers[question.id],
              );
              return (
                <li key={question.id}>
                  <button
                    onClick={() => go(i)}
                    aria-current={i === current ? "step" : undefined}
                    aria-label={`Question ${i + 1}${chosen >= 0 ? `, answered ${LETTERS[chosen]}` : ", unanswered"}`}
                    className={cn(
                      "relative flex items-center gap-2 whitespace-nowrap font-ui font-medium text-[19px] leading-snug tracking-[.02em] uppercase",
                      "px-2.5 py-1.5 border border-aw-line md:w-full md:border-0 md:px-0 md:py-1 md:pl-4 text-left",
                      i === current
                        ? "text-aw-text border-aw-text-2 md:before:absolute md:before:left-0 md:before:top-1.5 md:before:bottom-1.5 md:before:w-0.5 md:before:bg-aw-text"
                        : "text-aw-text-2 hover:text-aw-text",
                    )}
                  >
                    <span className="hidden md:inline">Question</span> {i + 1}
                    {chosen >= 0 ? (
                      <span className="ml-auto pl-2 text-[15px] tracking-[.06em] text-aw-text-3">
                        {LETTERS[chosen].toUpperCase()}
                      </span>
                    ) : (
                      <span className="aw-unread" />
                    )}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="hidden md:grid gap-2 mt-6 font-ui text-[14px] tracking-[.06em] uppercase text-aw-text-3">
            <span className="inline-flex items-center gap-1.5">
              <Key>1</Key>–<Key>4</Key> circle an answer
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Key>H</Key> hint
            </span>
          </div>
        </nav>

        {/* The paper stack */}
        <section className="relative justify-self-center w-full max-w-[720px]">
          <div
            aria-hidden="true"
            className="hidden md:block absolute inset-0 bg-[#8f8170] brightness-[.55] rotate-[1.2deg] translate-x-2 translate-y-2.5 shadow-[0_20px_50px_rgba(0,0,0,.5)]"
          />
          <div
            aria-hidden="true"
            className="hidden md:block absolute inset-0 bg-[#8f8170] brightness-[.7] -rotate-[1.6deg] -translate-x-1.5 translate-y-1.5 shadow-[0_20px_50px_rgba(0,0,0,.5)]"
          />
          <div className="md:rotate-[.5deg]">
            <article
              aria-live="polite"
              className={cn(
                "aw-paper relative flex flex-col md:min-h-[min(72vh,860px)] px-[7%] md:px-[10%] pt-[10%] md:pt-[9%] pb-[6%] md:pb-[4%]",
                plain
                  ? "font-prose text-[16px] md:text-[clamp(16px,1.3vw,18px)] leading-[1.9]"
                  : "aw-typed text-[14px] md:text-[clamp(14.5px,1.25vw,17px)] leading-[2.15]",
              )}
            >
              <div className="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-1 border-b border-dashed border-aw-ink/35 pb-1 mb-[2.4em] text-[.88em]">
                <span>{quizTitle}</span>
                <span className="font-hand text-[1.55em] leading-none">
                  {studentId}
                </span>
              </div>

              <p className="font-bold mb-[1.1em] pl-[2.2em] pr-[2.4em] -indent-[2.2em]">
                {current + 1}.&nbsp; {q.question_text}
              </p>

              <div role="radiogroup" aria-label={`Answers to question ${current + 1}`}>
                {q.options.map((opt, i) => {
                  const selected = answers[q.id] === opt.id;
                  return (
                    <button
                      key={opt.id}
                      role="radio"
                      aria-checked={selected}
                      onClick={() => pick(i)}
                      disabled={isPending}
                      className={cn(
                        "aw-btn-reset block w-fit max-w-full text-left mb-[.25em] py-[.1em] pr-[.5em] pl-[3.6em] md:pl-[4.6em] -indent-[1.7em] rounded-sm",
                        "hover:bg-aw-ink/[.07] focus-visible:outline-dashed focus-visible:outline-[1.5px] focus-visible:outline-aw-ink/60 focus-visible:outline-offset-2",
                        selected &&
                          "underline decoration-1 underline-offset-[.32em] decoration-aw-ink/55",
                      )}
                    >
                      <span
                        className={cn(
                          "indent-0 px-[.1em]",
                          selected ? "aw-circled" : "inline-block",
                        )}
                      >
                        {LETTERS[i]}
                      </span>
                      ) {opt.option_text}
                    </button>
                  );
                })}
              </div>

              {q.hint && (
                <>
                  <button
                    onClick={toggleHint}
                    aria-expanded={hintOpen}
                    aria-controls="question-hint"
                    title="Hint (H)"
                    className="aw-btn-reset absolute right-[3%] md:right-[4%] top-[calc(10%+4.2em)] md:top-[calc(9%+4.2em)] grid place-items-center size-[1.9em] rounded-full border-[1.5px] border-aw-ink/55 font-hand text-[1.25em] leading-none text-[#191714] hover:bg-aw-ink/[.08] aria-expanded:bg-aw-ink/[.08]"
                  >
                    ?<span className="sr-only">Show hint</span>
                  </button>
                  <div
                    id="question-hint"
                    hidden={!hintOpen}
                    className="font-hand uppercase text-[1.35em] leading-[1.3] mt-[1.6em] ml-[3em] -rotate-[1.5deg] origin-left text-[#191714]"
                  >
                    {q.hint}
                  </div>
                </>
              )}

              <div className="mt-auto pt-[2.5em] flex justify-between gap-4 text-[.85em] opacity-60">
                <span>{footerNote}</span>
                <span>
                  {current + 1} / {total}
                </span>
              </div>
            </article>
          </div>
        </section>
        <div className="hidden xl:block" />
      </main>

      <div className="sticky bottom-0 md:static bg-[rgba(13,12,11,.94)] md:bg-transparent border-t border-aw-line md:border-0">
        {error && (
          <p
            role="alert"
            className="text-center font-prose text-[15px] text-[#d58c88] pt-3"
          >
            {error}
          </p>
        )}
        <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5 px-4 py-3 md:pt-6 md:pb-7 font-ui font-medium text-[19px] uppercase tracking-[.05em]">
          <button
            onClick={() => go(current - 1)}
            disabled={current === 0}
            className="inline-flex items-center gap-2.5 text-aw-text-2 hover:text-aw-text disabled:opacity-35 disabled:hover:text-aw-text-2"
          >
            <Key>Q</Key>Previous
          </button>
          <button
            onClick={() => go(current + 1)}
            disabled={current === total - 1}
            className="inline-flex items-center gap-2.5 text-aw-text-2 hover:text-aw-text disabled:opacity-35 disabled:hover:text-aw-text-2"
          >
            <Key>E</Key>Next
          </button>
          <span className="hidden md:inline text-[16px] tracking-[.1em] text-aw-text-3">
            {allAnswered ? "All answered" : `${answered} of ${total} answered`}
          </span>
          <button
            onClick={submit}
            disabled={!allAnswered || isPending}
            className="inline-flex items-center gap-2.5 text-aw-text disabled:text-aw-text-2 disabled:opacity-35"
          >
            <Key>Enter</Key>
            {isPending ? "Submitting…" : "Submit"}
          </button>
        </nav>
      </div>
    </div>
  );
}
