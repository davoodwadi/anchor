/** Blank sheet on the desk while the quiz loads. */
export default function Loading() {
  return (
    <div
      role="status"
      aria-label="Loading quiz"
      className="min-h-svh grid content-center justify-items-center gap-6 px-4"
    >
      <div className="aw-kicker text-aw-text-3 animate-pulse">Loading quiz</div>
      <div className="aw-paper w-[min(100%,420px)] aspect-[1000/1296] rotate-[1.5deg] px-[10%] pt-[12%] opacity-80">
        <div className="space-y-[1.4em] animate-pulse">
          <div className="h-2.5 w-3/4 bg-aw-ink/20" />
          <div className="h-2.5 w-1/2 bg-aw-ink/15" />
          <div className="h-2.5 w-2/3 bg-aw-ink/15" />
          <div className="h-2.5 w-1/2 bg-aw-ink/15" />
          <div className="h-2.5 w-3/5 bg-aw-ink/15" />
        </div>
      </div>
    </div>
  );
}
