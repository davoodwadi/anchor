"use client";

import { Eye } from "lucide-react";
import Link from "next/link";
import { WakeButton } from "@/components/shared/wake-button";

export function PreviewQuizButton({ quizId }: { quizId: string }) {
  return (
    <WakeButton
      href={`/quiz/${quizId}/preview`}
      variant="secondary"
      className="w-full flex justify-center py-5"
    >
      <span className="flex items-center gap-2">
        <Eye className="w-4 h-4" />
        Preview
      </span>
    </WakeButton>
  );
}
