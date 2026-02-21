"use client";

import { generateQuizAction } from "@/actions/generate-actions";
import { ActionState, GeneratedContent } from "@/types/QuizTypes";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { useActionState, useEffect, useState } from "react";
import { HistoryItem } from "./history-item";

import { MarkdownComponent } from "@/components/markdown/markdown-component";

import { Input } from "@/components/ui/input";
import { UploadBox } from "@/components/shared/upload-box";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/shared/wake-variants";
import { RitualLoading } from "./RitualLoading";
import { BackButton } from "@/components/shared/back-button";

const noRefDoc = "Do not mention the document. ";
// const noBullet = "Do not use bullet points in your response. ";
const addedConstraints = noRefDoc;

interface Props {
  user: User;
  sessionId: string;
  initialHistory: GeneratedContent[];
}
export default function GeneratePage({
  user,
  sessionId,
  initialHistory,
}: Props) {
  const [title, setTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState(3);
  const [fileName, setFileName] = useState<string | null>(null);
  // const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [history, setHistory] = useState<GeneratedContent[]>(initialHistory);

  const [extractedText, setExtractedText] = useState<string | null>(
    initialHistory.length > 0
      ? (initialHistory[0]?.extractedText ?? null)
      : null,
  );

  const [isPDFLoading, setIsPDFLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const disabled = history.length > 0;

  const lastModelResponse = history.at(-1);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    setFileName(selectedFile.name);
    setFile(selectedFile);
    const fullText = await extractTextClientSide(selectedFile);
  };

  const extractTextClientSide = async (fileToParse: File) => {
    if (!fileToParse) return;
    setIsPDFLoading(true);

    try {
      // Dynamic import to prevent SSR server crash
      const pdfjsLib = await import("pdfjs-dist");

      // Set worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjsLib.version}/build/pdf.worker.min.mjs`;

      // 4. Use the passed argument 'fileToParse', not the state 'file'
      const arrayBuffer = await fileToParse.arrayBuffer();

      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

      let fullText = "";
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          // @ts-ignore - 'str' exists on TextItem, typescript sometimes complains about TextMarkedContent
          .map((item) => item.str)
          .join(" ");
        fullText += pageText + "\n\n";
      }

      setExtractedText(fullText);
      return fullText;
    } catch (error) {
      console.error("Error parsing PDF:", error);
      alert("Failed to parse PDF.");
    } finally {
      setIsPDFLoading(false);
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
            ? `Generate ${numQuestions} multiple choice questions based on the following document.` +
              addedConstraints +
              "\n\n" +
              extractedText
            : "Explain the attached document. " +
              addedConstraints +
              "\n\n" +
              extractedText,
        extractedText: extractedText,
        id: "user-quiz1",
      };

      newHistory.push(userMessagePart);
      setHistory(newHistory);
    } else {
      if (mode === "quiz") {
        const userMessagePart: GeneratedContent = {
          type: "user",
          content: `Generate ${numQuestions} new multiple choice questions.`,
          id: "user-quiz2",
        };
        newHistory.push(userMessagePart);
        setHistory(newHistory);
      } else {
        let instruction = "";
        if (lastModelResponse?.type === "explanation") {
          instruction = `Explain the document in more detail. `;
        } else {
          instruction = `Explain the questions and why the correct choice is true. `;
        }
        const userMessagePart: GeneratedContent = {
          type: "user",
          content: instruction + addedConstraints,
          id: "exp1",
        };
        newHistory.push(userMessagePart);
        setHistory(newHistory);
      }
    }

    const result = await generateQuizAction({
      sessionId,
      mode,
      history,
      numQuestions, // <--- Passed directly
      title,
      sessionType: "generate",
    });

    if (result.success && result.data) {
      setHistory((prev) => [...prev, result.data!]);
      // console.log("result", result);
    }

    setIsLoading(false);
  };

  //   console.log("history", history);

  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col gap-10 p-4 ">
      <BackButton href="/dashboard" />
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
          value={numQuestions}
          onChange={(e) => setNumQuestions(Number(e.target.value))}
          className=""
        />
      </div>

      <div>
        <Label htmlFor="file">Source Material (PDF)</Label>
        <UploadBox
          fileName={fileName}
          extractedText={extractedText}
          disabled={disabled}
          onChange={handleFileChange}
        />
      </div>

      {/* 2. The History Loop */}
      <div className="">
        {history.map((item, index) => {
          if (item.type !== "user") {
            return <HistoryItem key={item.id} item={item} />;
          }
        })}
      </div>
      {!isLoading && (
        <div className="flex flex-col">
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
          <Button
            onClick={() => redirect("/generate")}
            disabled={isLoading}
            className={buttonVariants({ variant: "large", color: "secondary" })}
          >
            New Session
          </Button>
        </div>
      )}
      {isLoading && <RitualLoading />}

      {/* Invisible div to auto-scroll to bottom */}
      <div id="scroll-anchor" />
    </div>
  );
}
