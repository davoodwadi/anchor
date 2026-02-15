"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
const baseStyle = `
      bg-foreground text-background 
      px-3 py-2 md:px-4 md:py-2
      font-bold uppercase tracking-widest 
      text-xs md:text-sm
      hover:bg-primary hover:text-primary-foreground 
      transition-colors
      truncate max-w-[100px] md:max-w-none
      flex items-center gap-2`;

export function ShareButton({ quizId }: { quizId: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Construct the URL dynamically based on current origin
    const link = `${window.location.origin}/take/${quizId}`;
    navigator.clipboard.writeText(link);

    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Button
      onClick={handleCopy}
      variant="outline"
      size="sm"
      className={
        copied
          ? cn(baseStyle, "text-green-600 border-green-200 bg-green-50")
          : baseStyle
      }
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          <div className="hidden md:block">Copied Link</div>
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4" />
          <div className="hidden md:block">Share Quiz</div>
        </>
      )}
    </Button>
  );
}
