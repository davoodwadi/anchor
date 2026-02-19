import { Button } from "@/components/ui/button";
import { Plus, Book } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { QuizList } from "@/components/quiz-list";
import { QuizListSkeleton } from "@/components/quiz-list-skeleton";

export default function DashboardPage() {
  return (
    <div className="container w-full p-6 mx-auto">
      <div className="flex flex-row w-full gap-2 items-start justify-center mb-8">
        <Link href="/create" className="w-full">
          <Button className="w-full flex flex-row justify-between">
            <Plus className="w-4 h-4 " />
            <span className="ml-2 hidden md:inline">Quiz</span>
          </Button>
        </Link>
        <Link href="/generate" className="w-full">
          <Button className="w-full flex flex-row justify-between">
            <Book className="w-4 h-4 " />
            <span className="ml-2 hidden md:inline">Learn</span>
          </Button>
        </Link>
      </div>
      {/* 1. Static UI: Renders Instantly */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Quizzes</h1>
          <p className="text-muted-foreground mt-1">
            Manage your AI-generated quizzes
          </p>
        </div>
      </div>

      {/* 2. Streaming UI: Loads in background */}
      <Suspense fallback={<QuizListSkeleton />}>
        <QuizList />
      </Suspense>
    </div>
  );
}
