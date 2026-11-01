/* Sample quiz + shared identity screen for the /take prototypes.
   Shape mirrors the Supabase query in app/take/[id]/quiz-loader.tsx:
   question_text, hint, options[] (4), correct_answer_citation. */
window.QUIZ = {
  title: "Week 7 · Memory and Retrieval",
  course: "PSYC 210",
  questions: [
    {
      text: "In Roediger and Karpicke's 2006 study, when was the advantage of testing over restudying largest?",
      hint: "Restudying actually looked better on one of the tests. Which delay favours durable memories?",
      options: ["Five minutes after study", "Two days after study", "One week after study", "It was the same at every delay"],
    },
    {
      text: "Which statement best describes the testing effect?",
      hint: "It's about what retrieval does to a memory, not about measuring it.",
      options: [
        "Tests mainly measure what was already learned",
        "Retrieving information strengthens later retention more than restudying it",
        "Students remember more when they expect a test",
        "Testing helps only when feedback is given",
      ],
    },
    {
      text: "Which of these is an example of a desirable difficulty?",
      hint: "It slows learning down in the moment but pays off later.",
      options: ["Rereading highlighted notes", "Studying in one long session", "Spacing study sessions across several days", "Copying notes out word for word"],
    },
    {
      text: "Divers who learned a word list underwater recalled it best when they were tested…",
      hint: "Think about encoding specificity: context at learning and at retrieval.",
      options: ["On land, after a short rest", "Underwater", "In whichever setting came first", "After rehearsing on land"],
    },
    {
      text: "Which task leads to the best later recall of a word list?",
      hint: "Levels of processing: the deeper the analysis, the better.",
      options: [
        "Counting the vowels in each word",
        "Judging whether each word is in capitals",
        "Deciding whether each word rhymes with “train”",
        "Deciding whether each word fits a given sentence",
      ],
    },
    {
      text: "Compared with massed practice, spaced practice typically…",
      hint: "Notice the gap between how learning feels and how it lasts.",
      options: [
        "Feels easier and produces better retention",
        "Feels harder but produces better long-term retention",
        "Produces the same retention in less time",
        "Helps only for motor skills",
      ],
    },
  ],
};

/* Identity step (student number), shared by every candidate. */
window.renderIdentity = function (root, onStart) {
  root.innerHTML = `
    <section class="ident">
      <div class="kicker">${QUIZ.course}</div>
      <h1 class="ident-title">${QUIZ.title.split(" · ")[1].toUpperCase()}</h1>
      <div class="ident-meta">${QUIZ.questions.length} questions · No account needed · Results shown at the end</div>
      <form class="ident-form" autocomplete="off">
        <label for="sid" class="kicker">Student number</label>
        <input id="sid" inputmode="numeric" placeholder="e.g. 300184562" required>
        <button type="submit" class="ident-go"><span class="key">Enter</span>Begin</button>
      </form>
    </section>`;
  const form = root.querySelector("form");
  const input = root.querySelector("input");
  input.focus();
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (input.value.trim()) onStart(input.value.trim());
  });
};

/* Ignore shortcut keys while typing in a field. */
window.isTyping = (e) => /input|textarea|select/i.test(e.target.tagName) || e.metaKey || e.ctrlKey || e.altKey;
