"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const ICON_SIZE = 18;

const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        type="button"
        className="inline-flex items-center justify-center h-10 w-10 border-2 border-border bg-background rounded-none"
        aria-hidden
        disabled
      >
        <Sun size={ICON_SIZE} className="text-muted-foreground" />
      </button>
    );
  }

  const isDark = resolvedTheme === "dark";

  const toggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className={cn(
        "inline-flex items-center justify-center h-10 w-10 rounded-none",
        "border-0 border-border ",
        "uppercase tracking-wider font-bold",
        "text-muted-foreground hover:text-foreground hover:bg-muted",
        "transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0",
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Light mode" : "Dark mode"}
    >
      {isDark ? (
        <Sun size={ICON_SIZE} className="shrink-0" />
      ) : (
        <Moon size={ICON_SIZE} className="shrink-0" />
      )}
    </button>
  );
};

export { ThemeSwitcher };
