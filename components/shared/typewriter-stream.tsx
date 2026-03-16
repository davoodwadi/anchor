"use client";

import { useEffect, useMemo, useState } from "react";

import { cn } from "@/lib/utils";

type TypewriterStreamProps = {
  lines: string[];
  speed?: "fast" | "medium" | "slow" | "xslow";
  className?: string;
  completedLineClassName?: string;
  activeLineClassName?: string;
  cursorClassName?: string;
  lineClassName?: string;
  minLines?: number;
  ariaLive?: "off" | "polite" | "assertive";
  loop?: boolean;
  lineHoldDelay?: number;
  carriageDelay?: number;
  pageResetDelay?: number;
  blinkDelay?: number;
  keyPattern?: readonly number[];
};

const speedPresets = {
  fast: {
    keyPattern: [17, 15, 16, 15, 19, 15, 17, 16],
    initialDelay: 130,
    spaceDelay: 38,
    sentencePause: 220,
    clausePause: 130,
    wordPause: 35,
    rhythmPause: 85,
  },
  medium: {
    keyPattern: [30, 27, 31, 28, 34, 27, 30, 29],
    initialDelay: 170,
    spaceDelay: 52,
    sentencePause: 300,
    clausePause: 170,
    wordPause: 50,
    rhythmPause: 110,
  },
  slow: {
    keyPattern: [86, 82, 88, 84, 93, 82, 87, 85],
    initialDelay: 230,
    spaceDelay: 128,
    sentencePause: 420,
    clausePause: 280,
    wordPause: 100,
    rhythmPause: 150,
  },
  xslow: {
    keyPattern: [106, 102, 108, 104, 113, 102, 107, 105],
    initialDelay: 830,
    spaceDelay: 158,
    sentencePause: 520,
    clausePause: 380,
    wordPause: 190,
    rhythmPause: 190,
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

  if (".!?".includes(character)) {
    return baseDelay + speedPreset.sentencePause;
  }

  if (",:;".includes(character)) {
    return baseDelay + speedPreset.clausePause;
  }

  if (nextCharacter === " ") {
    return baseDelay + speedPreset.wordPause;
  }

  if (index % 12 === 0) {
    return baseDelay + speedPreset.rhythmPause;
  }

  return baseDelay;
}

export function TypewriterStream({
  lines,
  speed = "fast",
  className,
  completedLineClassName,
  activeLineClassName,
  cursorClassName,
  lineClassName,
  minLines,
  ariaLive = "polite",
  loop = true,
  lineHoldDelay = 50,
  carriageDelay = 260,
  pageResetDelay = 1800,
  blinkDelay = 530,
  keyPattern,
}: TypewriterStreamProps) {
  const normalizedLines = useMemo(
    () => lines.filter((line) => line.trim().length > 0),
    [lines],
  );
  const speedPreset = speedPresets[speed];
  const typingPattern = keyPattern ?? speedPreset.keyPattern;
  const rowsToRender = Math.max(minLines ?? normalizedLines.length, 1);
  const [sampleIndex, setSampleIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [visibleText, setVisibleText] = useState("");
  const [cursorVisible, setCursorVisible] = useState(true);
  const [phase, setPhase] = useState<
    "typing" | "holding" | "carriage" | "resetting" | "done"
  >("typing");

  const currentLine = normalizedLines[sampleIndex] ?? "";

  useEffect(() => {
    setSampleIndex(0);
    setCompletedLines([]);
    setVisibleText("");
    setPhase("typing");
  }, [normalizedLines]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCursorVisible((currentVisibility) => !currentVisibility);
    }, blinkDelay);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [blinkDelay]);

  useEffect(() => {
    if (normalizedLines.length === 0) {
      return;
    }

    let timeoutId: number;

    if (phase === "typing") {
      if (visibleText.length < currentLine.length) {
        const nextLength = visibleText.length + 1;

        timeoutId = window.setTimeout(
          () => {
            setVisibleText(currentLine.slice(0, nextLength));
          },
          getTypingDelay(
            currentLine,
            nextLength - 1,
            speedPreset,
            typingPattern,
          ),
        );
      } else {
        timeoutId = window.setTimeout(() => {
          setPhase("holding");
        }, lineHoldDelay);
      }
    }

    if (phase === "holding") {
      timeoutId = window.setTimeout(() => {
        setCompletedLines((currentLines) => [...currentLines, currentLine]);
        setVisibleText("");

        if (sampleIndex === normalizedLines.length - 1) {
          setPhase(loop ? "resetting" : "done");
          return;
        }

        setSampleIndex((currentIndex) => currentIndex + 1);
        setPhase("carriage");
      }, lineHoldDelay);
    }

    if (phase === "carriage") {
      timeoutId = window.setTimeout(() => {
        setPhase("typing");
      }, carriageDelay);
    }

    if (phase === "resetting") {
      timeoutId = window.setTimeout(() => {
        setCompletedLines([]);
        setSampleIndex(0);
        setVisibleText("");
        setPhase("typing");
      }, pageResetDelay);
    }

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [
    carriageDelay,
    currentLine,
    lineHoldDelay,
    loop,
    normalizedLines,
    pageResetDelay,
    phase,
    sampleIndex,
    speedPreset,
    typingPattern,
    visibleText,
  ]);

  if (normalizedLines.length === 0) {
    return null;
  }

  return (
    <div aria-live={ariaLive} className={cn("space-y-1", className)}>
      {Array.from({ length: rowsToRender }).map((_, index) => {
        const completedLine = completedLines[index];
        const isActiveRow = index === completedLines.length;

        if (completedLine) {
          return (
            <p
              key={`completed-${index}`}
              className={cn(lineClassName, completedLineClassName)}
            >
              {completedLine}
            </p>
          );
        }

        if (isActiveRow) {
          return (
            <p
              key="active-line"
              className={cn(
                "min-h-8 md:min-h-10",
                lineClassName,
                activeLineClassName,
              )}
            >
              <span>{visibleText}</span>
              <span
                aria-hidden="true"
                className={cn(
                  "ml-[2px] inline-block h-[1.05em] w-[1px] align-[-0.12em] transition-opacity duration-75",
                  cursorVisible ? "opacity-100" : "opacity-0",
                  cursorClassName,
                )}
              ></span>
            </p>
          );
        }

        return (
          <p
            key={`placeholder-${index}`}
            aria-hidden="true"
            className={cn("min-h-8 md:min-h-10", lineClassName, "opacity-0")}
          >
            .
          </p>
        );
      })}
    </div>
  );
}
