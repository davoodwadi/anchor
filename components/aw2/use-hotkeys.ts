"use client";

import { useEffect, useRef } from "react";

type Handlers = Record<string, (e: KeyboardEvent) => void>;

/**
 * Single-key shortcuts that mirror the on-screen key chips.
 * Keys are matched lowercase against `event.key` ("1", "q", "enter", "arrowleft").
 * Ignored while typing in a field or when a modifier is held.
 */
export function useHotkeys(handlers: Handlers, enabled = true) {
  const ref = useRef(handlers);
  useEffect(() => {
    ref.current = handlers;
  });

  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && /^(input|textarea|select)$/i.test(target.tagName)) return;
      if (target?.isContentEditable) return;
      const fn = ref.current[e.key.toLowerCase()];
      if (fn) {
        fn(e);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [enabled]);
}
