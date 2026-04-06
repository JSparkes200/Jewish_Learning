/**
 * One-time / maintenance: serialize `LEGACY_CORPUS_D` → `web/data/legacy-corpus-d.json`.
 * Run from `web/`: npx tsx scripts/export-legacy-corpus-d-json.ts
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { LEGACY_CORPUS_D } from "../data/corpus-d";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outPath = join(__dirname, "..", "data", "legacy-corpus-d.json");

const payload = [...LEGACY_CORPUS_D];
writeFileSync(outPath, JSON.stringify(payload));
console.log(`Wrote ${outPath} (${payload.length} entries)`);
