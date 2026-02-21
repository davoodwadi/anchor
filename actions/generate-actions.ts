"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GoogleGenAI } from "@google/genai";
import { z } from "zod";
import { wait } from "@/lib/utils";
import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import {
  GeminiPart,
  GeminiContent,
  QuestionSchema,
  OptionSchema,
  QuizOutputSchema,
  Question,
  QuizData,
  ActionState,
  GeneratedContent,
  GenerateInput,
} from "@/types/QuizTypes";

const dummy = false;
const model = "gemini-3-flash-preview";

// Initialize the new client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
  if (dummy) {
    await wait(2000);
  }
  const { sessionId, mode, history, numQuestions, title, sessionType } = input;

  let newId = "";

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
  const extractedText = lastItem.extractedText;
  // console.log("lastItem", lastItem);
  // console.log("currentUserText", currentUserText);
  if (sessionType === "generate") {
    const { error: userMsgError } = await supabase
      .from("chat_messages")
      .insert({
        session_id: sessionId,
        user_id: user.id,
        role: "user",
        type: "user",
        content: currentUserText,
        extracted_text: extractedText,
      });

    if (userMsgError) {
      console.error("Failed to save user message:", userMsgError);
      return { success: false, error: "Database error saving user message" };
    }
  }

  history.map((item, index) => {
    // console.log("item", item);
    if (item.type === "user") {
      const userParts: GeminiPart[] = [
        {
          text: item.content,
        },
      ];
      contents.push({ role: "user", parts: userParts });
    } else {
      contents.push({
        role: "model",
        parts: [{ text: item.content }],
      });
    }
  });
  // console.log("contents");
  // console.log("contents", contents);
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

  // update db for generate
  if (sessionType === "generate") {
    newId = randomUUID();

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
  } else if (sessionType === "createQuiz") {
    // update db for createQuiz
    // --- Save to Supabase ---

    // 2. Insert Questions & Options
    // We do this sequentially or via Promise.all. Sequential is safer for debugging.
    const parsedData = JSON.parse(aiResponseText);
    const result = QuizOutputSchema.safeParse(parsedData);
    if (!result.success) {
      console.error("Schema Validation Error:", result.error.format());
      return {
        success: false,
        error: "AI generated content does not match the required format",
      };
    }
    const validatedData = result.data;

    // 1. Create the Quiz
    const { data: quiz, error: quizError } = await supabase
      .from("quizzes")
      .insert({ title, instructor_id: user.id })
      .select()
      .single();

    if (quizError) throw new Error("DB Error: " + quizError.message);

    // new id to redirect to
    newId = quiz.id;

    for (const q of validatedData.questions) {
      // 1. Insert Question with Hint and Citation
      const { data: questionData, error: qError } = await supabase
        .from("questions")
        .insert({
          quiz_id: quiz.id,
          question_text: q.question_text,
          hint: q.hint,
          correct_answer_citation: q.correct_answer_citation, // <--- Added
        })
        .select()
        .single();

      if (qError) {
        console.error("Error inserting question:", qError);
        continue;
      }

      // Prepare Options
      const optionsToInsert = q.options.map((opt, idx) => ({
        question_id: questionData.id,
        option_text: opt.option_text, // <--- Access property
        option_explanation: opt.option_explanation, // <--- Added
        is_correct: idx === q.correct_answer_index,
      }));

      // 3. Insert Options
      const { error: optError } = await supabase
        .from("options")
        .insert(optionsToInsert);

      if (optError) {
        console.error("Error inserting options:", optError);
      }
    }
  }

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
            hint: "It is where Eiffel Tower is.",
            options: [
              {
                option_text: "Berlin",
                option_explanation: "It is capital of Germany",
              },
              {
                option_text: "Madrid",
                option_explanation: "It is capital of Spain",
              },
              {
                option_text: "Paris",
                option_explanation: "It is correct",
              },
              {
                option_text: "Rome",
                option_explanation: "It is capital of Italy",
              },
            ],
            correct_answer_index: 2,
          },
          {
            question_text: "Which planet is known as the Red Planet?",
            hint: "Is it a popular travel destination!",
            options: [
              {
                option_text: "Earth",
                option_explanation: "It is known as the blue planet",
              },
              {
                option_text: "Mars",
                option_explanation: "Correct",
              },
              {
                option_text: "Jupiter",
                option_explanation: "It is not red",
              },
              {
                option_text: "Venus",
                option_explanation: "Incorrect",
              },
            ],
            correct_answer_index: 1,
          },
        ],
      }),
    },
  ],
  role: "model",
};
