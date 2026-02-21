import { cn } from "@/lib/utils";
export default function ProgressBar({ className }: { className?: string }) {
  return (
    <div className="flex gap-2 w-full ">
      <div className="flex gap-2 w-full">
        <div className="flex gap-2 w-full">
          {/* Block 1: Black from 0.0s to 0.3s */}
          <div
            className={cn("h-4 flex-1 bg-black animate-travel-snap", className)}
          ></div>

          {/* Block 2: Black from 0.3s to 0.6s */}
          <div
            className={cn(
              "h-4 flex-1 bg-black animate-travel-snap [animation-delay:0.8s]",
              className,
            )}
          ></div>

          {/* Block 3: Black from 0.6s to 0.9s */}
          <div
            className={cn(
              "h-4 flex-1 bg-black animate-travel-snap [animation-delay:1.6s]",
              className,
            )}
          ></div>
        </div>
      </div>
    </div>
  );
}
