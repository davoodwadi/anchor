import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { QuizList } from "@/components/quiz-list";
import { QuizListSkeleton } from "@/components/quiz-list-skeleton";

export default function DashboardPage() {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* 1. Static UI: Renders Instantly */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Quizzes</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI-generated assessments
          </p>
        </div>
        <Link href="/create">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Create New
          </Button>
        </Link>
      </div>

      {/* 2. Streaming UI: Loads in background */}
      <Suspense fallback={<QuizListSkeleton />}>
        <QuizList />
      </Suspense>
    </div>
  );
}
