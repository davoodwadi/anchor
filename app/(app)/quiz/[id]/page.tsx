import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AttemptsList from "@/components/dashboard/AttemptsList";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Calendar, Users, Link } from "lucide-react";
import { format } from "date-fns";
import { BackButton } from "@/components/shared/back-button";
import { ShareButton } from "./share-button";
import { PreviewQuizButton } from "./preview-quiz-button";
// 1. The Page Component is now SYNCHRONOUS.
// It sets up the boundary and passes the Promise.
export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="container max-w-5xl py-12 space-y-12 animate-in fade-in duration-500">
      <Suspense fallback={<DashboardSkeleton />}>
        <QuizDashboard params={params} />
      </Suspense>
    </div>
  );
}
// 2. This Inner Component handles the async logic (awaiting params & DB)
async function QuizDashboard({ params }: { params: Promise<{ id: string }> }) {
  // NOW we can safely await params here because we are inside a Suspense boundary
  const { id } = await params;
  const supabase = await createClient();

  // Parallel data fetching for efficiency
  const { data: quiz, error } = await supabase
    .from("quizzes")
    .select("*, questions(*)")
    .eq("id", id)
    .single();

  if (error || !quiz) notFound();

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6">
      <div className="mb-6">
        <BackButton href="/dashboard" />
      </div>

      {/* --- SECTION 1: QUIZ META DATA (Alan Wake Style) --- */}
      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between border border-zinc-800 bg-black p-8 relative overflow-hidden">
        <div className="absolute inset-y-0 left-0 w-1 bg-neon-red-500/80"></div>

        <div className="flex flex-col gap-4 relative z-10 w-full md:w-2/3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-zinc-100 break-words leading-none">
            {quiz.title}
          </h1>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8 mt-2 text-zinc-500 font-mono text-xs uppercase tracking-widest">
            <span className="flex items-center gap-2 whitespace-nowrap">
              <Calendar className="w-4 h-4 shrink-0 text-neon-red-800" />
              {format(new Date(quiz.created_at), "MMM dd, yyyy")}
            </span>
            <span className="flex items-center gap-2 whitespace-nowrap">
              <FileText className="w-4 h-4 shrink-0 text-neon-red-800" />
              {quiz.questions.length} Questions
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col gap-3 md:w-1/3 z-10">
          <PreviewQuizButton quizId={quiz.id} />
          <ShareButton quizId={quiz.id} />
        </div>
      </div>

      {/* --- SECTION 2: ATTEMPT LOGS (Streaming Component) --- */}
      <div className="mt-12">
        <div className="relative">
          <Suspense fallback={<ListSkeleton />}>
            <AttemptsList quizId={id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// --- LOADING STATES (Alan Wake 2 Aesthetic) ---

function DashboardSkeleton() {
  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
      <Skeleton className="h-6 w-24 bg-zinc-900 rounded-none mb-6" />

      <div className="border border-zinc-900 bg-black p-8 relative flex flex-col md:flex-row gap-8 justify-between">
        <div className="absolute inset-y-0 left-0 w-1 bg-zinc-900"></div>
        <div className="space-y-6 w-full md:w-2/3">
          <Skeleton className="h-4 w-32 bg-zinc-900 rounded-none" />
          <Skeleton className="h-12 w-3/4 bg-zinc-900/50 rounded-none" />
          <div className="flex gap-6 pt-2">
            <Skeleton className="h-4 w-24 bg-zinc-900 rounded-none" />
            <Skeleton className="h-4 w-24 bg-zinc-900 rounded-none" />
          </div>
        </div>
        <div className="flex flex-col gap-3 w-full md:w-auto md:min-w-[200px]">
          <Skeleton className="h-10 w-full bg-zinc-900 rounded-none" />
          <Skeleton className="h-10 w-full bg-zinc-900 rounded-none" />
        </div>
      </div>

      <ListSkeleton />
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6 border-b border-zinc-900 pb-4">
        <Skeleton className="h-6 w-48 bg-zinc-900 rounded-none" />
      </div>
      <div className="grid gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="h-24 w-full bg-zinc-900/30 border border-zinc-900 rounded-none"
          />
        ))}
      </div>
    </div>
  );
}
