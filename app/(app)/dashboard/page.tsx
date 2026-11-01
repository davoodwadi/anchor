import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { quizStats } from "@/lib/quiz-stats";
import { AwPage } from "@/components/aw2/shell";
import {
  DashboardMindPlace,
  type DashboardQuiz,
} from "@/components/dashboard/dashboard-mind-place";

export default function DashboardPage() {
  return (
    <AwPage>
      <Suspense fallback={<DashboardLoading />}>
        <Dashboard />
      </Suspense>
    </AwPage>
  );
}

async function Dashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("id, title, created_at, questions ( id, question_text, options ( option_text ) )")
    .eq("instructor_id", user.id)
    .order("created_at", { ascending: false });

  const ids = (quizzes ?? []).map((q) => q.id);
  const { data: attempts } = ids.length
    ? await supabase
        .from("attempts")
        .select("quiz_id, score, quiz_responses ( question_id, option:options ( is_correct ) )")
        .in("quiz_id", ids)
    : { data: [] };

  const list: DashboardQuiz[] = (quizzes ?? []).map((q) => {
    const questions = q.questions ?? [];
    const mine = (attempts ?? []).filter((a) => a.quiz_id === q.id);
    const first = questions[0];
    return {
      id: q.id,
      title: q.title?.trim() || "Untitled quiz",
      createdAt: q.created_at,
      questionCount: questions.length,
      stats: quizStats(
        questions.map((x) => x.id),
        mine as unknown as Parameters<typeof quizStats>[1],
      ),
      firstQuestion: first
        ? {
            text: first.question_text,
            options: (first.options ?? []).map((o) => o.option_text),
          }
        : null,
    };
  });

  return <DashboardMindPlace email={user.email ?? ""} quizzes={list} />;
}

function DashboardLoading() {
  return (
    <div
      role="status"
      aria-label="Loading your quizzes"
      className="min-h-svh grid content-center justify-items-center px-4"
    >
      <div className="aw-kicker text-aw-text-3">Opening your desk</div>
    </div>
  );
}
