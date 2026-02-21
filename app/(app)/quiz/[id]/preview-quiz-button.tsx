"use client";

import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import Link from "next/link";

const baseStyle = `
      bg-foreground text-background 
      px-4 py-3 md:px-4 md:py-2
      font-bold uppercase tracking-widest 
      text-sm
      hover:bg-primary hover:text-primary-foreground 
      transition-colors
      w-full md:w-auto justify-center
      flex items-center gap-2`;

export function PreviewQuizButton({ quizId }: { quizId: string }) {
  return (
    <Button asChild variant="outline" size="sm" className={baseStyle}>
      <Link href={`/quiz/${quizId}/preview`}>
        <Eye className="w-4 h-4" />
        <div>Preview Quiz</div>
      </Link>
    </Button>
  );
}
