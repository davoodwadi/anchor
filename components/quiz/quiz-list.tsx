import { createClient } from "@/lib/supabase/server";
import { Eye, Calendar, FileText } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export async function QuizList() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/login");
  }

  const { data: quizzes } = await supabase
    .from("quizzes")
    .select("*")
    .eq("instructor_id", user.id)
    .order("created_at", { ascending: false });

  if (!quizzes?.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 border border-zinc-900 bg-black/50 text-center">
        <FileText className="w-8 h-8 text-zinc-700 mb-4 opacity-50" />
        <h3 className="text-xl font-serif text-zinc-400 tracking-widest uppercase mb-2">
          NO RECORDS FOUND
        </h3>
        <p className="text-zinc-600 font-mono text-xs uppercase tracking-wider mb-6">
          The archives are currently empty.
        </p>
        <Link
          href="/create"
          className="px-6 py-2 border border-zinc-800 text-zinc-300 font-mono text-xs uppercase tracking-widest hover:border-neon-red-500 hover:text-white hover:bg-neon-red-900/10 transition-all duration-300"
        >
          Initiate Trial
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {quizzes.map((quiz) => (
        <Link key={quiz.id} href={`/quiz/${quiz.id}`} className="block group">
          <div className="h-full flex flex-col p-5 border border-zinc-800 bg-black hover:border-neon-red-500 hover:bg-zinc-950 transition-all duration-300 relative overflow-hidden">
            <div className="absolute inset-0 bg-neon-red-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>

            <h3
              className="text-lg font-bold text-zinc-300 group-hover:text-white mb-3 truncate uppercase tracking-wide transition-colors relative z-10 w-full"
              title={quiz.title}
            >
              {quiz.title}
            </h3>

            <div className="flex items-center text-xs font-mono text-zinc-500 group-hover:text-zinc-400 mb-6 mt-auto transition-colors relative z-10">
              <Calendar className="w-3 h-3 mr-2 text-zinc-700 group-hover:text-neon-red-800 transition-colors" />
              {new Date(quiz.created_at).toLocaleDateString()}
            </div>

            <div className="mt-auto flex items-center text-xs font-mono text-zinc-600 group-hover:text-neon-red-500 transition-colors relative z-10">
              <Eye className="w-3 h-3 mr-2" />
              <span className="uppercase tracking-widest">Review File</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
