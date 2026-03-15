"use client";

import { TypewriterStream } from "@/components/shared/typewriter-stream";

const sampleLines = [
  "Anchor is reading your notes and finding the facts that matter.",
  "Now shaping those fragments into a quiz that arrives one keystroke at a time.",
  "This sample is the pacing target: crisp bursts, brief pauses, and a living cursor.",
];

export default function Page() {
  return (
    <section className="mx-auto flex min-h-[calc(100vh-12rem)] w-full max-w-6xl items-center py-10 md:py-16">
      <div className="grid w-full gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
        <div className="relative overflow-hidden border border-zinc-800 bg-[linear-gradient(180deg,rgba(24,24,27,0.96)_0%,rgba(10,10,10,0.98)_100%)] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)] md:p-8">
          <div className="mt-6 space-y-5">
            <div className="min-h-[18rem] border border-zinc-800 bg-[repeating-linear-gradient(180deg,rgba(12,12,12,1)_0px,rgba(12,12,12,1)_34px,rgba(120,120,120,0.08)_34px,rgba(12,12,12,1)_35px)] px-4 py-5 md:px-5 md:py-6">
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-zinc-500">
                Output
              </p>
              <TypewriterStream
                lines={sampleLines}
                className="mt-5 space-y-1 font-mono text-lg leading-8 text-zinc-100 md:text-[1.4rem]"
                completedLineClassName="text-zinc-400"
                activeLineClassName="text-zinc-100"
                cursorClassName="bg-red-500"
                minLines={sampleLines.length}
              />
            </div>

            <p className="font-mono text-xs uppercase tracking-[0.24em] text-zinc-500">
              Sample types across {sampleLines.length} lines, then resets like a
              fresh sheet.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
