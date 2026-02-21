"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { optionVariants } from "@/components/shared/wake-variants";
import { type Question } from "@/actions/generate-actions";
import { Button } from "@/components/ui/button";

interface QuizQuestionProps {
  question: Question;
  index: number;
  selectedOptionIndex?: number | null;
  onSelectOption: (optionIndex: number) => void;
  isReadOnly?: boolean;
  showFeedback?: boolean;
}

export function QuizQuestion({
  question,
  index,
  selectedOptionIndex,
  onSelectOption,
  isReadOnly = false,
  showFeedback = false,
}: QuizQuestionProps) {
  const [showHint, setShowHint] = useState(false);

  // Determine if answered based on props (if feedback is shown, we treat it as answered/locked contextually)
  // But strictly, 'isAnswered' in rendering logic usually implies showFeedback is true.
  // The caller controls showFeedback.

  const isSelected = (oIndex: number) => selectedOptionIndex === oIndex;
  const isCorrect = selectedOptionIndex === question.correct_answer_index;

  return (
    <div
      className={cn(
        "p-6 border bg-card text-card-foreground shadow-sm transition-all",
        showFeedback && isCorrect ? " " : "",
        showFeedback && !isCorrect ? " " : "",
      )}
    >
      <h4 className="font-semibold text-lg mb-4">
        {index + 1}. {question.question_text}
      </h4>

      {/* --- HINT SECTION --- */}
      <div className="min-h-[40px] mb-4 flex items-center">
        {!showFeedback ? (
          showHint ? (
            <div className="w-full text-sm bg-amber-50 border border-amber-200 text-amber-800 p-3 rounded-md italic animate-in fade-in duration-300">
              <strong>Hint:</strong> {question.hint}
            </div>
          ) : (
            <button
              onClick={() => setShowHint(true)}
              className="text-xs text-muted-foreground hover:text-primary underline transition-colors"
            >
              Need a hint?
            </button>
          )
        ) : (
          <div className="h-[40px]" />
        )}
      </div>

      <div className="grid gap-3">
        {question.options.map((option, oIndex) => {
          const selected = isSelected(oIndex);
          const isCorrectOption = question.correct_answer_index === oIndex;

          let state:
            | "default"
            | "selected"
            | "correct"
            | "incorrect"
            | "dimmed" = "default";

          if (showFeedback) {
            if (isCorrectOption) {
              state = "correct";
            } else if (selected && !isCorrectOption) {
              state = "incorrect";
            } else {
              state = "dimmed";
            }
          } else if (selected) {
            state = "selected";
          }

          return (
            <Button
              key={oIndex}
              disabled={isReadOnly}
              onClick={() => onSelectOption(oIndex)}
              className={cn(
                optionVariants({ state }),
                "justify-between group h-auto whitespace-normal text-left",
              )}
            >
              <span className="flex-1">{option.option_text}</span>

              {showFeedback && isCorrectOption && (
                <CheckCircle2 className="h-5 w-5 text-green-600 ml-2 shrink-0" />
              )}
              {showFeedback && selected && !isCorrectOption && (
                <XCircle className="h-5 w-5 text-red-600 ml-2 shrink-0" />
              )}
            </Button>
          );
        })}
      </div>

      {/* Explanation/Feedback Text */}
      {showFeedback && (
        <div
          className={cn(
            "mt-6 p-4 rounded-lg border text-sm shadow-sm transition-all animate-in fade-in zoom-in-95",
            isCorrect
              ? "bg-green-900/10 border-green-900 text-foreground"
              : "bg-red-900/10 border-red-900 text-foreground",
          )}
        >
          <div className="flex gap-2 mb-3 ">
            <p className="leading-relaxed">
              {
                question.options[question.correct_answer_index]
                  .option_explanation
              }
            </p>
          </div>

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
}
