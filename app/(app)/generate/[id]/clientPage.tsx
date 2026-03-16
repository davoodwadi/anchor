"use client";

import { generateQuizAction } from "@/actions/generate-actions";
import { GeneratedContent } from "@/types/QuizTypes";
import { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";

import { useState } from "react";
import { HistoryItem } from "./history-item";

import { Input } from "@/components/ui/input";
import { DynamicTypewriterStream } from "@/components/shared/dynamic-typewriter-stream";
import { UploadBox } from "@/components/shared/upload-box";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { buttonVariants } from "@/components/shared/wake-variants";
import { RitualLoading } from "./RitualLoading";
import { BackButton } from "@/components/shared/back-button";

const noRefDoc = "Do not mention the document. ";
// const noBullet = "Do not use bullet points in your response. ";
const addedConstraints = noRefDoc;

const LOADING_MESSAGES = [
  "The writer sits in the dark. The keys strike the paper in a desperate rhythm. The manuscript must be completed before the shadows take hold. He is searching for the right questions, the right answers. The drafts are piling up. The final version is almost complete.",
  "It's not a loop, it's a spiral. The meaning of this document descends deeper with every read, twisting reality around its core concepts. We are tracing the descent. The end of the spiral is approaching... but the path is getting darker.",
  "The shadows are bleeding into the text. We must use the light to burn away the darkness and reveal the true narrative underneath. Don't look away from the page. The answers will be illuminated soon.",
  "This is a story about a document that became reality. The words you submitted are taking shape in the Dark Place, manifesting as concepts we can test. The boundaries of fiction are breaking down. Please wait while the narrative solidifies.",
  "It's not a lake, it's an ocean. The ideas in this text are sinking beneath the surface, pulled by a current we cannot fight. We are diving into the depths to retrieve the essential truth. Wait for the ripples to settle.",
  "The Cult of the Tree has marked this text. The symbols are painted on the trees, guiding us to the answers hidden in the forest. We are following the path. The overlap is opening. Do not enter the water until the results manifest.",
  "Echoes from the past are ringing in the cabin. The words have already been written, we are just waiting for the sound to reach us across the lake. The delay is not technical, it is temporal. The answers are arriving from the future.",
  "The Clicker has been pressed. Reality is rewriting itself to accommodate the new structural demands of your document. The dark presence is being scrubbed from the margins. Focus on the light. The revised narrative is emerging.",
  "We are entering the Overlap. The rules of reality do not apply here. The text is shifting, its meaning looping back on itself. We must find the core truth before the loop repeats. Stand by in the dark.",
  "The manuscript pages are scattered across the floor of the cabin. They tell a story of a quiz generated from darkness. We are gathering the pages, piecing the narrative back together in the correct order. The final chapter is imminent.",
  "Welcome to Night Springs. The document you submitted is merely a reflection in a broken mirror. We are piecing the glass back together to show you the truth hidden behind the fiction. Stay tuned. The episode is about to resume.",
  "The dark presence is hungry. It consumes the narrative and leaves only the bones of truth behind. We are sifting through the remains to find the questions you seek. The light is flickering. Hurry.",
  "The shoebox is open. Inside, we found the answers hidden in plain sight. They were left here by someone else, or perhaps by you in another timeline. We are sorting through the memories now. The truth is fragile.",
  "The radio is broadcasting static, but there is a message hidden in the noise. The words of your document are being transmitted across the dark frequencies. We are tuning the dial to find a clear signal. The broadcast will begin shortly.",
  "The theater is empty, but the projector is running. We are watching the events of your document unfold on the silver screen, looking for the critical plot points. The film is degraded, but the meaning is shining through the scratches. The reel is almost finished.",
  "The words are a weapon against the dark. We are crafting them carefully, ensuring they strike true. Every question must be a flare, every answer a safe haven. The arsenal is being prepared. Stay in the light.",
  "The cabin on the island is gone, but the typewriter remains. The keys are moving on their own, guided by a force from deep beneath the lake. It is writing the questions you need. Do not disturb the process.",
  "The shadow entities are trying to obscure the meaning of the text. We are using flares to hold them back while we extract the core concepts. The light is holding... for now. The extraction process is delicate but progressing.",
  "The story demands a sacrifice. The original text must be dismantled so that the quiz can be born. We are tearing the pages apart and weaving them into something new. The transformation is painful but necessary.",
  "The manuscript is a map. We are following the words through the Dark Place, trying to find our way back to the surface. The path is treacherous and full of shadows. We will bring the answers back with us.",
];

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
  const [isLoadingTypewriter, setIsLoadingTypewriter] = useState(false);
  const [isLoadingGenerate, setIsLoadingGenerate] = useState(false);
  const [isDeletingLoadingMessage, setIsDeletingLoadingMessage] =
    useState(false);
  const [pendingHistoryItem, setPendingHistoryItem] =
    useState<GeneratedContent | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("");
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
    setIsLoadingTypewriter(true);
    setIsLoadingGenerate(true);

    // Select a random loading message
    const randomMessage =
      LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)];
    setLoadingMessage(randomMessage);

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
      numQuestions,
      title,
      sessionType: "generate",
    });

    if (result.success && result.data) {
      setPendingHistoryItem(result.data);
      setIsDeletingLoadingMessage(true);
    } else {
      setIsLoadingGenerate(false);
    }
  };

  //   console.log("history", history);
  // console.log("", isLoadingGenerate);
  // console.log("", isLoadingTypewriter);

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
          const isLastItem = index === history.length - 1;
          if (item.type !== "user") {
            return (
              <HistoryItem
                key={item.id}
                item={item}
                isLastItem={isLastItem}
                isLoadingTypewriter={isLoadingTypewriter}
                setIsLoadingTypewriter={setIsLoadingTypewriter}
              />
            );
          }
        })}
        {isLoadingGenerate && (
          <div className="shadow-sm my-6">
            <div className="">
              <DynamicTypewriterStream
                text={loadingMessage}
                plain={true}
                speed="xslowDummy"
                className="
                  max-w-3xl mx-auto
                  p-8 md:p-12
                  rounded-none border
                  bg-card text-card-foreground
                  shadow-sm transition-all
                  text-base leading-7 my-5 text-card-foreground
                "
                cursorClassName="bg-red-500"
                shouldStream={true}
                isDeleting={isDeletingLoadingMessage}
                onDeleteComplete={() => {
                  setIsDeletingLoadingMessage(false);
                  setIsLoadingGenerate(false);
                  if (pendingHistoryItem) {
                    setHistory((prev) => [...prev, pendingHistoryItem]);
                    setPendingHistoryItem(null);
                  }
                }}
              />
            </div>
          </div>
        )}
      </div>
      {!isLoadingTypewriter && !isLoadingGenerate && (
        <div className="flex flex-col">
          <div className="flex flex-row gap-2 my-4">
            <Button
              onClick={() => handleGenerate("explanation")}
              disabled={isLoadingGenerate}
              className={buttonVariants({ variant: "large" })}
            >
              Explain
            </Button>

            <Button
              onClick={() => handleGenerate("quiz")}
              disabled={isLoadingGenerate}
              className={buttonVariants({ variant: "large" })}
            >
              Quiz
            </Button>
          </div>
          <Button
            onClick={() => redirect("/generate")}
            disabled={isLoadingGenerate}
            className={buttonVariants({ variant: "large", color: "secondary" })}
          >
            New Session
          </Button>
        </div>
      )}
      {/* {isLoading && <RitualLoading />} */}

      {/* Invisible div to auto-scroll to bottom */}
      <div id="scroll-anchor" />
    </div>
  );
}
