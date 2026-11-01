/* Sample instructor-side data for the remaining-page prototypes.
   Shapes follow the Supabase tables: quizzes, questions, options,
   attempts, quiz_responses. */
window.ME = { email: "d.wadi@university.ca" };

window.QUIZ = {
  id: "7f3c9a2e",
  title: "Week 7 · Memory and Retrieval",
  created: "Oct 24, 2026",
  questions: [
    {
      text: "In Roediger and Karpicke's 2006 study, when was the advantage of testing over restudying largest?",
      options: ["Five minutes after study", "Two days after study", "One week after study", "It was the same at every delay"],
      correct: 2,
      explanation: "Restudying was slightly better on the immediate test, but testing produced better retention at two days and the gap was widest at one week.",
      citation: "On the one-week test, students who had been tested recalled substantially more than those who restudied.",
    },
    {
      text: "Which statement best describes the testing effect?",
      options: ["Tests mainly measure what was already learned", "Retrieving information strengthens later retention more than restudying it", "Students remember more when they expect a test", "Testing helps only when feedback is given"],
      correct: 1,
      explanation: "The testing effect is about retrieval itself changing memory: pulling information out makes it more durable than reading it again.",
      citation: "Retrieval is not a neutral readout of what was stored; each act of recall makes the memory easier to reach again.",
    },
    {
      text: "Which of these is an example of a desirable difficulty?",
      options: ["Rereading highlighted notes", "Studying in one long session", "Spacing study sessions across several days", "Copying notes out word for word"],
      correct: 2,
      explanation: "Spacing makes study feel harder in the moment, which is exactly why it counts as a desirable difficulty: it improves long-term retention.",
      citation: "Spacing, interleaving and testing slow initial learning but improve what is retained later.",
    },
    {
      text: "Divers who learned a word list underwater recalled it best when they were tested…",
      options: ["On land, after a short rest", "Underwater", "In whichever setting came first", "After rehearsing on land"],
      correct: 1,
      explanation: "Encoding specificity: recall is best when the retrieval context matches the context in which the material was learned.",
      citation: "Words learned underwater were recalled better underwater, and words learned on land were recalled better on land.",
    },
    {
      text: "Which task leads to the best later recall of a word list?",
      options: ["Counting the vowels in each word", "Judging whether each word is in capitals", "Deciding whether each word rhymes with “train”", "Deciding whether each word fits a given sentence"],
      correct: 3,
      explanation: "Judging whether a word fits a sentence requires processing its meaning, the deepest level of processing, which produces the best recall.",
      citation: "Semantic judgements produced the highest recall, followed by phonemic and then structural judgements.",
    },
    {
      text: "Compared with massed practice, spaced practice typically…",
      options: ["Feels easier and produces better retention", "Feels harder but produces better long-term retention", "Produces the same retention in less time", "Helps only for motor skills"],
      correct: 1,
      explanation: "Spaced practice usually feels less fluent than cramming, but it reliably produces better long-term retention.",
      citation: "Students rated massed practice as more effective, even though spaced practice produced better scores a week later.",
    },
  ],
};

/* Each attempt lists the chosen option index per question. */
window.ATTEMPTS = [
  { student: "300184562", when: "Oct 30, 14:12", picks: [2, 1, 2, 1, 2, 1] },
  { student: "300177301", when: "Oct 30, 13:58", picks: [1, 1, 2, 1, 3, 1] },
  { student: "300192840", when: "Oct 30, 13:41", picks: [2, 1, 2, 1, 3, 1] },
  { student: "300160077", when: "Oct 29, 21:05", picks: [0, 2, 2, 1, 1, 0] },
  { student: "300188915", when: "Oct 29, 19:33", picks: [2, 1, 0, 1, 3, 1] },
  { student: "300171264", when: "Oct 29, 16:20", picks: [1, 1, 2, 0, 3, 1] },
  { student: "300199402", when: "Oct 28, 22:47", picks: [2, 1, 2, 1, 3, 0] },
  { student: "300165530", when: "Oct 28, 18:09", picks: [1, 3, 2, 1, 2, 1] },
];
ATTEMPTS.forEach(a => { a.score = a.picks.filter((p, i) => p === QUIZ.questions[i].correct).length; a.total = QUIZ.questions.length; });

window.QUIZZES = [
  { id: QUIZ.id, title: QUIZ.title, created: QUIZ.created, questions: 6, attempts: ATTEMPTS.length, median: "5/6" },
  { id: "a91e", title: "Week 6 · Working Memory", created: "Oct 17, 2026", questions: 8, attempts: 41, median: "6/8" },
  { id: "c22b", title: "Week 5 · Attention", created: "Oct 10, 2026", questions: 10, attempts: 57, median: "7/10" },
  { id: "e7d0", title: "Midterm practice", created: "Oct 3, 2026", questions: 20, attempts: 88, median: "14/20" },
  { id: "f013", title: "Week 3 · Perception", created: "Sep 26, 2026", questions: 6, attempts: 0, median: "—" },
];

/* The attempt shown on the student results prototypes. */
window.MY_ATTEMPT = ATTEMPTS[0];

window.L = ["a", "b", "c", "d"];
