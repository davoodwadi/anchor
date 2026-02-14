"use client";

import { useState, useTransition } from "react";
import { submitQuiz } from "@/actions/quiz-actions";
import { QuizIdentity } from "./quiz-identity";
import { QuizInvestigation } from "./quiz-investigation";
import { QuizVerdict } from "./quiz-verdict";

export type Question = {
  id: string;
  question_text: string;
  options: { id: string; option_text: string }[];
};

interface QuizTakerProps {
  quizId: string;
  quizTitle: string;
  questions: Question[];
}

export function QuizTaker({ quizId, quizTitle, questions }: QuizTakerProps) {
  // State Machine
  const [view, setView] = useState<"identity" | "quiz" | "result">("identity");

  // Data State
  const [studentId, setStudentId] = useState("");
  const [result, setResult] = useState<{ score: number; total: number } | null>(
    null,
  );

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
        setResult({ score: res.score, total: res.total || 0 });
        setView("result");
      } else {
        alert("Error submitting quiz. Please try again.");
      }
    });
  };

  // --- RENDER LOGIC ---

  if (view === "identity") {
    return <QuizIdentity onStart={handleStart} />;
  }

  if (view === "result" && result) {
    return (
      <QuizVerdict
        score={result.score}
        total={result.total}
        studentId={studentId}
      />
    );
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
