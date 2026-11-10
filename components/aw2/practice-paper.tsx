"use client";

import { cn } from "@/lib/utils";
import { aw } from "@/components/aw2/shell";

export type PracticeQuestion = {
  question_text: string;
  options: { option_text: string; option_explanation?: string | null }[];
  /** Index of the correct option. */
  correct: number;
  /** Context behind the question, written under the answer once it is marked. */
  background?: string | null;
};

const LETTERS = ["a", "b", "c", "d", "e", "f"];
const noteClass = cn(aw.note, "ml-[2.4em] [grid-area:1/1]");

/**
 * Practice questions typed on paper. Circle an answer and it is marked straight
 * away in pen with the reason; circling another option changes it. Whether picks are kept is up to the parent.
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
        const explanation = q.options[q.correct]?.option_explanation;
        const wrongVerdict = `No, it's ${LETTERS[q.correct]}.`;
        const noteBody = (verdict: string) => (
          <>
            <span className={aw.noteVerdict}>{verdict}</span>
            {explanation}
            {q.background && (
              <span className="block mt-[.7em]">{q.background}</span>
            )}
          </>
        );
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
                    onClick={() => onPick(key, oi)}
                    className={cn(
                      "aw-btn-reset block w-fit max-w-full text-left mb-[.2em] py-[.05em] pr-[.4em] pl-[3.6em] md:pl-[4.4em] -indent-[1.6em]",
                      !chosen && "hover:bg-aw-ink/[.07]",
                      chosen &&
                        !right &&
                        "line-through decoration-[#141210] decoration-[1.5px]",
                    )}
                  >
                    <span
                      className={cn(
                        "indent-0 px-[.1em]",
                        chosen
                          ? "aw-circled"
                          : answered && correct
                            ? "aw-circled aw-pen"
                            : "inline-block",
                      )}
                    >
                      {LETTERS[oi]}
                    </span>
                    ) {o.option_text}
                    <span
                      className={cn(
                        "aw-pen font-hand text-[1.3em] leading-none ml-[.4em] indent-0 inline-block",
                        !(answered && correct) && "invisible",
                      )}
                    >
                      ✓
                    </span>
                  </button>
                );
              })}
            </div>
            {/* The longest possible note holds the space, so answering moves nothing */}
            <div className="grid mt-[.7em]">
              <p className={cn(noteClass, "invisible")}>
                {noteBody(wrongVerdict)}
              </p>
              {answered && (
                <p className={cn(noteClass, "aw-pen")}>
                  {noteBody(right ? "Yes." : wrongVerdict)}
                </p>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
