import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { AwPage } from "@/components/aw2/shell";
import { QuizPreview } from "./quiz-preview";

export default function PreviewQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <AwPage shade={false}>
      <Suspense
        fallback={
          <div
            role="status"
            className="min-h-svh grid content-center justify-items-center aw-kicker text-aw-text-3"
          >
            Loading preview
          </div>
        }
      >
        <PreviewQuizLoader params={params} />
      </Suspense>
    </AwPage>
  );
}

async function PreviewQuizLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: quiz, error } = await supabase
    .from("quizzes")
    .select("id, title, questions(*, options(*))")
    .eq("id", id)
    .single();

  if (error || !quiz) notFound();

  return (
    <QuizPreview
      quizId={quiz.id}
      quizTitle={quiz.title?.trim() || "Untitled quiz"}
      questions={quiz.questions}
    />
  );
}
