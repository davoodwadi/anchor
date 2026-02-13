"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function submitQuiz(
  quizId: string,
  studentId: string,
  answers: Record<string, string>,
) {
  const supabase = await createClient();

  // 1. Fetch the CORRECT answers from DB (Server-side only)
  const { data: questions, error } = await supabase
    .from("questions")
    .select(
      `
      id,
      options (
        id,
        is_correct
      )
    `,
    )
    .eq("quiz_id", quizId);

  if (error || !questions) {
    return { error: "Failed to grade quiz." };
  }

  // 2. Calculate Score
  let score = 0;
  const totalQuestions = questions.length;

  questions.forEach((q) => {
    // The student's selected option ID for this question
    const selectedOptionId = answers[q.id];

    // Find the correct option for this question
    const correctOption = q.options.find((o) => o.is_correct);

    if (correctOption && selectedOptionId === correctOption.id) {
      score++;
    }
  });

  // 3. Save Attempt to DB
  const { error: saveError } = await supabase.from("attempts").insert({
    quiz_id: quizId,
    student_number: studentId,
    score: score,
  });

  if (saveError) {
    console.error(saveError);
    return { error: "Failed to save results." };
  }

  // 4. Return the result to the UI
  return {
    success: true,
    score,
    total: totalQuestions,
  };
}
