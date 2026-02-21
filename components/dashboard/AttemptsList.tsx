import { createClient } from "@/lib/supabase/server";
import { AttemptItem } from "./attempt-item";
import { AttemptsHeader } from "./attempts-header";

export default async function AttemptsList({ quizId }: { quizId: string }) {
  const supabase = await createClient();

  // 1. Fetch Data
  const { data: attempts } = await supabase
    .from("attempts")
    .select(
      `
      id, student_number, score, total, submitted_at,
      quiz_responses (
        question:questions ( question_text ), 
        option:options ( option_text, is_correct )
      )
    `,
    )
    .eq("quiz_id", quizId)
    .order("submitted_at", { ascending: false });
  // console.log("attempts.attempt_answers", attempts);
  // console.log("quizId", quizId);
  // 2. Handle Empty State
  if (!attempts?.length) {
    return (
      <div className="border-2 border-dashed border-muted p-8 text-center uppercase tracking-widest text-muted-foreground font-bold">
        No Subject Data Recorded
      </div>
    );
  }

  // 3. Render List
  return (
    <div className="space-y-4">
      <AttemptsHeader count={attempts.length} />

      <div className="w-full space-y-2">
        {attempts.map((attempt) => (
          <AttemptItem key={attempt.id} attempt={attempt} />
        ))}
      </div>
    </div>
  );
}
