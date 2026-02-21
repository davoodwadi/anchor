"use client";

import { useState } from "react";
import { QuizData } from "@/types/QuizTypes";
import { QuizQuestion } from "./quiz-question";

interface QuizDisplayProps {
  data: QuizData;
}

export function QuizDisplay({ data }: QuizDisplayProps) {
  // Store user answers: { [questionIndex]: selectedOptionIndex }
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    // Prevent changing answer if already answered
    if (userAnswers[questionIndex] !== undefined) return;

    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  // Calculate score
  const correctCount = data.questions.reduce((acc, question, index) => {
    return userAnswers[index] === question.correct_answer_index ? acc + 1 : acc;
  }, 0);

  if (!data || !data.questions || data.questions.length === 0) {
    return (
      <div className="text-muted-foreground italic">
        No quiz data available.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="flex items-center justify-between border-b pb-4">
        <h3 className="text-xl font-bold">Quiz</h3>
        <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-none">
          Score: {correctCount} / {data.questions.length}
        </span>
      </div>

      {data.questions.map((question, qIndex) => {
        const isAnswered = userAnswers[qIndex] !== undefined;

        return (
          <QuizQuestion
            key={qIndex}
            question={question}
            index={qIndex}
            selectedOptionIndex={userAnswers[qIndex]}
            onSelectOption={(optIndex) => handleSelect(qIndex, optIndex)}
            isReadOnly={isAnswered}
            showFeedback={isAnswered}
          />
        );
      })}
    </div>
  );
}
