"use client";

import { useState } from "react";
import { CheckCircle2, XCircle } from "lucide-react"; // Assuming you have lucide-react or similar icons
import { cn } from "@/lib/utils"; // Assuming standard shadcn/tailwind utility

// 1. Define the Types based on your Zod Schema
interface Question {
  question_text: string;
  options: string[];
  correct_answer_index: number;
}

interface QuizData {
  questions: Question[];
}

interface QuizDisplayProps {
  data: QuizData;
}

export function QuizDisplay({ data }: QuizDisplayProps) {
  // Store user answers: { [questionIndex]: selectedOptionIndex }
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    // Prevent changing answer if already answered (optional)
    if (userAnswers[questionIndex] !== undefined) return;

    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };

  // Calculate score
  const answeredCount = Object.keys(userAnswers).length;
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
        <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-full">
          Score: {correctCount} / {data.questions.length}
        </span>
      </div>

      {data.questions.map((question, qIndex) => {
        const userAnswer = userAnswers[qIndex];
        const isAnswered = userAnswer !== undefined;
        const isCorrect = userAnswer === question.correct_answer_index;

        return (
          <div
            key={qIndex}
            className={cn(
              "p-6 rounded-lg border bg-card text-card-foreground shadow-sm transition-all",
              isAnswered && isCorrect ? "border-green-200 bg-green-50/30" : "",
              isAnswered && !isCorrect ? "border-red-200 bg-red-50/30" : "",
            )}
          >
            <h4 className="font-semibold text-lg mb-4">
              {qIndex + 1}. {question.question_text}
            </h4>

            <div className="grid gap-3">
              {question.options.map((option, oIndex) => {
                const isSelected = userAnswer === oIndex;
                const isCorrectOption =
                  question.correct_answer_index === oIndex;

                // Determine styling based on state
                let optionStyle =
                  "border-input hover:bg-accent hover:text-accent-foreground";

                if (isAnswered) {
                  if (isCorrectOption) {
                    optionStyle =
                      "border-green-500 bg-green-100 text-green-900 ring-1 ring-green-500";
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle =
                      "border-red-500 bg-red-100 text-red-900 ring-1 ring-red-500";
                  } else {
                    optionStyle = "opacity-50"; // Dim other options
                  }
                } else if (isSelected) {
                  optionStyle =
                    "border-primary bg-primary/10 ring-1 ring-primary";
                }

                return (
                  <button
                    key={oIndex}
                    disabled={isAnswered}
                    onClick={() => handleSelect(qIndex, oIndex)}
                    className={cn(
                      "flex items-center justify-between w-full p-4 text-left border rounded-md transition-all text-sm",
                      optionStyle,
                    )}
                  >
                    <span>{option}</span>

                    {/* Icons for feedback */}
                    {isAnswered && isCorrectOption && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {isAnswered && isSelected && !isCorrectOption && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation/Feedback Text (Optional) */}
            {isAnswered && !isCorrect && (
              <div className="mt-4 text-sm text-red-600 font-medium">
                Incorrect. The correct answer was option{" "}
                {question.correct_answer_index + 1}.
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
