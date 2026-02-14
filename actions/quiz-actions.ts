"use server";

import { createClient } from "@/lib/supabase/server"; // Updated path per instructions
import { revalidatePath } from "next/cache";

export async function submitQuiz(
  quizId: string,
  studentId: string,
  submittedAnswers: Record<string, string>, // { question_id: option_id }
) {
  const supabase = await createClient();

  if (!quizId || !studentId) {
    return { success: false, error: "Missing required fields." };
  }

  // 1. Fetch the "Answer Key" (Questions & Correct Options)
  const { data: questions, error: qError } = await supabase
    .from("questions")
    .select(
      `
      id,
      options ( id, is_correct )
    `,
    )
    .eq("quiz_id", quizId);

  if (qError || !questions)
    return { success: false, error: "Failed to validate quiz." };

  let score = 0;
  const answersToInsert = [];

  // 2. Grade the quiz server-side
  for (const question of questions) {
    const selectedOptionId = submittedAnswers[question.id];

    if (selectedOptionId) {
      // Check if selected option is correct
      const isCorrect =
        question.options.find((o) => o.id === selectedOptionId)?.is_correct ||
        false;

      if (isCorrect) score++;

      answersToInsert.push({
        question_id: question.id,
        option_id: selectedOptionId,
        is_correct: isCorrect,
      });
    }
  }

  // 3. Create the Attempt Record
  const { data: attempt, error: attemptError } = await supabase
    .from("attempts")
    .insert({
      quiz_id: quizId,
      student_number: studentId,
      score: score,
    })
    .select()
    .single();

  if (attemptError)
    return { success: false, error: "Failed to record attempt." };

  // 4. Batch Insert the Granular Answers
  if (answersToInsert.length > 0) {
    const finalPayload = answersToInsert.map((ans) => ({
      ...ans,
      attempt_id: attempt.id,
    }));

    const { error: ansError } = await supabase
      .from("attempt_answers")
      .insert(finalPayload);

    if (ansError) console.error("Error saving answers:", ansError);
  }

  revalidatePath(`/quiz/${quizId}`); // Refresh instructor dashboard

  return { success: true, score, total: questions.length };
}
