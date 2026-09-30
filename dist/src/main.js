import { createGame } from "./game.js";
import { QUESTIONS } from "./questions.js";

const el = (id) => document.getElementById(id);
const screens = {
  start: el("screen-start"),
  game: el("screen-game"),
  result: el("screen-result"),
};

let game = createGame(QUESTIONS);

function show(name) {
  for (const [key, node] of Object.entries(screens)) {
    node.classList.toggle("hidden", key !== name);
  }
}

function renderQuestion() {
  const question = game.currentQuestion();
  el("hud-progress").textContent = `Soal ${game.index + 1} dari ${game.total}`;
  el("hud-score").textContent = `Skor: ${game.score}`;
  el("question-category").textContent = question.category;
  el("question-text").textContent = question.text;
  el("feedback").classList.add("hidden");
  el("btn-next").classList.add("hidden");

  const options = el("options");
  options.replaceChildren();
  question.options.forEach((text, i) => {
    const button = document.createElement("button");
    button.className = "option";
    button.type = "button";
    button.textContent = text;
    button.addEventListener("click", () => handleAnswer(i, question, options));
    options.append(button);
  });
}

function handleAnswer(choice, question, options) {
  const result = game.answer(choice);
  [...options.children].forEach((node, i) => {
    node.disabled = true;
    if (i === result.correctIndex) node.classList.add("correct");
    else if (i === choice) node.classList.add("wrong");
  });

  const feedback = el("feedback");
  feedback.textContent = `${result.isCorrect ? "Tepat sekali! " : "Belum tepat. "}${result.explanation}`;
  feedback.classList.remove("hidden");
  el("btn-next").classList.remove("hidden");
  el("hud-score").textContent = `Skor: ${game.score}`;
  el("progress-fill").style.width = `${result.progress * 100}%`;
}

function showResult() {
  const result = game.result();
  el("result-badge").textContent = result.badge;
  el("result-rank").textContent = result.rank;
  el("result-detail").textContent = `Jawaban benar ${result.correct} dari ${result.total} (${result.percent}%)`;
  show("result");
}

el("btn-start").addEventListener("click", () => {
  game.restart();
  show("game");
  renderQuestion();
});

el("btn-next").addEventListener("click", () => {
  if (game.finished) showResult();
  else renderQuestion();
});

el("btn-restart").addEventListener("click", () => {
  game.restart();
  show("game");
  renderQuestion();
});
