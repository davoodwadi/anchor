import { createClient } from "@/lib/supabase/server";
import { AttemptItem } from "./attempt-item";
import { FileText, Calendar, Users, Link } from "lucide-react";

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
      <div className="flex items-center justify-between pb-4 mb-6 border-b border-primary">
        <div className="flex items-center gap-2 ">
          <Users className="w-5 h-5 text-neon-red-500" />
          <div className="text-sm  font-serif tracking-widest text-zinc-100 uppercase py-1 ">
            Subject Records
          </div>
        </div>
        <div className="bg-foreground text-background px-2 py-1 font-mono text-sm font-bold uppercase">
          Total Records: {attempts.length}
        </div>
      </div>

      <div className="w-full space-y-2">
        {attempts.map((attempt) => (
          <AttemptItem key={attempt.id} attempt={attempt} />
        ))}
      </div>
    </div>
  );
}
