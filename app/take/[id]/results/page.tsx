import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { AwPage, AwTopBar, aw } from "@/components/aw2/shell";
import { GradedPaper, type GradedResponse } from "./graded-paper";

interface ResultPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attemptId?: string }>;
}

export default function ResultPage(props: ResultPageProps) {
  return (
    <AwPage>
      <Suspense fallback={<ResultsLoading />}>
        <Results {...props} />
      </Suspense>
    </AwPage>
  );
}

async function Results({ searchParams }: ResultPageProps) {
  const { attemptId } = await searchParams;
  if (!attemptId) notFound();

  const supabase = await createClient();
  const { data: attempt, error } = await supabase
    .from("attempts")
    .select(
      `
      id,
      score,
      total,
      student_number,
      quizzes ( title ),
      quiz_responses (
        selected_option_id,
        question_id,
        questions (
          question_text,
          correct_answer_citation,
          options (
            id,
            option_text,
            option_explanation,
            is_correct
          )
        )
      )
    `,
    )
    .eq("id", attemptId)
    .single();

  if (error || !attempt) notFound();

  const quiz = attempt.quizzes as unknown as { title: string } | null;
  const title = quiz?.title?.trim() || "Untitled quiz";

  return (
    <>
      <AwTopBar
        mid={title}
        right={<span className={aw.chip}>{attempt.student_number}</span>}
      />
      <GradedPaper
        title={title}
        studentId={attempt.student_number}
        score={attempt.score}
        total={attempt.total}
        responses={attempt.quiz_responses as unknown as GradedResponse[]}
      />
    </>
  );
}

function ResultsLoading() {
  return (
    <div
      role="status"
      aria-label="Loading results"
      className="min-h-svh grid content-center justify-items-center gap-6 px-4"
    >
      <div className="aw-kicker text-aw-text-3">Marking your paper</div>
      <div className="aw-paper w-[min(100%,420px)] aspect-[1000/1296] rotate-[1.5deg] opacity-80" />
    </div>
  );
}
