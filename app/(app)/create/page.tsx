"use client";

import { useActionState, useState } from "react";
import { createQuizAction, ActionState } from "./create-quiz-action";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { FormField } from "@/components/form-field";
import { UploadBox } from "@/components/upload-box";
import { SubmitButton } from "@/components/submit-button";

const initialState: ActionState = {
  message: "",
  error: "",
  success: false,
  quizId: "",
};

export default function CreateQuizPage() {
  const [state, formAction] = useActionState(createQuizAction, initialState);

  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileName(file?.name ?? null);
  };

  return (
    <div className="flex flex-col items-center justify-center p-4 ">
      <Card className="w-full max-w-md border-2 border-border shadow-sm bg-zinc-950">
        <CardHeader className="pb-4 border-b border-border bg-muted/20">
          <CardTitle className="uppercase tracking-wide">Create Quiz</CardTitle>

          <CardDescription>
            Upload a PDF document. AI will generate questions for you.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-6">
          <form action={formAction} className="space-y-6">
            <FormField label="Quiz Title" htmlFor="title">
              <Input
                id="title"
                name="title"
                placeholder="e.g. Lecture 1"
                required
              />
            </FormField>

            <FormField
              label="Number of Questions"
              htmlFor="amount"
              hint="Min: 1 | Max: 20"
            >
              <Input
                id="amount"
                name="amount"
                type="number"
                min={1}
                max={20}
                defaultValue={10}
                required
              />
            </FormField>

            <FormField label="Source Material (PDF)" htmlFor="file">
              <UploadBox fileName={fileName} onChange={handleFileChange} />
            </FormField>

            {state.error && (
              <div className="p-4 text-sm font-bold text-destructive bg-destructive/10 border border-destructive">
                ERROR: {state.error}
              </div>
            )}

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
