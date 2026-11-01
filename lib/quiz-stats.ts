/** Class-level numbers for a quiz, computed from its attempts. */
export type QuizStats = {
  attempts: number;
  /** Median score, rounded down to a whole question. */
  median: number | null;
  /** 1-based question number missed most often, or null if nothing missed. */
  mostMissed: number | null;
  /** Share of attempts that missed each question, in question order. */
  missRate: number[];
};

type AttemptLike = {
  score: number;
  quiz_responses: {
    question_id: string;
    option: { is_correct: boolean } | null;
  }[];
};

export function quizStats(
  questionIds: string[],
  attempts: AttemptLike[],
): QuizStats {
  const n = attempts.length;
  // Count correct answers; anything else (wrong or not recorded) is a miss,
  // which keeps the rates consistent with the attempt scores.
  const hits = new Map<string, number>();
  for (const a of attempts) {
    for (const r of a.quiz_responses) {
      if (r.option?.is_correct) {
        hits.set(r.question_id, (hits.get(r.question_id) ?? 0) + 1);
      }
    }
  }
  const missRate = questionIds.map((id) =>
    n ? 1 - (hits.get(id) ?? 0) / n : 0,
  );

  const scores = attempts.map((a) => a.score).sort((x, y) => x - y);
  const median = n ? scores[Math.floor((n - 1) / 2)] : null;

  const top = Math.max(0, ...missRate);
  const mostMissed = top > 0 ? missRate.indexOf(top) + 1 : null;

  return { attempts: n, median, mostMissed, missRate };
}
