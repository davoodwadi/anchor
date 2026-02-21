export function QuizListSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="h-40 bg-muted/20 rounded-lg border border-muted animate-pulse"
        />
      ))}
    </div>
  );
}
