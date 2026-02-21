import { RitualLoading } from "@/app/(app)/generate/[id]/RitualLoading";
import Link from "next/link";

export default function RitualLoadingInspectPage() {
  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 py-8">
      <div className="flex flex-col gap-2">
        <Link
          href="/dashboard"
          className="text-sm text-muted-foreground hover:text-foreground underline"
        >
          ← Back to dashboard
        </Link>
        <p className="text-xs text-muted-foreground uppercase tracking-widest">
          Dev: RitualLoading component
        </p>
      </div>
      <RitualLoading />
    </div>
  );
}
