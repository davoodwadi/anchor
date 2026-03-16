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
  "Initiating psychometric scan of the target document. The text is highly volatile and prone to reality-shifting. Analyzing semantic anomalies... Filtering out parautilitarian noise... Calibrating the narrative logic... Do not break visual contact with the terminal. The Board is reviewing the submitted materials and will transmit the resulting constructs momentarily.",
  "The manuscript pages are being scattered into the Dark Place. The words shift and reorganize on their own, guided by forces we don't fully comprehend. We are currently parsing the psychic resonance of the text to separate truth from the anomaly. Please hold the line. The Board will issue a response shortly... assuming the narrative holds together.",
  "Warning: Conceptual dissonance detected in the source material. Deploying the HRA (Hedron Resonance Amplifier) array to stabilize the data stream. The narrative threads are currently tangled within the Oldest House. Extracting relevant quiz parameters now. Stand by for the translated broadcast.",
  "Listening to the Hotline... The voice on the other end is obscured by static, but the meaning is clear. The Director has authorized the restructuring of this information. We are binding the concepts to the astral plane. Do not touch the vibrating hum of the screen. Results are imminent.",
  "An Altered World Event (AWE) is currently unfolding within the localized text boundary. FBC Rangers are securing the perimeter. Our analysts are extracting the core facts from the surrounding altered reality. The situation is under control. The finalized report will manifest shortly.",
  "The clicker has been activated. Reality is rewriting itself to accommodate the new structural demands of your document. Shadow entities are being scrubbed from the margins. Focus on the light. The revised narrative is emerging from the depths of Cauldron Lake.",
  "Establishing a secure link with the Oceanview Motel and Casino. The keys are turning in the doors. We are navigating the shifting corridors of meaning to find the correct answers. Please wait in the lobby. The bell will ring when the process is complete.",
  "Scanning for Objects of Power within the submitted text. So far, the item appears benign, but standard FBC containment protocols require a full ontological breakdown. We are dismantling the text's reality and rebuilding it into an interrogative format. Stand by for containment breach, or quiz completion.",
  "The darkness is pressing in on the words. We are using flares and flashlights to burn away the obscurity and reveal the hidden structure of the document. The taken are resisting the analysis. Keep the generator running. The final output is almost secure.",
  "Entering the Astral Plane. The Board is judging the foundational integrity of the concepts provided. \n\n< ACCEPT / REJECT / REFORMAT >\n\nThe Board finds the request... acceptable. Generating the required testing matrix now.",
  "This is a Night Springs production... The text you submitted is merely a reflection in a broken mirror. We are piecing the glass back together to show you the truth hidden behind the fiction. Stay tuned. The episode is about to resume.",
  "Warning: High levels of resonance detected. The words are bleeding into the surrounding environment. Securing the manuscript in a designated Control Point. Cleansing the corruption from the paragraphs. The purified data will be transmitted as soon as the area is safe.",
  "The writer is at his typewriter, deep in the cabin. The keys are clacking relentlessly against the silence. He's trying to find the right ending, the right questions to ask. The story is taking shape, pulled from the ether of the Dark Place. Give him a moment to finish the page.",
  "Accessing the Federal Bureau of Control archives. Cross-referencing your document with known paranatural phenomena. The filing cabinets stretch into infinity. We have dispatched a drone to retrieve the corresponding test materials. Awaiting its return... if it returns.",
  "The projector in the Cinema is running. We are watching the events of your document unfold on the silver screen, looking for the critical plot points. The film is degraded, but the meaning is shining through the scratches. The reel is almost finished.",
  "Subjecting the text to the Black Rock Prism. The light refracting through the document is separating the core themes from the stylistic noise. The spectrum of information is being categorized and formulated into questions. Analysis is 87% complete.",
  "The spiral is endless. We are descending into the layered meanings of the text, searching for the bottom. Each revolution reveals a new layer of understanding. The journey is disorienting, but the destination is clear. We are bringing the answers back to the surface.",
  "Calibrating the Service Weapon. The text requires a precise approach. We are targeting the key concepts and extracting them with surgical precision. The recoil is significant, but the results are guaranteed. Reloading the data stream now.",
  "The resonance from the document is causing localized gravitational anomalies in the server room. Coffee mugs are hovering. We are stabilizing the sector before the data is irreparably warped. The extraction process is delicate but progressing. Stand by.",
  "Listening to the echoes in the dark. The words have already been spoken, we are just waiting for the sound to reach us. The delay is not technical, it is temporal. The answers are arriving from the future. Please wait for the timeline to catch up.",
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
                speed="medium"
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
