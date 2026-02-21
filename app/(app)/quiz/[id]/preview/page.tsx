import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { QuizPreview } from "./quiz-preview";

export default async function PreviewQuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="container max-w-5xl py-12 animate-in fade-in duration-500">
      <Suspense fallback={<div className="font-mono text-center pt-24 uppercase tracking-widest animate-pulse">Loading Evidence...</div>}>
        <PreviewQuizLoader params={params} />
      </Suspense>
    </div>
  );
}

async function PreviewQuizLoader({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: quiz, error } = await supabase
    .from("quizzes")
    .select("title, questions(*, options(*))")
    .eq("id", id)
    .single();

  if (error || !quiz) notFound();

  // Sort questions to maintain reasonable order
  const sortedQuestions = quiz.questions.sort((a, b) => 
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return (
    <QuizPreview 
      quizTitle={quiz.title} 
      questions={sortedQuestions} 
    />
  );
}
