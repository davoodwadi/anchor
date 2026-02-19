import QuizVerdict from "./quiz-verdict";
import { QuizReview } from "./quiz-review";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server"; // Updated path per instructions
import { Separator } from "@/components/ui/separator";
interface ResultPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ attemptId?: string }>;
}

export default async function ResultPage(props: ResultPageProps) {
  // Await the searchParams in Next.js 15
  const searchParams = await props.searchParams;
  const { attemptId } = searchParams;
  // console.log("attemptId", attemptId);
  if (!attemptId) {
    redirect(notFound());
  }
  const supabase = await createClient();
  const { data: attempt, error } = await supabase
    .from("attempts")
    .select(
      `
      id,
      score,
      total,
      student_number,
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
    .eq("id", searchParams.attemptId)
    .single();

  if (error || !attempt) {
    return notFound();
  }
  // console.log("attempt", attempt);

  return (
    <div className="container max-w-3xl py-12 space-y-12">
      {/* 1. Show the Score Header */}
      <QuizVerdict
        score={attempt.score}
        total={attempt.total}
        studentId={attempt.student_number}
      />
      {/* <Separator /> */}
      {/* 2. Show the Question-by-Question Review */}
      <QuizReview responses={attempt.quiz_responses} />
    </div>
  );
}
