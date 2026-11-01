import { cn } from "@/lib/utils";
import { aw } from "@/components/aw2/shell";

export type GradedResponse = {
  selected_option_id: string;
  question_id: string;
  questions: {
    question_text: string;
    correct_answer_citation?: string | null;
    options: {
      id: string;
      option_text: string;
      option_explanation?: string | null;
      is_correct: boolean;
    }[];
  };
};

const LETTERS = ["a", "b", "c", "d", "e", "f"];

interface GradedPaperProps {
  title: string;
  studentId: string;
  score: number;
  total: number;
  responses: GradedResponse[];
}

/**
 * The student's paper handed back: one long typed sheet with every question,
 * marked by the grader in blue pen. The student's own circles stay in pencil.
 */
export function GradedPaper({
  title,
  studentId,
  score,
  total,
  responses,
}: GradedPaperProps) {
  const graded = responses.map((res) => {
    const correct = res.questions.options.find((o) => o.is_correct);
    return { res, correct, right: res.selected_option_id === correct?.id };
  });
  const missed = graded.filter((g) => !g.right).length;

  return (
    <main className="grid gap-8 xl:gap-12 px-4 md:px-10 pt-[1vh] pb-16 items-start grid-cols-1 lg:grid-cols-[minmax(220px,290px)_minmax(0,1fr)] xl:grid-cols-[minmax(220px,290px)_minmax(0,1fr)_minmax(0,200px)]">
      {/* Score and question index */}
      <section className="lg:sticky lg:top-6">
        <div className={aw.kicker}>Your result</div>
        <h1
          className={cn(
            aw.display,
            "text-[clamp(64px,6.4vw,104px)] mt-1 mb-3 whitespace-nowrap",
          )}
        >
          {score} / {total}
        </h1>
        <p className="font-prose text-[16px] leading-relaxed text-aw-text-2 mb-6 max-w-[32ch]">
          {missed === 0 ? (
            <strong className="text-aw-text font-medium">
              Every answer correct.
            </strong>
          ) : (
            <>
              You missed{" "}
              <strong className="text-aw-text font-medium">
                {missed} question{missed > 1 ? "s" : ""}
              </strong>
              .
            </>
          )}{" "}
          Your paper is marked in blue, with the reason and the source for each
          answer.
        </p>
        <nav aria-label="Questions">
          <h2 className={aw.groupTitle}>
            Questions
            <span className="tracking-[.04em]">
              {score}/{total} correct
            </span>
          </h2>
          <ol className="flex lg:block flex-wrap gap-1.5">
            {graded.map((g, i) => (
              <li key={g.res.question_id}>
                <a
                  href={`#q${i + 1}`}
                  className={cn(
                    aw.item,
                    aw.itemIdle,
                    "max-lg:w-auto max-lg:border max-lg:border-aw-line max-lg:px-2.5 max-lg:py-1.5",
                  )}
                >
                  <span className="hidden lg:inline">Question</span> {i + 1}
                  <span
                    className={cn(
                      aw.itemMeta,
                      g.right ? "text-aw-sage" : "text-[#c27a76]",
                    )}
                  >
                    {g.right ? "✓" : "✗"}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      {/* The marked paper */}
      <section className="justify-self-center w-full max-w-[720px]">
        <div className="md:rotate-[.4deg]">
          <article className="aw-paper aw-typed relative px-[7%] md:px-[10%] pt-[9%] md:pt-[6%] pb-[8%] md:pb-[5%] text-[14px] md:text-[clamp(14.5px,1.2vw,16.5px)] leading-[2.1]">
            <div className="flex flex-wrap justify-between items-baseline gap-x-4 gap-y-1 border-b border-dashed border-aw-ink/35 pb-1 mb-[2.4em] text-[.88em]">
              <span>{title}</span>
              <span className="font-hand text-[1.55em] leading-none">
                {studentId}
              </span>
            </div>

            <div
              aria-label={`Score ${score} out of ${total}`}
              className="aw-blue font-hand md:absolute md:right-[5%] md:top-[2.6em] w-fit ml-auto -mt-[.6em] mb-[.2em] md:m-0 text-[2.4em] leading-none -rotate-[8deg] border-[2px] border-[#1e3f94] rounded-[50%] px-[.45em] py-[.2em]"
            >
              {score}/{total}
            </div>

            {graded.map(({ res, correct, right }, i) => {
              const q = res.questions;
              return (
                <section
                  key={res.question_id}
                  id={`q${i + 1}`}
                  className="relative scroll-mt-8 pt-[1.6em] mb-[1.6em] border-t border-dashed border-aw-ink/20 first-of-type:border-0 first-of-type:pt-[2.4em]"
                >
                  <span
                    aria-label={right ? "Correct" : "Incorrect"}
                    className="aw-blue font-hand absolute right-0 md:right-auto md:-left-[2em] top-[.9em] text-[1.9em] leading-none -rotate-[6deg]"
                  >
                    {right ? "✓" : "✗"}
                  </span>
                  <p className="font-bold mb-[.8em] pl-[2.2em] pr-[1.6em] md:pr-0 -indent-[2.2em]">
                    {i + 1}.&nbsp; {q.question_text}
                  </p>
                  <ul>
                    {q.options.map((opt, oi) => {
                      const chosen = opt.id === res.selected_option_id;
                      const isCorrect = opt.is_correct;
                      return (
                        <li
                          key={opt.id}
                          className={cn(
                            "pl-[3.6em] md:pl-[4.6em] -indent-[1.7em] mb-[.2em]",
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
                                : isCorrect && !right
                                  ? "aw-circled aw-blue"
                                  : "inline-block",
                            )}
                          >
                            {LETTERS[oi]}
                          </span>
                          ) {opt.option_text}
                          {isCorrect && (
                            <span className="aw-blue font-hand text-[1.3em] ml-[.4em] indent-0 inline-block">
                              ✓
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                  {correct?.option_explanation && (
                    <p className="aw-blue font-hand uppercase text-[1.3em] leading-[1.3] mt-[1em] ml-[2.4em] max-w-[48ch] -rotate-[1deg] origin-left">
                      {right ? "Right. " : ""}
                      {correct.option_explanation}
                    </p>
                  )}
                  {q.correct_answer_citation && (
                    <blockquote className="mt-[1.2em] ml-[1.4em] max-w-[92%] -rotate-[.6deg] bg-[#c9bea6] shadow-[0_3px_10px_rgba(0,0,0,.25)] px-[1.1em] py-[.8em] text-[.92em] leading-[1.75]">
                      <span className="block text-[.8em] tracking-[.14em] opacity-65 mb-[.3em]">
                        FROM THE READING
                      </span>
                      &ldquo;{q.correct_answer_citation}&rdquo;
                    </blockquote>
                  )}
                </section>
              );
            })}

            <p className="text-center tracking-[.3em] pt-[1em] opacity-70">
              END
            </p>
          </article>
        </div>
      </section>
      <div className="hidden xl:block" />
    </main>
  );
}
