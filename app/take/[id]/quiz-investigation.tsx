"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  optionVariants,
  checkboxVariants,
  buttonVariants,
} from "@/components/wake-variants";
import type { Question } from "./quiz-taker";

interface QuizInvestigationProps {
  quizTitle: string;
  studentId: string;
  questions: Question[];
  isPending: boolean;
  onSubmit: (answers: Record<string, string>) => void;
}

export function QuizInvestigation({
  quizTitle,
  studentId,
  questions,
  isPending,
  onSubmit,
}: QuizInvestigationProps) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (qId: string, optId: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const isComplete = Object.keys(answers).length === questions.length;
  // console.log("questions", questions);
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-foreground pb-4 gap-4">
        <h1 className="text-3xl font-heading font-black uppercase text-foreground leading-none">
          {quizTitle}
        </h1>
        <div className="font-mono text-sm bg-primary text-primary-foreground px-3 py-1 uppercase font-bold tracking-wider inline-block">
          Subject: {studentId}
        </div>
      </div>

      {/* Questions List */}
      <div className="space-y-16">
        {questions.map((q, i) => (
          <div key={q.id} className="space-y-6 relative pl-8 md:pl-0">
            {/* Mobile Vertical Line */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-border md:hidden" />

            <div className="flex gap-6">
              <span className="hidden md:flex flex-shrink-0 w-12 h-12 bg-foreground text-background items-center justify-center font-heading text-2xl font-bold">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-xl md:text-2xl font-bold leading-tight pt-1">
                {q.question_text}
              </h3>
            </div>

            <RadioGroup
              onValueChange={(val) => handleSelect(q.id, val)}
              className="pl-4 md:pl-[4.5rem] space-y-4"
            >
              {q.options.map((opt) => {
                const isSelected = answers[q.id] === opt.id;
                const state = isSelected ? "selected" : "default";
                return (
                  <div key={opt.id}>
                    <RadioGroupItem
                      value={opt.id}
                      id={opt.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={opt.id}
                      className={optionVariants({ state })}
                    >
                      <div className={checkboxVariants({ state })} />
                      {opt.option_text}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="pt-12 pb-24 border-t-4 border-muted">
        <Button
          className={buttonVariants({ variant: "large" })}
          onClick={() => onSubmit(answers)}
          disabled={isPending || !isComplete}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-3 h-6 w-6 animate-spin" />
              Processing Evidence...
            </>
          ) : (
            "Submit Final Report"
          )}
        </Button>

        {!isComplete && (
          <div className="mt-4 flex items-center justify-center text-destructive font-bold uppercase tracking-wider gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>Complete all fields before submission</span>
          </div>
        )}
      </div>
    </div>
  );
}
