"use client";

import { createQuizAction, ActionState } from "./create-quiz-action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, UploadCloud, CheckCircle2 } from "lucide-react";
// import { useRouter } from "next/navigation";
import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

// 1. Create a "Smart" Submit Button that knows its own loading state
function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          Generating Questions...
        </>
      ) : (
        "Generate Quiz"
      )}
    </Button>
  );
}

const initialState: ActionState = {
  message: "",
  error: "",
  success: false,
  quizId: "",
};

export default function CreateQuizPage() {
  // 2. Use the hook to handle form submission
  const [state, formAction] = useActionState(createQuizAction, initialState);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md border-2 border-border shadow-sm">
        <CardHeader className="pb-4 border-b border-border bg-muted/20">
          <CardTitle className="uppercase tracking-wide">Create Quiz</CardTitle>
          <CardDescription>
            Upload a PDF document. AI will generate questions for you.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form action={formAction} className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="uppercase text-xs font-bold tracking-widest text-foreground"
              >
                Quiz Title
              </Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Lecture 1"
                className="font-heading font-bold"
                required
              />
            </div>

            {/* Question Count Input */}
            <div className="space-y-2">
              <Label
                htmlFor="amount"
                className="uppercase text-xs font-bold tracking-widest text-foreground"
              >
                Number of Questions
              </Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                min={1}
                max={20}
                defaultValue={10}
                className="font-mono"
                required
              />
              <p className="text-[10px] text-muted-foreground uppercase">
                Min: 1 | Max: 20
              </p>
            </div>

            {/* Elegant File Upload */}
            <div className="space-y-2">
              <Label
                htmlFor="file"
                className="uppercase text-xs font-bold tracking-widest text-foreground"
              >
                Source Material (PDF)
              </Label>

              <div className="relative group">
                <input
                  id="file"
                  name="file"
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="hidden" // Completely hide the ugly default input
                  required
                />

                <label
                  htmlFor="file"
                  className={`
                    flex flex-col items-center justify-center w-full h-32 
                    border-2 rounded-lg cursor-pointer transition-all duration-300
                    ${
                      fileName
                        ? "border-secondary bg-secondary/5 border-solid"
                        : "border-dashed border-border hover:border-foreground hover:bg-muted/50"
                    }
                  `}
                >
                  {fileName ? (
                    // SELECTED STATE
                    <div className="flex flex-col items-center animate-in fade-in zoom-in-95 duration-300">
                      <div className="p-3 bg-background border-2 border-secondary rounded-full mb-2">
                        <CheckCircle2 className="w-6 h-6 text-secondary" />
                      </div>
                      <p className="text-sm font-bold text-foreground text-center px-4 truncate max-w-[250px]">
                        {fileName}
                      </p>
                      <p className="text-xs text-primary uppercase font-bold mt-1 tracking-widest">
                        Click to Replace
                      </p>
                    </div>
                  ) : (
                    // EMPTY STATE
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-foreground group-hover:text-foreground transition-colors">
                      <UploadCloud className="w-10 h-10 mb-3" />
                      <p className="text-sm uppercase font-bold tracking-wide">
                        Click to upload PDF
                      </p>
                      {/* <p className="text-xs opacity-70 mt-1">(MAX. 10MB)</p> */}
                    </div>
                  )}
                </label>
              </div>
            </div>

            {state.error && (
              <div className="p-4 text-sm font-bold text-destructive bg-destructive/10 border border-destructive rounded-none">
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
