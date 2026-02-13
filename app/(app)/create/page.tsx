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
import { Loader2, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";
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
  const router = useRouter();

  // 2. Use the hook to handle form submission
  const [state, formAction] = useActionState(createQuizAction, initialState);
  console.log("state", state);
  // 3. Watch for success to redirect
  useEffect(() => {
    if (state.success && state.quizId) {
      router.push("/dashboard");
    }
  }, [state.success, state.quizId, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Create New Quiz</CardTitle>
          <CardDescription>
            Upload a PDF document. AI will generate questions for you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* 4. Pass the 'formAction' to the form action prop */}
          <form action={formAction} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Intro to Biology - Chapter 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Source Material (PDF)</Label>
              <div className="flex items-center justify-center w-full">
                <label
                  htmlFor="file"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      <span className="font-semibold">Click to upload</span> or
                      drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PDF (MAX. 10MB)
                    </p>
                  </div>
                  <input
                    id="file"
                    name="file"
                    type="file"
                    accept=".pdf"
                    // className="hidden"
                    // required
                  />
                </label>
              </div>
            </div>

            {state.error && (
              <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
                {state.error}
              </div>
            )}

            <SubmitButton />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
