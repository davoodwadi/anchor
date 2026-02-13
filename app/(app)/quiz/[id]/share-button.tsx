"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy, Share2 } from "lucide-react";
import { useState } from "react";

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
      className={copied ? "text-green-600 border-green-200 bg-green-50" : ""}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4 mr-2" />
          Copied Link
        </>
      ) : (
        <>
          <Share2 className="w-4 h-4 mr-2" />
          Share Quiz
        </>
      )}
    </Button>
  );
}
