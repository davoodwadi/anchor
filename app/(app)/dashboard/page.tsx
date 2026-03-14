import { Button } from "@/components/ui/button";
import { Plus, Book, FileText } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { QuizList } from "@/components/quiz/quiz-list";
import { QuizListSkeleton } from "@/components/quiz/quiz-list-skeleton";
import { BackButton } from "@/components/shared/back-button";

export default function DashboardPage() {
  return (
    <div className="container w-full p-6 mx-auto pt-12 pb-24 relative z-10 min-h-screen">
      {/* Header */}

      <div className="flex flex-col mb-12 border-b border-zinc-800 pb-6 w-full max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-3 mb-6 ">
          <BackButton href="/" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black uppercase text-zinc-100 tracking-tight">
          THE MIND PLACE
        </h1>
      </div>

      {/* Main Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto mb-16">
        <Link
          href="/create"
          className="group relative flex flex-col items-start justify-center p-8 bg-black border border-zinc-800 hover:border-neon-red-500 transition-all duration-300 rounded-none"
        >
          <div className="absolute inset-0 bg-neon-red-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <Plus className="w-8 h-8 text-zinc-500 group-hover:text-neon-red-500 mb-4 transition-colors duration-300" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-300 group-hover:text-white mb-2 relative z-10 transition-colors">
            Create Quiz
          </h2>
          <p className="text-zinc-600 font-mono text-sm group-hover:text-zinc-400 transition-colors relative z-10">
            Initiate a new trial.
          </p>
        </Link>

        <Link
          href="/generate"
          className="group relative flex flex-col items-start justify-center p-8 bg-black border border-zinc-800 hover:border-zinc-300 transition-all duration-300 rounded-none"
        >
          <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          <Book className="w-8 h-8 text-zinc-500 group-hover:text-white mb-4 transition-colors duration-300" />
          <h2 className="text-xl font-bold uppercase tracking-widest text-zinc-300 group-hover:text-white mb-2 relative z-10 transition-colors">
            Learn Subject
          </h2>
          <p className="text-zinc-600 font-mono text-sm group-hover:text-zinc-400 transition-colors relative z-10">
            Study the manuscript.
          </p>
        </Link>
      </div>

      {/* Evidence Section (Quiz List) */}
      <div className="w-full max-w-4xl mx-auto border border-zinc-900 bg-zinc-950/50 p-6 md:p-8 rounded-none">
        <div className="flex flex-col mb-8 border-b border-zinc-900 pb-6">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-neon-red-500" />
            <h2 className="text-2xl font-serif tracking-widest text-zinc-100 uppercase">
              CASE FILES
            </h2>
          </div>
          <p className="text-zinc-600 font-mono text-xs mt-2 uppercase tracking-wider pl-8">
            Review the records of your trials.
          </p>
        </div>

        <div className="relative pl-0 md:pl-8">
          <Suspense fallback={<QuizListSkeleton />}>
            <QuizList />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
