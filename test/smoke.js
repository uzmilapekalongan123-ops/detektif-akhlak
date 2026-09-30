import { createGame } from "../src/game.js";
import { QUESTIONS } from "../src/questions.js";

let failures = 0;
const check = (label, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failures += 1;
  console.log(`${ok ? "PASS" : "FAIL"} ${label} (dapat: ${actual}, harap: ${expected})`);
};

console.log("=== Simulasi main sempurna ===");
const perfect = createGame(QUESTIONS, { shuffle: (i) => i });
while (!perfect.finished) perfect.answer(perfect.currentQuestion().answer);
const perfectResult = perfect.result();
check("semua jawaban benar", perfectResult.correct, QUESTIONS.length);
check("persentase 100", perfectResult.percent, 100);
check("peringkat tertinggi", perfectResult.rank, "Detektif Sedap Akhlak");

console.log("\n=== Simulasi main salah semua ===");
const wrong = createGame(QUESTIONS, { shuffle: (i) => i });
while (!wrong.finished) {
  const q = wrong.currentQuestion();
  wrong.answer((q.answer + 1) % q.options.length);
}
check("nilai 0", wrong.result().percent, 0);
check("peringkat pemula", wrong.result().rank, "Detektif Pemula");

console.log("\n=== Jalankan 200 permainan acak ===");
for (let i = 0; i < 200; i += 1) {
  const g = createGame(QUESTIONS);
  while (!g.finished) {
    const q = g.currentQuestion();
    g.answer(Math.floor(Math.random() * q.options.length));
  }
  const r = g.result();
  if (r.percent < 0 || r.percent > 100) {
    console.log(`FAIL persentase di luar rentang pada permainan ${i}: ${r.percent}`);
    failures += 1;
  }
}
check("tidak ada persentase di luar 0-100", failures, 0);

console.log(failures === 0 ? "\nSEMUA SMOKE TEST LULUS" : `\n${failures} KEGAGALAN`);
process.exit(failures === 0 ? 0 : 1);
