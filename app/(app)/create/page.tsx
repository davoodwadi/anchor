"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  generateQuizAction,
  ActionState,
  GeneratedContent,
} from "@/actions/generate-actions";

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
const noRefDoc = "Do not mention the document. ";
// const noBullet = "Do not use bullet points in your response. ";
const addedConstraints = noRefDoc;

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

    setFileName(selectedFile.name);
    setFile(selectedFile);
    // console.log("selectedFile", selectedFile);
    // console.log("extractTextClientSide");
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

  return (
    <div className="min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center p-4 ">
      <Card>
        <CardHeader>
          <CardTitle>Create Quiz</CardTitle>

          <CardDescription>
            Upload a PDF document. AI will generate questions for you.
          </CardDescription>
        </CardHeader>

        <CardContent>
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
              onChange={(e) => setNumQuestions(parseInt(e.target.value))} // Update state
              className=""
            />
          </div>

          <div>
            <Label htmlFor="file">Source Material (PDF)</Label>
            <UploadBox
              fileName={fileName}
              extractedText={extractedText}
              onChange={handleFileChange}
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
                <div className="bg-primary border-[4px] border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 max-w-md w-full flex flex-col items-center text-center">
                  {/* Brutalist Loader: Square, Thick Border, Fast Spin */}
                  <div className="h-16 w-16  border-black border-t-white bg-black mb-8 animate-flicker" />

                  {/* Typography: Bold, Uppercase, High Contrast */}
                  <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-4 border-b-[4px] border-black pb-2 w-full">
                    GENERATING QUIZ
                  </h2>

                  <div className="space-y-4 text-left font-bold uppercase text-sm tracking-tight">
                    <p className="bg-white text-black p-2 inline-block">
                      STEP 01: SCANNING SOURCE MATERIAL...
                    </p>
                    <p
                      className={`${extractedText ? "bg-white text-black" : "text-black"} p-2 block`}
                    >
                      STEP 02: EXTRACTING SEMANTIC DATA...
                    </p>
                    <p className="bg-black border-border p-2 block italic">
                      PLEASE WAIT — SYSTEM IS OPERATING AT CAPACITY
                    </p>
                  </div>

                  {/* Decorative Brutalist Element */}
                  <ProgressBar className="bg-black mt-8" />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
