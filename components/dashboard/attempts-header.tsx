export function AttemptsHeader({ count }: { count: number }) {
  return (
    <div className="flex items-end justify-between border-b-4 border-foreground pb-2 mb-6">
      <h2 className="text-sm md:text-2xl font-heading font-bold uppercase tracking-tight leading-none">
        Subject Responses
      </h2>
      <div className="bg-foreground text-background px-2 py-1 font-mono text-sm font-bold uppercase">
        Total Records: {count}
      </div>
    </div>
  );
}
