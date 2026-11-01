import { Suspense } from "react";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { quizStats } from "@/lib/quiz-stats";
import { AwPage } from "@/components/aw2/shell";
import {
  QuizViewMindPlace,
  type QuizViewAttempt,
  type QuizViewQuestion,
} from "./quiz-view";

// The page is synchronous; params are awaited inside the Suspense boundary.
export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AwPage>
      <Suspense fallback={<QuizLoading />}>
        <QuizDashboard params={params} />
      </Suspense>
    </AwPage>
  );
}

async function QuizDashboard({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: quiz, error }, { data: attempts }] = await Promise.all([
    supabase
      .from("quizzes")
      .select(
        "id, title, created_at, questions ( id, question_text, options ( id, option_text, is_correct ) )",
      )
      .eq("id", id)
      .single(),
    supabase
      .from("attempts")
      .select(
        "id, student_number, score, total, submitted_at, quiz_responses ( question_id, selected_option_id, option:options ( is_correct ) )",
      )
      .eq("quiz_id", id)
      .order("submitted_at", { ascending: false }),
  ]);

  if (error || !quiz) notFound();

  const questions: QuizViewQuestion[] = (quiz.questions ?? []).map((q) => ({
      id: q.id,
      text: q.question_text,
      options: (q.options ?? []).map((o) => ({
        id: o.id,
        text: o.option_text,
        correct: o.is_correct,
      })),
  }));

  const list = (attempts ?? []) as unknown as QuizViewAttempt[];

  return (
    <QuizViewMindPlace
      quiz={{
        id: quiz.id,
        title: quiz.title?.trim() || "Untitled quiz",
        createdAt: quiz.created_at,
      }}
      questions={questions}
      attempts={list}
      stats={quizStats(
        questions.map((q) => q.id),
        list,
      )}
    />
  );
}

function QuizLoading() {
  return (
    <div
      role="status"
      aria-label="Loading quiz"
      className="min-h-svh grid content-center justify-items-center px-4"
    >
      <div className="aw-kicker text-aw-text-3">Opening the quiz</div>
    </div>
  );
}
