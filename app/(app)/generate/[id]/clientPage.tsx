"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import Markdown from "react-markdown";

import {
  generateQuizAction,
  saveStudyPicks,
} from "@/actions/generate-actions";
import { GeneratedContent, QuizData } from "@/types/QuizTypes";
import { extractText } from "@/lib/extract-text";
import type { StudySession } from "@/lib/study-sessions";
import { cn } from "@/lib/utils";
import { AwPage, AwTopBar, aw } from "@/components/aw2/shell";
import { AwSide, AwSplit } from "@/components/aw2/collapsible-side";
import { Key } from "@/components/aw2/key";
import { useHotkeys } from "@/components/aw2/use-hotkeys";
import { PracticePaper } from "@/components/aw2/practice-paper";

const noRefDoc = "Do not mention the document. ";
const addedConstraints = noRefDoc;
const PLAIN_KEY = "anchor:plain-text";

interface Props {
  user: User;
  sessionId: string;
  initialHistory: GeneratedContent[];
  sessions: StudySession[];
}

type Mode = "quiz" | "explanation";

function readPlainPref() {
  try {
    return localStorage.getItem(PLAIN_KEY) === "1";
  } catch {
    return false;
  }
}
const noSubscribe = () => () => {};

/** Number each explanation and practice quiz in the order they appeared. */
function labelEntries(history: GeneratedContent[]) {
  let e = 0;
  let q = 0;
  return history
    .filter((h) => h.type !== "user")
    .map((h) => ({
      item: h,
      label: h.type === "quiz" ? `Practice quiz ${++q}` : `Explanation ${++e}`,
    }));
}

/** Saved answers, keyed the way PracticePaper expects. */
function restorePicks(history: GeneratedContent[]) {
  const picks: Record<string, number> = {};
  for (const h of history) {
    for (const [question, option] of Object.entries(h.picks ?? {})) {
      picks[`${h.id}-${question}`] = option;
    }
  }
  return picks;
}

function parseQuestions(content: string) {
  try {
    return (JSON.parse(content) as QuizData).questions.map((q) => ({
      question_text: q.question_text,
      options: q.options,
      correct: q.correct_answer_index,
    }));
  } catch {
    return null;
  }
}

/** One explanation or quiz batch. Memoized so the "Writing…" timer skips it. */
const StudySheet = memo(function StudySheet({
  item,
  label,
  className,
  picks,
  onPick,
  register,
}: {
  item: GeneratedContent;
  label: string;
  className: string;
  picks: Record<string, number>;
  onPick: (key: string, option: number) => void;
  register: (id: string, el: HTMLElement | null) => void;
}) {
  const questions = useMemo(
    () => (item.type === "quiz" ? parseQuestions(item.content) : null),
    [item],
  );

  return (
    <div
      ref={(el) => register(item.id, el)}
      tabIndex={-1}
      className="scroll-mt-6 outline-none md:rotate-[.4deg]"
    >
      <article aria-label={label} className={className}>
        <p className="font-bold uppercase tracking-[.16em] mb-[2em]">{label}</p>
        {item.type !== "quiz" ? (
          <div className="aw-manuscript">
            <Markdown>{item.content}</Markdown>
          </div>
        ) : questions ? (
          <PracticePaper
            questions={questions}
            keyPrefix={item.id}
            picks={picks}
            onPick={onPick}
          />
        ) : (
          <p>This quiz could not be displayed.</p>
        )}
      </article>
    </div>
  );
});

export default function GeneratePage({
  sessionId,
  initialHistory,
  sessions,
}: Props) {
  const router = useRouter();
  const [history, setHistory] = useState<GeneratedContent[]>(initialHistory);
  const [extractedText, setExtractedText] = useState<string | null>(
    initialHistory[0]?.extractedText ?? null,
  );
  const [fileName, setFileName] = useState<string | null>(null);
  const [numQuestions, setNumQuestions] = useState(3);
  const [pending, setPending] = useState<Mode | null>(null);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isReading, setIsReading] = useState(false);
  // Stored preference (read on the client only), overridden once toggled here
  const storedPlain = useSyncExternalStore(
    noSubscribe,
    readPlainPref,
    () => false,
  );
  const [plainOverride, setPlainOverride] = useState<boolean | null>(null);
  const plain = plainOverride ?? storedPlain;
  const [picks, setPicks] = useState(() => restorePicks(initialHistory));
  const picksRef = useRef(picks);
  const fileInput = useRef<HTMLInputElement>(null);

  const entries = useMemo(() => labelEntries(history), [history]);
  // Which sheet is being read, kept in step with the scroll position
  const [selected, setSelected] = useState(0);
  const started = history.length > 0;
  const sheets = useRef(new Map<string, HTMLElement>());
  const pendingSheet = useRef<HTMLDivElement>(null);
  const scrollToLatest = useRef(false);

  const registerSheet = useCallback((id: string, el: HTMLElement | null) => {
    if (el) sheets.current.set(id, el);
    else sheets.current.delete(id);
  }, []);

  const handlePick = useCallback((key: string, option: number) => {
    if (picksRef.current[key] === option) return;
    const next = { ...picksRef.current, [key]: option };
    picksRef.current = next;
    setPicks(next);

    // Keys are `${messageId}-${questionIndex}`; save this quiz's answers together
    const messageId = key.slice(0, key.lastIndexOf("-"));
    const prefix = `${messageId}-`;
    const quizPicks = Object.fromEntries(
      Object.entries(next)
        .filter(([k]) => k.startsWith(prefix))
        .map(([k, v]) => [k.slice(prefix.length), v]),
    );
    const notSaved = () =>
      setError("That answer couldn't be saved. It will be lost on refresh.");
    saveStudyPicks({ messageId, picks: quizPicks })
      .then((r) => {
        if (!r.success) notSaved();
      })
      .catch(notSaved);
  }, []);

  const goToSheet = (i: number) => {
    const el = sheets.current.get(entries[i].item.id);
    el?.scrollIntoView({ block: "start" });
    el?.focus({ preventScroll: true });
  };

  // Show progress as soon as a new sheet starts being written
  useEffect(() => {
    if (pending) pendingSheet.current?.scrollIntoView({ block: "start" });
  }, [pending]);

  // Runs before the outline effect below, so it reads the new position
  useEffect(() => {
    if (!scrollToLatest.current) return;
    scrollToLatest.current = false;
    const latest = entries.at(-1);
    if (latest) {
      sheets.current.get(latest.item.id)?.scrollIntoView({ block: "start" });
    }
  }, [entries]);

  useEffect(() => {
    if (entries.length === 0) return;
    const updateOutline = () => {
      const { scrollHeight } = document.documentElement;
      if (window.innerHeight + window.scrollY >= scrollHeight - 2) {
        setSelected(entries.length - 1);
        return;
      }
      const readingLine = window.innerHeight * 0.3;
      let at = 0;
      entries.forEach((e, i) => {
        const top = sheets.current.get(e.item.id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= readingLine) at = i;
      });
      setSelected(at);
    };
    updateOutline();
    window.addEventListener("scroll", updateOutline, { passive: true });
    return () => window.removeEventListener("scroll", updateOutline);
  }, [entries]);

  useEffect(() => {
    if (!pending) return;
    const t = setInterval(
      () => setElapsed(Math.round((Date.now() - startedAt) / 1000)),
      1000,
    );
    return () => clearInterval(t);
  }, [pending, startedAt]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError(null);
    setFileName(file.name);
    setExtractedText(null);
    setIsReading(true);
    try {
      setExtractedText(await extractText(file));
    } catch (e) {
      setFileName(null);
      setError(e instanceof Error ? e.message : "Couldn't read that file.");
    } finally {
      setIsReading(false);
    }
  };

  const handleGenerate = async (mode: Mode) => {
    if (pending || !extractedText) return;
    setError(null);

    let userMessage: GeneratedContent;
    if (!started) {
      userMessage = {
        type: "user",
        content:
          mode === "quiz"
            ? `Generate ${numQuestions} multiple choice questions based on the following document.` +
              addedConstraints +
              "\n\n" +
              extractedText
            : "Explain the attached document. " +
              addedConstraints +
              "\n\n" +
              extractedText,
        extractedText,
        id: `user-${Date.now()}`,
      };
    } else if (mode === "quiz") {
      userMessage = {
        type: "user",
        content: `Generate ${numQuestions} new multiple choice questions.`,
        id: `user-${Date.now()}`,
      };
    } else {
      const last = history.at(-1);
      const instruction =
        last?.type === "explanation"
          ? "Explain the document in more detail. "
          : "Explain the questions and why the correct choice is true. ";
      userMessage = {
        type: "user",
        content: instruction + addedConstraints,
        id: `user-${Date.now()}`,
      };
    }

    const nextHistory = [...history, userMessage];
    setHistory(nextHistory);
    setPending(mode);
    setStartedAt(Date.now());
    setElapsed(0);

    const result = await generateQuizAction({
      sessionId,
      mode,
      history: nextHistory,
      numQuestions,
      title: fileName?.replace(/\.[^.]+$/, "") ?? "",
      sessionType: "generate",
    });

    if (result.success && result.data) {
      const withReply = [...nextHistory, result.data];
      setHistory(withReply);
      scrollToLatest.current = true;
      // A brand-new session has content now, so it can join the session list
      if (!started) router.refresh();
    } else {
      setError(result.error || "That didn't work. Please try again.");
    }
    setPending(null);
  };

  const togglePlain = () => {
    const next = !plain;
    setPlainOverride(next);
    try {
      localStorage.setItem(PLAIN_KEY, next ? "1" : "0");
    } catch {
      // Preference just won't persist
    }
  };

  useHotkeys({
    escape: () => router.push("/dashboard"),
    x: () => handleGenerate("explanation"),
    q: () => handleGenerate("quiz"),
    n: () => router.push("/generate"),
    t: togglePlain,
  });

  const paperText = plain
    ? "font-prose text-[16px] md:text-[clamp(16px,1.3vw,18px)] leading-[1.85]"
    : "aw-typed text-[14px] md:text-[clamp(14.5px,1.2vw,16.5px)] leading-[2.05]";

  const sheetClass = cn(
    "aw-paper relative md:min-h-[min(70vh,820px)] px-[7%] md:px-[10%] pt-[9%] md:pt-[7%] pb-[8%] md:pb-[6%]",
    paperText,
  );

  return (
    <AwPage>
      <div className="min-h-svh grid grid-rows-[auto_1fr_auto]">
        <AwTopBar
          left={
            <Link href="/dashboard" className={aw.chip}>
              <Key>Esc</Key>Dashboard
            </Link>
          }
          mid="Study session"
          right={
            <button
              onClick={togglePlain}
              aria-pressed={plain}
              className={aw.chip}
            >
              <Key>T</Key>
              {plain ? "Typewriter" : "Plain text"}
            </button>
          }
        />

        <AwSplit
          className="grid gap-6 md:gap-10 px-4 md:px-10 pt-[1vh] pb-6 items-start grid-cols-1 md:grid-cols-[minmax(200px,260px)_minmax(0,1fr)] xl:grid-cols-[minmax(220px,280px)_minmax(0,1fr)_minmax(0,220px)]"
          collapsedClassName="md:grid-cols-[auto_minmax(0,1fr)] xl:grid-cols-[auto_minmax(0,1fr)_auto]"
        >
          <AwSide className={aw.side}>
            <div className={aw.kicker}>Studying</div>
            <h1
              className={cn(
                aw.display,
                "text-[clamp(48px,4.6vw,72px)] mt-1.5 mb-6",
              )}
            >
              STUDY
            </h1>
            {sessions.length > 0 && (
              <>
                <h2 className={aw.groupTitle}>All sessions</h2>
                <ul className="flex md:block gap-1.5 overflow-x-auto md:max-h-[34svh] md:overflow-y-auto md:[scrollbar-width:thin]">
                  {sessions.map((s) => (
                    <li key={s.id}>
                      <Link
                        href={`/generate/${s.id}`}
                        aria-current={s.id === sessionId ? "page" : undefined}
                        className={cn(
                          aw.item,
                          s.id === sessionId ? aw.itemOn : aw.itemIdle,
                          "max-md:w-auto max-md:max-w-[70vw] max-md:whitespace-nowrap max-md:border max-md:border-aw-line max-md:px-2.5 max-md:py-1.5",
                        )}
                      >
                        <span className="truncate">{s.title}</span>
                        <span className={aw.itemMeta}>{s.date}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
            {(entries.length > 0 || pending) && (
              <nav
                aria-label="This session"
                className={cn(sessions.length > 0 && "mt-5")}
              >
                <h2 className={aw.groupTitle}>
                  Session{" "}
                  <span className="tracking-[.04em]">{entries.length}</span>
                </h2>
                <ul className="flex md:block gap-1.5 overflow-x-auto">
                  {entries.map((e, i) => (
                    <li key={e.item.id}>
                      <button
                        onClick={() => goToSheet(i)}
                        aria-current={
                          i === selected && !pending ? "true" : undefined
                        }
                        className={cn(
                          aw.item,
                          "max-md:w-auto max-md:whitespace-nowrap max-md:border max-md:border-aw-line max-md:px-2.5 max-md:py-1.5",
                          i === selected && !pending ? aw.itemOn : aw.itemIdle,
                        )}
                      >
                        {e.label}
                      </button>
                    </li>
                  ))}
                  {pending && (
                    <li className={cn(aw.item, aw.itemOn)}>
                      {pending === "quiz" ? "Practice quiz" : "Explanation"}
                      <span className={aw.itemMeta}>Writing…</span>
                    </li>
                  )}
                </ul>
              </nav>
            )}
          </AwSide>

          {/* One sheet per explanation or quiz batch, read by scrolling */}
          <section
            aria-live="polite"
            className={cn(
              "flex flex-col gap-8 md:gap-12 justify-self-center w-full max-w-[760px]",
              aw.paperWide,
            )}
          >
            {entries.length === 0 && !pending && (
              <div className="md:rotate-[.4deg]">
                <article className={sheetClass}>
                  <StartSheet
                    fileName={fileName}
                    isReading={isReading}
                    ready={!!extractedText}
                    onPick={() => fileInput.current?.click()}
                    onDrop={handleFile}
                  />
                </article>
              </div>
            )}
            {entries.map((e) => (
              <StudySheet
                key={e.item.id}
                item={e.item}
                label={e.label}
                className={sheetClass}
                picks={picks}
                onPick={handlePick}
                register={registerSheet}
              />
            ))}
            {pending && (
              <div ref={pendingSheet} className="scroll-mt-6 md:rotate-[.4deg]">
                <article className={sheetClass}>
                  <p role="status">
                    Writing{" "}
                    {pending === "quiz"
                      ? `${numQuestions} practice questions`
                      : "an explanation"}{" "}
                    from your file. This usually takes 20 to 40 seconds.{" "}
                    {elapsed}s so far.
                  </p>
                </article>
              </div>
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
          </section>
          <div className="hidden xl:block" />
        </AwSplit>

        <div className="sticky bottom-0 md:static bg-[rgba(13,12,11,.94)] md:bg-transparent border-t border-aw-line md:border-0">
          {error && (
            <p
              role="alert"
              className="text-center font-prose text-[15px] text-[#d58c88] pt-3"
            >
              {error}
            </p>
          )}
          <nav className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2.5 px-4 py-3 md:pt-6 md:pb-7">
            <button
              onClick={() => handleGenerate("explanation")}
              disabled={!!pending || !extractedText}
              className={cn(aw.action, "text-aw-text")}
            >
              <Key>X</Key>
              {started ? "Explain more" : "Explain"}
            </button>
            <span className="inline-flex items-center gap-3.5">
              <button
                onClick={() => handleGenerate("quiz")}
                disabled={!!pending || !extractedText}
                className={cn(aw.action, "text-aw-text")}
              >
                <Key>Q</Key>Quiz me
              </button>
              <span className="inline-flex items-center gap-1.5 font-ui text-[15px] text-aw-text-3">
                <button
                  onClick={() => setNumQuestions((n) => Math.max(1, n - 1))}
                  aria-label="Fewer questions"
                  className="size-[26px] bg-white/[.08] text-aw-text"
                >
                  −
                </button>
                <span className="text-aw-text">{numQuestions}</span> questions
                <button
                  onClick={() => setNumQuestions((n) => Math.min(20, n + 1))}
                  aria-label="More questions"
                  className="size-[26px] bg-white/[.08] text-aw-text"
                >
                  +
                </button>
              </span>
            </span>
            {started && (
              <Link href="/generate" className={aw.action}>
                <Key>N</Key>New session
              </Link>
            )}
          </nav>
        </div>
      </div>
    </AwPage>
  );
}

function StartSheet({
  fileName,
  isReading,
  ready,
  onPick,
  onDrop,
}: {
  fileName: string | null;
  isReading: boolean;
  ready: boolean;
  onPick: () => void;
  onDrop: (file: File | undefined) => void;
}) {
  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        onDrop(e.dataTransfer.files?.[0]);
      }}
    >
      <p className="font-bold tracking-[.16em] mb-[2em]">STUDY SESSION</p>
      <p className="mb-[1.2em]">
        Give Anchor a reading and it will explain it, then quiz you on it.
        Nothing here is shared with the others.
      </p>
      {fileName ? (
        <p className="mb-[1.2em]">
          Source: {fileName} {isReading ? "(reading…)" : ""}
        </p>
      ) : (
        <button
          onClick={onPick}
          className="aw-btn-reset block w-full my-[1.4em] border-[1.5px] border-dashed border-aw-ink/45 px-4 py-[1.6em] text-center leading-[1.8] hover:bg-aw-ink/[.06]"
        >
          Drop a PDF or Markdown file on this page
          <br />
          or click to choose one
        </button>
      )}
      {ready && (
        <p className="font-hand uppercase text-[1.35em] leading-tight -rotate-2 mt-[1.6em]">
          Ready. Press X to explain or Q to quiz yourself.
        </p>
      )}
    </div>
  );
}
