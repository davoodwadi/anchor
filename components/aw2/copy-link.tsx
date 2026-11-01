"use client";

import { useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";
import { Key } from "./key";

const noSubscribe = () => () => {};

/** The public /take link for a quiz. Empty during SSR, filled on the client. */
export function useShareLink(quizId: string) {
  const origin = useSyncExternalStore(
    noSubscribe,
    () => window.location.origin,
    () => "",
  );
  return origin ? `${origin}/take/${quizId}` : "";
}

/** Typed link box with a Copy button. Pages can bind key C to `[data-copy-link]`. */
export function CopyLinkBox({
  link,
  className,
}: {
  link: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    if (!link) return;
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 bg-[rgba(10,11,11,.8)] border border-aw-line px-3 py-2.5 font-typed text-[15px] text-aw-text",
        className,
      )}
    >
      <span className="truncate">{link || " "}</span>
      <button
        onClick={copy}
        data-copy-link
        className="aw-btn-reset ml-auto inline-flex items-center gap-2 font-ui font-medium text-[14px] uppercase tracking-[.1em] text-aw-text-2 hover:text-aw-text whitespace-nowrap"
      >
        <Key>C</Key>
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
