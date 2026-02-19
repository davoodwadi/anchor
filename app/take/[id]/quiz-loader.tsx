import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { QuizTaker } from "./quiz-taker"; // The Client Component we built earlier

export async function QuizLoader({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // Await params inside the Suspense boundary
  const { id } = await params;
  const supabase = await createClient();

  // Fetch Quiz Data (No 'is_correct' field for security)
  const { data: quiz, error } = await supabase
    .from("quizzes")
    .select(
      `
      id,
      title,
      questions (
        id,
        question_text,
        options (
          id,
          option_text
        )
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error || !quiz) {
    console.log(error);
    return notFound();
  }
  console.log("quiz", quiz);

  return (
    <QuizTaker
      quizId={quiz.id}
      quizTitle={quiz.title}
      questions={quiz.questions}
    />
  );
}
