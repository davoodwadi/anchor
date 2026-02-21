export function AttemptsHeader({ count }: { count: number }) {
  return (
    <div className="flex items-center justify-between border-b-4 border-foreground pb-4 mb-6">
      <div className="text-sm md:text-2xl font-heading font-bold uppercase tracking-tight leading-none underline !decoration-primary decoration-2 underline-offset-8">
        Subject Responses
      </div>
      <div className="bg-foreground text-background px-2 py-1 font-mono text-sm font-bold uppercase">
        Total Records: {count}
      </div>
    </div>
  );
}
