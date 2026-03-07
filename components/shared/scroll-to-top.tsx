"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className={cn(
        // Layout
        "group inline-flex items-center gap-2",
        // Typography
        "font-heading font-bold uppercase tracking-widest text-sm",
        // Colors
        "text-muted-foreground transition-colors duration-200",
        // Hover State
        "hover:text-foreground",
        // Fixed positioning
        "fixed bottom-8 right-8 z-50",
      )}
    >
      <ArrowUp className="w-4 h-4 " />
      {/* <span>Top</span> */}
    </button>
  );
}
