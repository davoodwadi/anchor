import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import AttemptsList from "@/components/dashboard/AttemptsList";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Calendar, Users } from "lucide-react";
import { format } from "date-fns";

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
    <>
      {/* --- SECTION 1: QUIZ META DATA (Alan Wake Style) --- */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2 border-l-4 border-primary pl-6">
          <h1 className="text-5xl font-heading font-bold uppercase tracking-tighter text-foreground">
            {quiz.title}
          </h1>
          <div className="flex items-center gap-6 text-muted-foreground font-mono text-sm uppercase tracking-widest font-bold">
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              {format(new Date(quiz.created_at), "MMM dd, yyyy")}
            </span>
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              {quiz.questions.length} Questions
            </span>
            <span className="text-primary flex items-center gap-2">
              <Users className="w-4 h-4" />
              Active
            </span>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex gap-4 pt-4">
          <a
            href={`/take/${quiz.id}`}
            target="_blank"
            className="inline-flex h-12 items-center justify-center bg-foreground text-background px-8 font-bold uppercase tracking-widest hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            Open Public Link
          </a>
        </div>
      </div>

      {/* --- SECTION 2: ATTEMPT LOGS (Streaming Component) --- */}
      <div className="pt-12 border-t-2 border-muted">
        {/* We can nest another Suspense here if we want the title to load before the list */}
        <Suspense fallback={<ListSkeleton />}>
          <AttemptsList quizId={id} />
        </Suspense>
      </div>
    </>
  );
}

// --- LOADING STATES (Alan Wake 2 Aesthetic) ---

function DashboardSkeleton() {
  return (
    <div className="space-y-12">
      <div className="space-y-6">
        <div className="border-l-4 border-muted pl-6 space-y-4">
          <Skeleton className="h-16 w-3/4 bg-muted rounded-none" />
          <div className="flex gap-4">
            <Skeleton className="h-4 w-32 bg-muted rounded-none" />
            <Skeleton className="h-4 w-32 bg-muted rounded-none" />
          </div>
        </div>
        <Skeleton className="h-12 w-48 bg-muted rounded-none" />
      </div>
      <ListSkeleton />
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-4 pt-12">
      <div className="flex justify-between items-end border-b-4 border-muted pb-2">
        <Skeleton className="h-8 w-64 bg-muted rounded-none" />
        <Skeleton className="h-6 w-24 bg-muted rounded-none" />
      </div>
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            className="h-20 w-full bg-muted/50 rounded-none border-2 border-transparent"
          />
        ))}
      </div>
    </div>
  );
}
