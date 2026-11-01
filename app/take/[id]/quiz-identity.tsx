"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Key } from "@/components/aw2/key";

interface QuizIdentityProps {
  quizTitle: string;
  questionCount: number;
  onStart: (id: string) => void;
}

export function QuizIdentity({
  quizTitle,
  questionCount,
  onStart,
}: QuizIdentityProps) {
  const [localId, setLocalId] = useState("");

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (localId.trim()) onStart(localId.trim());
  };

  return (
    <section className="min-h-svh grid content-center justify-items-center text-center px-4 py-10">
      <div className="aw-kicker text-aw-text-2">Quiz</div>
      <h1
        className={cn(
          "font-display font-normal tracking-normal text-aw-sage leading-[.88] mt-3 mb-4 max-w-[16ch] [text-wrap:balance] uppercase",
          quizTitle.length > 28
            ? "text-[clamp(44px,7vw,96px)]"
            : "text-[clamp(56px,11vw,160px)]",
        )}
      >
        {quizTitle}
      </h1>
      <p className="font-ui text-[17px] tracking-[.04em] text-aw-text-3">
        {questionCount} questions · No account needed · Results shown at the
        end
      </p>

      <form
        onSubmit={handleSubmit}
        autoComplete="off"
        className="mt-12 grid gap-3 justify-items-center w-full max-w-[360px]"
      >
        <label htmlFor="student-id" className="aw-kicker text-aw-text-2">
          Student number
        </label>
        <input
          id="student-id"
          name="student-id"
          autoFocus
          inputMode="numeric"
          value={localId}
          onChange={(e) => setLocalId(e.target.value)}
          placeholder="e.g. 300184562"
          required
          className="w-full bg-transparent border-0 border-b border-aw-text-3 focus:border-aw-sage outline-none font-typed text-[28px] text-center tracking-[.08em] text-aw-text placeholder:text-[20px] placeholder:tracking-[.04em] placeholder:text-[#4a504c] pt-1.5 pb-2.5"
        />
        <button
          type="submit"
          disabled={!localId.trim()}
          className="mt-4 inline-flex items-center gap-2.5 font-ui font-medium text-[22px] uppercase tracking-[.06em] text-aw-text-2 hover:text-aw-text disabled:opacity-40 disabled:hover:text-aw-text-2"
        >
          <Key>Enter</Key>Begin
        </button>
      </form>
    </section>
  );
}
