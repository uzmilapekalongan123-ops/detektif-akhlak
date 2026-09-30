import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("..", import.meta.url));
const OUT = join(ROOT, "dist");

const ASSETS = ["index.html", "src"];

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

for (const asset of ASSETS) {
  await cp(join(ROOT, asset), join(OUT, asset), { recursive: true });
}

// Mencegah Jekyll mengabaikan berkas yang diawali garis bawah.
await writeFile(join(OUT, ".nojekyll"), "");

console.log(`Situs dibangun di ${OUT}`);
