"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { generateQuizAction } from "@/actions/generate-actions";
import { ActionState, GeneratedContent } from "@/types/QuizTypes";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shared/card-wake";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/shared/wake-variants";
import { UploadBox } from "@/components/shared/upload-box";
import ProgressBar from "@/components/shared/ProgressBar";
import { BackButton } from "@/components/shared/back-button";
import { TypewriterStream } from "@/components/shared/typewriter-stream";

const noRefDoc = "Do not mention the document. ";
// const noBullet = "Do not use bullet points in your response. ";
const addedConstraints = noRefDoc;
const loadingLines = [
  "Generating Quiz",
  "Scanning source material for the ideas that matter.",
  "Extracting semantic signals and stabilizing the structure.",
  "Assembling a quiz from the strongest patterns in your notes.",
  "PLEASE WAIT - SYSTEM IS OPERATING AT CAPACITY",
];

export default function CreateQuizPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [numQuestions, setNumQuestions] = useState(3);
  const [fileName, setFileName] = useState<string | null>(null);
  // const [fileBase64, setFileBase64] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  // const [history, setHistory] = useState<GeneratedContent[]>(initialHistory);
  const [extractedText, setExtractedText] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isPDFLoading, setIsPDFLoading] = useState(false);
  // console.log("extractedText", extractedText);
  // console.log("numQuestions", numQuestions);

  const handleGenerate = async (mode: "quiz" | "explanation") => {
    setIsLoading(true);
    const history: GeneratedContent[] = [];

    // console.log("extractedText", extractedText);
    // console.log("extractedText", typeof extractedText);
    // first request
    const userMessagePart: GeneratedContent = {
      type: "user",
      content:
        `Generate ${numQuestions} multiple choice questions based on the following document. ` +
        addedConstraints +
        "\n\n" +
        extractedText,
      id: "1",
    };
    // if (fileBase64) {
    //   userMessagePart.file = fileBase64;
    // }
    history.push(userMessagePart);

    const result = await generateQuizAction({
      sessionId: "",
      mode,
      history,
      numQuestions, // <--- Passed directly
      title,
      sessionType: "createQuiz",
    });

    if (result.success && result.data) {
      // console.log("result.success", result.data);
      // Navigate to dashboard
      router.push(`/quiz/${result.data.id}`);
    }

    setIsLoading(false);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    if (!selectedFile) return;

    await processSelectedFile(selectedFile);
  };

  const processSelectedFile = async (selectedFile: File) => {
    if (!selectedFile) return;

    setFileName(selectedFile.name);
    setFile(selectedFile);
    setExtractedText(null);

    const isPdf =
      selectedFile.type === "application/pdf" ||
      selectedFile.name.toLowerCase().endsWith(".pdf");
    const isMarkdown =
      selectedFile.type === "text/markdown" ||
      selectedFile.name.toLowerCase().endsWith(".md") ||
      selectedFile.name.toLowerCase().endsWith(".markdown");

    if (isMarkdown) {
      const rawMarkdown = await selectedFile.text();
      setExtractedText(rawMarkdown);
      return;
    }

    if (isPdf) {
      await extractTextClientSide(selectedFile);
      return;
    }

    alert("Unsupported file type. Please upload a PDF or Markdown file.");
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
  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col gap-10 p-4 ">
      <BackButton href="/dashboard" />

      <div className="relative overflow-hidden bg-black/40 backdrop-blur-md border border-white/10 p-8 rounded-none">
        {/* Subtle glowing red accent to fit the Wake theme */}
        <div className="absolute top-0 left-0 w-full h-[2px] opacity-50"></div>

        <div className="text-center text-2xl font-black uppercase tracking-widest text-white mb-2">
          Create Quiz
        </div>

        <div className="text-center text-sm font-medium tracking-wide text-zinc-400">
          Upload a PDF or Markdown document. AI will generate questions for you.
        </div>
      </div>
      <div>
        <Label htmlFor="title">Title</Label>

        <Input
          id={"title"}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className=" "
        />

        <div>
          <Label htmlFor="amount">Number of Questions</Label>
          <Input
            id="amount"
            name="amount"
            type="number"
            min={1}
            max={20}
            value={numQuestions} // Link to state
            onChange={(e) => {
              const parsedValue = parseInt(e.target.value, 10);
              setNumQuestions(Number.isNaN(parsedValue) ? 1 : parsedValue);
            }} // Update state
            className=""
          />
        </div>

        <div>
          <Label htmlFor="file">Source Material (PDF or Markdown)</Label>
          <UploadBox
            fileName={fileName}
            extractedText={extractedText}
            onChange={handleFileChange}
            onFileSelect={processSelectedFile}
          />
        </div>
        <div className="py-2">
          <Button
            onClick={() => handleGenerate("quiz")}
            disabled={isLoading}
            className={buttonVariants({ variant: "large" })}
          >
            Quiz
          </Button>
          {isLoading && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-md z-[100] flex items-center justify-center p-4">
              {/* Main Container: Hard black border, No rounding, Sharp Shadow */}
              <div className="bg-neon-red-600 border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full flex flex-col items-center text-center">
                <div className="w-full space-y-4 text-left">
                  <div className="border-[3px] border-black bg-black px-4 py-4 min-h-[50vh] flex flex-col">
                    <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-500">
                      Live Process
                    </p>
                    <TypewriterStream
                      lines={loadingLines}
                      speed="xslow"
                      className="mt-4 flex-1 font-mono text-sm leading-7 tracking-[0.04em] text-white md:text-base"
                      completedLineClassName="text-zinc-400"
                      activeLineClassName="text-white"
                      cursorClassName="bg-neon-red-500"
                      minLines={loadingLines.length}
                    />
                  </div>
                </div>

                {/* Decorative Brutalist Element */}
                <ProgressBar className="bg-black mt-8" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
