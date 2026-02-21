"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { type Question as BaseQuestion } from "@/types/QuizTypes";
import { BackButton } from "@/components/shared/back-button";
import { QuizQuestion } from "@/components/quiz/quiz-question";

type Option = BaseQuestion["options"][number] & {
  id: string;
  option_explanation?: string | null;
  is_correct: boolean;
};

type Question = Omit<BaseQuestion, "options" | "correct_answer_index"> & {
  id: string;
  options: Option[];
  correct_answer_citation?: string | null;
  hint?: string | null;
};

interface QuizPreviewProps {
  quizTitle: string;
  questions: Question[];
}

export function QuizPreview({ quizTitle, questions }: QuizPreviewProps) {
  // Store answers as index -> optionIndex
  const [answers, setAnswers] = useState<Record<number, number>>({});

  const handleSelect = (qIndex: number, optIndex: number) => {
    // Lock answer once selected
    if (answers[qIndex] !== undefined) return;
    setAnswers((prev) => ({ ...prev, [qIndex]: optIndex }));
  };

  return (
    <div className="space-y-8 max-w-3xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b-4 border-foreground pb-4">
        <div className="flex items-center gap-4">
          <BackButton />
          <h1 className="text-3xl font-heading font-black uppercase text-foreground leading-none">
            {quizTitle}
          </h1>
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-16">
        {questions.map((q, i) => {
          // Map DB Question to Component Question
          const correctIndex = q.options.findIndex((o) => o.is_correct);
          const questionForDisplay: BaseQuestion = {
            question_text: q.question_text,
            hint: q.hint || "",
            correct_answer_index: correctIndex >= 0 ? correctIndex : 0,
            correct_answer_citation: q.correct_answer_citation || "",
            options: q.options.map((o) => ({
              option_text: o.option_text,
              option_explanation: o.option_explanation || "",
            })),
          };

          const isAnswered = answers[i] !== undefined;

          return (
            <div key={q.id} className="space-y-6 relative pl-8 md:pl-0">
              {/* Mobile Vertical Line */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-border md:hidden" />

              <div className="flex-grow">
                <QuizQuestion
                  question={questionForDisplay}
                  index={i}
                  selectedOptionIndex={answers[i]}
                  onSelectOption={(optIndex) => handleSelect(i, optIndex)}
                  isReadOnly={isAnswered}
                  showFeedback={isAnswered}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
