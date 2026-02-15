import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface Answer {
  question_text: string;
  option_text: string;
  is_correct: boolean;
}

export function AttemptDetails({ answers }: { answers: Answer[] }) {
  if (!answers?.length)
    return <div className="p-4 text-center">No details available.</div>;

  return (
    <div className="bg-muted/20 p-4 space-y-4 border-t-2 border-foreground">
      {answers.map((ans, i) => (
        <div key={i} className="flex gap-4 group">
          {/* Status Indicator Line */}
          <div
            className={cn(
              "w-1 flex-shrink-0 transition-colors",
              ans.is_correct ? "bg-primary" : "bg-red-600",
            )}
          />

          <div className="flex-1 space-y-1 pb-4 border-b border-border/50 last:border-0 last:pb-0">
            {/* Question Text */}
            <p className="font-heading uppercase text-sm font-bold opacity-60">
              {ans.question_text || "Unknown Question"}
            </p>

            {/* Answer Result */}
            <div className="flex items-start gap-2">
              {ans.is_correct ? (
                <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
              ) : (
                <X className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
              )}

              <span
                className={cn(
                  "font-body text-base font-medium",
                  ans.is_correct
                    ? "text-primary"
                    : "text-red-600 line-through decoration-2",
                )}
              >
                {ans.option_text || "Unknown Option"}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
