"use client";

import { useEffect, useState, useRef } from "react";
import { cn, stripMarkdown } from "@/lib/utils";

type DynamicTypewriterStreamProps = {
  text: string;
  plain?: boolean;
  speed?: "xfast" | "fast" | "medium" | "slow" | "xslow";
  className?: string;
  completedLineClassName?: string;
  activeLineClassName?: string;
  cursorClassName?: string;
  lineClassName?: string;
  ariaLive?: "off" | "polite" | "assertive";
  blinkDelay?: number;
  keyPattern?: readonly number[];
  shouldStream?: boolean;
  onComplete?: () => void;
  isDeleting?: boolean;
  onDeleteComplete?: () => void;
};

const speedPresets = {
  xfast: {
    keyPattern: [1, 1, 1, 1, 1, 1, 1, 1],
    initialDelay: 1,
    spaceDelay: 3,
    sentencePause: 2,
    clausePause: 1,
    wordPause: 3,
    rhythmPause: 5,
    newlinePause: 4,
    deletePause: 15,
  },
  fast: {
    keyPattern: [17, 15, 16, 15, 19, 15, 17, 16],
    initialDelay: 130,
    spaceDelay: 38,
    sentencePause: 220,
    clausePause: 130,
    wordPause: 35,
    rhythmPause: 85,
    newlinePause: 400,
    deletePause: 15,
  },
  medium: {
    keyPattern: [30, 27, 31, 28, 34, 27, 30, 29],
    initialDelay: 170,
    spaceDelay: 52,
    sentencePause: 300,
    clausePause: 170,
    wordPause: 50,
    rhythmPause: 110,
    newlinePause: 600,
    deletePause: 25,
  },
  slow: {
    keyPattern: [86, 82, 88, 84, 93, 82, 87, 85],
    initialDelay: 230,
    spaceDelay: 128,
    sentencePause: 420,
    clausePause: 280,
    wordPause: 100,
    rhythmPause: 150,
    newlinePause: 800,
    deletePause: 50,
  },
  xslow: {
    keyPattern: [106, 102, 108, 104, 113, 102, 107, 105],
    initialDelay: 230,
    spaceDelay: 158,
    sentencePause: 520,
    clausePause: 380,
    wordPause: 190,
    rhythmPause: 190,
    newlinePause: 1000,
    deletePause: 70,
  },
} as const;

function getTypingDelay(
  line: string,
  index: number,
  speedPreset: (typeof speedPresets)[keyof typeof speedPresets],
  keyPattern: readonly number[],
) {
  const character = line[index];
  const nextCharacter = line[index + 1];
  const baseDelay = keyPattern[index % keyPattern.length];

  if (index === 0) {
    return baseDelay + speedPreset.initialDelay;
  }

  if (character === " ") {
    return speedPreset.spaceDelay;
  }

  if (character && ".!?".includes(character)) {
    return baseDelay + speedPreset.sentencePause;
  }

  if (character && ",:;".includes(character)) {
    return baseDelay + speedPreset.clausePause;
  }

  if (character === "\n") {
    return baseDelay + speedPreset.newlinePause;
  }

  if (nextCharacter === " ") {
    return baseDelay + speedPreset.wordPause;
  }

  if (index % 12 === 0) {
    return baseDelay + speedPreset.rhythmPause;
  }

  return baseDelay;
}

export function DynamicTypewriterStream({
  text,
  plain = false,
  speed = "slow",
  className,
  completedLineClassName,
  activeLineClassName,
  cursorClassName,
  lineClassName,
  ariaLive = "polite",
  blinkDelay = 530,
  keyPattern,
  shouldStream = true,
  onComplete,
  isDeleting = false,
  onDeleteComplete,
}: DynamicTypewriterStreamProps) {
  const speedPreset = speedPresets[speed];
  const typingPattern = keyPattern ?? speedPreset.keyPattern;
  const displayText = plain ? stripMarkdown(text) : text;
  const streamEnabled = shouldStream;

  const [visibleTextLength, setVisibleTextLength] = useState(
    streamEnabled ? 0 : displayText.length,
  );
  const [cursorVisible, setCursorVisible] = useState(true);
  const [hasCompletedTyping, setHasCompletedTyping] = useState(
    !streamEnabled && displayText.length > 0,
  );

  const textRef = useRef(displayText);
  useEffect(() => {
    textRef.current = displayText;
    if (!streamEnabled) {
      setVisibleTextLength(displayText.length);
      setHasCompletedTyping(displayText.length > 0);
      return;
    }

    setVisibleTextLength((currentLength) =>
      Math.min(currentLength, displayText.length),
    );
    setHasCompletedTyping(false);
  }, [displayText, streamEnabled]);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  const onDeleteCompleteRef = useRef(onDeleteComplete);
  useEffect(() => {
    onDeleteCompleteRef.current = onDeleteComplete;
  }, [onDeleteComplete]);

  // We use this dummy state to kickstart the typing loop when new text arrives
  const [kickstart, setKickstart] = useState(0);
  // Tracks whether the typing loop is stalled (caught up to the stream end).
  // Only true when visibleTextLength === text.length — not during mid-typing pauses.
  const isStalledRef = useRef(false);

  // Wake up the typing loop when new text arrives, but ONLY if we're stalled.
  // If we're mid-typing (e.g. inside a newlinePause), we must NOT cancel that
  // pending timeout — doing so would reset the pause on every incoming chunk.
  useEffect(() => {
    if (!streamEnabled) {
      return;
    }

    if (isStalledRef.current) {
      setKickstart((k) => k + 1);
    }
  }, [displayText, streamEnabled]);

  // Blink cursor
  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCursorVisible((currentVisibility) => !currentVisibility);
    }, blinkDelay);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [blinkDelay]);

  // Typing effect loop
  useEffect(() => {
    if (!streamEnabled) {
      isStalledRef.current = true;
      return;
    }

    if (isDeleting) {
      const deletePause = speedPresets[speed].deletePause;
      if (visibleTextLength > 0) {
        const timeoutId = window.setTimeout(() => {
          setVisibleTextLength((prev) => Math.max(0, prev - 1));
        }, deletePause);
        return () => window.clearTimeout(timeoutId);
      } else {
        if (!hasCompletedTyping) {
          setHasCompletedTyping(true);
        }
        onDeleteCompleteRef.current?.();
      }
      return;
    }

    // If we've typed everything currently available, we wait for text updates
    if (visibleTextLength >= textRef.current.length) {
      isStalledRef.current = true;
      if (
        !hasCompletedTyping &&
        visibleTextLength > 0 &&
        onCompleteRef.current
      ) {
        const t = setTimeout(() => {
          // Double check if text grew while we were waiting to complete
          if (visibleTextLength >= textRef.current.length) {
            setHasCompletedTyping(true);
            onCompleteRef.current?.();
          }
        }, 500);
        return () => clearTimeout(t);
      }
      return;
    }

    isStalledRef.current = false;
    const nextLength = visibleTextLength + 1;
    const relevantContextStart = Math.max(0, nextLength - 50);
    const relevantContext = textRef.current.slice(
      relevantContextStart,
      nextLength + 1,
    );
    const indexInContext = nextLength - 1 - relevantContextStart;

    const delay = getTypingDelay(
      relevantContext,
      indexInContext,
      speedPreset,
      typingPattern,
    );

    const timeoutId = window.setTimeout(() => {
      setVisibleTextLength(nextLength);
    }, delay);

    return () => {
      window.clearTimeout(timeoutId);
    };
    // Note: `text` is intentionally NOT in this dependency array.
    // This loop is purely driven by `visibleTextLength` updating itself,
    // or by the `kickstart` state updating when new text arrives while stalled.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    hasCompletedTyping,
    kickstart,
    speedPreset,
    streamEnabled,
    typingPattern,
    visibleTextLength,
    isDeleting,
  ]);

  if (!displayText) {
    return null;
  }

  // Split visible text by newline
  const visibleText = displayText.slice(0, visibleTextLength);
  const visibleLines = visibleText.split("\n");
  const showCursor = streamEnabled && !hasCompletedTyping;

  return (
    <div aria-live={ariaLive} className={cn("space-y-1", className)}>
      {visibleLines.map((visibleLine, index) => {
        const isCurrentLine = index === visibleLines.length - 1;
        const isCompletedLine = index < visibleLines.length - 1;

        return (
          <p
            key={`line-${index}`}
            className={cn(
              "min-h-8 md:min-h-10 break-all whitespace-pre-wrap",
              lineClassName,
              isCompletedLine && completedLineClassName,
              isCurrentLine && activeLineClassName,
            )}
          >
            <span>{visibleLine}</span>
            {isCurrentLine && showCursor && (
              <span
                aria-hidden="true"
                className={cn(
                  "ml-[2px] inline-block h-[1.05em] w-[1px] align-[-0.12em] transition-opacity duration-75",
                  cursorVisible ? "opacity-100" : "opacity-0",
                  cursorClassName,
                )}
              ></span>
            )}
          </p>
        );
      })}
    </div>
  );
}
