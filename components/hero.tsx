import { FileText, BrainCircuit, Activity } from "lucide-react";

export function Hero() {
  return (
    <div className="flex flex-col gap-12 items-center relative overflow-hidden px-4">
      {/* Background Ambience */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background blur-3xl opacity-40" />

      {/* Visual Metaphor - Responsive Scaling Added */}
      {/* 1. Gap reduced from gap-6 to gap-2 on mobile */}
      <div className="flex gap-2 md:gap-12 justify-center items-center mt-8 w-full max-w-4xl">
        {/* Source */}
        <div className="flex flex-col items-center gap-2 md:gap-3 group">
          {/* 2. Padding reduced (p-2 vs p-4) */}
          <div className="p-2 md:p-4 bg-card border border-border shadow-sm group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-500">
            {/* 3. Icon size reduced (w-8 vs w-16) */}
            <FileText className="w-8 h-8 md:w-16 md:h-16 text-foreground group-hover:text-primary transition-colors" />
          </div>
          {/* 4. Text size reduced (text-xs vs text-xl) */}
          <span className="font-heading text-xs md:text-xl tracking-widest uppercase text-foreground">
            Data
          </span>
        </div>

        {/* The Connection */}
        <div className="relative flex items-center shrink-0">
          {/* 5. Line width reduced (w-4 vs w-16) */}
          <span className="w-4 md:w-16 h-[1px] bg-border" />
          <Activity className="w-4 h-4 md:w-6 md:h-6 text-primary absolute left-1/2 -translate-x-1/2 " />
        </div>

        {/* AI Processing */}
        <div className="relative group animate-flicker">
          <div className="absolute -inset-1 bg-primary/20 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="flex flex-col items-center gap-2 md:gap-3 relative z-10">
            {/* 6. Center box scaling */}
            <div className="p-3 md:p-5 bg-background border-2 border-primary shadow-[0_0_20px_hsl(var(--primary)/0.5)] dark:shadow-[0_0_20px_hsl(var(--primary)/0.5)]">
              <BrainCircuit className="w-10 h-10 md:w-20 md:h-20 text-primary" />
            </div>
            <span className="font-heading text-xs md:text-xl tracking-widest uppercase text-primary ">
              LLM
            </span>
          </div>
        </div>

        {/* Connection */}
        <div className="relative flex items-center shrink-0">
          <span className="w-4 md:w-16 h-[1px] bg-border" />
        </div>

        {/* Output */}
        <div className="flex flex-col items-center gap-2 md:gap-3 group">
          <div className="p-2 md:p-4 bg-card border border-border shadow-sm group-hover:border-primary group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)] transition-all duration-500">
            <FileText className="w-8 h-8 md:w-16 md:h-16 text-foreground group-hover:text-primary transition-colors" />
          </div>
          <span className="font-heading text-xs md:text-xl tracking-widest uppercase text-foreground">
            Quiz
          </span>
        </div>
      </div>

      {/* Main Text */}
      <div className="flex flex-col items-center gap-6 text-center max-w-3xl px-4 mt-8">
        {/* 7. Adjusted typography for mobile wrap */}
        <h1 className="text-4xl md:text-6xl lg:text-8xl font-heading font-bold uppercase tracking-tighter leading-[0.9] text-foreground">
          It's not a text. <br />
          <span className="text-primary bg-clip-text">It's a test.</span>
        </h1>

        <p className="text-lg md:text-2xl text-muted-foreground font-body max-w-2xl leading-relaxed mt-4">
          <span className="text-foreground font-bold border-b-2 border-primary">
            Anchor
          </span>{" "}
          secures your knowledge before it fades. Turn your lecture notes into
          quizzes immediately.
        </p>
      </div>
    </div>
  );
}
