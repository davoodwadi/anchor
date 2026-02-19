import { Button } from "@/components/ui/button";
import { Plus, Book } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { QuizList } from "@/components/quiz-list";
import { QuizListSkeleton } from "@/components/quiz-list-skeleton";

export default function DashboardPage() {
  return (
    <div className="container w-full p-6 mx-auto">
      {/* 1. Static UI: Renders Instantly */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Quizzes</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI-generated quizzes
          </p>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center ">
          <Link href="/create">
            <Button className="w-32">
              <Plus className="w-4 h-4 " />
              <span className="ml-2 hidden md:inline">New Quiz</span>
            </Button>
          </Link>
          <Link href="/generate">
            <Button className="w-32">
              <Book className="w-4 h-4 " />
              <span className="ml-2 hidden md:inline">Learn</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* 2. Streaming UI: Loads in background */}
      <Suspense fallback={<QuizListSkeleton />}>
        <QuizList />
      </Suspense>
    </div>
  );
}
