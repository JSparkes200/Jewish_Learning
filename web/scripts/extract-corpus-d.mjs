/**
 * Generate `web/data/corpus-d.ts` from `web/data/legacy-corpus-d.json`.
 *
 * The JSON file is the source of truth for the legacy dictionary D (replacing
 * extraction from hebrew-v8.2.html).
 *
 * Regenerate TS from repo root:
 *   node web/scripts/extract-corpus-d.mjs
 *
 * Refresh JSON from current TS (after hand-edits to corpus-d.ts):
 *   cd web && npx tsx scripts/export-legacy-corpus-d-json.ts
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..", "..");
const jsonPath = path.join(repoRoot, "web", "data", "legacy-corpus-d.json");
const outPath = path.join(repoRoot, "web", "data", "corpus-d.ts");

function j(s) {
  return JSON.stringify(s);
}

/** One corpus row as a single-line TS literal (matches legacy HTML / corpus-d.ts order). */
function entryToTs(o) {
  const bits = [`h:${j(o.h)}`, `p:${j(o.p)}`, `e:${j(o.e)}`, `l:${o.l}`];
  if (o.shoresh != null && o.shoresh !== "") bits.push(`shoresh:${j(o.shoresh)}`);
  if (o.gram != null && o.gram !== "") bits.push(`gram:${j(o.gram)}`);
  if (o.col != null && o.col !== "") bits.push(`col:${j(o.col)}`);
  return `{${bits.join(",")}}`;
}

const raw = fs.readFileSync(jsonPath, "utf8");
const rows = JSON.parse(raw);
if (!Array.isArray(rows) || rows.length === 0) {
  throw new Error(`Expected non-empty array in ${jsonPath}`);
}

const header = `/**
 * Legacy dictionary D from web/data/legacy-corpus-d.json (generated — do not hand-edit).
 * Format: { h, p, e, l, shoresh?, gram?, col? }
 *
 * Regenerate from repo root: node web/scripts/extract-corpus-d.mjs
 * Refresh JSON from TS: cd web && npx tsx scripts/export-legacy-corpus-d-json.ts
 */

export type LegacyCorpusEntry = {
  h: string;
  p: string;
  e: string;
  l: number;
  shoresh?: string;
  gram?: string;
  col?: string;
};

export const LEGACY_CORPUS_D: readonly LegacyCorpusEntry[] = [
`;

const body = rows.map(entryToTs).join(",\n");
const out = `${header}${body}\n];\n`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, out, "utf8");

console.log(`Wrote ${outPath} (${rows.length} entries, ${Math.round(out.length / 1024)} KB)`);
