# Detektif Akhlak

Game web edukasi untuk siswa SD. Anak-anak berperan sebagai detektif cilik yang
menelusuri situasi sehari-hari dan memilih jawaban yang mencerminkan akhlak mulia.

## Fitur

- 6 soal situasi akhlak (jujur, amanah, adab, persaudaraan, kebersihan, etika bicara)
- Skor, progres, dan peringkat detektif (Pemula → Sedap Akhlak)
- Umpan balik langsung plus penjelasan untuk setiap soal
- Urutan soal diacak pada setiap permainan

## Menjalankan

Butuh Node.js 20 atau lebih baru. Tidak ada dependensi eksternal.

```bash
npm test           # unit test (node:test)
npm run test:smoke # simulasi main penuh + 200 permainan acak
npm run lint       # syntax check semua modul
npm run check      # lint + unit test + smoke test
npm run serve      # server lokal di http://localhost:8080
```

Buka `index.html` langsung di browser juga bisa, tanpa server.

## Struktur

```
index.html          tampilan dan kerangka layar
src/game.js         logika permainan murni (tanpa DOM, mudah diuji)
src/questions.js    bank soal
src/main.js         perekat DOM dan event
src/style.css       gaya tampilan
tools/serve.js      server statis sederhana
test/game.test.js   unit test dengan node:test
test/smoke.js       simulasi permainan penuh
.github/workflows/  CI: lint + test di Node 20/22/24, Linux & Windows
```

## Lisensi

MIT
