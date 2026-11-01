/* Sample study session: a source file, explanations, and practice quizzes.
   Mirrors chat_messages entries (type: explanation | quiz). */
window.SESSION = {
  source: { name: "Week 7 notes - Memory.pdf", pages: 12 },
  entries: [
    {
      type: "explanation",
      title: "Explanation 1",
      paras: [
        "The reading argues that memory is shaped by how it is used, not just how it is stored. Every time you retrieve something, you rebuild it, and that act of rebuilding makes it easier to reach next time.",
        "That is why testing works as a study method. In Roediger and Karpicke's experiment, students who were tested on a passage remembered more of it a week later than students who simply reread it, even though rereading felt more productive at the time.",
        "The same idea runs through the rest of the chapter: spacing, interleaving and context all change how retrievable a memory is later. Learning that feels harder in the moment often lasts longer.",
      ],
    },
    { type: "quiz", title: "Practice quiz 1", questions: [0, 1, 2] },
    {
      type: "explanation",
      title: "Explanation 2",
      paras: [
        "Question 2 hinged on the difference between measuring memory and changing it. A test is usually thought of as a measurement, but retrieval itself strengthens the memory being retrieved.",
        "If you chose that tests mainly measure what was already learned, that is the intuitive view the reading argues against.",
      ],
    },
  ],
};
