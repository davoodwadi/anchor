"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { submitQuiz } from "@/actions/quiz-actions";
import { Loader2, User, Check, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";

type Question = {
  id: string;
  question_text: string;
  options: {
    id: string;
    option_text: string;
  }[];
};

export function QuizTaker({
  quizId,
  quizTitle,
  questions,
}: {
  quizId: string;
  quizTitle: string;
  questions: Question[];
}) {
  const [studentId, setStudentId] = useState("");
  const [started, setStarted] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<{ score: number; total: number } | null>(
    null,
  );

  // FIX: Use React.FormEvent<HTMLFormElement> to avoid deprecation warnings
  const handleStart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (studentId.trim()) setStarted(true);
  };

  const handleSelect = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }));
  };

  const handleSubmit = () => {
    if (Object.keys(answers).length < questions.length) return;

    startTransition(async () => {
      const res = await submitQuiz(quizId, studentId, answers);
      if (res.success && res.score !== undefined) {
        setResult({ score: res.score, total: res.total || 0 });
      } else {
        alert("Error submitting quiz. Please try again.");
      }
    });
  };

  // --- VIEW 1: IDENTITY CHECK (Agent Login) ---
  if (!started) {
    return (
      <Card className="max-w-md mx-auto border-2 border-primary bg-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-none rounded-none">
        <CardHeader className="bg-primary text-primary-foreground py-4 px-6">
          <CardTitle className="uppercase tracking-widest flex items-center gap-2 font-bold text-lg">
            <User className="w-5 h-5" />
            Subject Identification
          </CardTitle>
        </CardHeader>
        <CardContent className="p-8 space-y-6">
          <form onSubmit={handleStart} className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="student-id"
                className="uppercase font-bold text-xs tracking-widest text-muted-foreground"
              >
                Agent ID / Student Number
              </Label>
              <Input
                id="student-id"
                placeholder="ENTER ID..."
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="font-mono text-xl uppercase h-14 border-2 border-border rounded-none focus-visible:ring-0 focus-visible:border-primary"
                autoComplete="off"
              />
            </div>
            <Button
              type="submit"
              className="w-full h-14 text-lg rounded-none bg-foreground text-background hover:bg-primary hover:text-primary-foreground transition-colors"
              disabled={!studentId}
            >
              Initialize Assessment
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  // --- VIEW 3: RESULTS (The Conclusion) ---
  if (result) {
    const percentage = Math.round((result.score / result.total) * 100);

    return (
      <Card className="max-w-lg mx-auto border-2 border-primary bg-background shadow-none rounded-none animate-in fade-in zoom-in-95 duration-500">
        <CardHeader className="bg-primary text-primary-foreground text-center py-6">
          <CardTitle className="text-3xl uppercase font-black tracking-tighter">
            Report Finalized
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-8 pt-10 pb-10">
          {/* Big Score Display */}
          <div className="relative flex items-center justify-center">
            {/* <div className="absolute inset-0 border-4 border-muted rotate-45" /> */}
            <div className="relative z-10 text-8xl font-black text-foreground font-heading tracking-tighter">
              {percentage}%
            </div>
          </div>

          <div className="text-xl uppercase tracking-widest text-muted-foreground font-bold">
            {result.score} / {result.total} Correct
          </div>

          {/* Brutalist Progress Bar */}
          <div className="w-full h-4 bg-muted border-2 border-border">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${percentage}%` }}
            />
          </div>

          <div className="p-4 bg-muted/30 border border-border w-full text-center">
            <p className="text-xs uppercase tracking-widest text-muted-foreground font-mono">
              CASE FILE ARCHIVED FOR ID:{" "}
              <span className="text-foreground font-bold">{studentId}</span>
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // --- VIEW 2: THE QUIZ (The Investigation) ---
  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b-4 border-foreground pb-4 gap-4">
        <h1 className="text-3xl font-heading font-black uppercase text-foreground leading-none">
          {quizTitle}
        </h1>
        <div className="font-mono text-sm bg-primary text-primary-foreground px-3 py-1 uppercase font-bold tracking-wider inline-block">
          Subject: {studentId}
        </div>
      </div>

      <div className="space-y-16">
        {questions.map((q, i) => (
          <div key={q.id} className="space-y-6 relative pl-8 md:pl-0">
            {/* Question Number (Vertical Line style) */}
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
                return (
                  <div key={opt.id} className="relative group">
                    <RadioGroupItem
                      value={opt.id}
                      id={opt.id}
                      className="peer sr-only" // Hide default radio
                    />
                    <Label
                      htmlFor={opt.id}
                      className={`
                        flex items-center p-4 border-2 cursor-pointer transition-all duration-200
                         tracking-wide text-sm md:text-base font-medium
                        ${
                          isSelected
                            ? "border-primary bg-primary/10 text-foreground"
                            : "border-border bg-background text-foreground hover:border-foreground hover:text-foreground"
                        }
                      `}
                    >
                      <div
                        className={`
                        w-4 h-4 mr-4 border-2 flex-shrink-0
                        ${isSelected ? "bg-primary border-primary" : "border-muted-foreground"}
                      `}
                      />
                      {opt.option_text}
                    </Label>
                  </div>
                );
              })}
            </RadioGroup>
          </div>
        ))}
      </div>

      {/* Footer / Submit l/sup*/}
      <div className="pt-12 pb-24 border-t-4 border-muted">
        <Button
          onClick={handleSubmit}
          className="w-full h-16 text-xl rounded-none bg-primary text-primary-foreground hover:bg-primary/90 font-black tracking-widest uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
          disabled={isPending || Object.keys(answers).length < questions.length}
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

        {Object.keys(answers).length < questions.length && (
          <div className="mt-4 flex items-center justify-center text-destructive font-bold uppercase tracking-wider gap-2">
            <AlertCircle className="w-5 h-5" />
            <span>Complete all fields before submission</span>
          </div>
        )}
      </div>
    </div>
  );
}
