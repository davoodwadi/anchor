import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { redirect } from "next/navigation";
import { ShareButton } from "./share-button";

// Update props to accept the Promise
export async function QuizContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Await params INSIDE the Suspense boundary
  const { id } = await params;

  const supabase = await createClient();

  // Auth Check
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  // Fetch Data (using 'id' from params)
  const { data: quiz, error } = await supabase
    .from("quizzes")
    .select(
      `
      *,
      questions (
        id,
        question_text,
        options (
          id,
          option_text,
          is_correct
        )
      )
    `,
    )
    .eq("id", id)
    .eq("instructor_id", user.id)
    .single();

  if (error || !quiz) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-muted-foreground">
        <AlertCircle className="w-12 h-12 mb-4 text-red-400" />
        <h3 className="text-lg font-semibold text-foreground">
          Quiz not found
        </h3>
        <p>You may not have permission to view this quiz.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{quiz.title}</h1>
          <p className="text-muted-foreground mt-1">
            {quiz.questions.length} Questions • Created{" "}
            {new Date(quiz.created_at).toLocaleDateString()}
          </p>
        </div>
        <ShareButton quizId={quiz.id} />
      </div>

      <div className="grid gap-6">
        {quiz.questions.map((q: any, i: number) => (
          <Card key={q.id} className="overflow-hidden rounded-none">
            <CardHeader className="pb-4 bg-muted/30 border-b">
              <CardTitle className="text-base font-medium leading-relaxed flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs">
                  {i + 1}
                </span>
                {q.question_text}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4 bg-card/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {q.options.map((opt: any) => (
                  <div
                    key={opt.id}
                    className={`
                      relative p-3 rounded-md border text-sm transition-all
                      ${
                        opt.is_correct
                          ? "bg-green-50 border-green-200 text-green-900 shadow-sm"
                          : "bg-background border-muted text-muted-foreground opacity-80"
                      }
                    `}
                  >
                    <span className="pr-6 block">{opt.option_text}</span>
                    {opt.is_correct && (
                      <CheckCircle2 className="w-4 h-4 text-green-600 absolute right-3 top-3" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
