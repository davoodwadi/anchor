"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { generateQuizAction } from "@/actions/generate-actions";
import { GeneratedContent } from "@/types/QuizTypes";
import { extractText } from "@/lib/extract-text";
import { cn } from "@/lib/utils";
import { AwPage, AwTopBar, aw } from "@/components/aw2/shell";
import { Key } from "@/components/aw2/key";
import { useHotkeys } from "@/components/aw2/use-hotkeys";

const noRefDoc = "Do not mention the document. ";
const addedConstraints = noRefDoc;

export default function CreateQuizPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState(3);
  const [fileName, setFileName] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const ready = !!extractedText && !!title.trim() && !isReading;

  // Elapsed seconds while drafting (text only, no animation)
  useEffect(() => {
    if (!isLoading) return;
    const t = setInterval(
      () => setElapsed(Math.round((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => clearInterval(t);
  }, [isLoading, startedAt]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setFileName(file.name);
    setExtractedText(null);
    setIsReading(true);
    try {
      setExtractedText(await extractText(file));
      if (!title.trim()) setTitle(file.name.replace(/\.(pdf|md|markdown)$/i, ""));
    } catch (e) {
      setFileName(null);
      setError(e instanceof Error ? e.message : "Couldn't read that file.");
    } finally {
      setIsReading(false);
    }
  };

  const handleGenerate = async () => {
    if (!ready || isLoading) return;
    setError(null);
    setStartedAt(Date.now());
    setElapsed(0);
    setIsLoading(true);

    const history: GeneratedContent[] = [
      {
        type: "user",
        content:
          `Generate ${numQuestions} multiple choice questions based on the following document. ` +
          addedConstraints +
          "\n\n" +
          extractedText,
        id: "1",
      },
    ];

    const result = await generateQuizAction({
      sessionId: "",
      mode: "quiz",
      history,
      numQuestions,
      title,
      sessionType: "createQuiz",
    });

    if (result.success && result.data) {
      router.push(`/quiz/${result.data.id}`);
      return;
    }
    setError(result.error || "The quiz couldn't be drafted. Please try again.");
    setIsLoading(false);
  };

  useHotkeys({
    escape: () => router.push("/dashboard"),
    enter: (e) => {
      if ((e.target as HTMLElement).closest("button, a")) return;
      handleGenerate();
    },
  });

  const steps = [
    { label: "Source", done: !!extractedText },
    { label: "Title and length", done: !!title.trim() },
    { label: "Draft", done: false },
  ];
  const at = isLoading ? 2 : extractedText ? 1 : 0;

  return (
    <AwPage>
      <div className="min-h-svh grid grid-rows-[auto_1fr]">
        <AwTopBar
          left={
            <Link href="/dashboard" className={aw.chip}>
              <Key>Esc</Key>Dashboard
            </Link>
          }
          mid="New quiz"
        />

        <main className="grid gap-8 xl:gap-12 px-4 md:px-10 pt-[1vh] pb-16 items-start grid-cols-1 md:grid-cols-[minmax(200px,280px)_minmax(0,1fr)] xl:grid-cols-[minmax(220px,300px)_minmax(0,1fr)_minmax(300px,460px)]">
          <section className={aw.side}>
            <div className={aw.kicker}>From your material</div>
            <h1 className={cn(aw.display, "text-[clamp(54px,5.6vw,84px)] mt-1.5 mb-6")}>
              NEW QUIZ
            </h1>
            <h2 className={cn(aw.groupTitle, "hidden md:flex")}>Steps</h2>
            <ol className="hidden md:block">
              {steps.map((s, i) => (
                <li
                  key={s.label}
                  className={cn(aw.item, i === at ? aw.itemOn : "text-aw-text-2")}
                >
                  <span className="w-5 text-aw-text-3">{i + 1}</span>
                  {s.label}
                  <span className={cn(aw.itemMeta, s.done && "text-aw-sage")}>
                    {s.done ? "✓" : i === 2 && isLoading ? "Writing…" : ""}
                  </span>
                </li>
              ))}
            </ol>
          </section>

          <section className={cn(aw.stage, "pt-1 max-w-[560px]")}>
            {isLoading ? (
              <div role="status" className="grid gap-3 font-prose text-[18px] leading-relaxed text-aw-text">
                <div className={aw.label}>Drafting</div>
                <p>
                  Writing {numQuestions} questions from{" "}
                  <strong className="font-medium">{fileName}</strong>.
                </p>
                <p className="text-[16px] text-aw-text-2">
                  Each question is grounded in a sentence from your file. This
                  usually takes 20 to 40 seconds. {elapsed}s so far.
                </p>
              </div>
            ) : (
              <div className="grid gap-8">
                <div className="grid gap-2">
                  <span className={aw.fieldLabel}>Source material</span>
                  {fileName ? (
                    <div className="flex items-baseline gap-3 font-prose text-[17px] text-aw-text">
                      <span className="truncate">{fileName}</span>
                      <span className="text-[15px] text-aw-text-3 whitespace-nowrap">
                        {isReading ? "Reading…" : "Ready"}
                      </span>
                      <button
                        onClick={() => {
                          setFileName(null);
                          setExtractedText(null);
                        }}
                        className="aw-btn-reset ml-auto font-ui font-medium text-[14px] uppercase tracking-[.1em] text-aw-text-3 hover:text-aw-text"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => fileInput.current?.click()}
                      onDragOver={(e) => {
                        e.preventDefault();
                        setDragging(true);
                      }}
                      onDragLeave={() => setDragging(false)}
                      onDrop={(e) => {
                        e.preventDefault();
                        setDragging(false);
                        handleFile(e.dataTransfer.files?.[0]);
                      }}
                      className={cn(
                        "aw-btn-reset grid place-items-center gap-1 px-4 py-8 border-[1.5px] border-dashed font-prose text-[17px]",
                        dragging
                          ? "border-aw-sage text-aw-text"
                          : "border-white/30 text-aw-text-2 hover:border-aw-sage hover:text-aw-text",
                      )}
                    >
                      <span className="font-ui font-medium text-[18px] uppercase tracking-[.08em] text-aw-text">
                        Drop a PDF or Markdown file
                      </span>
                      or click to choose one
                    </button>
                  )}
                  <input
                    ref={fileInput}
                    type="file"
                    accept=".pdf,.md,.markdown,application/pdf,text/markdown"
                    hidden
                    onChange={(e) => {
                      handleFile(e.target.files?.[0]);
                      e.target.value = "";
                    }}
                  />
                </div>

                <div className="grid gap-2">
                  <label htmlFor="title" className={aw.fieldLabel}>
                    Title
                  </label>
                  <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Week 7: Memory and Retrieval"
                    className={aw.input}
                  />
                </div>

                <div className="grid gap-2">
                  <span className={aw.fieldLabel} id="count-label">
                    Number of questions
                  </span>
                  <div className="flex items-center gap-4" role="group" aria-labelledby="count-label">
                    <button
                      onClick={() => setNumQuestions((n) => Math.max(1, n - 1))}
                      aria-label="Fewer questions"
                      className="size-[38px] bg-[rgba(30,32,31,.7)] text-[22px] text-aw-text"
                    >
                      −
                    </button>
                    <output className="font-display text-[40px] min-w-[2ch] text-center text-aw-text">
                      {numQuestions}
                    </output>
                    <button
                      onClick={() => setNumQuestions((n) => Math.min(20, n + 1))}
                      aria-label="More questions"
                      className="size-[38px] bg-[rgba(30,32,31,.7)] text-[22px] text-aw-text"
                    >
                      +
                    </button>
                  </div>
                </div>

                {error && (
                  <p role="alert" className="font-prose text-[15px] text-[#d58c88] border-l-2 border-aw-red pl-3">
                    {error}
                  </p>
                )}

                <div>
                  <button onClick={handleGenerate} disabled={!ready} className={aw.button}>
                    <Key className="bg-white/[.12] text-inherit">Enter</Key>Draft the quiz
                  </button>
                </div>
              </div>
            )}
          </section>

          <section
            aria-label="What Anchor read from your file"
            className="md:col-span-2 xl:col-span-1 w-full max-w-[460px] justify-self-center pt-1"
          >
            <div className="rotate-[1.8deg]">
              <div className="aw-paper aw-typed relative aspect-[1000/1296] w-full overflow-hidden px-[10%] pt-[10%] pb-[14%] text-[clamp(11px,.95vw,14px)] leading-[2.1]">
                {extractedText ? (
                  <>
                    <p className="whitespace-pre-line line-clamp-[18]">
                      {extractedText.trim().slice(0, 1400)}
                    </p>
                    <span className="absolute left-[10%] bottom-[5%] -rotate-3 font-hand uppercase text-[1.35em]">
                      {isLoading
                        ? `drafting ${numQuestions} questions…`
                        : "↑ what Anchor read from your file"}
                    </span>
                  </>
                ) : (
                  <p className="font-hand text-[1.6em] text-center mt-[45%] opacity-70 -rotate-3">
                    {isReading ? "Reading your file…" : "Your file will appear here"}
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>
      </div>
    </AwPage>
  );
}
