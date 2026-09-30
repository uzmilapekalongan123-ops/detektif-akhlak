import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { createGame, assertValidQuestions, RANKS } from "../src/game.js";
import { QUESTIONS } from "../src/questions.js";

const SAMPLE = [
  {
    id: "a",
    category: "Jujur",
    text: "Soal A",
    options: ["Pilihan 1", "Pilihan 2"],
    answer: 0,
    explanation: "Penjelasan A",
  },
  {
    id: "b",
    category: "Amanah",
    text: "Soal B",
    options: ["Pilihan 1", "Pilihan 2", "Pilihan 3"],
    answer: 2,
    explanation: "Penjelasan B",
  },
];

const noShuffle = (items) => items;

describe("createGame", () => {
  it("menolak daftar soal kosong", () => {
    assert.throws(() => createGame([]), /tidak boleh kosong/);
    assert.throws(() => createGame(null), /tidak boleh kosong/);
  });

  it("memulai permainan di soal pertama", () => {
    const game = createGame(SAMPLE, { shuffle: noShuffle });
    assert.equal(game.index, 0);
    assert.equal(game.score, 0);
    assert.equal(game.correct, 0);
    assert.equal(game.total, 2);
    assert.equal(game.finished, false);
    assert.equal(game.currentQuestion().id, "a");
  });

  it("menambah skor saat jawaban benar", () => {
    const game = createGame(SAMPLE, { shuffle: noShuffle });
    const result = game.answer(0);
    assert.equal(result.isCorrect, true);
    assert.equal(result.correctIndex, 0);
    assert.equal(game.score, 1);
    assert.equal(game.correct, 1);
    assert.equal(game.index, 1);
    assert.equal(result.progress, 0.5);
  });

  it("tidak menambah skor saat jawaban salah", () => {
    const game = createGame(SAMPLE, { shuffle: noShuffle });
    const result = game.answer(1);
    assert.equal(result.isCorrect, false);
    assert.equal(game.score, 0);
    assert.equal(game.correct, 0);
  });

  it("menolak indeks jawaban di luar jangkauan", () => {
    const game = createGame(SAMPLE, { shuffle: noShuffle });
    assert.throws(() => game.answer(9), RangeError);
    assert.throws(() => game.answer(-1), RangeError);
    assert.throws(() => game.answer(0.5), RangeError);
    assert.equal(game.index, 0);
  });

  it("menandai permainan selesai setelah semua soal dijawab", () => {
    const game = createGame(SAMPLE, { shuffle: noShuffle });
    game.answer(0);
    game.answer(2);
    assert.equal(game.finished, true);
    assert.equal(game.currentQuestion(), null);
    assert.throws(() => game.answer(0), /sudah selesai/);
  });

  it("menghitung persentase dan peringkat dari hasil akhir", () => {
    const game = createGame(SAMPLE, { shuffle: noShuffle });
    game.answer(0);
    game.answer(1);
    const result = game.result();
    assert.equal(result.correct, 1);
    assert.equal(result.total, 2);
    assert.equal(result.percent, 50);
    assert.equal(result.rank, RANKS[0].title);
  });

  it("restart mengembalikan skor dan indeks ke awal", () => {
    const game = createGame(SAMPLE, { shuffle: noShuffle });
    game.answer(0);
    game.answer(2);
    game.restart();
    assert.equal(game.index, 0);
    assert.equal(game.score, 0);
    assert.equal(game.correct, 0);
    assert.equal(game.finished, false);
  });

  it("menggunakan urutan acak dari shuffle", () => {
    const game = createGame(SAMPLE, { shuffle: (items) => [...items].reverse() });
    assert.equal(game.currentQuestion().id, "b");
  });
});

describe("assertValidQuestions", () => {
  it("menerima bank soal yang valid", () => {
    assert.equal(assertValidQuestions(SAMPLE), true);
  });

  it("menolak soal tanpa id", () => {
    assert.throws(() => assertValidQuestions([{ ...SAMPLE[0], id: "" }]), /tidak memiliki id/);
  });

  it("menolak soal dengan pilihan kurang dari dua", () => {
    assert.throws(
      () => assertValidQuestions([{ ...SAMPLE[0], options: ["satu"] }]),
      /minimal 2 pilihan/,
    );
  });

  it("menolak indeks jawaban yang tidak valid", () => {
    assert.throws(() => assertValidQuestions([{ ...SAMPLE[0], answer: 7 }]), /tidak valid/);
  });

  it("menolak soal tanpa penjelasan", () => {
    assert.throws(
      () => assertValidQuestions([{ ...SAMPLE[0], explanation: "" }]),
      /tidak memiliki penjelasan/,
    );
  });
});

describe("bank soal bawaan", () => {
  it("lengkap dan konsisten", () => {
    assert.equal(assertValidQuestions(QUESTIONS), true);
    assert.ok(QUESTIONS.length >= 5);
  });

  it("memiliki id unik", () => {
    const ids = new Set(QUESTIONS.map((q) => q.id));
    assert.equal(ids.size, QUESTIONS.length);
  });

  it("tidak memuat pilihan jawaban kosong", () => {
    for (const q of QUESTIONS) {
      for (const option of q.options) {
        assert.ok(option.trim().length > 0, `Soal ${q.id} punya pilihan kosong`);
      }
    }
  });
});
