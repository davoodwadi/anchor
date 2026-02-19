"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { submitQuiz } from "@/actions/quiz-actions";
import { QuizIdentity } from "./quiz-identity";
import { QuizInvestigation } from "./quiz-investigation";

export type Question = {
  id: string;
  question_text: string;
  options: { id: string; option_text: string; option_explanation?: string }[];
  correct_answer_citation?: string;
  hint?: string;
};

interface QuizTakerProps {
  quizId: string;
  quizTitle: string;
  questions: Question[];
}

export function QuizTaker({ quizId, quizTitle, questions }: QuizTakerProps) {
  const router = useRouter();
  // State Machine
  const [view, setView] = useState<"identity" | "quiz">("identity");
  // Data State
  const [studentId, setStudentId] = useState("");

  // Async State
  const [isPending, startTransition] = useTransition();

  const handleStart = (id: string) => {
    setStudentId(id);
    setView("quiz");
  };

  const handleSubmit = (answers: Record<string, string>) => {
    startTransition(async () => {
      const res = await submitQuiz(quizId, studentId, answers);
      if (res.success && res.score !== undefined) {
        // console.log("res", res);
        const params = new URLSearchParams({
          attemptId: res.attempt_id.toString(),
        });
        router.push(`/take/${quizId}/results?${params.toString()}`);
      } else {
        alert("Error submitting quiz. Please try again.");
      }
    });
  };

  if (view === "identity") {
    return <QuizIdentity onStart={handleStart} />;
  }

  return (
    <QuizInvestigation
      quizTitle={quizTitle}
      studentId={studentId}
      questions={questions}
      isPending={isPending}
      onSubmit={handleSubmit}
    />
  );
}
