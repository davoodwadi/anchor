import { FileText, BrainCircuit, Activity } from "lucide-react";

export function Hero() {
  return (
    <div className="flex flex-col gap-12 items-center relative">
      {/* Background Ambience: Cyan Fog in Dark Mode, Warm light in Light Mode */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background blur-3xl opacity-40" />

      {/* Visual Metaphor */}
      <div className="flex gap-6 md:gap-12 justify-center items-center mt-8">
        {/* Source */}
        <div className="flex flex-col items-center gap-3 group">
          <div className="p-4 bg-card border border-border shadow-sm group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-500">
            <FileText className="w-16 h-16 text-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="font-heading text-xl tracking-widest uppercase text-foreground">
            Data
          </span>
        </div>

        {/* The Connection (A glitchy line) */}
        <div className="relative flex items-center">
          <span className="w-8 md:w-16 h-[1px] bg-border" />
          <Activity className="w-6 h-6 text-primary absolute left-1/2 -translate-x-1/2 " />
        </div>

        {/* AI Processing */}
        <div className="relative group animate-flicker">
          <div className="absolute -inset-1 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col items-center gap-3 relative z-10">
            <div className="p-5 bg-background border-2 border-primary shadow-[0_0_20px_hsl(var(--primary)/0.5)] dark:shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
              <BrainCircuit className="w-20 h-20 text-primary" />
            </div>
            <span className="font-heading text-xl tracking-widest uppercase text-primary ">
              LLM
            </span>
          </div>
        </div>

        {/* Connection */}
        <div className="relative flex items-center">
          <span className="w-8 md:w-16 h-[1px] bg-border" />
        </div>

        {/* Output */}
        <div className="flex flex-col items-center gap-3 group">
          <div className="p-4 bg-card border border-border shadow-sm group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-500">
            <FileText className="w-16 h-16 text-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="font-heading text-xl tracking-widest uppercase text-foreground">
            Quiz
          </span>
        </div>
      </div>

      {/* Main Text */}
      <div className="flex flex-col items-center gap-6 text-center max-w-3xl px-4 mt-8">
        <h1 className="text-6xl md:text-8xl font-heading font-bold uppercase tracking-tighter leading-[0.85] text-foreground">
          It's not a text. <br />
          <span className="text-primary bg-clip-text  ">It's a test.</span>
        </h1>

        <p className="text-xl md:text-2xl text-muted-foreground font-body max-w-2xl leading-relaxed mt-4">
          <span className="text-foreground font-bold border-b-2 border-primary">
            Anchor
          </span>{" "}
          transforms your lecture notes into an interactive quiz. Use the power
          of the AI to generate quizzes instantly.
        </p>
      </div>
    </div>
  );
}
