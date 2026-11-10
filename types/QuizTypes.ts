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
    .describe(
      "Why this option is correct or incorrect. For an incorrect option, say what it actually refers to. Use the material where it covers this, otherwise well-established general knowledge. Do not refer to the document.",
    ),
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

// Study-session quizzes also teach the context behind each question. Kept out
// of instructor quizzes, whose questions table has no column for it.
const { question_text, ...restOfQuestion } = QuestionSchema.shape;
export const StudyQuestionSchema = z.object({
  question_text,
  // Before the options, so the model works out the context first
  background: z
    .string()
    .describe(
      "The background a learner with no prior knowledge needs to understand this question (e.g., how it connects to the wider topic, and why it matters). Use the material where it covers this, otherwise well-established general knowledge. Do not refer to the document.",
    ),
  ...restOfQuestion,
});
export const StudyQuizSchema = z.object({
  questions: z
    .array(StudyQuestionSchema)
    .describe("A list of multiple choice questions generated from the text"),
});
export type StudyQuizData = z.infer<typeof StudyQuizSchema>;

export type GeneratedContent = {
  type: "explanation" | "quiz" | "user";
  content: string;
  file?: string;
  extractedText?: string | null;
  id: string;
  /** Answers circled on a practice quiz: question index -> option index. */
  picks?: Record<string, number>;
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
