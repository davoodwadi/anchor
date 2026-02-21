import { z } from "zod";

export type GeminiPart =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

export type GeminiContent = {
  role: "user" | "model";
  parts: GeminiPart[];
};

export const OptionSchema = z.object({
  option_text: z.string().describe("The text of the option"),
  option_explanation: z
    .string()
    .describe("Explanation of why the option is correct/incorrect"),
});
export const QuestionSchema = z.object({
  question_text: z.string().describe("The text of the question"),
  hint: z.string().describe("A gentle hint that does not give away the answer"),
  options: z
    .array(OptionSchema)
    .length(4)
    .describe("A list of exactly 4 possible answers"),
  correct_answer_index: z
    .number()
    .int()
    .min(0)
    .max(3)
    .describe(
      "The index (0, 1, 2, or 3) of the correct option in the options array",
    ),
  correct_answer_citation: z
    .string()
    .describe(
      "The sentence from the original document that supports the correct option.",
    ),
});

export const QuizOutputSchema = z.object({
  questions: z
    .array(QuestionSchema)
    .describe("A list of multiple choice questions generated from the text"),
});
export type Question = z.infer<typeof QuestionSchema>;
export type QuizData = z.infer<typeof QuizOutputSchema>;

export type GeneratedContent = {
  type: "explanation" | "quiz" | "user";
  content: string;
  file?: string;
  extractedText?: string | null;
  id: string;
};
// Define the return state type
export type ActionState = {
  data?: GeneratedContent;
  error?: string;
  success?: boolean;
};
export type GenerateInput = {
  sessionId: string;
  mode: "quiz" | "explanation";
  history: GeneratedContent[];
  numQuestions: number;
  title: string;
  sessionType: "generate" | "createQuiz";
  // extractedText: string | null;
};
