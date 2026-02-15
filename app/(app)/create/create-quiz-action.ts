"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";

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

// Initialize the new client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// Define the return state type
export type ActionState = {
  message?: string;
  error?: string;
  success?: boolean;
  quizId?: string;
};

export async function createQuizAction(
  prevState: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  // --- Auth Check ---
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect("/auth/login");

  // --- Input Validation ---
  const title = formData.get("title") as string;
  const file = formData.get("file") as File;

  if (!file && !title) {
    return { error: "Please provide a title and/or a file" };
  }

  // 1. EXTRACT THE AMOUNT (Default to 10 if missing)
  const amountRaw = formData.get("amount");
  const amount = amountRaw ? parseInt(amountRaw.toString()) : 10;
  const safeAmount = Math.min(Math.max(amount, 1), 20);

  const jsonSchema = QuizOutputSchema.toJSONSchema();

  let quizId;
  try {
    const parts: any[] = [
      {
        text: `Generate ${safeAmount} multiple choice questions based on the attached document.`,
      },
    ];
    if (file && file.size > 0) {
      const isPdfMime = file.type === "application/pdf";
      const isPdfExt = file.name.toLowerCase().endsWith(".pdf");

      // logic: "validate that the file is pdf, if so add it... if not, don't add it"
      if (isPdfMime || isPdfExt) {
        const arrayBuffer = await file.arrayBuffer();
        const base64Data = Buffer.from(arrayBuffer).toString("base64");

        parts.push({
          inlineData: {
            mimeType: "application/pdf", // Explicitly force PDF to avoid octet-stream errors
            data: base64Data,
          },
        });
      }
    }

    console.log();
    // return { success: false, quizId: "some quiz id" };

    // --- Call Gemini with Zod Schema ---
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Using gemini-2.5-flash-lite (the cheapest)
      contents: [
        {
          role: "user",
          parts: parts, // Pass the dynamic array
        },
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: jsonSchema,
      },
    });

    // --- Parse & Validate Response ---
    // we run it through Zod.parse just to be 100% safe and get typed objects.
    const responseText = response.text;
    if (!responseText) throw new Error("No data returned from AI");
    // console.log("responseText", responseText);
    // console.log("responseText", typeof responseText);
    const responseObject = JSON.parse(responseText);
    const parsedData = QuizOutputSchema.parse(responseObject);

    // --- Save to Supabase ---

    // 1. Create the Quiz
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({ title, instructor_id: user.id })
      .select()
      .single();

    quizId = quiz.id;

    if (quizError) throw new Error("DB Error: " + quizError.message);

    // 2. Insert Questions & Options
    // We do this sequentially or via Promise.all. Sequential is safer for debugging.
    for (const q of parsedData.questions) {
      // Insert Question
      const { data: questionData, error: qError } = await supabase
        .from("questions")
        .insert({
          quiz_id: quiz.id,
          question_text: q.question_text,
        })
        .select()
        .single();

      if (qError) continue; // Skip if a single question fails

      // Prepare Options
      const optionsToInsert = q.options.map((optText, idx) => ({
        question_id: questionData.id,
        option_text: optText,
        is_correct: idx === q.correct_answer_index,
      }));

      // Insert Options
      await supabase.from("options").insert(optionsToInsert);
    }
  } catch (error: any) {
    console.error("Quiz Generation Error:", error);
    return { error: error.message || "Failed to generate quiz" };
  }
  if (quizId) {
    redirect("/dashboard");
  }
  return { error: "Unknown error occurred" };
}
