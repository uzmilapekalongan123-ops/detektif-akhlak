export const RANKS = [
  { min: 0, title: "Detektif Pemula", badge: "🔍" },
  { min: 60, title: "Detektif Junior", badge: "🕵️" },
  { min: 80, title: "Detektif Senior", badge: "🥷" },
  { min: 100, title: "Detektif Sedap Akhlak", badge: "🏆" },
];

export function createGame(questions, { shuffle = defaultShuffle, random = Math.random } = {}) {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error("Daftar soal tidak boleh kosong");
  }
  assertValidQuestions(questions);

  const queue = shuffle(questions.map((_, i) => i), random);
  const state = { index: 0, score: 0, correct: 0, answers: [] };

  return {
    get total() {
      return queue.length;
    },
    get index() {
      return state.index;
    },
    get score() {
      return state.score;
    },
    get correct() {
      return state.correct;
    },
    get finished() {
      return state.index >= queue.length;
    },
    currentQuestion() {
      if (this.finished) return null;
      return questions[queue[state.index]];
    },
    answer(choice) {
      const question = this.currentQuestion();
      if (!question) throw new Error("Permainan sudah selesai");
      if (!Number.isInteger(choice) || choice < 0 || choice >= question.options.length) {
        throw new RangeError("Pilihan jawaban tidak valid");
      }
      const isCorrect = choice === question.answer;
      state.answers.push({ questionId: question.id, choice, isCorrect });
      if (isCorrect) {
        state.correct += 1;
        state.score += 1;
      }
      state.index += 1;
      return {
        isCorrect,
        correctIndex: question.answer,
        explanation: question.explanation,
        progress: this.index / this.total,
      };
    },
    result() {
      const finalScore = this.total === 0 ? 0 : Math.round((state.score / this.total) * 100);
      const rank = [...RANKS].reverse().find((r) => finalScore >= r.min) ?? RANKS[0];
      return {
        correct: state.correct,
        total: this.total,
        percent: finalScore,
        rank: rank.title,
        badge: rank.badge,
      };
    },
    restart() {
      state.index = 0;
      state.score = 0;
      state.correct = 0;
      state.answers.length = 0;
      return this;
    },
  };
}

export function assertValidQuestions(questions) {
  for (const [i, q] of questions.entries()) {
    if (!q.id) throw new Error(`Soal ke-${i + 1} tidak memiliki id`);
    if (!q.text) throw new Error(`Soal ${q.id} tidak memiliki teks pertanyaan`);
    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new Error(`Soal ${q.id} harus memiliki minimal 2 pilihan jawaban`);
    }
    if (!Number.isInteger(q.answer) || q.answer < 0 || q.answer >= q.options.length) {
      throw new Error(`Soal ${q.id} memiliki indeks jawaban yang tidak valid`);
    }
    if (!q.explanation) throw new Error(`Soal ${q.id} tidak memiliki penjelasan`);
  }
  return true;
}

function defaultShuffle(items, random) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
