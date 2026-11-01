"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Key } from "@/components/aw2/key";

/** Accepts a full share link (…/take/<id>) or the bare quiz id. */
export function parseQuizId(input: string): string | null {
  const value = input.trim();
  if (!value) return null;
  const match = value.match(/\/take\/([^/?#\s]+)/);
  if (match) return decodeURIComponent(match[1]);
  return /^[A-Za-z0-9_-]+$/.test(value) ? value : null;
}

export function QuizLinkForm({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const id = parseQuizId(value);
    if (!id) {
      setError(true);
      return;
    }
    router.push(`/take/${id}`);
  };

  return (
    <form
      onSubmit={submit}
      className="flex flex-col items-center gap-1.5 w-full sm:w-auto"
    >
      <div className="flex items-center gap-3 w-full">
        <input
          autoFocus
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setError(false);
          }}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          placeholder="Paste your quiz link"
          aria-label="Quiz link or code"
          aria-invalid={error}
          className="w-full sm:w-[340px] bg-transparent border-0 border-b border-aw-text-3 focus:border-aw-sage outline-none font-typed normal-case tracking-normal text-[17px] text-aw-text placeholder:text-[#5a5f5b] py-1.5"
        />
        <button
          type="submit"
          className="inline-flex items-center gap-2.5 text-aw-text font-medium shrink-0"
        >
          <Key>Enter</Key>Open
        </button>
      </div>
      {error && (
        <p
          role="alert"
          className="font-prose normal-case tracking-normal text-[14px] text-[#c27a76]"
        >
          That doesn&apos;t look like a quiz link.
        </p>
      )}
    </form>
  );
}
