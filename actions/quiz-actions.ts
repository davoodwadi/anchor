"use server";

import { createClient } from "@/lib/supabase/server";

export async function submitQuiz(
  quizId: string,
  studentId: string,
  submittedAnswers: Record<string, string>, // { question_id: option_id }
) {
  const supabase = await createClient();

  // Anonymous submission: no auth. We validate inputs and that the quiz exists (via questions fetch below).
  if (!quizId?.trim() || !studentId?.trim()) {
    return { success: false, error: "Missing required fields." };
  }

  // 1. Fetch the CORRECT answers (also validates that the quiz exists and has questions)
  const { data: questions, error } = await supabase
    .from("questions")
    .select(
      `
      id,
      options (id, is_correct)
    `,
    )
    .eq("quiz_id", quizId);

  if (error || !questions?.length) {
    return { success: false, error: "Quiz not found or has no questions." };
  }

  // 2. Calculate Score
  let score = 0;
  questions.forEach((q) => {
    const selectedOptionId = submittedAnswers[q.id];
    const correctOption = q.options.find((o) => o.is_correct);
    if (correctOption && selectedOptionId === correctOption.id) score++;
  });

  // 3. Save Attempt FIRST to get the ID
  const { data: attempt, error: saveError } = await supabase
    .from("attempts")
    .insert({
      quiz_id: quizId,
      student_number: studentId,
      score: score,
      total: questions.length, // Ensure your table has this column
    })
    .select()
    .single();

  if (saveError || !attempt) {
    console.error(saveError);
    return { success: false, error: "Failed to save results." };
  }

  // 4. Save individual responses for the Review Page
  const responsesToInsert = Object.entries(submittedAnswers).map(
    ([qId, optId]) => ({
      attempt_id: attempt.id,
      question_id: qId,
      selected_option_id: optId,
    }),
  );

  const { error: respError } = await supabase
    .from("quiz_responses")
    .insert(responsesToInsert);

  if (respError) {
    console.error("Failed to save individual responses:", respError);
  }

  return {
    success: true,
    score,
    total: questions.length,
    attempt_id: attempt.id, // Return this for the router redirect
  };
}
