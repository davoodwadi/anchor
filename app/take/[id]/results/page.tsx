import QuizVerdict from "./quiz-verdict";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server"; // Updated path per instructions

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
  const { data: attempt, error: attemptError } = await supabase
    .from("attempts")
    .select("*")
    .eq("id", attemptId)
    .single();
  console.log("attempt", attempt);

  return (
    <div className="p-6 pt-12 flex items-center justify-center ">
      <QuizVerdict
        score={attempt.score}
        total={attempt.total}
        studentId={attempt.student_number}
      />
    </div>
  );
}
