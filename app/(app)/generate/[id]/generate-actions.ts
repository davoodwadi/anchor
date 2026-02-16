"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import fs from "fs";
import path from "path";

const dummy = true;
const model = "gemini-3-flash-preview";

type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

type GeminiContent = {
  role: "user" | "model";
  parts: GeminiPart[];
};
// 1. Define the Shape of the Data with Zod
const QuestionSchema = z.object({
  question_text: z.string().describe("The text of the question"),
  options: z.array(z.string()).describe("A list of exactly 4 possible answers"),
  correct_answer_index: z
    .number()
    .int()
    .min(0)
    .max(3)
    .describe(
      "The index (0, 1, 2, or 3) of the correct option in the options array",
    ),
});

const QuizOutputSchema = z.object({
  questions: z
    .array(QuestionSchema)
    .describe("A list of multiple choice questions generated from the text"),
});
export type QuizData = z.infer<typeof QuizOutputSchema>;
export type GeneratedContent = {
  type: "explanation" | "quiz" | "user";
  content: string;
  file?: string;
  id: string;
};

// Initialize the new client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define the return state type
export type ActionState = {
  data?: GeneratedContent;
  error?: string;
  success?: boolean;
};

type GenerateInput = {
  sessionId: string;
  mode: "quiz" | "explanation";
  history: GeneratedContent[];
  numQuestions: number;
  title: string;
  fileBase64: string | null;
};
const jsonSchema = QuizOutputSchema.toJSONSchema();

export async function generateQuizAction(
  input: GenerateInput,
): Promise<ActionState> {
  const supabase = await createClient();
  // --- Auth Check ---
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");
  //

  const { sessionId, mode, history, numQuestions, title, fileBase64 } = input;

  const newId = crypto.randomUUID();

  //   console.log();

  const contents: GeminiContent[] = [];
  if (!history || history.length === 0) {
    return { success: false, error: "History is empty" };
  }
  const lastItem = history.at(-1);
  if (!lastItem) {
    return { success: false, error: "History is empty" };
  }
  // 3. Now TypeScript knows 'lastItem' is definitely defined
  const currentUserText = lastItem.content;
  // console.log("currentUserText", currentUserText);
  const { error: userMsgError } = await supabase.from("chat_messages").insert({
    session_id: sessionId,
    user_id: user.id,
    role: "user",
    type: "user",
    content: currentUserText,
  });

  if (userMsgError) {
    console.error("Failed to save user message:", userMsgError);
    return { success: false, error: "Database error saving user message" };
  }

  history.map((item, index) => {
    // console.log("item", item);
    if (item.type === "user") {
      const userParts: GeminiPart[] = [
        {
          text: item.content,
        },
      ];
      if (item.file) {
        userParts.push({
          inlineData: {
            mimeType: "application/pdf", // Explicitly force PDF to avoid octet-stream errors
            data: item.file,
          },
        });
      }
      contents.push({ role: "user", parts: userParts });
    } else {
      contents.push({
        role: "model",
        parts: [{ text: item.content }],
      });
    }
  });
  // console.log("contents");
  // console.dir(contents, { depth: null });
  let aiResponseText = "";
  if (mode === "quiz") {
    // --- Call Gemini with Zod Schema ---
    if (!dummy) {
      const response = await ai.models.generateContent({
        model: model, // Using gemini-2.5-flash-lite (the cheapest)
        contents: contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: jsonSchema,
        },
      });
      if (!response.candidates) {
        return { success: false };
      }
      const rawResponse = response.candidates[0]?.content?.parts?.[0]?.text;
      if (!rawResponse) {
        return { success: false };
      }
      aiResponseText = rawResponse;
    } else {
      const responseContent = mockQuiz;
      // 2. Parse the stringified JSON
      const rawResponse = responseContent.parts?.[0]?.text;
      aiResponseText = rawResponse;
    }
  } else if (mode === "explanation") {
    if (!dummy) {
      const response = await ai.models.generateContent({
        model: model, // Using gemini-2.5-flash-lite (the cheapest)
        contents: contents,
      });
      if (!response.candidates) {
        return { success: false };
      }
      const rawResponse = response.candidates[0]?.content?.parts?.[0]?.text;
      if (!rawResponse) {
        return { success: false };
      }
      aiResponseText = rawResponse;
    } else {
      // get gemini api
      const filePath = path.join(process.cwd(), "content", "example.md");
      const markdownContent = await fs.promises.readFile(filePath, "utf8");

      const rawResponse = markdownContent;
      aiResponseText = rawResponse;
    }
  }

  // update db
  const { data: savedAiMsg, error: aiMsgError } = await supabase
    .from("chat_messages")
    .insert({
      session_id: sessionId,
      user_id: user.id,
      role: "model",
      type: mode, // 'quiz' or 'explanation'
      content: aiResponseText,
    })
    .select()
    .single();

  if (aiMsgError || !savedAiMsg) {
    console.error("Failed to save AI message:", aiMsgError);
    return { success: false, error: "Database error saving AI message" };
  }
  // update db

  return {
    success: true,
    data: { type: mode, content: aiResponseText, id: newId },
  };
}

const mockQuiz = {
  parts: [
    {
      // The content must be a stringified JSON object
      text: JSON.stringify({
        questions: [
          {
            question_text: "What is the capital of France?",
            options: ["Berlin", "Madrid", "Paris", "Rome"],
            correct_answer_index: 2,
          },
          {
            question_text: "Which planet is known as the Red Planet?",
            options: ["Earth", "Mars", "Jupiter", "Venus"],
            correct_answer_index: 1,
          },
          {
            question_text: "What is the chemical symbol for water?",
            options: ["O2", "H2O", "CO2", "NaCl"],
            correct_answer_index: 1,
          },
        ],
      }),
    },
  ],
  role: "model",
};
