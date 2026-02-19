"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, BookOpen } from "lucide-react"; // Assuming you have lucide-react or similar icons
import { cn } from "@/lib/utils"; // Assuming standard shadcn/tailwind utility
import { Button } from "./ui/button";
import { QuizData, Question } from "@/actions/generate-actions";
// 1. Define the Types based on your Zod Schema

interface QuizDisplayProps {
  data: QuizData;
}

export function QuizDisplay({ data }: QuizDisplayProps) {
  // Store user answers: { [questionIndex]: selectedOptionIndex }
  const [userAnswers, setUserAnswers] = useState<Record<number, number>>({});
  const [showHints, setShowHints] = useState<Record<number, boolean>>({});

  const handleSelect = (questionIndex: number, optionIndex: number) => {
    // Prevent changing answer if already answered (optional)
    if (userAnswers[questionIndex] !== undefined) return;

    setUserAnswers((prev) => ({
      ...prev,
      [questionIndex]: optionIndex,
    }));
  };
  const toggleHint = (qIndex: number) => {
    setShowHints((prev) => ({ ...prev, [qIndex]: !prev[qIndex] }));
  };
  // console.log("showHints", showHints);

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
        <span className="text-sm font-medium bg-secondary px-3 py-1 rounded-none">
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
              "p-6 border bg-card text-card-foreground shadow-sm transition-all",
              isAnswered && isCorrect ? " " : "",
              isAnswered && !isCorrect ? " " : "",
            )}
          >
            <h4 className="font-semibold text-lg mb-4">
              {qIndex + 1}. {question.question_text}
            </h4>

            {/* --- HINT SECTION START --- */}
            <div className="min-h-[40px] mb-4 flex items-center">
              {/* We use min-h to reserve space. Flex items-center keeps it tidy */}
              {!isAnswered ? (
                showHints[qIndex] ? (
                  <div className="w-full text-sm bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md italic animate-in fade-in duration-300">
                    <strong>Hint:</strong> {question.hint}
                  </div>
                ) : (
                  <button
                    onClick={() => toggleHint(qIndex)}
                    className="text-xs text-muted-foreground hover:text-primary underline transition-colors"
                  >
                    Need a hint?
                  </button>
                )
              ) : (
                /* This empty div or 'null' inside a fixed-height parent 
       prevents the options from jumping up when isAnswered becomes true */
                <div className="h-[40px]" />
              )}
            </div>
            {/* --- HINT SECTION END --- */}

            <div className="grid gap-3">
              {question.options.map((option, oIndex) => {
                const isSelected = userAnswer === oIndex;
                const isCorrectOption =
                  question.correct_answer_index === oIndex;

                // Determine styling based on state
                let optionStyle =
                  "border-input hover:bg-accent hover:text-accent-foreground normal-case ";

                if (isAnswered) {
                  if (isCorrectOption) {
                    optionStyle =
                      "border-green-500 bg-green-900/10 text-foreground  normal-case";
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle =
                      "border-red-500 bg-red-900/10 text-foreground  normal-case";
                  } else {
                    optionStyle = "opacity-70 normal-case"; // Dim other options
                  }
                } else if (isSelected) {
                  optionStyle = "border-primary bg-primary/10  normal-case";
                }

                return (
                  <Button
                    key={oIndex}
                    disabled={isAnswered}
                    onClick={() => handleSelect(qIndex, oIndex)}
                    className={cn(
                      "flex items-center justify-between w-full p-4 text-left border rounded-md transition-all text-sm text-wrap h-auto border-card bg-transparent shadow-none",
                      optionStyle,
                    )}
                  >
                    <span>{option.option_text}</span>

                    {/* Icons for feedback */}
                    {isAnswered && isCorrectOption && (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    )}
                    {isAnswered && isSelected && !isCorrectOption && (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </Button>
                );
              })}
            </div>

            {/* Explanation/Feedback Text (Optional) */}
            {isAnswered && (
              <div
                className={cn(
                  "mt-6 p-4 rounded-lg border text-sm shadow-sm transition-all animate-in fade-in zoom-in-95",
                  isCorrect
                    ? "bg-green-900/10 border-green-900 text-foreground"
                    : "bg-red-900/10 border-red-900 text-foreground",
                )}
              >
                {/* Primary Explanation */}
                <div className="flex gap-2 mb-3 ">
                  {/* <div className="font-bold shrink-0">
                    {isCorrect ? "✓" : "✕"}
                  </div> */}
                  <p className="leading-relaxed">
                    {
                      question.options[question.correct_answer_index]
                        .option_explanation
                    }
                  </p>
                </div>

                {/* Citation Section */}
                {question.correct_answer_citation && (
                  <div className="pt-3 border-t border-current/10 flex items-start gap-2 opacity-80 italic">
                    <BookOpen className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span className="text-xs">
                      Source: {question.correct_answer_citation}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
