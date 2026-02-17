import { cn } from "@/lib/utils";
import ProgressBar from "@/components/ProgressBar";
export function RitualLoading() {
  return (
    <div className="w-full max-w-3xl py-8 px-8 bg-card border animate-in fade-in duration-300">
      <div className="flex flex-col gap-2">
        {/* The Content - A pulsing placeholder */}
        <div className="space-y-3 pl-5">
          <div className="flex items-center gap-2">
            <span className="text-card-foreground tracking-widest animate-pulse">
              WRITING...
            </span>
            {/* The Blinking Cursor Block */}
            {/* <div className="h-4 w-2 bg-red-600 animate-[pulse_1.8s_ease-in-out_infinite]" /> */}
          </div>

          {/* Brutalist "Redacted" Lines */}
          {/* <div className="h-4 w-3/4 bg-card-foreground animate-pulse delay-975" /> */}
          {/* <div className="h-4 w-1/2 bg-card-foreground animate-pulse delay-950" /> */}
          <ProgressBar className="bg-white mt-4 mb-8" />
        </div>
      </div>
    </div>
  );
}
