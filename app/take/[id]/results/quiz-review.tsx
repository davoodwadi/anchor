"use client";

import { CheckCircle2, XCircle, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { optionVariants, checkboxVariants } from "@/components/shared/wake-variants";

export function QuizReview({ responses }: { responses: any[] }) {
  return (
    <div className="px-4 sm:px-8 md:px-12 lg:px-16 space-y-8 md:space-y-16">
      <h2 className="text-2xl font-black uppercase border-b-4 border-foreground pb-2 flex items-center justify-center gap-2">
        Evidence Review
      </h2>

      {responses.map((res, i) => {
        const question = res.questions;
        const selectedId = res.selected_option_id;

        // Find the correct option in the options array
        const correctOption = question.options.find((o: any) => o.is_correct);
        const isUserCorrect = selectedId === correctOption?.id;

        return (
          <div key={i} className="space-y-6">
            <div className="flex gap-4 items-start">
              {/* <span
                className={cn(
                  "flex-shrink-0 w-8 h-8 flex items-center justify-center font-heading text-lg font-bold border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                  isUserCorrect ? "bg-card" : "bg-card-400",
                )}
              >
                {i + 1}
              </span> */}
              <h3 className="text-xl md:text-2xl font-bold leading-tight">
                {i + 1}. {question.question_text}
              </h3>
            </div>

            <div className="space-y-4">
              {question.options.map((opt: any) => {
                const isSelected = selectedId === opt.id;
                const isCorrect = opt.is_correct;

                // Set the variant state
                let state: "default" | "selected" | "correct" | "incorrect" | "disabled" | "dimmed" = "default";
                if (isCorrect) {
                  state = "correct";
                } else if (isSelected && !isCorrect) {
                  state = "incorrect";
                } else {
                  state = "disabled";
                }

                return (
                  <div key={opt.id} className="relative">
                    <div className={optionVariants({ state })}>
                      <div className={checkboxVariants({ state })} />
                      <span className="flex-1 font-bold">
                        {opt.option_text}
                      </span>

                      {isCorrect && (
                        <CheckCircle2 className="w-6 h-6 text-green-600 ml-2" />
                      )}
                      {isSelected && !isCorrect && (
                        <XCircle className="w-6 h-6 text-red-600 ml-2" />
                      )}
                    </div>
                  </div>
                );
              })}

              {/* AI Explanation Block */}
              <div
                className={cn(
                  "mt-6 p-6 border border-foreground bg-background ",
                )}
              >
                {/* <p className="font-black uppercase tracking-tighter text-lg mb-2 flex items-center gap-2">
                  {isUserCorrect ? "Analysis Correct" : "Discrepancy Found"}
                </p> */}
                <p className="leading-relaxed font-medium mb-4">
                  {/* We show the explanation for why the CORRECT option is correct */}
                  {correctOption?.option_explanation}
                </p>

                {question.correct_answer_citation && (
                  <div className="pt-4 border-t-2 border-foreground/10 flex items-center gap-2 text-xs font-mono font-bold text-foreground/70">
                    {/* <BookOpen className="w-4 h-4" /> */}
                    Source: {question.correct_answer_citation}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
