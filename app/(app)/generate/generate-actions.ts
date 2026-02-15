"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

import fs from "fs";
import path from "path";

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
  mode: "quiz" | "explanation";
  history: GeneratedContent[];
  numQuestions: number;
  title: string;
  fileBase64: string | null;
};
const jsonSchema = QuizOutputSchema.toJSONSchema();
const dummy = false;
const model = "gemini-3-flash-preview";
export async function generateQuizAction(
  input: GenerateInput,
): Promise<ActionState> {
  const supabase = await createClient();
  // --- Auth Check ---
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");

  const { mode, history, numQuestions, title, fileBase64 } = input;
  //   console.log("mode", mode);
  //   console.log("title", title);
  //   console.log("numQuestions", numQuestions);
  //   console.log("history", history);
  //   console.log("fileBase64", fileBase64);
  const newId = crypto.randomUUID();

  //   console.log();
  //   console.log("history", history);

  const contents: GeminiContent[] = [];

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
  //   const models = await ai.models.list();
  //   console.log("models", models);
  console.log("contents");
  console.dir(contents, { depth: null });
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
      return {
        success: true,
        data: { type: "quiz", content: rawResponse, id: newId },
      };
    } else {
      const responseContent = mockQuiz;
      // 2. Parse the stringified JSON
      const rawResponse = responseContent.parts?.[0]?.text;
      return {
        success: true,
        data: { type: "quiz", content: rawResponse, id: newId },
      };
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
      return {
        success: true,
        data: { type: "explanation", content: rawResponse, id: newId },
      };
    } else {
      // get gemini api
      const filePath = path.join(process.cwd(), "content", "example.md");
      const markdownContent = await fs.promises.readFile(filePath, "utf8");

      const responseContent = markdownContent;

      return {
        success: true,
        data: { type: "explanation", content: responseContent, id: newId },
      };
    }
  }

  return { success: false, error: "Unknown Error" };
  // 1. EXTRACT THE AMOUNT (Default to 10 if missing)
  //   const amountRaw = formData.get("amount");
  //   const amount = amountRaw ? parseInt(amountRaw.toString()) : 10;
  //   const safeAmount = Math.min(Math.max(amount, 1), 20);

  //   const jsonSchema = QuizOutputSchema.toJSONSchema();

  //   try {
  //     const parts: any[] = [
  //       {
  //         text: `Generate ${safeAmount} multiple choice questions based on the attached document.`,
  //       },
  //     ];
  //     if (file && file.size > 0) {
  //       const isPdfMime = file.type === "application/pdf";
  //       const isPdfExt = file.name.toLowerCase().endsWith(".pdf");

  //       // logic: "validate that the file is pdf, if so add it... if not, don't add it"
  //       if (isPdfMime || isPdfExt) {
  //         const arrayBuffer = await file.arrayBuffer();
  //         const base64Data = Buffer.from(arrayBuffer).toString("base64");

  //         parts.push({
  //           inlineData: {
  //             mimeType: "application/pdf", // Explicitly force PDF to avoid octet-stream errors
  //             data: base64Data,
  //           },
  //         });
  //       }
  //     }

  //     console.log();
  //     // return { success: false, quizId: "some quiz id" };

  //     // --- Call Gemini with Zod Schema ---
  //     const response = await ai.models.generateContent({
  //       model: "gemini-2.5-flash", // Using gemini-2.5-flash-lite (the cheapest)
  //       contents: [
  //         {
  //           role: "user",
  //           parts: parts, // Pass the dynamic array
  //         },
  //       ],
  //       config: {
  //         responseMimeType: "application/json",
  //         responseSchema: jsonSchema,
  //       },
  //     });

  //     // --- Parse & Validate Response ---
  //     // we run it through Zod.parse just to be 100% safe and get typed objects.
  //     const responseText = response.text;
  //     if (!responseText) throw new Error("No data returned from AI");
  //     // console.log("responseText", responseText);
  //     // console.log("responseText", typeof responseText);
  //     const responseObject = JSON.parse(responseText);
  //     const parsedData = QuizOutputSchema.parse(responseObject);

  //     // --- Save to Supabase ---

  //     // 1. Create the Quiz
  //     const { data: quiz, error: quizError } = await supabase
  //       .from("quizzes")
  //       .insert({ title, instructor_id: user.id })
  //       .select()
  //       .single();

  //     quizId = quiz.id;

  //     if (quizError) throw new Error("DB Error: " + quizError.message);

  //     // 2. Insert Questions & Options
  //     // We do this sequentially or via Promise.all. Sequential is safer for debugging.
  //     for (const q of parsedData.questions) {
  //       // Insert Question
  //       const { data: questionData, error: qError } = await supabase
  //         .from("questions")
  //         .insert({
  //           quiz_id: quiz.id,
  //           question_text: q.question_text,
  //         })
  //         .select()
  //         .single();

  //       if (qError) continue; // Skip if a single question fails

  //       // Prepare Options
  //       const optionsToInsert = q.options.map((optText, idx) => ({
  //         question_id: questionData.id,
  //         option_text: optText,
  //         is_correct: idx === q.correct_answer_index,
  //       }));

  //       // Insert Options
  //       await supabase.from("options").insert(optionsToInsert);
  //     }
  //   } catch (error: any) {
  //     console.error("Quiz Generation Error:", error);
  //     return { error: error.message || "Failed to generate quiz" };
  //   }
  //   if (quizId) {
  //     redirect("/dashboard");
  //   }
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
