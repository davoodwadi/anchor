import Footer from "@/app/Footer";
import Nav from "@/app/Nav";
import Image from "next/image";
import { WakeButton } from "@/components/shared/wake-button";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center bg-black text-white selection:bg-red-900 selection:text-white">
      <div className="flex-1 w-full flex flex-col items-center relative z-10">
        <Nav />
        <div className="flex-1 flex flex-col items-center justify-center w-full max-w-5xl px-6 py-24 md:py-32 gap-16">
          {/* Hero Section */}
          <section className="text-center flex flex-col items-center gap-8 w-full">
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 border border-zinc-800 bg-zinc-900/50 text-zinc-400 font-mono text-sm uppercase tracking-wider">
              <span className="w-2 h-2 bg-red-800 animate-pulse"></span>
              Investigation Active
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold uppercase text-zinc-100 mb-4 tracking-tight leading-tight">
              <span className="block mb-2">Survive The</span>
              <span className="block text-neon-red-500 font-black tracking-wide drop-shadow-[0_0_15px_rgba(185,28,28,0.2)]">
                Blank Page
              </span>
            </h1>

            <p className="text-justify hyphens-auto text-lg md:text-xl font-serif text-zinc-400 max-w-2xl leading-relaxed border-l-2 border-red-800/50 pl-6 text-left">
              Don't be left in the dark. Turn your notes, documents, and ideas
              into quizzes. Test your knowledge, master your subjects, and shed
              light on what you still need to learn.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 mt-12 w-full max-w-md justify-center">
              <WakeButton href="/create" variant="primary">
                Begin Investigation
              </WakeButton>
              <WakeButton href="/dashboard" variant="secondary">
                View Evidence
              </WakeButton>
            </div>
          </section>

          {/* Features / Manuscript Section */}
          <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 mt-24">
            <div className="bg-zinc-900/40 border border-zinc-800 p-8 hover:border-zinc-600 transition-colors backdrop-blur-sm">
              <h3 className="font-serif text-2xl mb-4 text-zinc-200 tracking-wide flex items-center gap-3">
                <span className="text-red-800 font-mono text-sm">01.</span>
                Submit The Source
              </h3>
              <p className="text-justify hyphens-auto font-mono text-sm text-zinc-500 leading-relaxed">
                Provide the raw material. Upload your study notes, documents, or
                articles. The system will analyze the text and extract the
                critical information needed for your test.
              </p>
            </div>
            <div className="bg-zinc-900/40 border border-zinc-800 p-8 hover:border-red-900/40 transition-colors relative overflow-hidden backdrop-blur-sm group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-red-900/5 blur-3xl rounded-full group-hover:bg-red-900/20 transition-all duration-500"></div>
              <h3 className="font-serif text-2xl mb-4 text-zinc-200 tracking-wide relative z-10 flex items-center gap-3">
                <span className="text-red-800 font-mono text-sm">02.</span>
                Face The Trial
              </h3>
              <p className="text-justify hyphens-auto font-mono text-sm text-zinc-500 leading-relaxed relative z-10">
                Engage with dynamic, challenging quizzes generated instantly
                from your content. Track your progress, identify blind spots,
                and master the subject matter.
              </p>
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </main>
  );
}
