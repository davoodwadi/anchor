import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-background p-6 md:p-12 font-body">
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center border-b-2 border-muted pb-4">
          <div className="h-8 w-64 bg-muted" /> {/* Title */}
          <div className="h-6 w-24 bg-muted" /> {/* ID Badge */}
        </div>

        {/* Questions Skeleton */}
        <div className="space-y-12">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-4">
              <div className="flex gap-4">
                <div className="h-8 w-8 bg-muted" /> {/* Number */}
                <div className="h-6 w-3/4 bg-muted" /> {/* Question Text */}
              </div>

              {/* Options */}
              <div className="pl-12 space-y-3">
                <div className="h-6 w-1/2 bg-muted/50" />
                <div className="h-6 w-1/2 bg-muted/50" />
                <div className="h-6 w-1/2 bg-muted/50" />
                <div className="h-6 w-1/2 bg-muted/50" />
              </div>
            </div>
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="pt-8 border-t-2 border-muted">
          <div className="h-14 w-full md:w-64 bg-muted" />
        </div>
      </div>
    </div>
  );
}
