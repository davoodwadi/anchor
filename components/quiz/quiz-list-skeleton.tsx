import { Skeleton } from "@/components/ui/skeleton";

export function QuizListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-[140px] flex flex-col p-5 border border-zinc-900 bg-black/50"
        >
          <Skeleton className="h-6 w-3/4 mb-3 bg-zinc-900 rounded-none" />
          <Skeleton className="h-4 w-1/2 mb-6 bg-zinc-900/50 rounded-none" />
          <div className="mt-auto flex items-center">
            <Skeleton className="h-4 w-24 bg-zinc-900/50 rounded-none" />
          </div>
        </div>
      ))}
    </div>
  );
}
