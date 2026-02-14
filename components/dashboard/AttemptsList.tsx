import { createClient } from "@/lib/supabase/server";
import { format } from "date-fns";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Check, X, User } from "lucide-react";

export default async function AttemptsList({ quizId }: { quizId: string }) {
  const supabase = await createClient();

  // Fetch attempts + nested answers + nested question text + nested option text
  const { data: attempts } = await supabase
    .from("attempts")
    .select(
      `
      id,
      student_number,
      score,
      submitted_at,
      attempt_answers (
        is_correct,
        question:questions ( question_text ),
        option:options ( option_text )
      )
    `,
    )
    .eq("quiz_id", quizId)
    .order("submitted_at", { ascending: false });

  if (!attempts?.length) {
    return (
      <div className="border-2 border-dashed border-muted p-8 text-center uppercase tracking-widest text-muted-foreground font-bold">
        No Subject Data Recorded
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between border-b-4 border-foreground pb-2 mb-6">
        <h2 className="text-2xl font-heading font-bold uppercase tracking-tight">
          Subject Responses
        </h2>
        <div className="bg-foreground text-background px-2 py-1 font-mono text-xs font-bold uppercase">
          Total Records: {attempts.length}
        </div>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-2">
        {attempts.map((attempt) => (
          <AccordionItem
            key={attempt.id}
            value={attempt.id}
            className="border-2 border-foreground bg-background"
          >
            <AccordionTrigger className="hover:no-underline px-4 py-3 hover:bg-muted/50 transition-colors data-[state=open]:bg-foreground data-[state=open]:text-background">
              <div className="flex items-center justify-between w-full pr-4">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-primary/10 border border-primary">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <div className="font-heading font-bold uppercase text-lg leading-none">
                      {attempt.student_number}
                    </div>
                    <div className="font-mono text-xs opacity-70 mt-1 uppercase">
                      {format(new Date(attempt.submitted_at), "MMM d, HH:mm")}
                    </div>
                  </div>
                </div>

                <div className="font-heading font-bold text-2xl">
                  {attempt.score}{" "}
                  <span className="text-sm font-body font-normal opacity-70">
                    pts
                  </span>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent className="p-0">
              <div className="bg-muted/20 p-4 space-y-4 border-t-2 border-foreground">
                {attempt.attempt_answers.map((ans: any, i: number) => (
                  <div key={i} className="flex gap-4 group">
                    {/* Status Indicator Line */}
                    <div
                      className={`w-1 flex-shrink-0 ${ans.is_correct ? "bg-primary" : "bg-red-600"}`}
                    />

                    <div className="flex-1 space-y-1 pb-4 border-b border-border/50 last:border-0 last:pb-0">
                      <p className="font-heading uppercase text-sm font-bold opacity-60">
                        {ans.question?.question_text || "Unknown Question"}
                      </p>

                      <div className="flex items-start gap-2">
                        {ans.is_correct ? (
                          <Check className="w-4 h-4 text-primary mt-1 flex-shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-red-600 mt-1 flex-shrink-0" />
                        )}
                        <span
                          className={`font-body text-base ${ans.is_correct ? "text-foreground" : "text-red-600 line-through"}`}
                        >
                          {ans.option?.option_text || "Unknown Option"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
