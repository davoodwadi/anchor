"use client";

import { cn } from "@/lib/utils";

export type PracticeQuestion = {
  question_text: string;
  options: { option_text: string; option_explanation?: string | null }[];
  /** Index of the correct option. */
  correct: number;
};

const LETTERS = ["a", "b", "c", "d", "e", "f"];

/**
 * Practice questions typed on paper. Circle an answer and it is marked straight
 * away in blue pen with the reason. Nothing is recorded.
 * Render inside an `aw-paper` sheet; picks are keyed `${keyPrefix}-${index}`.
 */
export function PracticePaper({
  questions,
  keyPrefix,
  picks,
  onPick,
}: {
  questions: PracticeQuestion[];
  keyPrefix: string;
  picks: Record<string, number>;
  onPick: (key: string, option: number) => void;
}) {
  return (
    <div>
      {questions.map((q, qi) => {
        const key = `${keyPrefix}-${qi}`;
        const pick = picks[key];
        const answered = pick !== undefined;
        const right = pick === q.correct;
        return (
          <section key={key} className="mb-[2em]">
            <p className="font-bold mb-[.6em] pl-[2.2em] -indent-[2.2em]">
              {qi + 1}.&nbsp; {q.question_text}
            </p>
            <div role="radiogroup" aria-label={`Question ${qi + 1}`}>
              {q.options.map((o, oi) => {
                const chosen = pick === oi;
                const correct = oi === q.correct;
                return (
                  <button
                    key={oi}
                    role="radio"
                    aria-checked={chosen}
                    disabled={answered}
                    onClick={() => onPick(key, oi)}
                    className={cn(
                      "aw-btn-reset block w-fit max-w-full text-left mb-[.2em] py-[.05em] pr-[.4em] pl-[3.6em] md:pl-[4.4em] -indent-[1.6em]",
                      !answered && "hover:bg-aw-ink/[.07]",
                      chosen &&
                        !right &&
                        "line-through decoration-[#1e3f94] decoration-[1.5px]",
                    )}
                  >
                    <span
                      className={cn(
                        "indent-0 px-[.1em]",
                        chosen
                          ? "aw-circled"
                          : answered && correct
                            ? "aw-circled aw-blue"
                            : "inline-block",
                      )}
                    >
                      {LETTERS[oi]}
                    </span>
                    ) {o.option_text}
                    {answered && correct && (
                      <span className="aw-blue font-hand text-[1.3em] ml-[.4em] indent-0 inline-block">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {answered && (
              <p className="aw-blue font-hand uppercase text-[1.25em] leading-[1.3] mt-[.8em] ml-[2.4em] max-w-[48ch] -rotate-1 origin-left">
                {right ? "Right. " : "Not quite. "}
                {q.options[q.correct]?.option_explanation}
              </p>
            )}
          </section>
        );
      })}
    </div>
  );
}
