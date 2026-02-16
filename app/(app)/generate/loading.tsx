export default function Loading() {
  return (
    <div className="flex h-[50vh] w-full items-center justify-center">
      {/* Use your brutalist loader, or just text */}
      <div className="animate-pulse text-sm font-mono tracking-widest text-zinc-500">
        INITIALIZING_SESSION...
      </div>
    </div>
  );
}
