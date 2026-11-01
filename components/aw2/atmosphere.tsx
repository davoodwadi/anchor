import { cn } from "@/lib/utils";

/** Film grain and edge vignette drawn over the whole viewport. */
export function Atmosphere({ still = false }: { still?: boolean }) {
  return (
    <>
      <div className="aw-vignette" aria-hidden="true" />
      <div className={cn("aw-grain", still && "!animate-none")} aria-hidden="true" />
    </>
  );
}
