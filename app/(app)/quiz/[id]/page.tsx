import { Suspense } from "react";
import { QuizContent } from "./quiz-content";
import { QuizDetailsSkeleton } from "./loading-skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

// 1. Remove 'async' from the Page component
// 2. Do NOT await params here. Pass the Promise down.
export default function QuizDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* This renders INSTANTLY now */}
      <div className="mb-6">
        <Link href="/dashboard">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-2 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* The await happens inside here, triggering the Skeleton */}
      <Suspense fallback={<QuizDetailsSkeleton />}>
        <QuizContent params={params} />
      </Suspense>
    </div>
  );
}
