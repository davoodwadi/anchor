/* Derived stats for the quiz-view prototypes, plus a stand-in QR code. */
window.STATS = (() => {
  const Qs = QUIZ.questions, n = ATTEMPTS.length;
  const missRate = Qs.map((q, i) => ATTEMPTS.filter(a => a.picks[i] !== q.correct).length / n);
  const scores = ATTEMPTS.map(a => a.score).sort((a, b) => a - b);
  const median = scores[Math.floor(n / 2)];
  const mostMissed = missRate.indexOf(Math.max(...missRate));
  return { n, missRate, median, mostMissed, link: `anchor.app/take/${QUIZ.id}` };
})();

/* Deterministic fake QR (prototype only; the app uses react-qr-code). */
window.fakeQR = function (size = 25) {
  let seed = 7;
  const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
  const finder = (x, y) => {
    for (const [fx, fy] of [[0, 0], [size - 7, 0], [0, size - 7]]) {
      const dx = x - fx, dy = y - fy;
      if (dx >= 0 && dx < 7 && dy >= 0 && dy < 7) {
        const edge = dx === 0 || dy === 0 || dx === 6 || dy === 6;
        const core = dx >= 2 && dx <= 4 && dy >= 2 && dy <= 4;
        return edge || core ? 1 : 0;
      }
    }
    return -1;
  };
  let rects = "";
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const f = finder(x, y);
    if (f === 1 || (f === -1 && rnd() > .52)) rects += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  }
  return `<svg viewBox="-2 -2 ${size + 4} ${size + 4}" shape-rendering="crispEdges" style="background:#fff;display:block;width:100%;height:auto"><g fill="#111">${rects}</g></svg>`;
};
