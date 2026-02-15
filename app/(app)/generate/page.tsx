"use client";

import {
  generateQuizAction,
  ActionState,
  GeneratedContent,
} from "./generate-actions";
import { useActionState, useEffect, useState } from "react";
import { HistoryItem } from "./history-item";

import { MarkdownComponent } from "@/components/markdown/markdown-component";

import { Input } from "@/components/ui/input";
import { UploadBox } from "@/components/upload-box";
import { SubmitButton } from "@/components/submit-button";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/wake-variants";
const initialState: ActionState = {
  success: false,
};

export default function GeneratePage() {
  const [title, setTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState(3);
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    setFileName(selectedFile.name);

    const toBase64 = (file: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); // This creates the "data:...;base64,XXXX" string
        reader.onload = () => {
          const result = reader.result as string;
          // Split by the comma and take the second part (the raw base64)
          const base64 = result.split(",")[1];
          resolve(base64);
        };
        reader.onerror = (error) => reject(error);
      });

    try {
      const pureBase64 = await toBase64(selectedFile);
      setFileBase64(pureBase64); // Now state only contains "JVBERi..."
    } catch (err) {
      console.error("Error reading file:", err);
    }
  };

  // 2. THE HANDLER
  const handleGenerate = async (mode: "quiz" | "explanation") => {
    setIsLoading(true);
    let newHistory: GeneratedContent[] = history;

    if (history.length === 0) {
      // first request
      const userMessagePart: GeneratedContent = {
        type: "user",
        content:
          mode === "quiz"
            ? `Generate ${numQuestions} multiple choice questions based on the attached document.`
            : "Explain the attached document",
        id: "1",
      };
      if (fileBase64) {
        userMessagePart.file = fileBase64;
      }
      newHistory.push(userMessagePart);
      setHistory(newHistory);
    } else {
      if (mode === "quiz") {
        const userMessagePart: GeneratedContent = {
          type: "user",
          content: `Generate ${numQuestions} multiple choice questions.`,
          id: "1",
        };
        newHistory.push(userMessagePart);
        setHistory(newHistory);
      } else {
        const userMessagePart: GeneratedContent = {
          type: "user",
          content: `Explain more`,
          id: "1",
        };
        newHistory.push(userMessagePart);
        setHistory(newHistory);
      }
    }

    const result = await generateQuizAction({
      mode,
      history,
      numQuestions, // <--- Passed directly
      title,
      fileBase64,
    });

    if (result.success && result.data) {
      setHistory((prev) => [...prev, result.data!]);
    }

    setIsLoading(false);
  };

  //   console.log("history", history);

  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col gap-10 p-4 ">
      {/* 1. Initial Input Form (To start the conversation) */}
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id={"title"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className=" "
        />
      </div>

      <div>
        <Label htmlFor="amount">Number of Questions</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          min={1}
          max={20}
          defaultValue={3}
          className=""
        />
      </div>

      <div>
        <Label htmlFor="file">Source Material (PDF)</Label>
        <UploadBox fileName={fileName} onChange={handleFileChange} />
      </div>

      {/* 2. The History Loop */}
      <div className="">
        {history.map((item, index) => {
          if (item.type !== "user") {
            return <HistoryItem key={item.id} item={item} />;
          }
        })}
      </div>

      <div className="flex flex-row gap-2 my-4">
        <Button
          onClick={() => handleGenerate("explanation")}
          disabled={isLoading}
          className={buttonVariants({ variant: "large" })}
        >
          Explain
        </Button>

        <Button
          onClick={() => handleGenerate("quiz")}
          disabled={isLoading}
          className={buttonVariants({ variant: "large" })}
        >
          Quiz
        </Button>
      </div>
    </div>
  );
}
