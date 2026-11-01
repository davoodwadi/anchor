"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AwTopBar, aw } from "@/components/aw2/shell";
import { Key } from "@/components/aw2/key";
import { useHotkeys } from "@/components/aw2/use-hotkeys";
import { PracticePaper } from "@/components/aw2/practice-paper";

type Option = {
  id: string;
  option_text: string;
  option_explanation?: string | null;
  is_correct: boolean;
};

type Question = {
  id: string;
  question_text: string;
  options: Option[];
};

interface QuizPreviewProps {
  quizId: string;
  quizTitle: string;
  questions: Question[];
}

/**
 * Instructor preview: the quiz on paper, marked as you answer.
 * Nothing is submitted or recorded.
 */
export function QuizPreview({ quizId, quizTitle, questions }: QuizPreviewProps) {
  const router = useRouter();
  const [picks, setPicks] = useState<Record<string, number>>({});

  useHotkeys({
    escape: () => router.push(`/quiz/${quizId}`),
    r: () => setPicks({}),
  });

  return (
    <div className="min-h-svh grid grid-rows-[auto_1fr]">
      <AwTopBar
        left={
          <Link href={`/quiz/${quizId}`} className={aw.chip}>
            <Key>Esc</Key>Back to quiz
          </Link>
        }
        mid="Preview"
        right={
          <button onClick={() => setPicks({})} className={aw.action}>
            <Key>R</Key>Start over
          </button>
        }
      />
      <main className="px-4 pb-16">
        <p className="mx-auto max-w-[720px] mb-5 font-prose text-[16px] text-aw-text-2">
          This is how students see the questions. Answers are marked straight
          away and nothing is recorded.
        </p>
        <div className="mx-auto max-w-[720px] md:rotate-[.4deg]">
          <article className="aw-paper aw-typed px-[7%] md:px-[10%] pt-[9%] md:pt-[6%] pb-[6%] text-[14px] md:text-[clamp(14.5px,1.2vw,16.5px)] leading-[2.05]">
            <p className="font-bold tracking-[.14em] mb-[2em] border-b border-dashed border-aw-ink/35 pb-[.3em]">
              {quizTitle.toUpperCase()}
            </p>
            <PracticePaper
              questions={questions.map((q) => ({
                question_text: q.question_text,
                options: q.options,
                correct: Math.max(
                  0,
                  q.options.findIndex((o) => o.is_correct),
                ),
              }))}
              keyPrefix="preview"
              picks={picks}
              onPick={(key, i) =>
                setPicks((p) => (key in p ? p : { ...p, [key]: i }))
              }
            />
          </article>
        </div>
      </main>
    </div>
  );
}
