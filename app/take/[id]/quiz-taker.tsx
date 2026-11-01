"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitQuiz } from "@/actions/quiz-actions";
import { QuizIdentity } from "./quiz-identity";
import { QuizPaper } from "./quiz-paper";

export type Question = {
  id: string;
  question_text: string;
  options: { id: string; option_text: string; option_explanation?: string }[];
  correct_answer_citation?: string;
  hint?: string | null;
};

interface QuizTakerProps {
  quizId: string;
  quizTitle: string;
  questions: Question[];
}

export function QuizTaker({ quizId, quizTitle, questions }: QuizTakerProps) {
  const router = useRouter();
  const title = quizTitle.trim() || "Untitled quiz";
  // State Machine
  const [view, setView] = useState<"identity" | "quiz">("identity");
  // Data State
  const [studentId, setStudentId] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Async State
  const [isPending, startTransition] = useTransition();

  const handleStart = (id: string) => {
    setStudentId(id);
    setView("quiz");
  };

  const handleSubmit = (answers: Record<string, string>) => {
    setError(null);
    startTransition(async () => {
      const res = await submitQuiz(quizId, studentId, answers);
      if (res.success && res.score !== undefined) {
        const params = new URLSearchParams({
          attemptId: res.attempt_id.toString(),
        });
        router.push(`/take/${quizId}/results?${params.toString()}`);
      } else {
        setError("Your answers couldn't be submitted. Please try again.");
      }
    });
  };

  if (view === "identity") {
    return (
      <QuizIdentity
        quizTitle={title}
        questionCount={questions.length}
        onStart={handleStart}
      />
    );
  }

  return (
    <QuizPaper
      quizTitle={title}
      studentId={studentId}
      questions={questions}
      isPending={isPending}
      error={error}
      onSubmit={handleSubmit}
    />
  );
}
